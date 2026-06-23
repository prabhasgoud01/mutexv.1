import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a holiday title'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide the holiday date'],
    },
    description: {
      type: String,
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

// Prevent duplicate holidays on the same date for the same college
holidaySchema.index({ date: 1, collegeName: 1 }, { unique: true });


import { getTenantModel } from '../config/tenantManager.js';

const HolidayProxy = new Proxy(function() {}, {
  construct(target, args) {
    const Model = getTenantModel('Holiday', holidaySchema);
    return new Model(...args);
  },
  get(target, prop) {
    const Model = getTenantModel('Holiday', holidaySchema);
    const value = Model[prop];
    return typeof value === 'function' ? value.bind(Model) : value;
  }
});

Proxy;

export default Holiday;
