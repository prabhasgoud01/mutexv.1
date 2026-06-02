import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a college name'],
      unique: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    subscriptionExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const College = mongoose.model('College', collegeSchema);
export default College;
