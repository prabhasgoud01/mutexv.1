import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Department from '../models/Department.js';
import bcrypt from 'bcryptjs';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import * as xlsx from 'xlsx';
import { sendEmail } from '../config/mail.js';

// Helper to parse file buffer
const parseFileBuffer = async (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const results = [];
    if (originalname.endsWith('.csv')) {
      const stream = Readable.from(buffer.toString('utf8'));
      stream
        .pipe(csvParser())
        .on('data', (data) => {
          console.log('Parsed Row Data:', data);
          results.push(data);
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    } else if (originalname.endsWith('.xls') || originalname.endsWith('.xlsx')) {
      try {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(sheet);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    } else {
      reject(new Error('Unsupported file format'));
    }
  });
};

export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received File for Students Upload:', req.file);

    const records = await parseFileBuffer(req.file.buffer, req.file.originalname);
    
    // Validate and process records
    const defaultPassword = 'sai111';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const studentsToInsert = [];
    
    for (const rawRecord of records) {
      const record = {};
      for (const key in rawRecord) {
        if (Object.hasOwnProperty.call(rawRecord, key)) {
          // Normalize key: remove all whitespace and lowercase
          record[key.replace(/\s+/g, '').toLowerCase()] = rawRecord[key];
        }
      }

      console.log('Parsed normalized student record:', record);

      if (!record.email || !record.name) continue; // Skip invalid rows
      
      studentsToInsert.push({
        name: record.name,
        email: record.email.toLowerCase(),
        password: hashedPassword,
        role: 'student',
        studentId: record.studentid || record.student_id || record.rollnumber || record.roll_number || '',
        department: record.department || record.branch || '',
        semester: record.semester || '',
        phoneNumber: record.phonenumber || record.phone || record.contact || '',
        
        gender: record.gender || '',
        dateOfBirth: record.dateofbirth || record.dob || '',
        mobileNumber: record.mobilenumber || record.mobile || record.phonenumber || record.phone || '',
        fatherName: record.fathername || record.father_name || '',
        motherName: record.mothername || record.mother_name || '',
        parentMobileNumber: record.parentmobilenumber || record.parent_mobile || record.parentphone || '',
        bloodGroup: record.bloodgroup || record.blood_group || '',
        
        rollNumber: record.rollnumber || record.roll_number || record.studentid || record.student_id || '',
        batch: record.batch || record.year || '',
        degree: record.degree || '',
        programCode: record.programcode || record.program_code || '',
        semesterNumber: record.semesternumber || record.semester || '',
        section: record.section || '',
        
        isFirstLogin: true,
        collegeName: req.user ? req.user.collegeName : '',
      });
    }

    if (studentsToInsert.length === 0) {
      return res.status(400).json({ message: 'No valid records found in file' });
    }

    // Insert many, ordered: false allows continuing on duplicate errors
    let insertedDocs = [];
    try {
      insertedDocs = await Student.insertMany(studentsToInsert, { ordered: false });
    } catch (insertError) {
      // Ignore duplicate key errors if some inserted successfully
      if (insertError.code !== 11000) {
        console.error('Insert error:', insertError);
      }
      if (insertError.insertedDocs) {
        insertedDocs = insertError.insertedDocs;
      }
    }

    // Send welcome emails asynchronously
    insertedDocs.forEach(async (student) => {
      const emailMessage = `
        <h1>Your Student Account has been Created</h1>
        <p>Hello ${student.name},</p>
        <p>Your student portal account has been successfully created.</p>
        <p>Here are your temporary login credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${student.email}</li>
          <li><strong>Password:</strong> ${defaultPassword}</li>
        </ul>
        <p><strong>IMPORTANT:</strong> For security reasons, you will be required to reset your password immediately upon your first login.</p>
        <p>Click <a href="${process.env.CLIENT_URL}/student-login">here</a> to login.</p>
      `;

      try {
        await sendEmail({
          to: student.email,
          subject: 'Your Student Portal Credentials',
          html: emailMessage,
        });
      } catch (err) {
        console.error('Email could not be sent to', student.email, err);
      }
    });

    res.status(200).json({ 
      message: 'Students uploaded successfully',
      processedCount: insertedDocs.length
    });
  } catch (error) {
    console.error('Student upload error:', error);
    res.status(500).json({ message: 'Server error during student upload' });
  }
};

export const uploadFaculty = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const records = await parseFileBuffer(req.file.buffer, req.file.originalname);
    
    const defaultPassword = 'sai111';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    console.log("Parsed Faculty:", records);

    const facultyToInsert = [];
    
    for (const rawRecord of records) {
      const record = {};
      for (const key in rawRecord) {
        if (Object.hasOwnProperty.call(rawRecord, key)) {
          // Normalize key: remove all whitespace and lowercase
          record[key.replace(/\s+/g, '').toLowerCase()] = rawRecord[key];
        }
      }

      console.log('Parsed normalized faculty record:', record);

      if (!record.email || !record.name) {
        continue;
      }
      
      const mappedFaculty = {
        name: record.name,
        email: record.email.toLowerCase(),
        password: hashedPassword,
        role: 'faculty',
        facultyId: record.facultyid || record.faculty_id || '',
        department: record.department || record.branch || '',
        specialization: record.specialization || '',
        positionRole: record.positionrole || record.position || 'Faculty',
        isFirstLogin: true,
        collegeName: req.user ? req.user.collegeName : '',
      };

      console.log('Valid Faculty:', mappedFaculty);
      facultyToInsert.push(mappedFaculty);
    }

    if (facultyToInsert.length === 0) {
      return res.status(400).json({ message: 'No valid records found in file' });
    }

    let insertedFacultyDocs = [];
    try {
      insertedFacultyDocs = await Faculty.insertMany(facultyToInsert, { ordered: false });
    } catch (insertError) {
      if (insertError.code !== 11000) {
        console.error('Insert error:', insertError);
      }
      if (insertError.insertedDocs) {
        insertedFacultyDocs = insertError.insertedDocs;
      }
    }

    // Send welcome emails asynchronously
    insertedFacultyDocs.forEach(async (faculty) => {
      const emailMessage = `
        <h1>Your Faculty Account has been Created</h1>
        <p>Hello ${faculty.name},</p>
        <p>Your faculty portal account has been successfully created.</p>
        <p>Here are your temporary login credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${faculty.email}</li>
          <li><strong>Password:</strong> ${defaultPassword}</li>
        </ul>
        <p><strong>IMPORTANT:</strong> For security reasons, you will be required to reset your password immediately upon your first login.</p>
        <p>Click <a href="${process.env.CLIENT_URL}/faculty-login">here</a> to login.</p>
      `;

      try {
        await sendEmail({
          to: faculty.email,
          subject: 'Your Faculty Portal Credentials',
          html: emailMessage,
        });
      } catch (err) {
        console.error('Email could not be sent to', faculty.email, err);
      }
    });

    res.status(200).json({ 
      message: 'Faculty uploaded successfully',
      processedCount: insertedFacultyDocs.length
    });
  } catch (error) {
    console.error('Faculty upload error:', error);
    res.status(500).json({ message: 'Server error during faculty upload' });
  }
};

export const uploadSubjects = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const records = await parseFileBuffer(req.file.buffer, req.file.originalname);
    
    const subjectsToInsert = [];
    
    for (const rawRecord of records) {
      const record = {};
      for (const key in rawRecord) {
        if (Object.hasOwnProperty.call(rawRecord, key)) {
          record[key.replace(/\s+/g, '').toLowerCase()] = rawRecord[key];
        }
      }

      // required fields based on our model
      if (!record.name && !record.subjectname) continue;
      if (!record.code && !record.coursecode) continue;

      subjectsToInsert.push({
        name: record.name || record.subjectname,
        code: record.code || record.coursecode,
        units: Number(record.units || record.coreunits) || 0,
        regulation: record.regulation || 'Unspecified',
        collegeName: req.user.collegeName
      });
    }

    if (subjectsToInsert.length === 0) {
      return res.status(400).json({ message: 'No valid subjects found in file' });
    }

    // Process individually to handle duplicates gracefully
    let insertedCount = 0;
    for (const sub of subjectsToInsert) {
      try {
        await Subject.create(sub);
        insertedCount++;
      } catch (err) {
        // Skip duplicates (E11000)
        if (err.code !== 11000) {
          console.error('Error inserting subject', err);
        }
      }
    }

    res.status(200).json({ 
      message: 'Subjects uploaded successfully',
      processedCount: insertedCount
    });
  } catch (error) {
    console.error('Subject upload error:', error);
    res.status(500).json({ message: 'Server error during subject upload' });
  }
};

// @desc    Bulk Upload Departments via CSV/Excel
// @route   POST /api/admin/upload-departments
// @access  Private/Admin
export const uploadDepartments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV or Excel file' });
    }

    const results = [];
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname.toLowerCase();

    // Parse logic based on file type
    if (fileName.endsWith('.csv')) {
      const stream = Readable.from(fileBuffer.toString('utf-8'));
      await new Promise((resolve, reject) => {
        stream.pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
      results.push(...data);
    } else {
      return res.status(400).json({ message: 'Unsupported file format. Use .csv, .xls, or .xlsx' });
    }

    let successCount = 0;
    const errors = [];

    for (const record of results) {
      // Extract case-insensitive keys
      const getField = (keys) => {
        const key = Object.keys(record).find(k => keys.includes(k.toLowerCase().trim().replace(/_/g, '').replace(/\s/g, '')));
        return key ? record[key] : '';
      };

      const name = getField(['name', 'departmentname', 'department']);
      const headOfDepartment = getField(['headofdepartment', 'hodname', 'hod', 'head']);
      const hodMobile = getField(['hodmobile', 'mobile', 'phone', 'contact']);
      const hodEmail = getField(['hodemail', 'email']);
      const details = getField(['details', 'description', 'desc']) || '';
      
      if (!name || !headOfDepartment || !hodMobile || !hodEmail) {
        errors.push({ record: name || 'Unknown', reason: 'Missing mandatory fields (Name, HOD Name, HOD Mobile, HOD Email)' });
        continue;
      }

      const collegeName = req.user.collegeName;

      try {
        const existingDept = await Department.findOne({ name, collegeName });
        if (existingDept) {
          errors.push({ record: name, reason: 'Department already exists' });
          continue;
        }

        await Department.create({
          name,
          headOfDepartment,
          hodMobile,
          hodEmail,
          details,
          collegeName
        });
        successCount++;
      } catch (err) {
        errors.push({ record: name, reason: 'Database error: ' + err.message });
      }
    }

    console.log(`Department Upload: processed ${results.length}, success ${successCount}, errors ${errors.length}`, errors);

    if (successCount === 0 && errors.length > 0) {
      return res.status(400).json({ 
        message: 'Upload failed: No valid departments found in file.',
        errors 
      });
    }

    res.json({
      message: `Processed ${results.length} records. Success: ${successCount}. Failed: ${errors.length}.`,
      successCount,
      errorCount: errors.length,
      errors
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error parsing bulk departments upload' });
  }
};
