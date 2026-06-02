import express from 'express';
import {
  getUsers,
  getStudents,
  toggleStudentBlock,
  getFaculty,
  toggleFacultyBlock,
  deleteFaculty,
  deleteUser,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import multer from 'multer';
import { searchStudents, searchUsers, sendSmsBroadcast } from '../controllers/smsController.js';
import { getSubjects, addSubject, deleteSubject, deleteMultipleSubjects } from '../controllers/subjectController.js';
import { uploadStudents, uploadFaculty, uploadSubjects } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/users', getUsers);
router.get('/students', getStudents);
router.put('/student/block/:id', toggleStudentBlock);
router.get('/faculty', getFaculty);
router.put('/faculty/block/:id', toggleFacultyBlock);
router.delete('/faculty/:id', deleteFaculty);
router.delete('/user/:id', deleteUser);
router.put('/role/:id', updateUserRole);

router.post('/upload-students', upload.single('file'), uploadStudents);
router.post('/upload-faculty', upload.single('file'), uploadFaculty);

// Subject Routes
router.get('/subjects', getSubjects);
router.post('/subjects', addSubject);
router.post('/subjects/bulk-delete', deleteMultipleSubjects);
router.delete('/subjects/:id', deleteSubject);
router.post('/upload-subjects', upload.single('file'), uploadSubjects);

// SMS Gateway Routes
router.get('/students/search', searchStudents);
router.get('/users/search', searchUsers);
router.post('/send-sms', sendSmsBroadcast);

export default router;
