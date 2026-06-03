import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('+password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving students' });
  }
};

// @desc    Toggle Student Block State
// @route   PUT /api/admin/student/block/:id
// @access  Private/Admin
export const toggleStudentBlock = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      student.blocked = !student.blocked;
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating student block state' });
  }
};

// @desc    Update Student Details
// @route   PUT /api/admin/student/:id
// @access  Private/Admin
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Ensure admin belongs to the same college as the student (College Isolation)
    if (req.user.collegeName !== student.collegeName) {
      return res.status(403).json({ message: 'Not authorized to update student from another college' });
    }

    const {
      name, email, department, semester, gender, dateOfBirth,
      mobileNumber, fatherName, motherName, parentMobileNumber, bloodGroup,
      rollNumber, batch, degree, programCode, semesterNumber, section
    } = req.body;

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (department !== undefined) student.department = department;
    if (semester !== undefined) student.semester = semester;
    if (gender !== undefined) student.gender = gender;
    if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth;
    if (mobileNumber !== undefined) student.mobileNumber = mobileNumber;
    if (fatherName !== undefined) student.fatherName = fatherName;
    if (motherName !== undefined) student.motherName = motherName;
    if (parentMobileNumber !== undefined) student.parentMobileNumber = parentMobileNumber;
    if (bloodGroup !== undefined) student.bloodGroup = bloodGroup;
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (batch !== undefined) student.batch = batch;
    if (degree !== undefined) student.degree = degree;
    if (programCode !== undefined) student.programCode = programCode;
    if (semesterNumber !== undefined) student.semesterNumber = semesterNumber;
    if (section !== undefined) student.section = section;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating student details' });
  }
};

// @desc    Get all faculty
// @route   GET /api/admin/faculty
// @access  Private/Admin
export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({}).select('+password');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving faculty' });
  }
};

// @desc    Toggle Faculty Block State
// @route   PUT /api/admin/faculty/block/:id
// @access  Private/Admin
export const toggleFacultyBlock = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
      faculty.blocked = !faculty.blocked;
      const updatedFaculty = await faculty.save();
      res.json(updatedFaculty);
    } else {
      res.status(404).json({ message: 'Faculty not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating faculty block state' });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/admin/faculty/:id
// @access  Private/Admin
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
      await Faculty.deleteOne({ _id: faculty._id });
      res.json({ message: 'Faculty removed' });
    } else {
      res.status(404).json({ message: 'Faculty not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting faculty' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/role/:id
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating role' });
  }
};
