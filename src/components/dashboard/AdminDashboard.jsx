import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, LogOut, Bell, Calendar, FileText, Settings, X, ChevronDown, 
  ChevronRight, Activity, Cpu, Database, CheckCircle, Users, Send, Check, 
  Info, Menu, Home, GraduationCap, ShieldCheck, Building2, Book, 
  ClipboardList, BarChart3, MessageSquare, AlertTriangle, UserCheck, PlusCircle, UploadCloud
} from 'lucide-react';
import api from '../../services/api';

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

  const [activeUsers, setActiveUsers] = useState(124);
  const [latency, setLatency] = useState(24);
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
    academic: false
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

  // Auto fluctuating health metrics
  useEffect(() => {
    const statInterval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      setLatency(prev => Math.max(10, prev + Math.floor(Math.random() * 7) - 3));
    }, 3000);
    return () => clearInterval(statInterval);
  }, []);

  // 1. Students States & Handlers
  const [studentsList, setStudentsList] = useState([]);

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
    if (activeSubTab === 'all-students') {
      fetchStudents();
    }
  }, [activeSubTab]);
  const [newStudName, setNewStudName] = useState('');
  const [newStudEmail, setNewStudEmail] = useState('');
  const [newStudDept, setNewStudDept] = useState('Computer Science');
  const [newStudSection, setNewStudSection] = useState('A');
  const [newStudRoll, setNewStudRoll] = useState('');
  const [newStudPhone, setNewStudPhone] = useState('');

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
      semester: 'Spring 2026',
      blocked: false,
      department: newStudDept,
      section: newStudSection,
      rollNumber: newStudRoll,
      phoneNumber: newStudPhone
    };
    setStudentsList([...studentsList, newStudent]);
    setNewStudName('');
    setNewStudEmail('');
    setNewStudRoll('');
    setNewStudPhone('');
    setNewStudDept('Computer Science');
    setNewStudSection('A');
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
  const [facultyList, setFacultyList] = useState([
    { id: 201, name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@gmail.com', specialization: 'Machine Learning', position: 'HOD', department: 'Computer Science', phoneNumber: '+1 234 567 8801' },
    { id: 202, name: 'Prof. Michael Chang', email: 'michael.chang@gmail.com', specialization: 'Theory of Computation', position: 'Principal', department: 'Information Technology', phoneNumber: '+1 234 567 8802' },
    { id: 203, name: 'Dr. Raymond Floyd', email: 'raymond.floyd@gmail.com', specialization: 'Distributed Systems', position: 'Faculty', department: 'Electrical Engineering', phoneNumber: '+1 234 567 8803' },
  ]);
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
  const [departments, setDepartments] = useState([
    { id: 301, name: 'Computer Science & Engineering', head: 'Dr. Sarah Jenkins', branchesCount: 4 },
    { id: 302, name: 'Information Technology', head: 'Dr. Raymond Floyd', branchesCount: 2 },
    { id: 303, name: 'Electrical Engineering', head: 'Prof. Helen Myers', branchesCount: 3 }
  ]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    const newDept = {
      id: departments.length + 301,
      name: newDeptName,
      head: newDeptHead || 'TBD',
      branchesCount: 1
    };
    setDepartments([...departments, newDept]);
    setNewDeptName('');
    setNewDeptHead('');
    setActiveSubTab('all-departments');
    triggerLocalToast('success', 'Department established.');
  };

  // 4. Subjects States
  const [subjects, setSubjects] = useState([
    { id: 401, name: 'Advanced Algorithms', code: 'CS-401', units: 5 },
    { id: 402, name: 'Neural Networks & Deep Learning', code: 'CS-425', units: 4 },
    { id: 403, name: 'Cloud Systems Architecture', code: 'CS-390', units: 6 }
  ]);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('');

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjName.trim() || !newSubjCode.trim()) return;
    const newSubj = {
      id: subjects.length + 401,
      name: newSubjName,
      code: newSubjCode,
      units: 4
    };
    setSubjects([...subjects, newSubj]);
    setNewSubjName('');
    setNewSubjCode('');
    setActiveSubTab('all-subjects');
    triggerLocalToast('success', 'Subject added to registry.');
  };

  // 5. Results States
  const [resultsList, setResultsList] = useState([
    { id: 501, student: 'Alex Johnson', semester: 'Spring 2026', GPA: '3.92', status: 'Published' },
    { id: 502, student: 'Sophia Martinez', semester: 'Spring 2026', GPA: '3.45', status: 'Draft' },
    { id: 503, student: 'Liam Chen', semester: 'Spring 2026', GPA: '3.78', status: 'Published' }
  ]);
  const [resultsLoading, setResultsLoading] = useState(false);

  const handlePublishResults = async () => {
    setResultsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResultsList(resultsList.map(r => ({ ...r, status: 'Published' })));
    setResultsLoading(false);
    setActiveSubTab('all-results');
    triggerLocalToast('success', 'All grades and results published to Student dashboards.');
  };

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
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'End-of-Term Examinations Schedule Released', category: 'Academic', date: 'May 30, 2026', body: 'All final exams will commence from June 15, 2026. Please check your course dashboards.', target: 'All' },
    { id: 2, title: 'Main Server Scheduled Maintenance', category: 'Maintenance', date: 'May 28, 2026', body: 'The MuTeX database and system auth endpoints will undergo scheduled hardware maintenance this Saturday.', target: 'All' }
  ]);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceCategory, setAnnounceCategory] = useState('Academic');
  const [announceTarget, setAnnounceTarget] = useState('All');
  const [announceBody, setAnnounceBody] = useState('');
  const [announceLoading, setAnnounceLoading] = useState(false);

  const [smsTarget, setSmsTarget] = useState('All');
  const [smsBody, setSmsBody] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);

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
    if (!announceTitle.trim() || !announceBody.trim()) return;
    setAnnounceLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnnouncements([{
      id: announcements.length + 1,
      title: announceTitle,
      category: announceCategory,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      body: announceBody,
      target: announceTarget
    }, ...announcements]);
    setAnnounceTitle('');
    setAnnounceBody('');
    setAnnounceLoading(false);
    setActiveSubTab('all-announcements');
    triggerLocalToast('success', 'Announcement published!');
  };

  const handleBroadcastSMS = async (e) => {
    e.preventDefault();
    if (!smsBody.trim()) return;
    setSmsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setSmsLoading(false);
    triggerLocalToast('success', `SMS broadcast sent successfully to ${smsTarget} list.`);
    setSmsBody('');
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

  // Reusable Sidebar Render Module
  const renderSidebarMenu = (isMobile = false) => {
    const isSelected = (tab) => activeSubTab === tab;
    const itemClass = (tab) => `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
      isSelected(tab) 
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
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
              isSelected('dashboard')
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
                <button onClick={() => { setActiveSubTab('publish-results'); if (isMobile) setMobileMenuOpen(false); }} className={itemClass('publish-results')}>
                  <BarChart3 className="w-3.5 h-3.5 opacity-75" />
                  <span>Publish Results</span>
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isSelected('chat')
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

          {/* Logs */}
          <button
            onClick={() => {
              setActiveSubTab('logs');
              if (isMobile) setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isSelected('logs')
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <FileText className="w-4.5 h-4.5 opacity-80 text-slate-500" />
            <span>Logs</span>
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
                className={`fixed top-6 right-1/2 translate-x-1/2 z-50 w-full max-w-xl mx-auto p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 shadow-2xl ${
                  bannerToast.type === 'success' 
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
                            <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Role</label>
                            <div className="relative">
                              <select value={profileData.role} onChange={(e) => setProfileData({...profileData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
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
                            <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">College Name</label>
                            <div className="relative">
                              <select value={profileData.collegeName} onChange={(e) => setProfileData({...profileData, collegeName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
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
                              <input type="tel" value={profileData.mobileNumber} onChange={(e) => setProfileData({...profileData, mobileNumber: e.target.value})} className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Location</label>
                            <input type="text" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                          </div>

                          <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Bio (Optional)</label>
                            <textarea rows="3" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} placeholder="Passionate about building products and leading high-performing teams." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"></textarea>
                            <div className="text-[10px] text-slate-400 text-right">{(profileData.bio || '').length} / 160</div>
                          </div>
                          
                          <div className="space-y-6 md:col-span-1">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Employee ID</label>
                              <input type="text" value={profileData.employeeId} onChange={(e) => setProfileData({...profileData, employeeId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date of Birth</label>
                              <div className="relative">
                                <input type="text" value={profileData.dateOfBirth} onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
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
                        <p className="text-2xl font-heading font-black text-slate-800 dark:text-slate-100">{activeUsers}</p>
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
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Database Clusters</span>
                        <p className="text-2xl font-heading font-black text-slate-800 dark:text-slate-100">Healthy</p>
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
                            {users.map(u => (
                              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="font-bold text-slate-800 dark:text-slate-100">{u.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{u.email}</div>
                                </td>
                                <td className="px-6 py-4 font-semibold">{u.role}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                                    u.status === 'Active'
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                                  }`}>
                                    {u.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => toggleUserStatus(u.id)}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition-all active:scale-95 ${
                                      u.status === 'Active'
                                        ? 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500'
                                        : 'bg-rose-600 text-white shadow-md shadow-rose-600/10 hover:brightness-110'
                                    }`}
                                  >
                                    {u.status === 'Active' ? 'Suspend' : 'Activate'}
                                  </button>
                                </td>
                              </tr>
                            ))}
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
                            <td className="px-6 py-4 font-mono text-slate-400 text-[10px] truncate max-w-[150px]">{s.password || '******'}</td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => toggleBlockStudent(s.id)}
                                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors cursor-pointer ${s.blocked ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                              >
                                {s.blocked ? 'Blocked' : 'Active'}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-semibold">No students found matching your criteria.</td>
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
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Phone Number</label>
                        <input type="tel" placeholder="e.g. +1 234 567 8900" value={newStudPhone} onChange={(e) => setNewStudPhone(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
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
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Section</label>
                        <select value={newStudSection} onChange={(e) => setNewStudSection(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 appearance-none">
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                        </select>
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
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-rose-500" />
                    Academic Faculty Roster
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Department</th>
                          <th className="px-6 py-4">Specialization</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Position Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {facultyList.map(f => (
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
                          </tr>
                        ))}
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

              {/* VIEW 9: ALL DEPARTMENTS */}
              {activeSubTab === 'all-departments' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-rose-500" />
                    University Department Registries
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {departments.map(d => (
                      <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-bold text-sm pr-4 leading-snug">{d.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{d.branchesCount} Branches</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Head of Department: <strong className="text-slate-600 dark:text-slate-300 font-bold">{d.head}</strong></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 10: ADD DEPARTMENT */}
              {activeSubTab === 'add-department' && (
                <div className="max-w-md mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-rose-500" />
                    Establish Department
                  </h3>
                  <form onSubmit={handleAddDept} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Department Name</label>
                      <input type="text" placeholder="e.g. Mechanical Engineering" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Appointed Head (HOD)</label>
                      <input type="text" placeholder="e.g. Dr. Alan Turing" value={newDeptHead} onChange={(e) => setNewDeptHead(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">Establish Department</button>
                  </form>
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
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <Book className="w-5 h-5 text-rose-500" />
                    Subject Syllabus Registry
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Subject Name</th>
                          <th className="px-6 py-4">Course Code</th>
                          <th className="px-6 py-4">Total Core Units</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {subjects.map(s => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-bold">{s.name}</td>
                            <td className="px-6 py-4 font-mono font-bold text-rose-500">{s.code}</td>
                            <td className="px-6 py-4 font-bold">{s.units} Units</td>
                          </tr>
                        ))}
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
                    <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">Register Subject</button>
                  </form>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-rose-500" />
                    Student Attendance Matrix
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">CS-401 Lecture</th>
                          <th className="px-6 py-4">CS-425 Seminar</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {studentsList.map((s, idx) => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-bold">{s.name}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-600">{idx % 2 === 0 ? 'Present (100%)' : 'Present (92%)'}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-600">Present (100%)</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase font-sans">Excellent</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                            <span className="text-[10px] text-slate-400 font-bold font-sans">Month {i+1}</span>
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
                    <span className="text-[10px] text-slate-400 font-bold font-mono">EXAM RESULTS ARCHIVE</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Semester</th>
                          <th className="px-6 py-4">GPA Score</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {resultsList.map(r => (
                          <tr key={r.id}>
                            <td className="px-6 py-4 font-bold">{r.student}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{r.semester}</td>
                            <td className="px-6 py-4 font-mono font-bold text-rose-500">{r.GPA}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${r.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 18: PUBLISH RESULTS */}
              {activeSubTab === 'publish-results' && (
                <div className="max-w-md mx-auto space-y-6">
                  <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-rose-500" />
                    Publish Term Results
                  </h3>
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-5">
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-rose-600 dark:text-rose-400 font-semibold">
                      <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong>Accreditation Warning</strong>: Publishing results transfers grades from draft states to permanent transcripts. This action is visible to all students instantly.</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Active Semester:</span>
                      <span className="font-bold">Spring 2026</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500">Draft Results Pending:</span>
                      <span className="font-bold text-rose-500">{resultsList.filter(r => r.status === 'Draft').length} submissions</span>
                    </div>

                    <button
                      onClick={handlePublishResults}
                      disabled={resultsLoading || resultsList.filter(r => r.status === 'Draft').length === 0}
                      className="w-full py-3.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resultsLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        'Publish All Pending Results'
                      )}
                    </button>
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
                        <div key={idx} className={`max-w-[80%] flex flex-col gap-1 p-3 rounded-2xl text-xs font-semibold ${
                          msg.sender === 'System Admin'
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
                      <div key={ann.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600">{ann.category}</span>
                        <h4 className="font-heading font-bold text-md mt-1">{ann.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{ann.body}</p>
                      </div>
                    ))}
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
                      <select value={announceCategory} onChange={(e) => setAnnounceCategory(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans">
                        <option value="Academic">Academic</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Content Body</label>
                      <textarea rows={4} value={announceBody} onChange={(e) => setAnnounceBody(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 font-sans" />
                    </div>
                    <button type="submit" disabled={announceLoading} className="w-full py-3.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">Publish</button>
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
                      <select value={smsTarget} onChange={(e) => setSmsTarget(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-bold bg-slate-50 dark:bg-slate-950 font-sans">
                        <option value="All">All Registered Mobile numbers (96)</option>
                        <option value="Faculty">Faculty Only (3)</option>
                        <option value="Student">Students Only (93)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">SMS Text Body (max 160)</label>
                      <textarea rows={3} value={smsBody} onChange={(e) => setSmsBody(e.target.value)} maxLength={160} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950 font-sans" />
                    </div>
                    <button type="submit" disabled={smsLoading} className="w-full py-3.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">Send GSM Broadcast</button>
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
                        <p className="text-2xl font-heading font-black">{activeUsers}</p>
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
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Database Clusters</span>
                        <p className="text-2xl font-heading font-black">Healthy</p>
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
                    <h3 className="text-md font-bold font-heading flex items-center gap-2">
                      <Database className="w-5 h-5 text-rose-500" />
                      Live System Console
                    </h3>
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

            </motion.div>
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
