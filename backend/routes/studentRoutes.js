import express from 'express';
import { 
  getStudentProfile, 
  getAcademicDetails,
  getAttendance,
  getResults,
  getFees,
  getAnnouncements,
  getCalendar,
  submitFeedback
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('student'));

router.get('/profile', getStudentProfile);
router.get('/academic-details', getAcademicDetails);
router.get('/attendance', getAttendance);
router.get('/results', getResults);
router.get('/fees', getFees);
router.get('/announcements', getAnnouncements);
router.get('/calendar', getCalendar);
router.post('/feedback', submitFeedback);

export default router;
