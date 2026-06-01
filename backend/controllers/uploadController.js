import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import bcrypt from 'bcryptjs';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import * as xlsx from 'xlsx';

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
        isFirstLogin: true,
      });
    }

    if (studentsToInsert.length === 0) {
      return res.status(400).json({ message: 'No valid records found in file' });
    }

    // Insert many, ordered: false allows continuing on duplicate errors
    try {
      await Student.insertMany(studentsToInsert, { ordered: false });
    } catch (insertError) {
      // Ignore duplicate key errors if some inserted successfully
      if (insertError.code !== 11000) {
        console.error('Insert error:', insertError);
      }
    }

    res.status(200).json({ 
      message: 'Students uploaded successfully',
      processedCount: studentsToInsert.length
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
      };

      console.log('Valid Faculty:', mappedFaculty);
      facultyToInsert.push(mappedFaculty);
    }

    if (facultyToInsert.length === 0) {
      return res.status(400).json({ message: 'No valid records found in file' });
    }

    try {
      await Faculty.insertMany(facultyToInsert, { ordered: false });
    } catch (insertError) {
      if (insertError.code !== 11000) {
        console.error('Insert error:', insertError);
      }
    }

    res.status(200).json({ 
      message: 'Faculty uploaded successfully',
      processedCount: facultyToInsert.length
    });
  } catch (error) {
    console.error('Faculty upload error:', error);
    res.status(500).json({ message: 'Server error during faculty upload' });
  }
};
