import mongoose from 'mongoose';

const facultySubjectAssignmentSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true, // e.g., '2025-2026'
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
    },
    collegeName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent a faculty from being assigned to the exact same subject+class multiple times
facultySubjectAssignmentSchema.index({ facultyId: 1, subjectId: 1, branchId: 1, year: 1, sectionId: 1, semester: 1, academicYear: 1 }, { unique: true, name: 'unique_assignment' });


import { getTenantModel } from '../config/tenantManager.js';

const FacultySubjectAssignmentProxy = new Proxy(function() {}, {
  construct(target, args) {
    const Model = getTenantModel('FacultySubjectAssignment', facultySubjectAssignmentSchema);
    return new Model(...args);
  },
  get(target, prop) {
    const Model = getTenantModel('FacultySubjectAssignment', facultySubjectAssignmentSchema);
    const value = Model[prop];
    return typeof value === 'function' ? value.bind(Model) : value;
  }
});

Proxy;

export default FacultySubjectAssignment;
