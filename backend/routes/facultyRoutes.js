import express from 'express';
import { getFacultyProfile } from '../controllers/facultyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('faculty'));

router.get('/profile', getFacultyProfile);

export default router;
