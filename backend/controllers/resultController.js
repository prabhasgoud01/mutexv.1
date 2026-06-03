import Result from '../models/Result.js';
import Student from '../models/Student.js';
import * as xlsx from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Helper for parsing CSV buffer
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer);
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// @desc    Upload results (Admin only)
// @route   POST /api/admin/upload-results
// @access  Private/Admin
export const uploadResults = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    let parsedData = [];
    
    // Parse Excel or CSV
    if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      req.file.mimetype === 'application/vnd.ms-excel'
    ) {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      parsedData = xlsx.utils.sheet_to_json(sheet);
    } else if (req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/csv') {
      parsedData = await parseCSV(req.file.buffer);
    } else {
      return res.status(400).json({ message: 'Invalid file format. Please upload CSV or Excel.' });
    }

    if (!parsedData || parsedData.length === 0) {
      return res.status(400).json({ message: 'Uploaded file is empty.' });
    }

    let successCount = 0;
    const errors = [];
    const collegeName = req.user.collegeName; // multi-college isolation

    for (let row of parsedData) {
      const studentId = row.studentId || row.rollNumber || row.email;
      if (!studentId) {
        errors.push(`Missing identifier for row: ${JSON.stringify(row)}`);
        continue;
      }

      // Check if student exists in the database within this college
      const student = await Student.findOne({
        $or: [
          { studentId: studentId },
          { rollNumber: studentId },
          { email: studentId }
        ],
        collegeName: collegeName
      });

      if (!student) {
        errors.push(`Student ${studentId} not found in database`);
        continue; // Skip invalid student
      }

      // Parse subjects structure
      let subjects = [];
      if (row.subjects) {
        try {
          subjects = typeof row.subjects === 'string' ? JSON.parse(row.subjects) : row.subjects;
        } catch (e) {
          // Fallback if subjects is a string but not JSON
        }
      }
      
      // If flat CSV, we can map single subject per row, but for a full memo, 
      // users might upload JSON strings in 'subjects' column, or we construct it.
      // E.g: courseCode, courseName, internalMarks, externalMarks, totalMarks, grade, status
      if (subjects.length === 0 && (row.courseCode || row.subjectName)) {
         subjects.push({
           courseCode: row.courseCode || 'N/A',
           courseName: row.courseName || row.subjectName || 'Unknown',
           internalMarks: parseInt(row.internalMarks) || 0,
           externalMarks: parseInt(row.externalMarks) || 0,
           totalMarks: parseInt(row.totalMarks) || parseInt(row.marks) || 0,
           credits: parseInt(row.credits) || 0,
           grade: row.grade || 'N/A',
           status: row.status || (row.grade !== 'F' ? 'Pass' : 'Fail')
         });
      }

      // Check if a result for this student and semester already exists
      // If so, we might want to push the subject to the existing result rather than creating duplicates
      const existingResult = await Result.findOne({
        studentId: student.studentId || student.rollNumber || student._id.toString(),
        semester: row.semester || student.semester || 'N/A'
      });

      if (existingResult) {
        // Append subject and recalculate or just add
        existingResult.subjects.push(...subjects);
        if (row.sgpa) existingResult.sgpa = parseFloat(row.sgpa);
        if (row.cgpa) existingResult.cgpa = parseFloat(row.cgpa);
        if (row.totalCredits) existingResult.totalCredits = parseInt(row.totalCredits);
        await existingResult.save();
        successCount++;
        continue;
      }

      const newResult = new Result({
        studentId: student.studentId || student.rollNumber || student._id.toString(),
        studentName: student.name,
        rollNumber: student.rollNumber || student.studentId,
        department: row.department || student.department || 'N/A',
        semester: row.semester || student.semester || 'N/A',
        subjects: subjects,
        sgpa: parseFloat(row.sgpa) || 0,
        totalCredits: parseInt(row.totalCredits) || 0,
        cgpa: parseFloat(row.cgpa) || 0,
        uploadedBy: req.user._id,
        collegeName: collegeName,
        resultState: 'visible'
      });

      await newResult.save();
      successCount++;
    }

    res.json({
      message: `Result upload finished. Successfully added ${successCount} records.`,
      successCount,
      errorCount: errors.length,
      errors
    });
  } catch (error) {
    console.error('Error uploading results:', error);
    res.status(500).json({ message: 'Server error processing upload.' });
  }
};

// @desc    Get all results (Admin)
// @route   GET /api/admin/results
// @access  Private/Admin
export const getAdminResults = async (req, res) => {
  try {
    const results = await Result.find({ collegeName: req.user.collegeName }).sort({ createdAt: -1 });
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch results' });
  }
};

// @desc    Block result
// @route   PUT /api/admin/block-result/:id
// @access  Private/Admin
export const blockResult = async (req, res) => {
  try {
    const result = await Result.findOneAndUpdate(
      { _id: req.params.id, collegeName: req.user.collegeName },
      { resultState: 'blocked' },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ success: true, data: result, message: 'Result blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block result' });
  }
};

// @desc    Unblock result
// @route   PUT /api/admin/unblock-result/:id
// @access  Private/Admin
export const unblockResult = async (req, res) => {
  try {
    const result = await Result.findOneAndUpdate(
      { _id: req.params.id, collegeName: req.user.collegeName },
      { resultState: 'visible' },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ success: true, data: result, message: 'Result unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unblock result' });
  }
};

// @desc    Delete result
// @route   DELETE /api/admin/delete-result/:id
// @access  Private/Admin
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findOneAndDelete({ _id: req.params.id, collegeName: req.user.collegeName });
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete result' });
  }
};

// @desc    Get student results
// @route   GET /api/student/results
// @access  Private/Student
export const getStudentResults = async (req, res) => {
  try {
    // Only return visible results for the logged-in student
    // Need to match using student ID/roll number from the user doc (req.user is typically the student doc if logged in)
    const identifier = req.user.studentId || req.user.rollNumber || req.user.email;
    
    // First we find all results that match this student.
    const results = await Result.find({
      $or: [
        { studentId: identifier },
        { rollNumber: identifier },
        { studentId: req.user._id.toString() }
      ],
      collegeName: req.user.collegeName
    }).sort({ createdAt: -1 });

    // Check blocked state - requirements state that if it's blocked, we should probably still return it but with blocked state, 
    // so frontend can show "Your result is currently unavailable. Contact administration."
    // Or we can just return blocked records with a flag, and valid records with data.
    const processed = results.map(r => {
      if (r.resultState === 'blocked') {
        return {
          _id: r._id,
          semester: r.semester,
          resultState: 'blocked',
          message: 'Your result is currently unavailable. Contact administration.'
        };
      }
      return r;
    });

    res.json({ success: true, data: processed });
  } catch (error) {
    console.error('Error fetching student results:', error);
    res.status(500).json({ message: 'Failed to fetch student results' });
  }
};
