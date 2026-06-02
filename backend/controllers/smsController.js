import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Admin from '../models/Admin.js';
import SmsLog from '../models/SmsLog.js';
import axios from 'axios';

// Search Students
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const collegeName = req.user.collegeName;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');

    const students = await Student.find({
      collegeName,
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { studentId: searchRegex },
        { phoneNumber: searchRegex }
      ]
    }).select('name email studentId phoneNumber department course').limit(20);

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Search All Users (Faculty & Students)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const collegeName = req.user.collegeName;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');

    const [students, faculty] = await Promise.all([
      Student.find({
        collegeName,
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { studentId: searchRegex },
          { phoneNumber: searchRegex }
        ]
      }).select('name email studentId phoneNumber department course role').limit(15),
      Faculty.find({
        collegeName,
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phoneNumber: searchRegex }
        ]
      }).select('name email phoneNumber department role').limit(15)
    ]);

    const users = [...students, ...faculty];
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Send SMS Broadcast
export const sendSmsBroadcast = async (req, res) => {
  try {
    const { targetType, message, department, section, userId, userType } = req.body;
    const collegeName = req.user.collegeName;

    if (!message || message.length > 160) {
      return res.status(400).json({ success: false, message: 'Message is required and must not exceed 160 characters.' });
    }

    let recipients = [];
    let recipientPhones = [];

    // If Super Admin, they must provide targetCollege for 'Specific College' broadcast
    if (req.user.role === 'superadmin') {
      if (targetType !== 'Specific College') {
        return res.status(403).json({ success: false, message: 'Super Admins can only use Specific College target.' });
      }
      if (!req.body.targetCollege) {
        return res.status(400).json({ success: false, message: 'targetCollege is required for Super Admin broadcast.' });
      }
      
      const [allStudents, allFaculty] = await Promise.all([
        Student.find({ collegeName: req.body.targetCollege, phoneNumber: { $exists: true, $ne: '' } }),
        Faculty.find({ collegeName: req.body.targetCollege, phoneNumber: { $exists: true, $ne: '' } })
      ]);
      recipients = [...allStudents, ...allFaculty];
    } else {
      // Admin Logic
      switch (targetType) {
        case 'All Students':
          recipients = await Student.find({ collegeName, phoneNumber: { $exists: true, $ne: '' } });
          break;
        case 'All Faculty':
          recipients = await Faculty.find({ collegeName, phoneNumber: { $exists: true, $ne: '' } });
          break;
        case 'All Registered Mobile Numbers':
          const [allStudents, allFaculty] = await Promise.all([
            Student.find({ collegeName, phoneNumber: { $exists: true, $ne: '' } }),
            Faculty.find({ collegeName, phoneNumber: { $exists: true, $ne: '' } })
          ]);
          recipients = [...allStudents, ...allFaculty];
          break;
        case 'Specific Department':
          if (!department) return res.status(400).json({ success: false, message: 'Department is required' });
          recipients = await Student.find({ collegeName, department, phoneNumber: { $exists: true, $ne: '' } });
          break;
        case 'Specific Section':
          if (!department || !section) return res.status(400).json({ success: false, message: 'Department and section are required' });
          recipients = await Student.find({ collegeName, department, phoneNumber: { $exists: true, $ne: '' } });
          break;
        case 'Specific Student':
          if (!userId) return res.status(400).json({ success: false, message: 'Student ID is required' });
          const student = await Student.findOne({ _id: userId, collegeName, phoneNumber: { $exists: true, $ne: '' } });
          if (student) recipients = [student];
          break;
        case 'Single User':
          if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });
          if (userType === 'student') {
            const s = await Student.findOne({ _id: userId, collegeName, phoneNumber: { $exists: true, $ne: '' } });
            if (s) recipients = [s];
          } else if (userType === 'faculty') {
            const f = await Faculty.findOne({ _id: userId, collegeName, phoneNumber: { $exists: true, $ne: '' } });
            if (f) recipients = [f];
          }
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid target type' });
      }
    }

    let formattedNumbers = recipients
      .map(r => r.phoneNumber)
      .filter(Boolean)
      .map(num => {
        const digitsOnly = String(num).replace(/\D/g, '');
        if (digitsOnly.length === 10) return `91${digitsOnly}`;
        return digitsOnly;
      })
      .filter(num => num.length >= 10);

    if (formattedNumbers.length === 0) {
      return res.status(404).json({ success: false, message: 'No valid mobile numbers found for the selected target.' });
    }

    let providerResponse = null;
    let deliveryStatus = 'Failed';
    let errorMessage = '';

    try {
      if (!process.env.FAST2SMS_API_KEY) {
        throw new Error('FAST2SMS_API_KEY is missing from environment variables');
      }

      console.log('Sending SMS...');
      console.log('Phone Numbers:', formattedNumbers);
      console.log('Message:', message);

      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'q',
          message: message,
          language: 'english',
          numbers: formattedNumbers.join(','),
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Fast2SMS Response:', response.data);
      providerResponse = response.data;
      
      if (response.data.return === true) {
        deliveryStatus = 'Sent';
      } else {
        errorMessage = response.data.message || 'SMS Provider rejected the request';
      }
    } catch (apiError) {
      console.error('Fast2SMS API Error:', apiError.response?.data || apiError.message);
      providerResponse = apiError.response?.data || { error: apiError.message };
      errorMessage = apiError.response?.data?.message || apiError.message;
    }

    // Log the broadcast
    const smsLog = await SmsLog.create({
      targetType,
      selectedUsers: formattedNumbers.length > 5 ? `${formattedNumbers.length} recipients` : formattedNumbers,
      sentBy: req.user._id,
      senderModel: req.user.role === 'superadmin' ? 'SuperAdmin' : 'Admin',
      message,
      collegeName: req.user.role === 'superadmin' ? req.body.targetCollege : collegeName,
      deliveryStatus,
      providerResponse,
      recipientsCount: formattedNumbers.length
    });

    if (deliveryStatus === 'Failed') {
      return res.status(502).json({ 
        success: false, 
        message: `SMS Gateway Error: ${errorMessage}`,
        data: smsLog
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully sent SMS to ${formattedNumbers.length} recipients`,
      data: smsLog
    });

  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
