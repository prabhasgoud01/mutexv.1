import express from 'express';
import {
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePasswordFirstLogin,
  superAdminForgotPassword,
  adminForgotPassword,
  facultyForgotPassword,
  studentForgotPassword,
  superAdminResetPassword,
  adminResetPassword,
  facultyResetPassword,
  studentResetPassword,
  registerSuperAdmin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginRateLimiter, loginUser);
router.post('/superadmin/signup', registerSuperAdmin);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Role-specific forgot password
router.post('/super-admin-forgot-password', superAdminForgotPassword);
router.post('/admin-forgot-password', adminForgotPassword);
router.post('/faculty-forgot-password', facultyForgotPassword);
router.post('/student-forgot-password', studentForgotPassword);

// Role-specific reset password
router.post('/super-admin-reset-password/:token', superAdminResetPassword);
router.post('/admin-reset-password/:token', adminResetPassword);
router.post('/faculty-reset-password/:token', facultyResetPassword);
router.post('/student-reset-password/:token', studentResetPassword);

router.post('/first-login-change-password', protect, changePasswordFirstLogin);

export default router;
