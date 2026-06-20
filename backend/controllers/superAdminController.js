import College from '../models/College.js';
import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import { sendEmail } from '../config/mail.js';

// @desc    Get dashboard statistics
// @route   GET /api/super-admin/stats
// @access  Private/SuperAdmin
export const getDashboardStats = async (req, res) => {
  try {
    const collegesCount = await College.countDocuments();
    const adminsCount = await Admin.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const studentsCount = await Student.countDocuments();

    res.json({
      colleges: collegesCount,
      admins: adminsCount,
      faculty: facultyCount,
      students: studentsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving stats' });
  }
};

// @desc    Get all colleges
// @route   GET /api/super-admin/colleges
// @access  Private/SuperAdmin
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({}).sort({ createdAt: -1 });
    res.json(colleges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving colleges' });
  }
};

// @desc    Toggle college block status
// @route   PUT /api/super-admin/colleges/:id/block
// @access  Private/SuperAdmin
export const toggleCollegeBlock = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (college) {
      college.isBlocked = !college.isBlocked;
      const updatedCollege = await college.save();
      res.json(updatedCollege);
    } else {
      res.status(404).json({ message: 'College not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating college status' });
  }
};

// @desc    Update college subscription
// @route   PUT /api/super-admin/colleges/:id/subscription
// @access  Private/SuperAdmin
export const updateCollegeSubscription = async (req, res) => {
  try {
    const { expiryDate } = req.body;
    const college = await College.findById(req.params.id);
    if (college) {
      college.subscriptionExpiry = expiryDate ? new Date(expiryDate) : null;
      const updatedCollege = await college.save();
      res.json(updatedCollege);
    } else {
      res.status(404).json({ message: 'College not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating college subscription' });
  }
};

// @desc    Get all users across the platform
// @route   GET /api/super-admin/users
// @access  Private (Super Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Optional filters
    const role = req.query.role;
    const collegeId = req.query.collegeId;
    const search = req.query.search;
    
    const users = [];
    
    // Query admins if no role filter or role is admin
    if (!role || role === 'admin') {
      let query = {};
      
      // We'd need to match college name if collegeId was provided
      if (collegeId) {
        const college = await College.findById(collegeId);
        if (college) query.collegeName = college.name;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      const admins = await Admin.find(query).select('-password').lean();
      users.push(...admins.map(a => ({ ...a, role: 'admin' })));
    }
    
    // Note: A real implementation would use aggregation pipelines for better performance
    // across multiple collections
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a new College Admin
// @route   POST /api/super-admin/create-admin
// @access  Private (Super Admin only)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, collegeName, phoneNumber, age, state } = req.body;

    if (!name || !email || !collegeName) {
      return res.status(400).json({ success: false, message: 'Name, email, and college name are required' });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
    }

    // Ensure college exists
    let college = await College.findOne({ name: collegeName });
    if (!college) {
      college = await College.create({ name: collegeName });
    } else if (college.isBlocked) {
      return res.status(403).json({ success: false, message: 'Creation not allowed. This college is blocked.' });
    }

    const defaultPassword = 'Prabhas@123';

    const newAdmin = await Admin.create({
      name,
      email,
      password: defaultPassword, // Will be hashed by pre('save') hook in Admin schema
      collegeName,
      phoneNumber,
      role: 'admin',
      location: state,
    });

    // Send credentials email
    const emailMessage = `
      <h1>Your Admin Account has been Created</h1>
      <p>Hello ${name},</p>
      <p>Your College Admin account for ${collegeName} has been successfully created by the Super Admin.</p>
      <p>Here are your temporary login credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${defaultPassword}</li>
      </ul>
      <p><strong>IMPORTANT:</strong> For security reasons, you will be required to reset your password immediately upon your first login.</p>
      <p>Click <a href="${process.env.CLIENT_URL}/admin-login">here</a> to login.</p>
    `;

    try {
      await sendEmail({
        to: newAdmin.email,
        subject: 'Your Admin Account Credentials',
        html: emailMessage,
      });
    } catch (err) {
      console.error('Email could not be sent', err);
    }

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        collegeName: newAdmin.collegeName,
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ success: false, message: 'Server error during admin creation' });
  }
};
