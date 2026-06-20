import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    academicYear: {
      type: String,
      required: true, // e.g., '2025-2026'
    },
    year: {
      type: String,
      required: true, // e.g., '2', '2nd Year'
    },
    semester: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['P', 'A', 'L'], // Present, Absent, Late
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student, subject, and date
attendanceSchema.index({ studentId: 1, subjectCode: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
