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
  updateStudentProfile,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import multer from 'multer';
import { searchStudents, searchUsers, sendSmsBroadcast } from '../controllers/smsController.js';
import { sendSMS } from '../utils/smsService.js';
import { getSubjects, addSubject, deleteSubject, deleteMultipleSubjects } from '../controllers/subjectController.js';
import { uploadStudents, uploadFaculty, uploadSubjects, uploadDepartments } from '../controllers/uploadController.js';
import { getDepartments, addDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { uploadResults, getAdminResults, blockResult, unblockResult, deleteResult } from '../controllers/resultController.js';
import { createAssignment, getAdminAssignments, updateAssignment, deleteAssignment } from '../controllers/facultyAssignmentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/users', getUsers);
router.get('/students', getStudents);
router.put('/update-student/:id', updateStudentProfile);
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

// Department Routes
router.get('/departments', getDepartments);
router.post('/departments', addDepartment);
router.delete('/departments/:id', deleteDepartment);
router.post('/upload-departments', upload.single('file'), uploadDepartments);

// SMS Gateway Routes
router.get('/students/search', searchStudents);
router.get('/users/search', searchUsers);
router.post('/send-sms', sendSmsBroadcast);

router.get('/test-sms', async (req, res) => {
  try {
    await sendSMS("9876543210", "Test SMS from College ERP");
    res.send("SMS Test Triggered. Check the terminal logs for responses.");
  } catch (error) {
    res.status(500).send("SMS Test Failed: " + error.message);
  }
});

// Result Routes
router.get('/results', getAdminResults);
router.post('/upload-results', upload.single('file'), uploadResults);
router.put('/block-result/:id', blockResult);
router.put('/unblock-result/:id', unblockResult);
router.delete('/delete-result/:id', deleteResult);

// Faculty Assignment Routes
router.post('/assign-subjects', createAssignment);
router.get('/faculty-assignments', getAdminAssignments);
router.put('/update-assignment/:id', updateAssignment);
router.delete('/delete-assignment/:id', deleteAssignment);

export default router;
