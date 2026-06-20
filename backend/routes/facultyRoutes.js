import express from 'express';
import { getFacultyProfile } from '../controllers/facultyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

import { getFacultyAssignments } from '../controllers/facultyAssignmentController.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('faculty'));

router.get('/profile', getFacultyProfile);
router.get('/assigned-subjects', getFacultyAssignments);

export default router;
