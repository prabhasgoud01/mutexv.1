import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a branch name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a branch code'],
      trim: true,
      uppercase: true,
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

// Prevent duplicate branch codes in the same college
branchSchema.index({ code: 1, collegeName: 1 }, { unique: true });


import { getTenantModel } from '../config/tenantManager.js';

const BranchProxy = new Proxy(function() {}, {
  construct(target, args) {
    const Model = getTenantModel('Branch', branchSchema);
    return new Model(...args);
  },
  get(target, prop) {
    const Model = getTenantModel('Branch', branchSchema);
    const value = Model[prop];
    return typeof value === 'function' ? value.bind(Model) : value;
  }
});

Proxy;

export default Branch;
