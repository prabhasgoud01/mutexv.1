import express from 'express';
import {
  getUsers,
  getStudents,
  toggleStudentBlock,
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
router.delete('/user/:id', deleteUser);
router.put('/role/:id', updateUserRole);

router.post('/upload-students', upload.single('file'), uploadStudents);
router.post('/upload-faculty', upload.single('file'), uploadFaculty);

export default router;
