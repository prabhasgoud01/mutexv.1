import Department from '../models/Department.js';

// @desc    Get all departments for the admin's college
// @route   GET /api/admin/departments
// @access  Private/Admin
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ collegeName: req.user.collegeName });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching departments' });
  }
};

// @desc    Add a single department
// @route   POST /api/admin/departments
// @access  Private/Admin
export const addDepartment = async (req, res) => {
  try {
    const { name, headOfDepartment, hodMobile, hodEmail, details } = req.body;
    const collegeName = req.user.collegeName;

    if (!name || !headOfDepartment || !hodMobile || !hodEmail) {
      return res.status(400).json({ message: 'Please provide all mandatory fields (Name, HOD Name, HOD Mobile, HOD Email)' });
    }

    const existingDepartment = await Department.findOne({ name, collegeName });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists in your college' });
    }

    const department = await Department.create({
      name,
      headOfDepartment,
      hodMobile,
      hodEmail,
      details,
      collegeName
    });

    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating department' });
  }
};

// @desc    Delete a department
// @route   DELETE /api/admin/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // College isolation check
    if (department.collegeName !== req.user.collegeName) {
      return res.status(403).json({ message: 'Not authorized to delete this department' });
    }

    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting department' });
  }
};
