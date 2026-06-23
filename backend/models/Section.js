import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    year: {
      type: String,
      required: [true, 'Please provide the year (e.g., "1", "2")'],
    },
    sectionName: {
      type: String,
      required: [true, 'Please provide a section name (e.g., "A", "B")'],
      uppercase: true,
      trim: true,
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

// Prevent duplicate sections for the same branch and year in the college
sectionSchema.index({ branchId: 1, year: 1, sectionName: 1, collegeName: 1 }, { unique: true });


import { getTenantModel } from '../config/tenantManager.js';

const SectionProxy = new Proxy(function() {}, {
  construct(target, args) {
    const Model = getTenantModel('Section', sectionSchema);
    return new Model(...args);
  },
  get(target, prop) {
    const Model = getTenantModel('Section', sectionSchema);
    const value = Model[prop];
    return typeof value === 'function' ? value.bind(Model) : value;
  }
});

Proxy;

export default Section;
