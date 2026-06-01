import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'faculty',
    },
    department: {
      type: String,
      default: '',
    },
    subjects: {
      type: [String],
      default: [],
    },
    facultyId: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    collegeName: {
      type: String,
    },
    location: {
      type: String,
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    specialization: {
      type: String,
      default: '',
    },
    positionRole: {
      type: String,
      default: 'Faculty',
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

facultySchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

facultySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

facultySchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
