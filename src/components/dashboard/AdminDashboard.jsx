import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminFacultyAssignmentsTab from './AdminFacultyAssignmentsTab';
import {
  Server, LogOut, Bell, Calendar, FileText, Settings, X, ChevronDown,
  ChevronRight, Activity, Cpu, Database, CheckCircle, Users, Send, Check,
  Info, Menu, Home, GraduationCap, ShieldCheck, Building2, Book,
  ClipboardList, BarChart3, MessageSquare, AlertTriangle, UserCheck, PlusCircle, UploadCloud, Trash2, Download, BookOpen, CreditCard
} from 'lucide-react';
import api from '../../services/api';

const EditStudentModal = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    department: student?.department || '',
    semester: student?.semester || '',
    gender: student?.gender || '',
    dateOfBirth: student?.dateOfBirth || '',
    mobileNumber: student?.mobileNumber || student?.phoneNumber || '',
    fatherName: student?.fatherName || '',
    motherName: student?.motherName || '',
    parentMobileNumber: student?.parentMobileNumber || '',
    bloodGroup: student?.bloodGroup || '',
    rollNumber: student?.rollNumber || student?.studentId || '',
    batch: student?.batch || '',
    degree: student?.degree || '',
    programCode: student?.programCode || '',
    semesterNumber: student?.semesterNumber || student?.semester || '',
    section: student?.section || ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: student.id || student._id, ...formData });
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden my-8">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold font-heading">Edit Student Profile</h2>
          <button onClick={onClose} className="p-2 bg-slate-200/50 dark:bg-slate-800 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Gender</label><input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Date of Birth</label><input type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Mobile Number</label><input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Blood Group</label><input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Father's Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Mother's Name</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Parent Mobile</label><input type="text" name="parentMobileNumber" value={formData.parentMobileNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
            </div>
          </div>
          <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Roll Number</label><input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Degree</label><input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Program Code</label><input type="text" name="programCode" value={formData.programCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Batch/Year</label><input type="text" name="batch" value={formData.batch} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Semester Number</label><input type="text" name="semesterNumber" value={formData.semesterNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Section</label><input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-900" /></div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminAttendanceView = ({ triggerLocalToast }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ semester: '', section: '', subjectCode: '' });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(`/attendance/admin-report?${queryParams}`);
      setReports(res.data.records);
    } catch (error) {
      triggerLocalToast('error', 'Failed to fetch attendance reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold font-heading flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-rose-500" />
        Student Attendance Monitoring
      </h3>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center">
        <input 
          type="text" 
          placeholder="Filter by Semester (e.g. 3)" 
          value={filters.semester} 
          onChange={e => setFilters({...filters, semester: e.target.value})}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm"
        />
        <input 
          type="text" 
          placeholder="Filter by Section (e.g. A)" 
          value={filters.section} 
          onChange={e => setFilters({...filters, section: e.target.value})}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm"
        />
        <input 
          type="text" 
          placeholder="Filter by Subject Code" 
          value={filters.subjectCode} 
          onChange={e => setFilters({...filters, subjectCode: e.target.value})}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm"
        />
        <button onClick={fetchReports} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md">Refresh Reports</button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Loading reports...</div> : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {reports.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 font-bold">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">{r.studentId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{r.rollNumber}</td>
                  <td className="px-6 py-4 font-semibold">{r.subjectName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-sans ${r.status === 'P' ? 'bg-emerald-500/10 text-emerald-500' : r.status === 'A' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {r.status === 'P' ? 'Present' : r.status === 'A' ? 'Absent' : 'Late'}
                    </span>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No attendance records found for these filters.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard({ user, onLogout, currentTime }) {
  // ------------------------------------------------------------------------
  // SIMULATED DATABASE STATE
  // ------------------------------------------------------------------------
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@gmail.com', role: 'Faculty', status: 'Active' },
    { id: 2, name: 'Alex Johnson', email: 'alex@gmail.com', role: 'Student', status: 'Active' },
    { id: 3, name: 'Markus Vance', email: 'markus@admin.com', role: 'Admin', status: 'Active' },
    { id: 4, name: 'Sophia Martinez', email: 'sophia@gmail.com', role: 'Student', status: 'Suspended' }
  ]);

  const [latency, setLatency] = useState(13);
  const [dbStorage, setDbStorage] = useState(1.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, prev + (Math.floor(Math.random() * 11) - 5)));
      setDbStorage(prev => +(prev + (Math.random() * 0.05)).toFixed(2));
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  const [sysLog, setSysLog] = useState([
    'SYSTEM: Service edu-auth started successfully.',
    'DB: Connection pool opened with Postgres cluster.',
    'AUTH: JWT signing keys successfully rotated.',
  ]);
  const [newLogInput, setNewLogInput] = useState('');

  // ------------------------------------------------------------------------
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Root Administrator',
    email: user?.email || 'admin@admin.com',
    role: user?.role || 'Admin',
    collegeName: user?.collegeName || 'Mutex College',
    mobileNumber: user?.phoneNumber || '+1 234 567 8900',
    profilePhoto: user?.profilePhoto || '',
    location: user?.location || 'New York, United States',
    bio: user?.bio || '',
    employeeId: user?.employeeId || 'EMP-2023-00125',
    dateOfBirth: user?.dateOfBirth || 'May 12, 1990'
  });
  const fileInputRef = useRef(null);
  const studentUploadRef = useRef(null);
  const facultyUploadRef = useRef(null);

  // Collapsible Accordions State
  const [accordions, setAccordions] = useState({
    students: false,
    faculty: false,
    departments: false,
    subjects: false,
    attendance: false,
    results: false,
    announcements: false,
    academic: false,
    payments: false
  });

  const toggleAccordion = (key) => {
    setAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toast local simulation banner
  const [bannerToast, setBannerToast] = useState({ show: false, message: '', type: 'success' });
  const triggerLocalToast = (type, message) => {
    setBannerToast({ show: true, message, type });
    setTimeout(() => {
      setBannerToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };



  // 1. Students States & Handlers
  const [studentsList, setStudentsList] = useState([]);
  const [editStudentData, setEditStudentData] = useState(null);

  const handleSaveStudentEdit = async (updatedData) => {
    try {
      const res = await api.put(`/admin/update-student/${updatedData.id}`, updatedData);
      setStudentsList(studentsList.map(s => s.id === updatedData.id ? { ...s, ...res.data.student } : s));
      setEditStudentData(null);
      triggerLocalToast('success', 'Student updated successfully!');
      fetchStudents();
    } catch (error) {
      console.error('Failed to update student:', error);
      triggerLocalToast('error', error.response?.data?.message || 'Failed to update student');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      // map backend id to front end expected properties
      const mapped = res.data.map(s => ({
        ...s,
        id: s._id,
        rollNumber: s.studentId || s.rollNumber || 'N/A'
      }));
      setStudentsList(mapped);
    } catch (error) {
      console.error('Failed to fetch students', error);
      triggerLocalToast('error', 'Failed to load students');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFaculty();
    fetchSubjects();
  }, []);
  const [newStudName, setNewStudName] = useState('');
  const [newStudEmail, setNewStudEmail] = useState('');
  const [newStudRoll, setNewStudRoll] = useState('');
  const [newStudId, setNewStudId] = useState('');
  const [newStudGender, setNewStudGender] = useState('');
  const [newStudDob, setNewStudDob] = useState('');
  const [newStudPhone, setNewStudPhone] = useState('');
  const [newStudFatherName, setNewStudFatherName] = useState('');
  const [newStudMotherName, setNewStudMotherName] = useState('');
  const [newStudParentMobile, setNewStudParentMobile] = useState('');
  const [newStudBloodGroup, setNewStudBloodGroup] = useState('');
  const [newStudDegree, setNewStudDegree] = useState('');
  const [newStudDept, setNewStudDept] = useState('Computer Science');
  const [newStudProgramCode, setNewStudProgramCode] = useState('');
  const [newStudBatch, setNewStudBatch] = useState('');
  const [newStudSemesterNumber, setNewStudSemesterNumber] = useState('');
  const [newStudSection, setNewStudSection] = useState('A');
  const [newStudAddress, setNewStudAddress] = useState('');

  // Filtering states
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('All');
  const [studentSectionFilter, setStudentSectionFilter] = useState('All');

  const filteredStudents = studentsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearchQuery.toLowerCase());
    const matchesDept = studentDeptFilter === 'All' || s.department === studentDeptFilter;
    const matchesSection = studentSectionFilter === 'All' || s.section === studentSectionFilter;
    return matchesSearch && matchesDept && matchesSection;
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudName.trim() || !newStudEmail.trim() || !newStudRoll.trim()) {
      triggerLocalToast('error', 'Complete all required fields.');
      return;
    }
    const newStudent = {
      id: studentsList.length + 101,
      name: newStudName,
      email: newStudEmail,
      rollNumber: newStudRoll,
      studentId: newStudId,
      gender: newStudGender,
      dateOfBirth: newStudDob,
      phoneNumber: newStudPhone,
      mobileNumber: newStudPhone,
      fatherName: newStudFatherName,
      motherName: newStudMotherName,
      parentMobileNumber: newStudParentMobile,
      bloodGroup: newStudBloodGroup,
      degree: newStudDegree,
      department: newStudDept,
      programCode: newStudProgramCode,
      batch: newStudBatch,
      semesterNumber: newStudSemesterNumber,
      section: newStudSection,
      address: newStudAddress,
      blocked: false
    };
    setStudentsList([...studentsList, newStudent]);
    setNewStudName('');
    setNewStudEmail('');
    setNewStudRoll('');
    setNewStudId('');
    setNewStudGender('');
    setNewStudDob('');
    setNewStudPhone('');
    setNewStudFatherName('');
    setNewStudMotherName('');
    setNewStudParentMobile('');
    setNewStudBloodGroup('');
    setNewStudDegree('');
    setNewStudDept('Computer Science');
    setNewStudProgramCode('');
    setNewStudBatch('');
    setNewStudSemesterNumber('');
    setNewStudSection('A');
    setNewStudAddress('');
    setActiveSubTab('all-students');
    triggerLocalToast('success', 'Student added successfully!');
  };

  const toggleBlockStudent = async (id) => {
    try {
      const res = await api.put(`/admin/student/block/${id}`);
      setStudentsList(studentsList.map(s => s.id === id ? { ...s, blocked: res.data.blocked } : s));
      triggerLocalToast('info', 'Student status adjusted.');
    } catch (error) {
      console.error('Failed to toggle block status', error);
      triggerLocalToast('error', 'Failed to update status');
    }
  };

  const handleStudentBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      triggerLocalToast('info', 'Uploading and processing students...');
      const res = await api.post('/admin/upload-students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerLocalToast('success', res.data.message || 'Students uploaded successfully!');
      // In a real app, you would fetch updated students list here
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to upload students.');
    } finally {
      if (studentUploadRef.current) studentUploadRef.current.value = '';
    }
  };

  // 2. Faculty States & Handlers
  const [facultyList, setFacultyList] = useState([]);
  const [facultySearchQuery, setFacultySearchQuery] = useState('');
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('All');
  const [facultySpecFilter, setFacultySpecFilter] = useState('All');
  const [facultyStateFilter, setFacultyStateFilter] = useState('All');

  const fetchFaculty = async () => {
    try {
      const res = await api.get('/admin/faculty');
      const mapped = res.data.map(f => ({
        ...f,
        id: f._id,
        position: f.positionRole || 'Faculty',
        specialization: f.specialization || 'N/A',
        phoneNumber: f.phoneNumber || 'N/A'
      }));
      setFacultyList(mapped);
    } catch (error) {
      console.error('Failed to fetch faculty', error);
      triggerLocalToast('error', 'Failed to load faculty');
    }
  };

  const toggleBlockFaculty = async (id) => {
    try {
      const res = await api.put(`/admin/faculty/block/${id}`);
      setFacultyList(facultyList.map(f => f.id === id ? { ...f, blocked: res.data.blocked } : f));
      triggerLocalToast('info', 'Faculty status adjusted.');
    } catch (error) {
      console.error('Failed to toggle block status', error);
      triggerLocalToast('error', 'Failed to update status');
    }
  };

  const [newFacName, setNewFacName] = useState('');
  const [newFacEmail, setNewFacEmail] = useState('');
  const [newFacSpec, setNewFacSpec] = useState('');
  const [newFacPos, setNewFacPos] = useState('Faculty');
  const [newFacPhone, setNewFacPhone] = useState('');
  const [newFacDept, setNewFacDept] = useState('Computer Science');

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFacName.trim() || !newFacEmail.trim()) {
      triggerLocalToast('error', 'Complete required fields.');
      return;
    }
    const newFac = {
      id: facultyList.length + 201,
      name: newFacName,
      email: newFacEmail,
      specialization: newFacSpec || 'General Science',
      position: newFacPos,
      department: newFacDept,
      phoneNumber: newFacPhone
    };
    setFacultyList([...facultyList, newFac]);
    setNewFacName('');
    setNewFacEmail('');
    setNewFacSpec('');
    setNewFacPos('Faculty');
    setNewFacPhone('');
    setNewFacDept('Computer Science');
    setActiveSubTab('all-faculty');
    triggerLocalToast('success', 'Faculty added successfully!');
  };

  const handleFacultyBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      triggerLocalToast('info', 'Uploading and processing faculty...');
      const res = await api.post('/admin/upload-faculty', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerLocalToast('success', res.data.message || 'Faculty uploaded successfully!');
      // In a real app, you would fetch updated faculty list here
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to upload faculty.');
    } finally {
      if (facultyUploadRef.current) facultyUploadRef.current.value = '';
    }
  };

  // 3. Departments States
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');
  const [newDeptHodMobile, setNewDeptHodMobile] = useState('');
  const [newDeptHodEmail, setNewDeptHodEmail] = useState('');
  const [newDeptDetails, setNewDeptDetails] = useState('');
  const [deleteDeptModalOpen, setDeleteDeptModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [deptUploadReport, setDeptUploadReport] = useState(null);
  const deptUploadRef = useRef(null);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin/departments');
      const mapped = res.data.map(d => ({
        ...d,
        id: d._id
      }));
      setDepartments(mapped);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptHead.trim() || !newDeptHodMobile.trim() || !newDeptHodEmail.trim()) {
      triggerLocalToast('error', 'Complete all required fields.');
      return;
    }
    
    try {
      await api.post('/admin/departments', {
        name: newDeptName,
        headOfDepartment: newDeptHead,
        hodMobile: newDeptHodMobile,
        hodEmail: newDeptHodEmail,
        details: newDeptDetails
      });
      fetchDepartments();
      setNewDeptName('');
      setNewDeptHead('');
      setNewDeptHodMobile('');
      setNewDeptHodEmail('');
      setNewDeptDetails('');
      setActiveSubTab('all-departments');
      triggerLocalToast('success', 'Department established.');
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to establish department.');
    }
  };

  const handleDeleteDept = async () => {
    if (!deptToDelete) return;
    try {
      await api.delete(`/admin/departments/${deptToDelete.id}`);
      setDepartments(departments.filter(d => d.id !== deptToDelete.id));
      triggerLocalToast('success', 'Department deleted.');
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to delete department.');
    } finally {
      setDeleteDeptModalOpen(false);
      setDeptToDelete(null);
    }
  };

  const handleDeptBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setDeptUploadReport(null);

    try {
      triggerLocalToast('info', 'Uploading and processing departments...');
      const res = await api.post('/admin/upload-departments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerLocalToast('success', res.data.message || 'Departments uploaded successfully!');
      
      setDeptUploadReport({
        successCount: res.data.successCount,
        errorCount: res.data.errorCount,
        errors: res.data.errors
      });
      fetchDepartments();
    } catch (error) {
      if (error.response?.data?.errors) {
        setDeptUploadReport({
          successCount: 0,
          errorCount: error.response.data.errors.length,
          errors: error.response.data.errors
        });
      }
      triggerLocalToast('error', error.response?.data?.message || 'Failed to upload departments.');
    } finally {
      if (deptUploadRef.current) deptUploadRef.current.value = '';
    }
  };

  // 4. Subjects States
  const [subjects, setSubjects] = useState([]);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjUnits, setNewSubjUnits] = useState(4);
  const [newSubjRegulation, setNewSubjRegulation] = useState('R-16');

  const [subjectRegulationFilter, setSubjectRegulationFilter] = useState('All');
  const [deleteSubjectModalOpen, setDeleteSubjectModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const subjectUploadRef = useRef(null);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/admin/subjects');
      const mapped = res.data.map(s => ({
        ...s,
        id: s._id
      }));
      setSubjects(mapped);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
      triggerLocalToast('error', 'Failed to load subjects');
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjName.trim() || !newSubjCode.trim() || !newSubjUnits || !newSubjRegulation) {
      triggerLocalToast('error', 'Please complete all fields.');
      return;
    }

    try {
      const res = await api.post('/admin/subjects', {
        name: newSubjName,
        code: newSubjCode,
        units: newSubjUnits,
        regulation: newSubjRegulation
      });

      setSubjects([...subjects, { ...res.data, id: res.data._id }]);
      setNewSubjName('');
      setNewSubjCode('');
      setNewSubjUnits(4);
      setNewSubjRegulation('R-16');
      setActiveSubTab('all-subjects');
      triggerLocalToast('success', 'Subject added to registry.');
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to add subject');
    }
  };

  const handleSubjectBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      triggerLocalToast('info', 'Uploading and processing subjects...');
      const res = await api.post('/admin/upload-subjects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerLocalToast('success', res.data.message || 'Subjects uploaded successfully!');
      fetchSubjects();
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to upload subjects.');
    } finally {
      if (subjectUploadRef.current) subjectUploadRef.current.value = '';
    }
  };

  const handleDeleteSubject = async () => {
    if (!subjectToDelete) return;
    try {
      await api.delete(`/admin/subjects/${subjectToDelete.id}`);
      setSubjects(subjects.filter(s => s.id !== subjectToDelete.id));
      triggerLocalToast('success', 'Subject deleted.');
    } catch (error) {
      triggerLocalToast('error', 'Failed to delete subject');
    } finally {
      setDeleteSubjectModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  const uniqueRegulations = Array.from(new Set(subjects.map(s => s.regulation).filter(Boolean)));

  const filteredSubjects = subjects.filter(s => {
    if (subjectRegulationFilter === 'All') return true;
    return s.regulation === subjectRegulationFilter;
  });

  const toggleSubjectSelect = (id) => {
    setSelectedSubjects(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllSubjects = () => {
    if (selectedSubjects.length === filteredSubjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(filteredSubjects.map(s => s.id));
    }
  };

  const handleBulkDeleteSubjects = async () => {
    try {
      await api.post('/admin/subjects/bulk-delete', { ids: selectedSubjects });
      setSubjects(subjects.filter(s => !selectedSubjects.includes(s.id)));
      setSelectedSubjects([]);
      triggerLocalToast('success', 'Selected subjects deleted.');
    } catch (error) {
      triggerLocalToast('error', 'Failed to bulk delete subjects');
    } finally {
      setBulkDeleteModalOpen(false);
    }
  };

  // 5. Results States
  const [resultsList, setResultsList] = useState([]);
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');
  const [resultsLoading, setResultsLoading] = useState(false);
  const resultUploadRef = useRef(null);
  const [uploadReport, setUploadReport] = useState(null);
  const [isUploadingResults, setIsUploadingResults] = useState(false);

  const fetchResultsList = async () => {
    setResultsLoading(true);
    try {
      const res = await api.get('/admin/results');
      setResultsList(res.data.data);
    } catch (error) {
      console.error('Failed to fetch results', error);
      triggerLocalToast('error', 'Failed to load results');
    } finally {
      setResultsLoading(false);
    }
  };

  const handleResultBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploadingResults(true);
    setUploadReport(null);
    try {
      triggerLocalToast('info', 'Uploading and processing results...');
      const res = await api.post('/admin/upload-results', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerLocalToast('success', res.data.message || 'Results uploaded successfully!');
      setUploadReport({
        successCount: res.data.successCount,
        errorCount: res.data.errorCount,
        errors: res.data.errors
      });
      fetchResultsList();
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to upload results.');
    } finally {
      setIsUploadingResults(false);
      if (resultUploadRef.current) resultUploadRef.current.value = '';
    }
  };

  const handleToggleResultBlock = async (ids, currentState) => {
    try {
      await Promise.all(ids.map(id => {
        const endpoint = currentState === 'blocked' ? `/admin/unblock-result/${id}` : `/admin/block-result/${id}`;
        return api.put(endpoint);
      }));
      const newState = currentState === 'blocked' ? 'visible' : 'blocked';
      setResultsList(resultsList.map(r => ids.includes(r._id) ? { ...r, resultState: newState } : r));
      triggerLocalToast('success', `Semester result ${newState} successfully`);
    } catch (error) {
      triggerLocalToast('error', 'Failed to change result state');
    }
  };

  const handleDeleteResult = async (ids) => {
    if (!window.confirm('Are you sure you want to delete this semester result?')) return;
    try {
      await Promise.all(ids.map(id => api.delete(`/admin/delete-result/${id}`)));
      setResultsList(resultsList.filter(r => !ids.includes(r._id)));
      triggerLocalToast('success', 'Semester result deleted successfully');
    } catch (error) {
      triggerLocalToast('error', 'Failed to delete results');
    }
  };

  useEffect(() => {
    if (activeSubTab === 'all-results') {
      fetchResultsList();
    }
  }, [activeSubTab]);

  // 6. Interactive Chat Room simulator states
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System Admin', text: 'Good morning campus team. Educational portals and database systems are running secure.', time: '09:30 AM' },
    { sender: 'Prof. Michael Chang', text: 'All grades for CS-202 Data Structures have been finalized and pushed to the results editor draft.', time: '09:42 AM' }
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;
    const newMsg = {
      sender: 'System Admin',
      text: newChatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setNewChatInput('');

    // Simulate instant reply from other campus worker
    setTimeout(() => {
      const answers = [
        'Confirmed admin. Logs checks complete.',
        'Perfect, thank you! I will lock databases configs now.',
        'SMS broadcats list for students has been synced.',
        'Subject registry updated successfully.'
      ];
      const botMsg = {
        sender: 'Dr. Sarah Jenkins',
        text: answers[Math.floor(Math.random() * answers.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  // 7. Core original States
  const [announcements, setAnnouncements] = useState([]);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceCategory, setAnnounceCategory] = useState('');
  const [announceTarget, setAnnounceTarget] = useState('All');
  const [announceBody, setAnnounceBody] = useState('');
  const [announceImage, setAnnounceImage] = useState(null);
  const [announceLoading, setAnnounceLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const [smsTarget, setSmsTarget] = useState('All Students');
  const [smsBody, setSmsBody] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsDepartment, setSmsDepartment] = useState('');
  const [smsSection, setSmsSection] = useState('');
  const [smsSearchQuery, setSmsSearchQuery] = useState('');
  const [smsSearchResults, setSmsSearchResults] = useState([]);
  const [smsSelectedUser, setSmsSelectedUser] = useState(null);
  const [smsSingleUserType, setSmsSingleUserType] = useState('student');
  const [isSearchingSmsUsers, setIsSearchingSmsUsers] = useState(false);
  const [smsSearchTimer, setSmsSearchTimer] = useState(null);

  const [sessions, setSessions] = useState([
    { id: 1, name: 'Spring Semester 2026', range: 'Jan 05, 2026 - May 28, 2026', enrolled: 1204, status: 'Active' },
    { id: 2, name: 'Summer Fast-track 2026', range: 'Jun 10, 2026 - Aug 18, 2026', enrolled: 450, status: 'Upcoming' }
  ]);

  const [regulations, setRegulations] = useState([
    { id: 1, title: 'Board of Higher Education Certification compliance', code: 'REG-201', compliant: true },
    { id: 2, title: 'GDPR Student Data Protection Standard compliance', code: 'REG-104', compliant: true },
    { id: 3, title: 'E-learning accessibility guidelines compliance audits', code: 'REG-025', compliant: false }
  ]);

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    triggerLocalToast('success', 'User directory status updated.');
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceCategory.trim() || !announceBody.trim()) {
      return triggerLocalToast('error', 'Please fill all required fields');
    }
    setAnnounceLoading(true);

    const formData = new FormData();
    formData.append('title', announceTitle);
    formData.append('category', announceCategory);
    formData.append('content', announceBody);
    if (announceImage) {
      formData.append('image', announceImage);
    }

    try {
      await api.post('/announcements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerLocalToast('success', 'Announcement published!');
      setAnnounceTitle('');
      setAnnounceCategory('');
      setAnnounceBody('');
      setAnnounceImage(null);
      fetchAnnouncements();
      setActiveSubTab('all-announcements');
    } catch (error) {
      console.error('Failed to create announcement:', error);
      triggerLocalToast('error', 'Failed to publish announcement');
    } finally {
      setAnnounceLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a._id !== id));
      triggerLocalToast('success', 'Announcement deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement', error);
      triggerLocalToast('error', 'Failed to delete announcement');
    }
  };

  const handleSmsSearch = (query, targetType, userType) => {
    setSmsSearchQuery(query);
    if (smsSearchTimer) clearTimeout(smsSearchTimer);

    if (!query.trim()) {
      setSmsSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSmsUsers(true);
      try {
        const endpoint = targetType === 'Specific Student'
          ? `/admin/students/search?query=${encodeURIComponent(query)}`
          : `/admin/users/search?query=${encodeURIComponent(query)}`;
        const res = await api.get(endpoint);
        setSmsSearchResults(res.data.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsSearchingSmsUsers(false);
      }
    }, 400); // 400ms debounce
    setSmsSearchTimer(timer);
  };

  const handleBroadcastSMS = async (e) => {
    e.preventDefault();
    if (!smsBody.trim()) {
      triggerLocalToast('error', 'Message body cannot be empty.');
      return;
    }

    if ((smsTarget === 'Specific Student' || smsTarget === 'Single User') && !smsSelectedUser) {
      triggerLocalToast('error', 'Please select a user first.');
      return;
    }
    if (smsTarget === 'Specific Department' && !smsDepartment) {
      triggerLocalToast('error', 'Please select a department.');
      return;
    }
    if (smsTarget === 'Specific Section' && (!smsDepartment || !smsSection)) {
      triggerLocalToast('error', 'Please select a department and section.');
      return;
    }

    setSmsLoading(true);
    try {
      const payload = {
        targetType: smsTarget,
        message: smsBody,
        department: smsDepartment,
        section: smsSection,
        userId: smsSelectedUser?._id,
        userType: smsSingleUserType
      };

      const res = await api.post('/admin/send-sms', payload);
      triggerLocalToast('success', res.data.message || 'SMS Broadcast completed successfully.');

      // Reset form
      setSmsBody('');
      setSmsSelectedUser(null);
      setSmsSearchQuery('');
      setSmsSearchResults([]);
    } catch (error) {
      console.error('Broadcast error:', error);
      triggerLocalToast('error', error.response?.data?.message || 'Failed to send SMS.');
    } finally {
      setSmsLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerLocalToast('error', 'Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Create payload focusing on fields we allow updating
      const payload = {
        name: profileData.name,
        collegeName: profileData.collegeName,
        location: profileData.location,
        phoneNumber: profileData.mobileNumber,
        bio: profileData.bio,
        employeeId: profileData.employeeId,
        dateOfBirth: profileData.dateOfBirth,
        profilePhoto: profileData.profilePhoto
      };

      const { data } = await api.put('/auth/profile', payload);
      setProfileData(prev => ({ ...prev, ...data, mobileNumber: data.phoneNumber }));
      triggerLocalToast('success', 'Profile updated successfully.');
    } catch (error) {
      console.error('Error saving profile', error);
      triggerLocalToast('error', error.response?.data?.message || 'Failed to update profile.');
    }
  };

  // 8. Payments States
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [newPayName, setNewPayName] = useState('');
  const [newPayId, setNewPayId] = useState('');
  const [newPayDate, setNewPayDate] = useState('');
  const [newPayStatus, setNewPayStatus] = useState('Paid');
  const [newPayMode, setNewPayMode] = useState('UPI');
  const [newPayAmount, setNewPayAmount] = useState('');
  const [newPayDue, setNewPayDue] = useState('');

  const fetchPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await api.get('/payments');
      setPaymentsList(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      triggerLocalToast('error', 'Failed to load payments');
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'view-payments') {
      fetchPayments();
    }
  }, [activeSubTab]);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPayName || !newPayId || !newPayDate || !newPayStatus || !newPayMode || newPayAmount === '' || newPayDue === '') {
      return triggerLocalToast('error', 'Complete all required fields.');
    }
    try {
      await api.post('/payments', {
        studentName: newPayName,
        idNo: newPayId,
        dateOfPayment: newPayDate,
        status: newPayStatus,
        mode: newPayMode,
        amountPaid: Number(newPayAmount),
        dueAmount: Number(newPayDue)
      });
      triggerLocalToast('success', 'Payment added successfully!');
      setNewPayName('');
      setNewPayId('');
      setNewPayDate('');
      setNewPayStatus('Paid');
      setNewPayMode('UPI');
      setNewPayAmount('');
      setNewPayDue('');
      setActiveSubTab('view-payments');
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to add payment');
    }
  };

  // Reusable Sidebar Render Module
  const renderSidebarMenu = (isMobile = false) => {
    const isSelected = (tab) => activeSubTab === tab;
    const itemClass = (tab) => `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected(tab)
        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold shadow-sm'
        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 font-medium'
      }`;
    const headerClass = (key) => `w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300 font-bold text-xs tracking-tight transition-all cursor-pointer`;

    return (
      <div className="space-y-4">
        {/* Header User Profile Panel */}
        {!isMobile && (
          <div className="relative mb-6">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-4 text-left shadow-lg relative overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-6 translate-x-6" />
              <div className="flex items-center gap-3 relative z-10">
                {profileData.profilePhoto ? (
                  <img src={profileData.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full border border-white/30 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border border-white/30 backdrop-blur-sm">
                    {profileData.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <h2 className="font-heading font-black text-sm tracking-wide text-white drop-shadow-md truncate">
                    {profileData.name}
                  </h2>
                  <p className="text-[10px] text-indigo-200 font-medium truncate">{profileData.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      setActiveSubTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveSubTab('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="space-y-1">
          {/* Dashboard Item */}
          <button
            onClick={() => {
              setActiveSubTab('dashboard');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${isSelected('dashboard')
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Collapsible 1: Students */}
          <div>
            <button onClick={() => toggleAccordion('students')} className={headerClass('students')}>
              <div className="flex items-center gap-3">
                <Users className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Students</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.students ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.students && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('all-students'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('all-students')}>
                  <Users className="w-3.5 h-3.5 opacity-75" />
                  <span>All Students</span>
                </button>
                <button onClick={() => { setActiveSubTab('add-student'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('add-student')}>
                  <Users className="w-3.5 h-3.5 opacity-75" />
                  <span>Add Student</span>
                </button>
                <button onClick={() => { setActiveSubTab('blocked-students'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('blocked-students')}>
                  <AlertTriangle className="w-3.5 h-3.5 opacity-75 text-rose-500" />
                  <span>Blocked Students</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 2: Faculty */}
          <div>
            <button onClick={() => toggleAccordion('faculty')} className={headerClass('faculty')}>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Faculty</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.faculty ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.faculty && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('all-faculty'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('all-faculty')}>
                  <GraduationCap className="w-3.5 h-3.5 opacity-75" />
                  <span>All Faculty</span>
                </button>
                <button onClick={() => { setActiveSubTab('add-faculty'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('add-faculty')}>
                  <GraduationCap className="w-3.5 h-3.5 opacity-75" />
                  <span>Add Faculty</span>
                </button>
                <button onClick={() => { setActiveSubTab('hods'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('hods')}>
                  <ShieldCheck className="w-3.5 h-3.5 opacity-75" />
                  <span>HODs</span>
                </button>
                <button onClick={() => { setActiveSubTab('principals'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('principals')}>
                  <ShieldCheck className="w-3.5 h-3.5 opacity-75" />
                  <span>Principals</span>
                </button>
                <button onClick={() => { setActiveSubTab('faculty-assignments'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('faculty-assignments')}>
                  <BookOpen className="w-3.5 h-3.5 opacity-75" />
                  <span>Assignments</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 3: Departments */}
          <div>
            <button onClick={() => toggleAccordion('departments')} className={headerClass('departments')}>
              <div className="flex items-center gap-3">
                <Building2 className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Departments</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.departments ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.departments && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('all-departments'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('all-departments')}>
                  <Building2 className="w-3.5 h-3.5 opacity-75" />
                  <span>All Departments</span>
                </button>
                <button onClick={() => { setActiveSubTab('add-department'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('add-department')}>
                  <Building2 className="w-3.5 h-3.5 opacity-75" />
                  <span>Add Department</span>
                </button>
                <button onClick={() => { setActiveSubTab('branches'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('branches')}>
                  <Building2 className="w-3.5 h-3.5 opacity-75" />
                  <span>Branches</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 4: Subjects */}
          <div>
            <button onClick={() => toggleAccordion('subjects')} className={headerClass('subjects')}>
              <div className="flex items-center gap-3">
                <Book className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Subjects</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.subjects ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.subjects && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('all-subjects'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('all-subjects')}>
                  <Book className="w-3.5 h-3.5 opacity-75" />
                  <span>All Subjects</span>
                </button>
                <button onClick={() => { setActiveSubTab('add-subject'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('add-subject')}>
                  <Book className="w-3.5 h-3.5 opacity-75" />
                  <span>Add Subject</span>
                </button>
                <button onClick={() => { setActiveSubTab('units'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('units')}>
                  <FileText className="w-3.5 h-3.5 opacity-75" />
                  <span>Units</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 5: Attendance */}
          <div>
            <button onClick={() => toggleAccordion('attendance')} className={headerClass('attendance')}>
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Attendance</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.attendance ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.attendance && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('view-attendance'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('view-attendance')}>
                  <ClipboardList className="w-3.5 h-3.5 opacity-75" />
                  <span>View Attendance</span>
                </button>
                <button onClick={() => { setActiveSubTab('reports'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('reports')}>
                  <BarChart3 className="w-3.5 h-3.5 opacity-75" />
                  <span>Reports</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 6: Results */}
          <div>
            <button onClick={() => toggleAccordion('results')} className={headerClass('results')}>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Results</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.results ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.results && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('all-results'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('all-results')}>
                  <BarChart3 className="w-3.5 h-3.5 opacity-75" />
                  <span>All Results</span>
                </button>
                <button onClick={() => { setActiveSubTab('upload-results'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('upload-results')}>
                  <UploadCloud className="w-3.5 h-3.5 opacity-75" />
                  <span>Upload Results</span>
                </button>
              </div>
            )}
          </div>

          {/* Chat Link */}
          <button
            onClick={() => {
              setActiveSubTab('chat');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isSelected('chat')
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
              }`}
          >
            <MessageSquare className="w-4.5 h-4.5 opacity-80 text-slate-500" />
            <span>Chat</span>
          </button>

          {/* Collapsible 7: Announcements */}
          <div>
            <button onClick={() => toggleAccordion('announcements')} className={headerClass('announcements')}>
              <div className="flex items-center gap-3">
                <Bell className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Announcements</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.announcements ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.announcements && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('all-announcements'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('all-announcements')}>
                  <Bell className="w-3.5 h-3.5 opacity-75" />
                  <span>All Announcements</span>
                </button>
                <button onClick={() => { setActiveSubTab('create-announcement'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('create-announcement')}>
                  <Bell className="w-3.5 h-3.5 opacity-75" />
                  <span>Create Announcement</span>
                </button>
                <button onClick={() => { setActiveSubTab('sms-notifications'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('sms-notifications')}>
                  <Bell className="w-3.5 h-3.5 opacity-75" />
                  <span>SMS Notifications</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 8: Academic */}
          <div>
            <button onClick={() => toggleAccordion('academic')} className={headerClass('academic')}>
              <div className="flex items-center gap-3">
                <Calendar className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Academic</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.academic ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.academic && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('sessions'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('sessions')}>
                  <Calendar className="w-3.5 h-3.5 opacity-75" />
                  <span>Sessions</span>
                </button>
                <button onClick={() => { setActiveSubTab('regulations'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('regulations')}>
                  <Calendar className="w-3.5 h-3.5 opacity-75" />
                  <span>Regulations</span>
                </button>
                <button onClick={() => { setActiveSubTab('years-semesters'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('years-semesters')}>
                  <Calendar className="w-3.5 h-3.5 opacity-75" />
                  <span>Years & Semesters</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible 9: Payments */}
          <div>
            <button onClick={() => toggleAccordion('payments')} className={headerClass('payments')}>
              <div className="flex items-center gap-3">
                <CreditCard className="w-4.5 h-4.5 opacity-80 text-slate-500" />
                <span>Payments</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${accordions.payments ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {accordions.payments && (
              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                <button onClick={() => { setActiveSubTab('view-payments'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('view-payments')}>
                  <CreditCard className="w-3.5 h-3.5 opacity-75" />
                  <span>View Fees</span>
                </button>
                <button onClick={() => { setActiveSubTab('add-payment'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('add-payment')}>
                  <CreditCard className="w-3.5 h-3.5 opacity-75" />
                  <span>Add Payment</span>
                </button>
              </div>
            )}
          </div>

          {/* Logs */}
          <button
            onClick={() => {
              setActiveSubTab('logs');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isSelected('logs')
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
              }`}
          >
            <FileText className="w-4.5 h-4.5 opacity-80 text-slate-500" />
            <span>Logs</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              setActiveSubTab('settings');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isSelected('settings')
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
              }`}
          >
            <Settings className="w-4.5 h-4.5 opacity-80 text-slate-500" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">

      {/* Top Navbar */}
      <nav className="shrink-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="p-2 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-md md:text-lg tracking-tight">MuTeX</h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Root Administrator</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Current Session</span>
            <span className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">{currentTime}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Scaffold Layout */}
      <div className="flex flex-1 w-full min-h-0">

        {/* Left Desktop Sidebar */}
        <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 hidden md:flex flex-col overflow-y-auto">
          {renderSidebarMenu(false)}
        </aside>

        {/* Mobile Sidebar Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-600 text-white shadow-md">
                        <Server className="w-4 h-4" />
                      </div>
                      <span className="font-heading font-black text-sm">MuTeX Admin</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  {renderSidebarMenu(true)}
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">

          {/* Animated Local Notification Banner (Fixed position so it's always visible) */}
          <AnimatePresence>
            {bannerToast.show && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`fixed top-6 right-1/2 translate-x-1/2 z-50 w-full max-w-xl mx-auto p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 shadow-2xl ${bannerToast.type === 'success'
                    ? 'bg-emerald-50/90 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 backdrop-blur-md'
                    : bannerToast.type === 'error'
                      ? 'bg-rose-50/90 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 backdrop-blur-md'
                      : 'bg-indigo-50/90 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 backdrop-blur-md'
                  }`}
              >
                <div className="p-1 rounded-full bg-white dark:bg-slate-900">
                  {bannerToast.type === 'success' ? <CheckCircle className="w-4.5 h-4.5 text-emerald-500" /> : <Info className="w-4.5 h-4.5 text-rose-500" />}
                </div>
                <span>{bannerToast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >

              {/* VIEW: PAYMENTS LIST */}
              {activeSubTab === 'view-payments' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-rose-500" />
                        Fee Details & Payments
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor all student fee transactions and dues.</p>
                    </div>
                    <button onClick={() => setActiveSubTab('add-payment')} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" /> Add Payment
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    {paymentsLoading ? (
                      <div className="p-8 text-center text-slate-500">Loading payments...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                              <th className="px-6 py-4">Student</th>
                              <th className="px-6 py-4">ID No</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Mode</th>
                              <th className="px-6 py-4">Amount Paid</th>
                              <th className="px-6 py-4">Due</th>
                              <th className="px-6 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {studentsList.map((student, idx) => {
                              const payment = paymentsList.find(p => p.idNo === student.rollNumber || p.idNo === student.studentId || p.studentName === student.name);
                              const p = {
                                studentName: student.name,
                                idNo: student.rollNumber || student.studentId || 'N/A',
                                dateOfPayment: payment ? new Date(payment.dateOfPayment).toLocaleDateString() : 'N/A',
                                mode: payment ? payment.mode : 'N/A',
                                amountPaid: payment ? payment.amountPaid : 0,
                                dueAmount: payment ? payment.dueAmount : 88000,
                                status: payment ? payment.status : 'Pending'
                              };
                              return (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{p.studentName}</td>
                                  <td className="px-6 py-4 font-mono text-xs">{p.idNo}</td>
                                  <td className="px-6 py-4">{p.dateOfPayment}</td>
                                  <td className="px-6 py-4 font-semibold">{p.mode}</td>
                                  <td className="px-6 py-4 font-bold text-emerald-600">₹{p.amountPaid}</td>
                                  <td className="px-6 py-4 font-bold text-rose-500">₹{p.dueAmount}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : p.status === 'Failed' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                      {p.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            {studentsList.length === 0 && (
                              <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No student records found.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW: ADD PAYMENT */}
              {activeSubTab === 'add-payment' && (
                <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <button onClick={() => setActiveSubTab('view-payments')} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-500 rotate-180" />
                    </button>
                    <div>
                      <h2 className="text-xl font-black font-heading flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-rose-500" /> Record New Payment
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">Enter the fee details and payment transaction information manually.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddPayment} className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Student Name</label>
                        <input type="text" value={newPayName} onChange={e => setNewPayName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500 focus:border-rose-500" placeholder="e.g. John Doe" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Student ID / Roll No</label>
                        <input type="text" value={newPayId} onChange={e => setNewPayId(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500 focus:border-rose-500" placeholder="e.g. CS2024-001" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Date of Payment</label>
                        <input type="date" value={newPayDate} onChange={e => setNewPayDate(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500 focus:border-rose-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Payment Status</label>
                        <select value={newPayStatus} onChange={e => setNewPayStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500">
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                          <option value="Processing">Processing</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Payment Mode</label>
                        <select value={newPayMode} onChange={e => setNewPayMode(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500">
                          <option value="UPI">UPI</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Net Banking">Net Banking</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Amount Paid ($)</label>
                        <input type="number" value={newPayAmount} onChange={e => setNewPayAmount(e.target.value)} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500 focus:border-rose-500" placeholder="0.00" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Due Amount ($)</label>
                        <input type="number" value={newPayDue} onChange={e => setNewPayDue(e.target.value)} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-1 focus:ring-rose-500 focus:border-rose-500" placeholder="0.00" />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                      <button type="button" onClick={() => setActiveSubTab('view-payments')} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                      <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Save Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 0: PROFILE MANAGEMENT */}
              {activeSubTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black font-heading text-slate-900 dark:text-white">Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information and account settings.</p>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-sm font-bold">
                    <button className="pb-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-500">Personal Information</button>
                    <button className="pb-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Change Password</button>
                    <button className="pb-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Account Preferences</button>
                  </div>

                  {/* Profile Layout */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

                      {/* Left: Avatar Column */}
                      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 w-full">Profile Photo</h3>
                        <div className="relative group mx-auto lg:mx-0">
                          {profileData.profilePhoto ? (
                            <img src={profileData.profilePhoto} alt="Profile" className="w-40 h-40 rounded-full border-4 border-white dark:border-slate-900 shadow-lg object-cover" />
                          ) : (
                            <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-slate-300">
                              {profileData.name.charAt(0)}
                            </div>
                          )}
                          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 dark:text-slate-300">
                            <Activity className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 w-full text-center lg:text-left">JPG, PNG or GIF. Max size 2MB.</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <UploadCloud className="w-4 h-4" />
                          Upload Photo
                        </button>
                      </div>

                      {/* Right: Info Column */}
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                            <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Role</label>
                            <div className="relative">
                              <select value={profileData.role} onChange={(e) => setProfileData({ ...profileData, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="Project Manager">Project Manager</option>
                                <option value="Admin">Admin</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Student">Student</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                            <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">College Name</label>
                            <div className="relative">
                              <select value={profileData.collegeName} onChange={(e) => setProfileData({ ...profileData, collegeName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="Product Management">Product Management</option>
                                <option value="Mutex College">Mutex College</option>
                                <option value="Engineering Department">Engineering Department</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone Number</label>
                            <div className="flex">
                              <div className="relative border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-xl bg-slate-50 dark:bg-slate-900 px-3 py-2.5 flex items-center gap-1 shrink-0">
                                <span className="text-lg">🇺🇸</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                              </div>
                              <input type="tel" value={profileData.mobileNumber} onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Location</label>
                            <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                          </div>

                          <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Bio (Optional)</label>
                            <textarea rows="3" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Passionate about building products and leading high-performing teams." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"></textarea>
                            <div className="text-[10px] text-slate-400 text-right">{(profileData.bio || '').length} / 160</div>
                          </div>

                          <div className="space-y-6 md:col-span-1">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Employee ID</label>
                              <input type="text" value={profileData.employeeId} onChange={(e) => setProfileData({ ...profileData, employeeId: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date of Birth</label>
                              <div className="relative">
                                <input type="text" value={profileData.dateOfBirth} onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                                <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                      <button className="px-6 py-2.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 1: GENERAL DATABASE OVERVIEW */}
              {activeSubTab === 'dashboard' && (
                <>
                  {/* Metric Cards Top */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Users</span>
                        <p className="text-2xl font-heading font-black text-slate-800 dark:text-slate-100">{studentsList.length + facultyList.length}</p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">API Latency</span>
                        <p className="text-2xl font-heading font-black text-slate-800 dark:text-slate-100">{latency} ms</p>
                      </div>
                      <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                        <Cpu className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Database Storage</span>
                        <p className="text-2xl font-heading font-black text-slate-800 dark:text-slate-100">{dbStorage} GB</p>
                      </div>
                      <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Database className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Security State</span>
                        <p className="text-2xl font-heading font-black text-emerald-500">Secured</p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Administrative User Directory */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                        <Users className="w-5 h-5 text-rose-500" />
                        Administrative User Directory
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">SIMULATED SQL DATABASE</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="px-6 py-4">User</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                            {(() => {
                              const activeStudents = studentsList.filter(s => !s.blocked).map(s => ({ id: s.id, name: s.name, email: s.email, role: 'Student', status: 'Active', original: s }));
                              const activeFaculty = facultyList.filter(f => !f.blocked).map(f => ({ id: f.id, name: f.name, email: f.email, role: f.position || 'Faculty', status: 'Active', original: f }));
                              const activeSystemUsers = [...activeStudents, ...activeFaculty];

                              if (activeSystemUsers.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-semibold">No active students or faculty found.</td>
                                  </tr>
                                );
                              }

                              return activeSystemUsers.map(u => (
                                <tr key={`user-${u.id}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800 dark:text-slate-100">{u.name}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{u.email}</div>
                                  </td>
                                  <td className="px-6 py-4 font-semibold">{u.role}</td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] ${u.status === 'Active'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                                      }`}>
                                      {u.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => {
                                        if (u.role === 'Student') toggleBlockStudent(u.id);
                                        else toggleBlockFaculty(u.id);
                                      }}
                                      className="px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500"
                                    >
                                      Suspend
                                    </button>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 2: ALL STUDENTS */}
              {activeSubTab === 'all-students' && (
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2 shrink-0">
                      <Users className="w-5 h-5 text-rose-500" />
                      All Registered Students
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <input type="text" placeholder="Search name, email, roll no..." value={studentSearchQuery} onChange={(e) => setStudentSearchQuery(e.target.value)} className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-rose-500 min-w-[220px]" />
                      <select value={studentDeptFilter} onChange={(e) => setStudentDeptFilter(e.target.value)} className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-rose-500">
                        <option value="All">All Branches</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                      </select>
                      <select value={studentSectionFilter} onChange={(e) => setStudentSectionFilter(e.target.value)} className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-rose-500">
                        <option value="All">All Sections</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student ID</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Department</th>
                          <th className="px-6 py-4">Phone Number</th>
                          <th className="px-6 py-4">Password Hash</th>
                          <th className="px-6 py-4">State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredStudents.map(s => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-mono text-slate-500">{s.rollNumber || s.studentId || 'N/A'}</td>
                            <td className="px-6 py-4 font-bold">{s.name}</td>
                            <td className="px-6 py-4 font-semibold text-slate-500">{s.email}</td>
                            <td className="px-6 py-4 font-semibold">{s.role || 'student'}</td>
                            <td className="px-6 py-4 font-semibold text-slate-500">{s.department || 'N/A'}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{s.phoneNumber || 'N/A'}</td>
                            <td className="px-6 py-4 font-mono text-slate-400 text-[10px] truncate max-w-[150px]">{s.password || '******'}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditStudentData(s)}
                                  className="px-3 py-1.5 rounded-full font-bold text-xs bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => toggleBlockStudent(s.id)}
                                  className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors cursor-pointer ${s.blocked ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                >
                                  {s.blocked ? 'Blocked' : 'Active'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-6 py-8 text-center text-slate-400 font-semibold">No students found matching your criteria.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 3: ADD STUDENT */}
              {activeSubTab === 'add-student' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-rose-500" />
                    Onboard New Student
                  </h3>
                  <form onSubmit={handleAddStudent} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Student Name</label>
                        <input type="text" placeholder="e.g. Alex Smith" value={newStudName} onChange={(e) => setNewStudName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Email Address (@gmail.com)</label>
                        <input type="email" placeholder="e.g. alexsmith@gmail.com" value={newStudEmail} onChange={(e) => setNewStudEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Roll Number</label>
                        <input type="text" placeholder="e.g. CS26001" value={newStudRoll} onChange={(e) => setNewStudRoll(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Student ID</label>
                        <input type="text" placeholder="e.g. STU12345" value={newStudId} onChange={(e) => setNewStudId(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Gender</label>
                        <select value={newStudGender} onChange={(e) => setNewStudGender(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Date of Birth</label>
                        <input type="date" value={newStudDob} onChange={(e) => setNewStudDob(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Mobile Number</label>
                        <input type="tel" placeholder="e.g. +1 234 567 8900" value={newStudPhone} onChange={(e) => setNewStudPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Father's Name</label>
                        <input type="text" placeholder="Father's Name" value={newStudFatherName} onChange={(e) => setNewStudFatherName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Mother's Name</label>
                        <input type="text" placeholder="Mother's Name" value={newStudMotherName} onChange={(e) => setNewStudMotherName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Parent Mobile Number</label>
                        <input type="tel" placeholder="Parent Mobile Number" value={newStudParentMobile} onChange={(e) => setNewStudParentMobile(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Blood Group</label>
                        <select value={newStudBloodGroup} onChange={(e) => setNewStudBloodGroup(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Degree</label>
                        <input type="text" placeholder="e.g. B.Tech" value={newStudDegree} onChange={(e) => setNewStudDegree(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Department (Branch)</label>
                        <select value={newStudDept} onChange={(e) => setNewStudDept(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Program Code</label>
                        <input type="text" placeholder="e.g. BTECH-CS" value={newStudProgramCode} onChange={(e) => setNewStudProgramCode(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Batch</label>
                        <input type="text" placeholder="e.g. 2022-2026" value={newStudBatch} onChange={(e) => setNewStudBatch(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Semester Number</label>
                        <input type="number" placeholder="e.g. 1" value={newStudSemesterNumber} onChange={(e) => setNewStudSemesterNumber(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Section</label>
                        <select value={newStudSection} onChange={(e) => setNewStudSection(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Address</label>
                        <textarea placeholder="Student's Residential Address" value={newStudAddress} onChange={(e) => setNewStudAddress(e.target.value)} rows="3" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950"></textarea>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 mt-4">Register Student</button>
                  </form>

                  <h3 className="text-lg font-bold font-heading flex items-center gap-2 pt-6">
                    <UploadCloud className="w-5 h-5 text-indigo-500" />
                    Bulk Data Upload (CSV / Excel)
                  </h3>
                  <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6 text-center">
                    <input type="file" ref={studentUploadRef} className="hidden" accept=".csv, .xls, .xlsx" onChange={handleStudentBulkUpload} />
                    <div onClick={() => studentUploadRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4">
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-500">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">Accepts .csv, .xls, .xlsx files</p>
                      </div>
                    </div>
                    <button onClick={() => studentUploadRef.current?.click()} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                      Process Upload
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 4: BLOCKED STUDENTS */}
              {activeSubTab === 'blocked-students' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Suspended Students Directory
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {studentsList.filter(s => s.blocked).map(s => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-bold">{s.name}</td>
                            <td className="px-6 py-4 font-semibold text-slate-500">{s.email}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => toggleBlockStudent(s.id)} className="px-3 py-1.5 bg-rose-600 text-white font-bold text-[10px] rounded-lg shadow-sm hover:brightness-115 cursor-pointer">
                                Reactivate Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                        {studentsList.filter(s => s.blocked).length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-slate-400 font-semibold">No students are currently blocked.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 5: ALL FACULTY */}
              {activeSubTab === 'all-faculty' && (
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2 shrink-0">
                      <GraduationCap className="w-5 h-5 text-rose-500" />
                      Academic Faculty Roster
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <input type="text" placeholder="Search name, email..." value={facultySearchQuery} onChange={(e) => setFacultySearchQuery(e.target.value)} className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-rose-500 min-w-[220px]" />
                      <select value={facultyDeptFilter} onChange={(e) => setFacultyDeptFilter(e.target.value)} className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-rose-500">
                        <option value="All">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                      </select>
                      <select value={facultyStateFilter} onChange={(e) => setFacultyStateFilter(e.target.value)} className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-rose-500">
                        <option value="All">All States</option>
                        <option value="Active">Active</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Department</th>
                          <th className="px-6 py-4">Specialization</th>
                          <th className="px-6 py-4">Phone Number</th>
                          <th className="px-6 py-4">Position Role</th>
                          <th className="px-6 py-4">State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {facultyList.filter(f => {
                          const matchesSearch = f.name.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
                            f.email.toLowerCase().includes(facultySearchQuery.toLowerCase());
                          const matchesDept = facultyDeptFilter === 'All' || f.department === facultyDeptFilter;
                          const matchesState = facultyStateFilter === 'All' || (facultyStateFilter === 'Blocked' ? f.blocked : !f.blocked);
                          return matchesSearch && matchesDept && matchesState;
                        }).map(f => (
                          <tr key={f.id}>
                            <td className="px-6 py-4 font-bold">{f.name}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{f.email}</td>
                            <td className="px-6 py-4 font-semibold">{f.department}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{f.specialization}</td>
                            <td className="px-6 py-4 text-slate-500">{f.phoneNumber}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${f.position === 'Principal' ? 'bg-indigo-500/10 text-indigo-500' : f.position === 'HOD' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                {f.position}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleBlockFaculty(f.id)}
                                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors cursor-pointer ${f.blocked ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                              >
                                {f.blocked ? 'Blocked' : 'Active'}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {facultyList.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-semibold">No faculty found matching your criteria.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 6: ADD FACULTY */}
              {activeSubTab === 'add-faculty' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-rose-500" />
                    Onboard Faculty Member
                  </h3>
                  <form onSubmit={handleAddFaculty} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Faculty Name</label>
                        <input type="text" placeholder="e.g. Dr. Jane Doe" value={newFacName} onChange={(e) => setNewFacName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Email Address (@gmail.com)</label>
                        <input type="email" placeholder="e.g. janedoe@gmail.com" value={newFacEmail} onChange={(e) => setNewFacEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Phone Number</label>
                        <input type="tel" placeholder="e.g. +1 234 567 8900" value={newFacPhone} onChange={(e) => setNewFacPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Specialization</label>
                        <input type="text" placeholder="e.g. Operating Systems" value={newFacSpec} onChange={(e) => setNewFacSpec(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Department</label>
                        <select value={newFacDept} onChange={(e) => setNewFacDept(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Administrative Position</label>
                        <select value={newFacPos} onChange={(e) => setNewFacPos(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="Faculty">Faculty Only</option>
                          <option value="HOD">Head of Department (HOD)</option>
                          <option value="Principal">College Principal</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 mt-2">Register Faculty</button>
                  </form>

                  <h3 className="text-lg font-bold font-heading flex items-center gap-2 pt-2">
                    <UploadCloud className="w-5 h-5 text-indigo-500" />
                    Bulk Data Upload (CSV / Excel)
                  </h3>
                  <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6 text-center">
                    <input type="file" ref={facultyUploadRef} className="hidden" accept=".csv, .xls, .xlsx" onChange={handleFacultyBulkUpload} />
                    <div onClick={() => facultyUploadRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4">
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-500">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">Accepts .csv, .xls, .xlsx files</p>
                      </div>
                    </div>
                    <button onClick={() => facultyUploadRef.current?.click()} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                      Process Upload
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 7: HODs */}
              {activeSubTab === 'hods' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-500" />
                    Heads of Departments (HODs)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facultyList.filter(f => f.position === 'HOD').map(f => (
                      <div key={f.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
                        <div>
                          <h4 className="font-heading font-bold text-sm">{f.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{f.specialization} • {f.email}</p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold">DEPARTMENT HEAD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 8: PRINCIPALS */}
              {activeSubTab === 'principals' && (
                <div className="space-y-4 max-w-md">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-500" />
                    College Executive Principals
                  </h3>
                  {facultyList.filter(f => f.position === 'Principal').map(f => (
                    <div key={f.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                      <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl"><ShieldCheck className="w-7 h-7" /></div>
                      <div>
                        <h4 className="font-heading font-black text-md">{f.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{f.email}</p>
                        <span className="inline-block mt-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded text-[9px] font-bold">CHIEF EXECUTIVE PRINCIPAL</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 9.5: FACULTY ASSIGNMENTS */}
              {activeSubTab === 'faculty-assignments' && (
                <AdminFacultyAssignmentsTab triggerLocalToast={triggerLocalToast} />
              )}

              {/* VIEW 9: ALL DEPARTMENTS */}
              {activeSubTab === 'all-departments' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-rose-500" />
                    University Department Registries
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departments.map(d => (
                      <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-heading font-bold text-sm pr-4 leading-snug text-indigo-600 dark:text-indigo-400">{d.name}</h4>
                            <button onClick={() => { setDeptToDelete(d); setDeleteDeptModalOpen(true); }} className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-md transition-colors" title="Delete Department">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Head of Department</span>
                              <strong className="text-slate-700 dark:text-slate-300 font-bold">{d.headOfDepartment || d.head}</strong>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">HOD Email</span>
                              <span className="text-slate-600 dark:text-slate-400 font-medium truncate block" title={d.hodEmail}>{d.hodEmail || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">HOD Mobile</span>
                              <span className="text-slate-600 dark:text-slate-400 font-medium">{d.hodMobile || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Department Details</span>
                              <span className="text-slate-500 italic line-clamp-1" title={d.details}>{d.details || 'No details available'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {departments.length === 0 && (
                      <div className="col-span-full p-8 text-center text-slate-500 font-semibold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        No departments established yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 10: ADD DEPARTMENT */}
              {activeSubTab === 'add-department' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-rose-500" />
                    Establish Department
                  </h3>
                  <form onSubmit={handleAddDept} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Department Name *</label>
                        <input type="text" placeholder="e.g. Mechanical Engineering" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Appointed Head (HOD) *</label>
                        <input type="text" placeholder="e.g. Dr. Alan Turing" value={newDeptHead} onChange={(e) => setNewDeptHead(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">HOD Mobile *</label>
                        <input type="text" placeholder="e.g. +1 555-1234" value={newDeptHodMobile} onChange={(e) => setNewDeptHodMobile(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">HOD Email *</label>
                        <input type="email" placeholder="e.g. hod.me@college.edu" value={newDeptHodEmail} onChange={(e) => setNewDeptHodEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Department Details (Optional)</label>
                        <input type="text" placeholder="e.g. Established in 1995" value={newDeptDetails} onChange={(e) => setNewDeptDetails(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 mt-4">Establish Department</button>
                  </form>
                  
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2 pt-4">
                    <UploadCloud className="w-5 h-5 text-rose-500" />
                    Bulk Data Upload (CSV / Excel)
                  </h3>
                  <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6 text-center">
                    <input type="file" ref={deptUploadRef} className="hidden" accept=".csv, .xls, .xlsx" onChange={handleDeptBulkUpload} />
                    <div onClick={() => deptUploadRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4">
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/30 rounded-full text-rose-500">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">Accepts .csv, .xls, .xlsx files</p>
                      </div>
                    </div>
                    <button onClick={() => deptUploadRef.current?.click()} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                      Process Upload
                    </button>
                    
                    {deptUploadReport && (
                      <div className="mt-6 text-left text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center font-bold font-heading mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                          Upload Report
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${deptUploadReport.errorCount === 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                            {deptUploadReport.successCount} Successful
                          </span>
                        </div>
                        {deptUploadReport.errors && deptUploadReport.errors.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {deptUploadReport.errors.map((err, idx) => (
                              <div key={idx} className="flex gap-2 items-start bg-white dark:bg-slate-900 p-2 rounded border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className="block text-[10px] uppercase font-mono mb-0.5">{err.record}</strong>
                                  <span className="opacity-90">{err.reason}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 11: BRANCHES */}
              {activeSubTab === 'branches' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-rose-500" />
                    Campus Branches Directory
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Main Campus Science Block', 'East Wing Laboratories', 'Mutex Engineering Block Research Annex'].map((b, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-rose-600/10 text-rose-600 rounded-xl"><Building2 className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-heading font-bold text-sm">{b}</h4>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold font-sans">OPERATIONAL</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 12: ALL SUBJECTS */}
              {activeSubTab === 'all-subjects' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                      <Book className="w-5 h-5 text-rose-500" />
                      Subject Syllabus Registry
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <AnimatePresence>
                        {selectedSubjects.length > 0 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setBulkDeleteModalOpen(true)}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Selected ({selectedSubjects.length})
                          </motion.button>
                        )}
                      </AnimatePresence>
                      <span className="text-xs font-bold text-slate-500 uppercase font-mono ml-2">Regulation:</span>
                      <select
                        value={subjectRegulationFilter}
                        onChange={(e) => setSubjectRegulationFilter(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 appearance-none min-w-[100px]"
                      >
                        <option value="All">All Regulations</option>
                        {uniqueRegulations.map((reg, idx) => (
                          <option key={idx} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-4 py-4 w-10">
                            <input
                              type="checkbox"
                              checked={filteredSubjects.length > 0 && selectedSubjects.length === filteredSubjects.length}
                              onChange={toggleSelectAllSubjects}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                            />
                          </th>
                          <th className="px-6 py-4">Subject Name</th>
                          <th className="px-6 py-4">Regulation</th>
                          <th className="px-6 py-4">Course Code</th>
                          <th className="px-6 py-4">Total Core Units</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredSubjects.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500 font-medium">No subjects found matching the criteria.</td>
                          </tr>
                        ) : (
                          filteredSubjects.map(s => (
                            <tr key={s.id} className={selectedSubjects.includes(s.id) ? "bg-rose-50/50 dark:bg-rose-900/10" : ""}>
                              <td className="px-4 py-4 w-10">
                                <input
                                  type="checkbox"
                                  checked={selectedSubjects.includes(s.id)}
                                  onChange={() => toggleSubjectSelect(s.id)}
                                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                                />
                              </td>
                              <td className="px-6 py-4 font-bold">{s.name}</td>
                              <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-slate-600 dark:text-slate-300 text-[10px]">{s.regulation}</span></td>
                              <td className="px-6 py-4 font-mono font-bold text-rose-500">{s.code}</td>
                              <td className="px-6 py-4 font-bold">{s.units} Units</td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => { setSubjectToDelete(s); setDeleteSubjectModalOpen(true); }} className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Delete Subject">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 13: ADD SUBJECT */}
              {activeSubTab === 'add-subject' && (
                <div className="max-w-md mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-rose-500" />
                    Add Subject Syllabus
                  </h3>
                  <form onSubmit={handleAddSubject} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Subject Name</label>
                      <input type="text" placeholder="e.g. Compiler Design" value={newSubjName} onChange={(e) => setNewSubjName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Course Code</label>
                      <input type="text" placeholder="e.g. CS-452" value={newSubjCode} onChange={(e) => setNewSubjCode(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Regulation</label>
                        <input
                          type="text"
                          list="regulation-options"
                          placeholder="e.g. R-22"
                          value={newSubjRegulation}
                          onChange={(e) => setNewSubjRegulation(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950"
                        />
                        <datalist id="regulation-options">
                          <option value="R-16" />
                          <option value="R-19" />
                          <option value="R-20" />
                          <option value="R-22" />
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Core Units</label>
                        <input type="number" min="1" max="10" placeholder="e.g. 4" value={newSubjUnits} onChange={(e) => setNewSubjUnits(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 mt-2">Register Subject</button>
                  </form>

                  <h3 className="text-lg font-bold font-heading flex items-center gap-2 pt-2">
                    <UploadCloud className="w-5 h-5 text-rose-500" />
                    Bulk Data Upload (CSV / Excel)
                  </h3>
                  <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6 text-center">
                    <input type="file" ref={subjectUploadRef} className="hidden" accept=".csv, .xls, .xlsx" onChange={handleSubjectBulkUpload} />
                    <div onClick={() => subjectUploadRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4">
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/30 rounded-full text-rose-500">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">Accepts .csv, .xls, .xlsx files</p>
                      </div>
                    </div>
                    <button onClick={() => subjectUploadRef.current?.click()} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                      Process Upload
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 14: UNITS */}
              {activeSubTab === 'units' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" />
                    Curriculum Units Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {subjects.map(s => (
                      <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-rose-500 font-mono">{s.code}</span>
                          <span className="text-xs text-slate-400 font-bold">{s.units} Core Units</span>
                        </div>
                        <h4 className="font-heading font-bold text-sm line-clamp-1">{s.name}</h4>
                        <ol className="text-[10px] text-slate-500 font-semibold space-y-1">
                          <li>• Unit 1: Foundations & Scope</li>
                          <li>• Unit 2: Advanced System Architecture</li>
                          <li>• Unit 3: Implementation Semantics</li>
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 15: VIEW ATTENDANCE */}
              {activeSubTab === 'view-attendance' && (
                <AdminAttendanceView triggerLocalToast={triggerLocalToast} />
              )}

              {/* VIEW 16: REPORTS */}
              {activeSubTab === 'reports' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-rose-500" />
                    Accreditation & Analytics Reports
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                      <h4 className="font-heading font-bold text-sm">Monthly Attendance Average</h4>
                      <div className="h-44 flex items-end justify-between px-2 pt-4">
                        {[92, 94, 91, 95, 96].map((v, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-8 bg-rose-600 rounded-t-lg transition-all hover:brightness-110" style={{ height: `${v * 1.2}px` }} />
                            <span className="text-[10px] text-slate-400 font-bold font-sans">Month {i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                      <h4 className="font-heading font-bold text-sm">Aesthetic Syllabus Performance Metrics</h4>
                      <div className="space-y-3 pt-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                            <span>Syllabus Covered</span>
                            <span>84%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-600" style={{ width: '84%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                            <span>Evaluations Complete</span>
                            <span>92%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-600" style={{ width: '92%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 17: ALL RESULTS */}
              {activeSubTab === 'all-results' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-rose-500" />
                      Student Grades & Results Directory
                    </h3>
                    <div className="flex items-center gap-4">
                      <input 
                        type="text" 
                        placeholder="Search student or semester..." 
                        value={resultsSearchQuery}
                        onChange={e => setResultsSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-rose-500/20"
                      />
                      <span className="text-[10px] text-slate-400 font-bold font-mono">EXAM RESULTS ARCHIVE</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Semester</th>
                          <th className="px-6 py-4">Subjects</th>
                          <th className="px-6 py-4">SGPA</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {resultsLoading ? (
                          <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">Loading results...</td></tr>
                        ) : resultsList.length === 0 ? (
                          <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">No results uploaded yet.</td></tr>
                        ) : (
                          Object.values(resultsList.reduce((acc, r) => {
                            const key = `${r.studentId}_${r.semester}`;
                            if (!acc[key]) {
                              acc[key] = { ...r, _ids: [r._id], allSubjects: r.subjects || [] };
                            } else {
                              acc[key]._ids.push(r._id);
                              if (r.subjects) acc[key].allSubjects.push(...r.subjects);
                              if (r.resultState === 'visible') acc[key].resultState = 'visible'; 
                            }
                            return acc;
                          }, {})).filter(r => 
                            !resultsSearchQuery || 
                            r.studentName?.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
                            r.rollNumber?.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
                            r.studentId?.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
                            r.semester?.toLowerCase().includes(resultsSearchQuery.toLowerCase())
                          ).map(r => (
                            <tr key={r._ids[0]}>
                              <td className="px-6 py-4">
                                <p className="font-bold">{r.studentName}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{r.rollNumber || r.studentId}</p>
                              </td>
                              <td className="px-6 py-4 text-slate-500 font-semibold">{r.semester}</td>
                              <td className="px-6 py-4 text-slate-500 text-[10px] max-w-[200px] truncate" title={r.allSubjects?.map(s => s.courseName || s.subjectName).join(', ')}>
                                {r.allSubjects?.map(s => s.courseName || s.subjectName).join(', ') || '-'}
                              </td>
                              <td className="px-6 py-4 font-mono font-bold text-rose-500">{r.sgpa || r.cgpa || '-'}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${r.resultState === 'visible' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                  {r.resultState}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button 
                                  onClick={() => handleToggleResultBlock(r._ids, r.resultState)} 
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${r.resultState === 'visible' ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'}`}
                                >
                                  {r.resultState === 'visible' ? 'Block' : 'Unblock'}
                                </button>
                                <button onClick={() => handleDeleteResult(r._ids)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition-colors">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 18: UPLOAD RESULTS */}
              {activeSubTab === 'upload-results' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-rose-500" />
                    Upload Term Results
                  </h3>
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-5">
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong>Instructions:</strong> Upload a CSV or Excel file containing student results. Ensure you map columns properly (studentId or email, semester, cgpa). Invalid students will be skipped automatically.</span>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                      <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">Select CSV or Excel file</p>
                      <p className="text-xs text-slate-400 font-medium mb-4">Max file size: 10MB</p>
                      <input 
                        type="file" 
                        ref={resultUploadRef}
                        accept=".csv, .xlsx, .xls"
                        onChange={handleResultBulkUpload} 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => resultUploadRef.current?.click()}
                        disabled={isUploadingResults}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        {isUploadingResults ? 'Uploading...' : 'Browse Files'}
                      </button>
                    </div>

                    {uploadReport && (
                      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-sans">
                        <h4 className="text-sm font-bold mb-3 flex justify-between items-center">
                          Upload Report
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${uploadReport.errorCount === 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                            {uploadReport.successCount} Successful
                          </span>
                        </h4>
                        
                        {uploadReport.errors && uploadReport.errors.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block mb-2">Skipped Records:</span>
                            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
                              {uploadReport.errors.map((err, idx) => (
                                <div key={idx} className="text-[10px] p-2 bg-rose-500/10 text-rose-600 rounded-lg font-mono flex items-start gap-2 border border-rose-500/20">
                                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <span>{err}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 19: CHAT ROOM SIMULATOR */}
              {activeSubTab === 'chat' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-500" />
                    Mutex College Faculty Chatroom
                  </h3>

                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                    {/* Chat Messages Log */}
                    <div className="h-64 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-3 overflow-y-auto font-sans">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`max-w-[80%] flex flex-col gap-1 p-3 rounded-2xl text-xs font-semibold ${msg.sender === 'System Admin'
                            ? 'bg-rose-600 text-white self-end rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 self-start rounded-tl-none border border-slate-200/40 dark:border-slate-800/40'
                          }`}>
                          <div className="flex justify-between items-center gap-4 text-[9px] opacity-75">
                            <span>{msg.sender}</span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="leading-relaxed mt-0.5">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chat Entry Form */}
                    <form onSubmit={handleSendMessage} className="flex gap-2 font-sans">
                      <input
                        type="text"
                        placeholder="Type message to the campus faculty..."
                        value={newChatInput}
                        onChange={(e) => setNewChatInput(e.target.value)}
                        className="flex-grow text-xs px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-semibold"
                      />
                      <button type="submit" className="p-3 rounded-xl bg-rose-600 text-white hover:brightness-105 active:scale-95 transition-all cursor-pointer">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* VIEW 20: ANNOUNCEMENTS */}
              {activeSubTab === 'all-announcements' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                      <Bell className="w-5 h-5 text-rose-500" />
                      Announcements Bulletin
                    </h3>
                    <button onClick={() => setActiveSubTab('create-announcement')} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md cursor-pointer transition-all">Post Announcement</button>
                  </div>
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann._id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm relative group flex gap-5 items-start">
                        <button onClick={() => handleDeleteAnnouncement(ann._id)} className="absolute top-4 right-4 p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-xl transition-colors opacity-0 group-hover:opacity-100 z-10">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600">{ann.category}</span>
                            <span className="text-xs text-slate-400 font-semibold">{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-heading font-bold text-md mt-1">{ann.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap truncate-2-lines line-clamp-3 mt-2">{ann.content}</p>
                        </div>
                        {ann.imageUrl && (
                          <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                            <img src={api.defaults.baseURL.replace('/api', '') + ann.imageUrl} alt="Announcement" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="p-8 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">No announcements found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 21: CREATE ANNOUNCEMENT FORM */}
              {activeSubTab === 'create-announcement' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Bell className="w-5 h-5 text-rose-500 animate-bounce" />
                    Post Announcement
                  </h3>
                  <form onSubmit={handleCreateAnnouncement} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Title</label>
                      <input type="text" value={announceTitle} onChange={(e) => setAnnounceTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Category</label>
                      <input type="text" placeholder="e.g. Academic, Event, Alert" value={announceCategory} onChange={(e) => setAnnounceCategory(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Image (Optional)</label>
                      <input type="file" accept="image/*" onChange={(e) => setAnnounceImage(e.target.files[0])} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Content Body</label>
                      <textarea rows={4} value={announceBody} onChange={(e) => setAnnounceBody(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 font-sans" />
                    </div>
                    <button type="submit" disabled={announceLoading} className="w-full py-3.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">
                      {announceLoading ? 'Publishing...' : 'Publish'}
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW 22: SMS GATEWAY */}
              {activeSubTab === 'sms-notifications' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Bell className="w-5 h-5 text-rose-500" />
                    GSM SMS Gateway Broadcaster
                  </h3>
                  <form onSubmit={handleBroadcastSMS} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Target</label>
                      <select value={smsTarget} onChange={(e) => { setSmsTarget(e.target.value); setSmsSelectedUser(null); setSmsSearchQuery(''); }} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans">
                        <option value="All Students">All Students</option>
                        <option value="All Faculty">All Faculty</option>
                        <option value="All Registered Mobile Numbers">All Registered Mobile Numbers</option>
                        <option value="Specific Department">Specific Department</option>
                        <option value="Specific Section">Specific Section</option>
                        <option value="Single User">Single User</option>
                        <option value="Specific Student">Specific Student</option>
                      </select>
                    </div>

                    {/* Conditional Fields based on Target */}
                    {(smsTarget === 'Specific Department' || smsTarget === 'Specific Section') && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Department</label>
                        <select value={smsDepartment} onChange={(e) => setSmsDepartment(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans">
                          <option value="">Select Department</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics & Communication">Electronics & Communication</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                        </select>
                      </div>
                    )}

                    {smsTarget === 'Specific Section' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Section</label>
                        <select value={smsSection} onChange={(e) => setSmsSection(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans">
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    )}

                    {smsTarget === 'Single User' && (
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <input type="radio" checked={smsSingleUserType === 'student'} onChange={() => setSmsSingleUserType('student')} className="text-rose-500 focus:ring-rose-500" />
                          Student
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <input type="radio" checked={smsSingleUserType === 'faculty'} onChange={() => setSmsSingleUserType('faculty')} className="text-rose-500 focus:ring-rose-500" />
                          Faculty
                        </label>
                      </div>
                    )}

                    {(smsTarget === 'Specific Student' || smsTarget === 'Single User') && (
                      <div className="relative">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Search User (Name, Roll No, Email)</label>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={smsSearchQuery}
                          onChange={(e) => handleSmsSearch(e.target.value, smsTarget, smsSingleUserType)}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans"
                        />
                        {isSearchingSmsUsers && <div className="absolute right-4 top-10 text-xs text-slate-400">Loading...</div>}

                        {smsSearchResults.length > 0 && !smsSelectedUser && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {smsSearchResults.map(user => (
                              <div
                                key={user._id}
                                onClick={() => { setSmsSelectedUser(user); setSmsSearchResults([]); setSmsSearchQuery(user.name); }}
                                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0"
                              >
                                <div className="font-bold text-xs">{user.name} <span className="text-[10px] font-mono text-slate-400 ml-2">{user.studentId || user.role}</span></div>
                                <div className="text-[10px] text-slate-500">{user.department} • {user.phoneNumber || 'No phone'}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {smsSelectedUser && (
                          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{smsSelectedUser.name}</p>
                              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-mono">{smsSelectedUser.studentId || smsSelectedUser.role} • {smsSelectedUser.phoneNumber || 'No Phone Number!'}</p>
                            </div>
                            <button type="button" onClick={() => { setSmsSelectedUser(null); setSmsSearchQuery(''); }} className="text-emerald-600 hover:text-emerald-800"><X className="w-4 h-4" /></button>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">SMS Text Body</label>
                        <span className={`text-[10px] font-mono font-bold ${smsBody.length > 160 ? 'text-rose-500' : 'text-slate-400'}`}>{smsBody.length} / 160</span>
                      </div>
                      <textarea rows={3} value={smsBody} onChange={(e) => setSmsBody(e.target.value)} maxLength={160} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 font-sans" />
                    </div>
                    <button type="submit" disabled={smsLoading || smsBody.length === 0 || smsBody.length > 160} className="w-full py-3.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                      {smsLoading ? 'Sending...' : 'Send GSM Broadcast'}
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW 23: SESSIONS */}
              {activeSubTab === 'sessions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    Academic Term & Sessions
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Session Name</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Total Enrollment</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {sessions.map(s => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-bold">{s.name}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>{s.status}</span>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold">{s.enrolled} Enrolled</td>
                            <td className="px-6 py-4 text-right">
                              {s.status !== 'Active' ? (
                                <button onClick={() => handleOpenRegistration(s.id)} className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] rounded-lg shadow-sm transition-all cursor-pointer">Open</button>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-bold">Currently Enrolling</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 24: REGULATIONS */}
              {activeSubTab === 'regulations' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    Regulatory Compliance Core Auditing
                  </h3>
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
                    {regulations.map(r => (
                      <div key={r.id} onClick={() => toggleRegulation(r.id)} className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${r.compliant ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                        <div className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center flex-shrink-0 ${r.compliant ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                          {r.compliant && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-heading font-bold text-xs">{r.title}</h4>
                          <span className="inline-block mt-1 text-[9px] font-bold font-mono opacity-65">{r.code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 25: YEARS & SEMESTERS */}
              {activeSubTab === 'years-semesters' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    Yearly Semesters timeline Organizer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Year 1: Freshman', 'Year 2: Sophomore'].map((y, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
                        <h4 className="font-heading font-bold text-sm border-b pb-2">{y}</h4>
                        <div className="space-y-2 text-xs font-semibold text-slate-500">
                          <div className="flex justify-between"><span>Fall Term</span><span className="text-emerald-500 font-bold">Closed Passed</span></div>
                          <div className="flex justify-between"><span>Spring Term</span><span className="text-rose-500 font-bold">Active Enrolling</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 26: LOGS */}
              {activeSubTab === 'logs' && (
                <div className="space-y-6">
                  {/* metric row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Users</span>
                        <p className="text-2xl font-heading font-black">{studentsList.length + facultyList.length}</p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Activity className="w-5 h-5" /></div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">API Latency</span>
                        <p className="text-2xl font-heading font-black">{latency} ms</p>
                      </div>
                      <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><Cpu className="w-5 h-5" /></div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Database Storage</span>
                        <p className="text-2xl font-heading font-black">{dbStorage} GB</p>
                      </div>
                      <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Database className="w-5 h-5" /></div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Security State</span>
                        <p className="text-2xl font-heading font-black text-emerald-500">Secured</p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 font-sans">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-bold font-heading flex items-center gap-2">
                        <Database className="w-5 h-5 text-rose-500" />
                        Live System Console
                      </h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSysLog([])} 
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                        >
                          Clear Logs
                        </button>
                        <button 
                          onClick={() => {
                            const element = document.createElement("a");
                            const file = new Blob([sysLog.join('\\n')], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = "system_logs.txt";
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }} 
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export
                        </button>
                      </div>
                    </div>
                    <div className="h-64 bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-[10px] text-emerald-400 space-y-2 overflow-y-auto">
                      {sysLog.map((log, idx) => (
                        <div key={idx} className="break-words">
                          <span className="text-slate-500">[{new Date().toLocaleDateString()}]</span> {log}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={addSysLog} className="flex gap-2">
                      <input type="text" placeholder="Inject mock syslog entry..." value={newLogInput} onChange={(e) => setNewLogInput(e.target.value)} className="flex-grow text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold" />
                      <button type="submit" className="p-2.5 rounded-xl bg-rose-600 text-white hover:brightness-105 active:scale-95 transition-all"><Send className="w-4.5 h-4.5" /></button>
                    </form>
                  </div>
                </div>
              )}

              {/* VIEW 27: SETTINGS */}
              {activeSubTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Settings className="w-5 h-5 text-rose-500" />
                    System Configuration Settings
                  </h3>
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Global System</h4>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-100 border-slate-300" defaultChecked={false} />
                        <div>
                          <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">Maintenance Mode</span>
                          <span className="block text-xs text-slate-400 font-medium">Prevents non-admin users from logging in</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-100 border-slate-300" defaultChecked={true} />
                        <div>
                          <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">Allow New Registrations</span>
                          <span className="block text-xs text-slate-400 font-medium">Enable or disable new user signups</span>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Notifications</h4>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-100 border-slate-300" defaultChecked={true} />
                        <div>
                          <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">Email Alerts</span>
                          <span className="block text-xs text-slate-400 font-medium">Receive system alerts via email</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-100 border-slate-300" defaultChecked={true} />
                        <div>
                          <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">SMS Gateway Active</span>
                          <span className="block text-xs text-slate-400 font-medium">Enable Fast2SMS integration for broadcasts</span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        onClick={(e) => { e.preventDefault(); triggerLocalToast('success', 'Configuration saved successfully'); }}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all active:scale-95">
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Delete Subject Modal */}
          <AnimatePresence>
            {deleteSubjectModalOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/60 dark:border-slate-800/80"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-2">
                      <Trash2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold font-heading">Delete Subject?</h2>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      You are about to delete <span className="font-bold text-rose-500">{subjectToDelete?.name}</span> ({subjectToDelete?.code}). This action cannot be undone. Are you completely sure?
                    </p>
                    <div className="flex w-full gap-3 pt-4">
                      <button
                        onClick={() => { setDeleteSubjectModalOpen(false); setSubjectToDelete(null); }}
                        className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteSubject}
                        className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-red-500/20 transition-all active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Delete Subject Modal */}
          <AnimatePresence>
            {bulkDeleteModalOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/60 dark:border-slate-800/80"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-2">
                      <Trash2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold font-heading">Delete {selectedSubjects.length} Subjects?</h2>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      You are about to delete <span className="font-bold text-rose-500">{selectedSubjects.length}</span> subjects. This action cannot be undone. Are you completely sure?
                    </p>
                    <div className="flex w-full gap-3 pt-4">
                      <button
                        onClick={() => setBulkDeleteModalOpen(false)}
                        className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkDeleteSubjects}
                        className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-red-500/20 transition-all active:scale-95"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {editStudentData && (
            <EditStudentModal 
              student={editStudentData} 
              onClose={() => setEditStudentData(null)} 
              onSave={handleSaveStudentEdit} 
            />
          )}

          {/* Delete Department Modal */}
          <AnimatePresence>
            {deleteDeptModalOpen && deptToDelete && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-slate-200 dark:border-slate-800 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-2">Delete Department?</h3>
                    <p className="text-sm text-slate-500">
                      Are you sure you want to permanently delete the department <strong>{deptToDelete.name}</strong>? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setDeleteDeptModalOpen(false); setDeptToDelete(null); }}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteDept}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-lg shadow-rose-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
