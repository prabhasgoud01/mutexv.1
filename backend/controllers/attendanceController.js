import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// @desc    Load students for marking attendance
// @route   POST /api/attendance/load-students
// @access  Private/Faculty
export const loadStudents = async (req, res) => {
  try {
    const { year, semester, section, batch } = req.body;

    // Filter by college and provided params
    const query = { collegeName: req.user.collegeName };
    if (semester) query.$or = [{ semester }, { semesterNumber: semester }];
    if (section) query.section = section;
    if (batch) query.batch = batch;
    
    // Fallback to year if batch not provided
    if (year && !batch) {
       // if we have '4' or '4th Year' we can map it here. For now we just add it to query if it exists
       // query.year = year;
    }

    const students = await Student.find(query)
      .select('name rollNumber studentId department course semester semesterNumber section profilePhoto');

    res.json({ success: true, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error loading students' });
  }
};

// @desc    Mark attendance for multiple students
// @route   POST /api/attendance/mark
// @access  Private/Faculty
export const markAttendance = async (req, res) => {
  try {
    const { subjectCode, subjectName, date, batch, year, semester, section, attendanceData } = req.body;
    
    // attendanceData = [{ studentId, rollNumber, status }, ...]

    const attendanceRecords = [];
    
    for (const record of attendanceData) {
      // Check if already exists to prevent duplicates
      const exists = await Attendance.findOne({
        studentId: record.studentId,
        subjectCode,
        date: new Date(date)
      });

      if (!exists) {
        attendanceRecords.push({
          studentId: record.studentId,
          rollNumber: record.rollNumber,
          facultyId: req.user._id,
          subjectCode,
          subjectName,
          date: new Date(date),
          academicYear: batch, // or save as batch if schema expects batch
          year,
          semester,
          section,
          status: record.status,
          collegeName: req.user.collegeName
        });
      }
    }

    if (attendanceRecords.length > 0) {
      await Attendance.insertMany(attendanceRecords);
    }

    // Now recalculate stats for each student and emit socket events
    const io = req.app.get('io');

    for (const record of attendanceRecords) {
      await updateStudentAttendanceStats(record.studentId, req.user.collegeName);
      
      if (io) {
        io.to(`student_${record.studentId}`).emit('attendance_updated', {
          message: `Attendance marked for ${subjectName}`,
          date: date,
        });
      }
    }

    res.json({ 
      success: true, 
      message: `Attendance marked successfully for ${attendanceRecords.length} students.`,
      duplicatesSkipped: attendanceData.length - attendanceRecords.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error marking attendance' });
  }
};

// Helper function to recalculate attendance stats
const updateStudentAttendanceStats = async (studentId, collegeName) => {
  const records = await Attendance.find({ studentId, collegeName });
  
  if (!records.length) return;

  const subjectStats = {};
  let totalPresent = 0;
  let totalClasses = 0;

  records.forEach(r => {
    if (!subjectStats[r.subjectCode]) {
      subjectStats[r.subjectCode] = { subjectName: r.subjectName, present: 0, total: 0 };
    }
    
    subjectStats[r.subjectCode].total += 1;
    totalClasses += 1;
    
    if (r.status === 'P') {
      subjectStats[r.subjectCode].present += 1;
      totalPresent += 1;
    } else if (r.status === 'L') {
      subjectStats[r.subjectCode].present += 0.5;
      totalPresent += 0.5;
    }
  });

  const subjectWise = {};
  for (const [code, stat] of Object.entries(subjectStats)) {
    subjectWise[stat.subjectName] = ((stat.present / stat.total) * 100).toFixed(2);
  }

  const overall = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;

  // Update student document
  await Student.findByIdAndUpdate(studentId, {
    $set: {
      'attendance.overall': overall,
      'attendance.subjectWise': subjectWise,
      'attendance.lastUpdated': new Date()
    }
  });
};

// @desc    Get student's own attendance
// @route   GET /api/attendance/student
// @access  Private/Student
export const getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user._id })
      .sort({ date: -1 });

    const student = await Student.findById(req.user._id).select('attendance');

    res.json({
      success: true,
      stats: student.attendance || {},
      history: records
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
};

// @desc    Admin report
// @route   GET /api/attendance/admin-report
// @access  Private/Admin or SuperAdmin
export const getAdminReport = async (req, res) => {
  try {
    const { semester, section, subjectCode } = req.query;
    
    const query = { collegeName: req.user.collegeName };
    if (semester) query.semester = semester;
    if (section) query.section = section;
    if (subjectCode) query.subjectCode = subjectCode;

    const records = await Attendance.find(query).populate('studentId', 'name rollNumber');
    
    res.json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating report' });
  }
};
