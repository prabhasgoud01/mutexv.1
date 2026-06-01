import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Setup environment and connection
dotenv.config();

// Define a legacy User schema that points to the old 'users' collection
const legacyUserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const LegacyUser = mongoose.model('LegacyUser', legacyUserSchema);

import Admin from './models/Admin.js';
import Faculty from './models/Faculty.js';
import Student from './models/Student.js';

const migrateData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB, starting migration...');

    const allLegacyUsers = await LegacyUser.find({});
    console.log(`Found ${allLegacyUsers.length} users in legacy collection.`);

    let adminCount = 0;
    let facultyCount = 0;
    let studentCount = 0;

    for (const userDoc of allLegacyUsers) {
      const userData = userDoc.toObject();
      const role = userData.role ? userData.role.toLowerCase() : 'student';
      delete userData._id; // Remove the old _id to generate a fresh one or keep it?
      // Let's keep the old ID to prevent referencing issues if they have relational data
      userData._id = userDoc._id; 

      if (role === 'admin') {
        const exists = await Admin.findById(userData._id);
        if (!exists) {
          await Admin.create(userData);
          adminCount++;
        }
      } else if (role === 'faculty') {
        const exists = await Faculty.findById(userData._id);
        if (!exists) {
          await Faculty.create(userData);
          facultyCount++;
        }
      } else {
        const exists = await Student.findById(userData._id);
        if (!exists) {
          await Student.create(userData);
          studentCount++;
        }
      }
    }

    console.log(`Migration Complete!
Admins Migrated: ${adminCount}
Faculty Migrated: ${facultyCount}
Students Migrated: ${studentCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
