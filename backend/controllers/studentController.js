// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
export const getStudentProfile = async (req, res) => {
  try {
    // In a real app, you might fetch specific student data from another collection
    res.json({
      message: 'Student profile data',
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving student profile' });
  }
};
