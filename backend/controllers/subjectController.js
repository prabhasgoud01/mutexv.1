import Subject from '../models/Subject.js';

// @desc    Get all subjects for the admin's college
// @route   GET /api/admin/subjects
// @access  Private/Admin
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ collegeName: req.user.collegeName });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving subjects' });
  }
};

// @desc    Add a single subject
// @route   POST /api/admin/subjects
// @access  Private/Admin
export const addSubject = async (req, res) => {
  try {
    const { name, code, units, regulation } = req.body;
    
    if (!name || !code || !units || !regulation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await Subject.findOne({ code, collegeName: req.user.collegeName });
    if (exists) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    const subject = await Subject.create({
      name,
      code,
      units,
      regulation,
      collegeName: req.user.collegeName
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding subject' });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/admin/subjects/:id
// @access  Private/Admin
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, collegeName: req.user.collegeName });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    await Subject.deleteOne({ _id: req.params.id });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting subject' });
  }
};

// @desc    Delete multiple subjects
// @route   POST /api/admin/subjects/bulk-delete
// @access  Private/Admin
export const deleteMultipleSubjects = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No subjects selected for deletion' });
    }

    await Subject.deleteMany({
      _id: { $in: ids },
      collegeName: req.user.collegeName
    });

    res.json({ message: 'Selected subjects deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting multiple subjects' });
  }
};
