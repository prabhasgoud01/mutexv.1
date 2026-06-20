import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import SuperAdmin from '../models/SuperAdmin.js';
import College from '../models/College.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../config/mail.js';
import { validatePassword } from '../utils/validatePassword.js';

// Helper to get model by role
const getModelByRole = (role) => {
  if (role === 'superadmin') return SuperAdmin;
  if (role === 'admin') return Admin;
  if (role === 'faculty') return Faculty;
  return Student;
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, portalRole } = req.body;

    const Model = getModelByRole(portalRole);

    const user = await Model.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const lockDurationMs = user.lockUntil - Date.now();
      const lockDurationMinutes = Math.ceil(lockDurationMs / 60000);
      return res.status(403).json({
        message: `Account is locked. Please try again after ${lockDurationMinutes} minutes.`,
        lockDurationMinutes
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
      const lockDurationMs = parseInt(process.env.LOCK_DURATION_MS) || 15 * 60 * 1000;
      
      let remainingAttempts = Math.max(0, maxAttempts - user.loginAttempts);

      if (user.loginAttempts >= maxAttempts) {
        user.lockUntil = Date.now() + lockDurationMs;
        await user.save({ validateBeforeSave: false });
        return res.status(403).json({
          message: `Account locked due to too many failed attempts. Please try again after ${Math.ceil(lockDurationMs / 60000)} minutes.`,
          lockDurationMinutes: Math.ceil(lockDurationMs / 60000),
          remainingAttempts: 0
        });
      }

      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ 
        message: 'Invalid email or password',
        remainingAttempts 
      });
    }

    // Password matches! Reset login attempts and lock status
    let needsSave = false;
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      needsSave = true;
    }

    // Check if the current password is weak, force change if so
    if (!validatePassword(password).isValid) {
      user.isFirstLogin = true;
      needsSave = true;
    }

    if (needsSave) {
      await user.save({ validateBeforeSave: false });
    }

    // Verify role matches login portal
    if (portalRole && user.role !== portalRole) {
      return res.status(403).json({ 
        message: 'Access denied. Please use your respective login portal.' 
      });
    }

    // Check if user is blocked
    if (user.blocked) {
      return res.status(403).json({
        message: 'Your account has been blocked by an administrator.'
      });
    }

    // Check College Blocked / Subscription status
    if (user.role !== 'superadmin' && user.collegeName) {
      const college = await College.findOne({ name: user.collegeName });
      if (college) {
        if (college.isBlocked) {
          return res.status(403).json({ message: 'Your college has been blocked by the Super Admin.' });
        }
        if (college.subscriptionExpiry && new Date() > new Date(college.subscriptionExpiry)) {
          return res.status(403).json({ message: 'Your college subscription has expired. Please contact support.' });
        }
      }
    }

    const token = generateToken(res, user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      isFirstLogin: user.isFirstLogin,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile (restores session)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profilePhoto: req.user.profilePhoto,
      collegeName: req.user.collegeName,
      location: req.user.location,
      phoneNumber: req.user.phoneNumber,
      bio: req.user.bio,
      employeeId: req.user.employeeId,
      dateOfBirth: req.user.dateOfBirth,
      isFirstLogin: req.user.isFirstLogin,
    };
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const Model = getModelByRole(req.user.role);
    const user = await Model.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.collegeName = req.body.collegeName || user.collegeName;
      user.location = req.body.location || user.location;
      
      // Update these only if they are explicitly sent in the request
      if (req.body.profilePhoto !== undefined) user.profilePhoto = req.body.profilePhoto;
      if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.employeeId !== undefined) user.employeeId = req.body.employeeId;
      if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto,
        collegeName: updatedUser.collegeName,
        location: updatedUser.location,
        phoneNumber: updatedUser.phoneNumber,
        bio: updatedUser.bio,
        employeeId: updatedUser.employeeId,
        dateOfBirth: updatedUser.dateOfBirth,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Helper to send forgot password email
const sendRoleSpecificForgotEmail = async (user, Model, rolePath, req, res) => {
  try {
    // Generate JWT reset token (expires in 15m)
    const resetToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // We can also save the token to DB for manual invalidation compatibility
    // But since the prompt relies heavily on JWT expiry, we will use it directly.
    // However, existing models use resetPasswordToken/Expire. We'll set them for safety.
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/${rolePath}-reset-password/${resetToken}`;

    const message = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">ProjectMutex</h2>
        <p>You requested a password reset for your ${user.role} account.</p>
        <p>Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #ef4444; font-size: 12px; text-align: center;">This link will expire in 15 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.error(error);
    return res.status(500).json({ message: 'Email could not be sent' });
  }
};

// Forgot Password Controllers
export const superAdminForgotPassword = async (req, res) => {
  const user = await SuperAdmin.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'There is no user with that email' });
  await sendRoleSpecificForgotEmail(user, SuperAdmin, 'super-admin', req, res);
};

export const adminForgotPassword = async (req, res) => {
  const user = await Admin.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'There is no user with that email' });
  await sendRoleSpecificForgotEmail(user, Admin, 'admin', req, res);
};

export const facultyForgotPassword = async (req, res) => {
  const user = await Faculty.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'There is no user with that email' });
  await sendRoleSpecificForgotEmail(user, Faculty, 'faculty', req, res);
};

export const studentForgotPassword = async (req, res) => {
  const user = await Student.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'There is no user with that email' });
  await sendRoleSpecificForgotEmail(user, Student, 'student', req, res);
};

// Helper for Role Specific Reset
const handleRoleSpecificReset = async (Model, expectedRole, req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (decoded.role !== expectedRole) {
      return res.status(400).json({ message: 'Token role mismatch' });
    }

    const user = await Model.findById(decoded.id);

    // Also check if the token matches the one in DB and hasn't expired according to DB (if we want to invalidate it)
    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.errors[0], errors: passwordValidation.errors });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// Reset Password Controllers
export const superAdminResetPassword = async (req, res) => {
  await handleRoleSpecificReset(SuperAdmin, 'superadmin', req, res);
};

export const adminResetPassword = async (req, res) => {
  await handleRoleSpecificReset(Admin, 'admin', req, res);
};

export const facultyResetPassword = async (req, res) => {
  await handleRoleSpecificReset(Faculty, 'faculty', req, res);
};

export const studentResetPassword = async (req, res) => {
  await handleRoleSpecificReset(Student, 'student', req, res);
};

// @desc    Change Password First Login
// @route   POST /api/auth/first-login-change-password
// @access  Private
export const changePasswordFirstLogin = async (req, res) => {
  try {
    const { password } = req.body;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.errors[0], errors: passwordValidation.errors });
    }

    const Model = getModelByRole(req.user.role);
    const user = await Model.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    user.isFirstLogin = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      isFirstLogin: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};
