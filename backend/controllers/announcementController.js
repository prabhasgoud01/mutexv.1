import Announcement from '../models/Announcement.js';
import fs from 'fs';
import path from 'path';

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    
    // req.user contains the authenticated Admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can create announcements' });
    }

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let imageUrl = '';
    if (req.file) {
      // Create a relative URL that the frontend can use to fetch the image
      imageUrl = `/uploads/announcements/${req.file.filename}`;
    }

    const announcement = await Announcement.create({
      title,
      category,
      content,
      imageUrl,
      collegeName: req.user.collegeName,
      authorId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get announcements for the user's college
// @route   GET /api/announcements
// @access  Private (All Roles)
export const getAnnouncements = async (req, res) => {
  try {
    const collegeName = req.user.collegeName;

    // Fetch announcements that belong to the user's college
    const announcements = await Announcement.find({ collegeName })
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email');

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can delete announcements' });
    }

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Ensure the admin belongs to the same college
    if (announcement.collegeName !== req.user.collegeName) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this announcement' });
    }

    // Delete image file if it exists
    if (announcement.imageUrl) {
      // e.g. /uploads/announcements/filename.ext
      const filePath = path.join(process.cwd(), 'backend', announcement.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
