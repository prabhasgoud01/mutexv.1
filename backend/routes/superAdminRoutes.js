import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkSuperAdmin } from '../middleware/superAdminMiddleware.js';
import {
  getDashboardStats,
  getAllColleges,
  toggleCollegeBlock,
  updateCollegeSubscription,
  getAllUsers,
  createAdmin,
} from '../controllers/superAdminController.js';

const router = express.Router();

// All routes require authentication and Super Admin privileges
router.use(protect);
router.use(checkSuperAdmin);

router.get('/stats', getDashboardStats);
router.get('/colleges', getAllColleges);
router.put('/colleges/:id/block', toggleCollegeBlock);
router.put('/colleges/:id/subscription', updateCollegeSubscription);
router.get('/users', getAllUsers);
router.post('/create-admin', createAdmin);

export default router;
