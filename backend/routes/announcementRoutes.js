import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All announcement routes require authentication
router.use(protect);

// @route   GET /api/announcements
router.get('/', getAnnouncements);

// @route   POST /api/announcements
// Note: We use multer upload.single('image') to parse multipart/form-data
router.post('/', uploadImage.single('image'), createAnnouncement);

// @route   DELETE /api/announcements/:id
router.delete('/:id', deleteAnnouncement);

export default router;
