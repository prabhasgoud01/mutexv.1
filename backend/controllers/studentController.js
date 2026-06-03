// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
export const getStudentProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        // Personal Details
        name: user.name,
        email: user.email,
        gender: user.gender || 'N/A',
        dateOfBirth: user.dateOfBirth || 'N/A',
        mobileNumber: user.mobileNumber || user.phoneNumber || 'N/A',
        fatherName: user.fatherName || 'N/A',
        motherName: user.motherName || 'N/A',
        parentMobileNumber: user.parentMobileNumber || 'N/A',
        bloodGroup: user.bloodGroup || 'N/A',
        
        // Academic Details
        rollNumber: user.rollNumber || user.studentId || 'N/A',
        batch: user.batch || 'N/A',
        degree: user.degree || 'N/A',
        department: user.department || 'N/A',
        programCode: user.programCode || 'N/A',
        semesterNumber: user.semesterNumber || user.semester || 'N/A',
        section: user.section || 'N/A',
        
        collegeName: user.collegeName || 'N/A'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Get academic details
// @route   GET /api/student/academic-details
export const getAcademicDetails = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        subjects: [
          { name: 'Advanced Algorithms', code: 'CS-401', credits: 4, faculty: 'Dr. Sarah Jenkins' },
          { name: 'Deep Learning', code: 'CS-425', credits: 4, faculty: 'Prof. Michael Chang' },
          { name: 'Cloud Architecture', code: 'CS-390', credits: 3, faculty: 'Dr. Raymond Floyd' },
          { name: 'HCI', code: 'CS-322', credits: 3, faculty: 'Prof. Helen Myers' }
        ],
        cgpa: 3.92,
        totalCredits: 104
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get attendance
export const getAttendance = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalPercentage: 88.5,
        status: 'Excellent',
        subjects: [
          { name: 'Advanced Algorithms', attended: 36, total: 40, percentage: 90 },
          { name: 'Deep Learning', attended: 38, total: 40, percentage: 95 },
          { name: 'Cloud Architecture', attended: 24, total: 30, percentage: 80 },
          { name: 'HCI', attended: 27, total: 30, percentage: 90 }
        ],
        monthly: [
          { month: 'Jan', percentage: 92 },
          { month: 'Feb', percentage: 89 },
          { month: 'Mar', percentage: 86 },
          { month: 'Apr', percentage: 88 }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get results
export const getResults = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        currentSemester: 'Semester 5',
        sgpa: 3.85,
        cgpa: 3.92,
        status: 'Pass',
        subjects: [
          { name: 'Operating Systems', marks: 92, grade: 'A+', status: 'Pass' },
          { name: 'Database Systems', marks: 88, grade: 'A', status: 'Pass' },
          { name: 'Computer Networks', marks: 85, grade: 'A', status: 'Pass' },
          { name: 'Software Engineering', marks: 95, grade: 'A+', status: 'Pass' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get fees
export const getFees = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalFee: 15000,
        paid: 10000,
        pending: 5000,
        dueDate: '2026-08-15',
        history: [
          { date: '2025-08-10', amount: 5000, status: 'Success', receipt: '#REC-001' },
          { date: '2026-01-15', amount: 5000, status: 'Success', receipt: '#REC-002' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get announcements
export const getAnnouncements = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { id: 1, title: 'Final Exam Schedule Published', date: '2026-05-28', type: 'Exam' },
        { id: 2, title: 'Campus Tech Fest Registration', date: '2026-05-25', type: 'Event' },
        { id: 3, title: 'Library Maintenance - Weekend Closure', date: '2026-05-20', type: 'Notice' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get calendar events
export const getCalendar = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { id: 1, date: '2026-06-05', title: 'Midterm Presentations', type: 'academic' },
        { id: 2, date: '2026-06-10', title: 'Fee Deadline', type: 'administrative' },
        { id: 3, date: '2026-06-15', title: 'Summer Break Begins', type: 'holiday' },
        { id: 4, date: '2026-06-25', title: 'Hackathon 2026', type: 'event' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { category, message } = req.body;
    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
