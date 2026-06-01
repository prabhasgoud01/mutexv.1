import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const studentSchema = new mongoose.Schema(
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
      default: 'student',
    },
    studentId: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
    semester: {
      type: String,
      default: '',
    },
    attendance: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    feeDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    personalDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

studentSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

studentSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
