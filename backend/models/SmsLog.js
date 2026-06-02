import mongoose from 'mongoose';

const smsLogSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      required: true,
      enum: [
        'All Students',
        'All Faculty',
        'All Registered Mobile Numbers',
        'Specific Department',
        'Specific Section',
        'Specific College',
        'Single User',
        'Specific Student',
      ],
    },
    selectedUsers: {
      type: mongoose.Schema.Types.Mixed, 
      default: [], // Array of targeted users or descriptive metadata
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'senderModel',
      required: true,
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Admin', 'SuperAdmin'],
    },
    message: {
      type: String,
      required: [true, 'Message body cannot be empty'],
      maxlength: [160, 'Message cannot exceed 160 characters'],
    },
    collegeName: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      default: 'Sent', // E.g., 'Sent', 'Failed', 'Pending'
    },
    providerResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    recipientsCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const SmsLog = mongoose.model('SmsLog', smsLogSchema);
export default SmsLog;
