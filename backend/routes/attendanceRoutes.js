import express from 'express';
import { 
  loadStudents, 
  markAttendance, 
  getStudentAttendance, 
  getAdminReport 
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Faculty Routes
router.post('/faculty/load-students', protect, loadStudents);
router.post('/faculty/mark', protect, markAttendance);

// Student Routes
router.get('/student', protect, getStudentAttendance);

// Admin Routes (Can be accessed by Admin or SuperAdmin if protect middleware allows them or we add role check)
// Since `protect` just checks JWT and fetches `req.user`, we rely on UI to hide this, or we could add a `authorize('admin')` middleware.
router.get('/admin-report', protect, getAdminReport);

export default router;
