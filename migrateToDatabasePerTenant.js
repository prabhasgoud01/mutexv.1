import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './backend/models/College.js';
import SuperAdmin from './backend/models/SuperAdmin.js';
import { tenantContext } from './backend/middleware/tenantMiddleware.js';

import { adminSchema } from './backend/models/Admin.js'; // Note: You'd need to extract schemas or just import the Proxy and use tenantContext
import { studentSchema } from './backend/models/Student.js'; // Actually, since we proxied everything, we can just use the proxies inside tenantContext.run!

// But wait, the proxies use the schemas internally. Since we modified the model files to export Proxies, we can import them directly!
import AdminProxy from './backend/models/Admin.js';
import FacultyProxy from './backend/models/Faculty.js';
import StudentProxy from './backend/models/Student.js';
import SubjectProxy from './backend/models/Subject.js';
import DepartmentProxy from './backend/models/Department.js';
import ResultProxy from './backend/models/Result.js';
import AnnouncementProxy from './backend/models/Announcement.js';
import SmsLogProxy from './backend/models/SmsLog.js';
import FacultyAssignmentProxy from './backend/models/FacultyAssignment.js';
import AttendanceProxy from './backend/models/Attendance.js';
import BranchProxy from './backend/models/Branch.js';
import SectionProxy from './backend/models/Section.js';
import HolidayProxy from './backend/models/Holiday.js';
import FacultySubjectAssignmentProxy from './backend/models/FacultySubjectAssignment.js';

dotenv.config();

const migrateToDatabasePerTenant = async () => {
  try {
    // Connect to the legacy default DB
    const masterDbURI = process.env.MONGO_URI; // Assuming this points to 'projectmutex'
    const masterConn = await mongoose.connect(masterDbURI);
    console.log('Connected to Master DB.');

    // Step 1: Read all colleges
    const colleges = await College.find({});
    
    const proxies = [
      AdminProxy, FacultyProxy, StudentProxy, SubjectProxy, DepartmentProxy, ResultProxy,
      AnnouncementProxy, SmsLogProxy, FacultyAssignmentProxy, AttendanceProxy,
      BranchProxy, SectionProxy, HolidayProxy, FacultySubjectAssignmentProxy
    ];

    let totalMigrated = 0;

    for (const college of colleges) {
      if (!college.name) continue;

      const sanitizedName = college.name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const tenantDbName = `college_${sanitizedName}`;

      console.log(`\nMigrating data for College: ${college.name} -> Database: ${tenantDbName}`);

      for (const ProxyModel of proxies) {
        // We read from ERP_MASTER (legacy)
        let legacyRecords = [];
        await tenantContext.run('ERP_MASTER', async () => {
          // Because projectmutex is the default DB, we assume ERP_MASTER points to the legacy data for now
          // Wait, if tenantManager connects to ERP_MASTER, it's just the default connection.
          legacyRecords = await ProxyModel.find({ collegeName: college.name }).lean();
        });

        if (legacyRecords.length === 0) continue;

        // Write to tenant DB
        await tenantContext.run(tenantDbName, async () => {
          for (const record of legacyRecords) {
            const exists = await ProxyModel.findById(record._id);
            if (!exists) {
              await ProxyModel.create(record);
              totalMigrated++;
            }
          }
        });
        
        console.log(`Migrated ${legacyRecords.length} records into ${ProxyModel.name || 'Model'}`);
        
        // Optional: Delete from legacy to free up space
        // await tenantContext.run('ERP_MASTER', async () => {
        //   await ProxyModel.deleteMany({ collegeName: college.name });
        // });
      }
    }

    console.log(`\nMigration Complete! Total records moved to tenant DBs: ${totalMigrated}`);
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateToDatabasePerTenant();
