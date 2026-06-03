import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    headOfDepartment: {
      type: String,
      required: true,
      trim: true,
    },
    hodMobile: {
      type: String,
      required: true,
      trim: true,
    },
    hodEmail: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: '',
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate department names within the same college
departmentSchema.index({ name: 1, collegeName: 1 }, { unique: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
