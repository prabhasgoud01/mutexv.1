import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  internalMarks: {
    type: Number,
    required: true
  },
  externalMarks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'P', 'F'],
    required: true
  }
});

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID or Roll Number is required']
    },
    studentName: {
      type: String,
      default: ''
    },
    rollNumber: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: ''
    },
    semester: {
      type: String,
      required: [true, 'Semester is required']
    },
    subjects: [subjectSchema],
    sgpa: {
      type: Number,
      required: true
    },
    totalCredits: {
      type: Number,
      default: 0
    },
    cgpa: {
      type: Number,
      default: 0
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collegeName: {
      type: String,
      required: [true, 'College Name is required']
    },
    resultState: {
      type: String,
      enum: ['visible', 'blocked'],
      default: 'visible'
    }
  },
  {
    timestamps: true
  }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
