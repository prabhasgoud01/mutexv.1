import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendEmail } from '../config/mail.js';

// Helper to get model by role
const getModelByRole = (role) => {
  if (role === 'admin') return Admin;
  if (role === 'faculty') return Faculty;
  return Student;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, collegeName, location } = req.body;
    const userRole = role || 'student';

    const Model = getModelByRole(userRole);

    const userExists = await Model.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await Model.create({
      name,
      email,
      password,
      role: userRole,
      collegeName,
      location,
    });

    if (user) {
      generateToken(res, user._id, user.role);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        collegeName: user.collegeName,
        location: user.location,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, portalRole } = req.body;

    const Model = getModelByRole(portalRole);

    const user = await Model.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
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

      generateToken(res, user._id, user.role);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        isFirstLogin: user.isFirstLogin,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
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

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    // Check all collections sequentially since we don't know the role from email alone
    let user = await Student.findOne({ email: req.body.email });
    if (!user) user = await Faculty.findOne({ email: req.body.email });
    if (!user) user = await Admin.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

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

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Check all collections
    let user = await Student.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    
    if (!user) {
      user = await Faculty.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }
    
    if (!user) {
      user = await Admin.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Log the user in implicitly by returning a new token
    generateToken(res, user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// @desc    Change Password First Login
// @route   POST /api/auth/first-login-change-password
// @access  Private
export const changePasswordFirstLogin = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
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
