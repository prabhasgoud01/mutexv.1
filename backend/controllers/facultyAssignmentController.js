import FacultyAssignment from '../models/FacultyAssignment.js';
import Faculty from '../models/Faculty.js';

// @desc    Assign subjects to a faculty
// @route   POST /api/admin/assign-subjects
// @access  Private/Admin
export const createAssignment = async (req, res) => {
  try {
    const { facultyId, department, academicYear, year, semester, section, subjects } = req.body;
    
    // Ensure faculty belongs to same college
    const faculty = await Faculty.findOne({ _id: facultyId, collegeName: req.user.collegeName });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found or does not belong to your college' });
    }

    // Check if an assignment already exists for this exact combination
    let assignment = await FacultyAssignment.findOne({
      facultyId,
      academicYear,
      semester,
      section,
      collegeName: req.user.collegeName
    });

    if (assignment) {
      // Update existing assignment subjects instead of failing
      assignment.subjects = subjects;
      assignment.department = department;
      assignment.year = year;
      await assignment.save();
      return res.status(200).json({ success: true, message: 'Assignment updated successfully', assignment });
    }

    assignment = new FacultyAssignment({
      facultyId,
      facultyName: faculty.name,
      department,
      academicYear,
      year,
      semester,
      section,
      subjects,
      collegeName: req.user.collegeName,
      createdBy: req.user._id
    });

    await assignment.save();
    res.status(201).json({ success: true, message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Assignment already exists for this combination.' });
    }
    res.status(500).json({ message: 'Server error while creating assignment' });
  }
};

// @desc    Get all faculty assignments for the college
// @route   GET /api/admin/faculty-assignments
// @access  Private/Admin
export const getAdminAssignments = async (req, res) => {
  try {
    const assignments = await FacultyAssignment.find({ collegeName: req.user.collegeName })
      .sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};

// @desc    Update a faculty assignment
// @route   PUT /api/admin/update-assignment/:id
// @access  Private/Admin
export const updateAssignment = async (req, res) => {
  try {
    const { subjects } = req.body;
    const assignment = await FacultyAssignment.findOneAndUpdate(
      { _id: req.params.id, collegeName: req.user.collegeName },
      { subjects },
      { new: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Assignment updated', assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating assignment' });
  }
};

// @desc    Delete a faculty assignment
// @route   DELETE /api/admin/delete-assignment/:id
// @access  Private/Admin
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await FacultyAssignment.findOneAndDelete({ 
      _id: req.params.id, 
      collegeName: req.user.collegeName 
    });
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting assignment' });
  }
};

// @desc    Get assigned subjects for logged in faculty
// @route   GET /api/faculty/assigned-subjects
// @access  Private/Faculty
export const getFacultyAssignments = async (req, res) => {
  try {
    const assignments = await FacultyAssignment.find({ 
      facultyId: req.user._id, 
      collegeName: req.user.collegeName 
    }).sort({ academicYear: -1, semester: 1 });
    
    res.json({ success: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your assignments' });
  }
};
