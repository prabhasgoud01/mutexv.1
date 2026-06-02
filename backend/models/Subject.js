import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    regulation: {
      type: String,
      required: true, // e.g. R-16, R-19, R-22
    },
    collegeName: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate subjects with the same code inside the same college
subjectSchema.index({ code: 1, collegeName: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
