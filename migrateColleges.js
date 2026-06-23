import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './backend/models/College.js';
import Admin from './backend/models/Admin.js';
import Faculty from './backend/models/Faculty.js';
import Student from './backend/models/Student.js';
import Subject from './backend/models/Subject.js';
import Department from './backend/models/Department.js';
import Result from './backend/models/Result.js';
import Announcement from './backend/models/Announcement.js';
import SmsLog from './backend/models/SmsLog.js';
import FacultyAssignment from './backend/models/FacultyAssignment.js';
import Attendance from './backend/models/Attendance.js';
import Branch from './backend/models/Branch.js';
import Section from './backend/models/Section.js';
import Holiday from './backend/models/Holiday.js';
import FacultySubjectAssignment from './backend/models/FacultySubjectAssignment.js';
import connectDB from './backend/config/db.js';

dotenv.config();

const migrateColleges = async () => {
  try {
    await connectDB();
    console.log('Database connected for migration.');

    const models = [
      Admin, Faculty, Student, Subject, Department, Result, Announcement,
      SmsLog, FacultyAssignment, Attendance, Branch, Section, Holiday, FacultySubjectAssignment
    ];

    let totalUpdated = 0;

    // First ensure all unique collegeNames from Admin exist in College
    const admins = await Admin.find({ collegeName: { $exists: true, $ne: null } });
    const uniqueCollegeNames = [...new Set(admins.map(a => a.collegeName))];

    for (const cName of uniqueCollegeNames) {
      if (!cName) continue;
      let college = await College.findOne({ name: cName });
      if (!college) {
        college = await College.create({ name: cName });
        console.log(`Created missing College document for: ${cName}`);
      }
    }

    // Now load all colleges for quick lookup
    const allColleges = await College.find({});
    const collegeMap = {};
    allColleges.forEach(c => {
      collegeMap[c.name] = c._id;
    });

    for (const Model of models) {
      const records = await Model.find({ 
        collegeName: { $exists: true, $ne: null },
        collegeId: { $exists: false } // Only update if not already migrated
      });

      let updatedCount = 0;

      for (const record of records) {
        const cId = collegeMap[record.collegeName];
        if (cId) {
          record.collegeId = cId;
          await record.save({ validateBeforeSave: false }); // Skip strict validation during migration
          updatedCount++;
        }
      }

      console.log(`Migrated ${updatedCount} records in ${Model.modelName}`);
      totalUpdated += updatedCount;
    }

    console.log(`Migration Complete! Total records updated: ${totalUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateColleges();
