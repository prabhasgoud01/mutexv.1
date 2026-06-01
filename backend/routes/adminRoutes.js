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
import { uploadStudents, uploadFaculty } from '../controllers/uploadController.js';

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

export default router;
