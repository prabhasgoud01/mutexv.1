import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookMarked, Clock, LogOut, Users, Award, Calendar, UserCheck, ChevronRight,
  PlusCircle, X, UploadCloud, CheckCircle, Info, LayoutDashboard,
  Bell, User, Settings,
  ChevronDown, CalendarDays, MessageSquare, ClipboardList, Wallet, BookOpen, UserCircle
} from 'lucide-react';

const DashboardTab = ({ user, currentTime, classrooms, gradingQueue, handleGrade, triggerLocalToast, setShowAddStudentModal }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl shadow-emerald-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">Instructor Dashboard</span>
            <h2 className="text-3xl font-heading font-black">Welcome back, {user.name}!</h2>
            <p className="text-emerald-100 max-w-xl text-sm leading-relaxed">
              You have {gradingQueue.filter(item => item.status === 'Pending').length} lab submissions in your queue. Your CS-202 lecture starts in 2 hours.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-24">
              <p className="text-[10px] uppercase font-bold text-emerald-200">Total Classes</p>
              <p className="text-3xl font-heading font-extrabold mt-1">3</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-24">
              <p className="text-[10px] uppercase font-bold text-emerald-200">Students</p>
              <p className="text-3xl font-heading font-extrabold mt-1">96</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Classrooms */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Active Lecture Classrooms
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((room) => (
              <div key={room.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-44">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-bold text-md text-slate-800 dark:text-slate-100">{room.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Attendees: {room.students} registered</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">Avg {room.average}</span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{room.nextLecture}</span>
                  </div>
                  <button className="text-emerald-500 hover:text-emerald-600 font-bold flex items-center cursor-pointer">
                    Enter Class
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Chart Widget Mock */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold font-heading uppercase text-slate-400 tracking-wider">Attendance Trajectory (Past 5 Lectures)</h4>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> CS-101</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> CS-202</span>
              </div>
            </div>
            
            <div className="w-full h-32 flex items-end justify-between px-2 pt-4">
              {[94, 88, 92, 95, 98].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 w-12">
                  <div className="w-full flex justify-center gap-1 h-20 items-end">
                    <div className="w-2.5 bg-emerald-500 rounded-t-sm" style={{ height: `${val * 0.7}%` }} />
                    <div className="w-2.5 bg-indigo-500 rounded-t-sm" style={{ height: `${(val - 5) * 0.7}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">Lec {idx+1}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Grading Queue */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            Grading Queue
          </h3>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="space-y-3">
              {gradingQueue.map(item => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.student}</h4>
                      <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">{item.assignment}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{item.date}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800/50">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Graded' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                    
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => handleGrade(item.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                      >
                        Grade Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold font-heading uppercase text-slate-400 tracking-wider">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button className="p-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex flex-col items-center gap-2 cursor-pointer">
                <Calendar className="w-4 h-4" />
                Office Hours
              </button>
              <button className="p-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex flex-col items-center gap-2 cursor-pointer">
                <UserCheck className="w-4 h-4" />
                Quick Grade
              </button>
              <button onClick={() => setShowAddStudentModal(true)} className="col-span-2 p-3 text-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex flex-col items-center gap-2 cursor-pointer mt-2">
                <PlusCircle className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const AttendanceMarkingTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Attendance Marking (Class Wise)</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const SubjectsTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">My Subjects</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const FacultyAttendanceTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">My Attendance</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const TimetableTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Timetable</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const AnnouncementsTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/announcements').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2"><Bell className="w-6 h-6 text-indigo-500" /> College Announcements</h3>
      {data.map((item) => (
        <div key={item._id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/30 transition-colors group flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400`}>
                {item.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 className="text-md font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
            <p className="text-sm mt-2 text-slate-500 whitespace-pre-wrap leading-relaxed truncate-2-lines line-clamp-3">{item.content}</p>
          </div>
          {item.imageUrl && (
            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
              <img src={api.defaults.baseURL.replace('/api', '') + item.imageUrl} alt="Announcement" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      ))}
      {data.length === 0 && (
        <div className="p-8 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">No announcements yet.</div>
      )}
    </div>
  );
};
const CalendarTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Calendar</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const SalaryTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Salary Crediting</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const PersonalTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Personal Details</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const FeedbackTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Feedback</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;
const SettingsTab = () => <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold font-heading">Settings</h3><p className="text-slate-500 mt-2">Feature coming soon.</p></div>;

export default function FacultyDashboard({ user, onLogout, currentTime }) {
  const [classrooms, setClassrooms] = useState([
    { id: 1, name: 'CS-101: Intro to JS', students: 48, average: '82%', nextLecture: '09:00 AM Tomorrow' },
    { id: 2, name: 'CS-202: Data Structures', students: 36, average: '79%', nextLecture: '02:00 PM Today' },
    { id: 3, name: 'CS-499: Senior Capstone', students: 12, average: '91%', nextLecture: '04:30 PM Wednesday' }
  ]);

  const [gradingQueue, setGradingQueue] = useState([
    { id: 1, student: 'Alex Johnson', assignment: 'Lab 4: Binary Trees', date: 'May 30', status: 'Pending' },
    { id: 2, student: 'Sophia Martinez', assignment: 'Lab 4: Binary Trees', date: 'May 29', status: 'Pending' },
    { id: 3, student: 'Liam Chen', assignment: 'Final Proposal draft', date: 'May 28', status: 'Pending' }
  ]);

  const handleGrade = (id) => {
    setGradingQueue(gradingQueue.map(item => 
      item.id === id ? { ...item, status: 'Graded' } : item
    ));
    triggerLocalToast('success', 'Grade submitted successfully');
  };

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudName, setNewStudName] = useState('');
  const [newStudEmail, setNewStudEmail] = useState('');

  const [bannerToast, setBannerToast] = useState({ show: false, message: '', type: 'info' });
  const triggerLocalToast = (type, message) => {
    setBannerToast({ show: true, message, type });
    setTimeout(() => setBannerToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudName.trim() || !newStudEmail.trim()) {
      triggerLocalToast('error', 'Please fill in all fields');
      return;
    }
    triggerLocalToast('success', 'Student added to your classroom');
    setNewStudName('');
    setNewStudEmail('');
    setShowAddStudentModal(false);
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance_marking', label: 'Mark Attendance', icon: ClipboardList },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'faculty_attendance', label: 'My Attendance', icon: UserCheck },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'salary', label: 'Salary', icon: Wallet },
    { id: 'personal', label: 'Personal Details', icon: UserCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg tracking-tight">MuTeX</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Faculty Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:text-rose-400 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="shrink-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="md:hidden flex items-center gap-3">
             <div className="p-1.5 rounded-lg bg-emerald-600 text-white"><BookMarked className="w-5 h-5" /></div>
             <h1 className="font-heading font-bold">MuTeX</h1>
          </div>
          
          <div className="hidden md:flex flex-col">
            <h2 className="text-xl font-heading font-black capitalize">{menuItems.find(m => m.id === activeTab)?.label}</h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">{currentTime}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto relative">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-tight">{user.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400">Faculty</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => {setActiveTab('personal'); setDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"><UserCircle className="w-4 h-4 text-slate-400"/> Profile</button>
                  <button onClick={() => {setActiveTab('settings'); setDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"><Settings className="w-4 h-4 text-slate-400"/> Settings</button>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 cursor-pointer"><LogOut className="w-4 h-4"/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Animated Local Notification Banner */}
        <AnimatePresence>
          {bannerToast.show && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 shadow-lg ${
                  bannerToast.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : bannerToast.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-500/20 text-rose-700 dark:text-rose-300'
                    : 'bg-indigo-50 dark:bg-indigo-950/90 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                <div className="p-1 rounded-full bg-white dark:bg-slate-900">
                  {bannerToast.type === 'success' ? <CheckCircle className="w-4.5 h-4.5 text-emerald-500" /> : <Info className="w-4.5 h-4.5 text-rose-500" />}
                </div>
                <span>{bannerToast.message}</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab user={user} currentTime={currentTime} classrooms={classrooms} gradingQueue={gradingQueue} handleGrade={handleGrade} triggerLocalToast={triggerLocalToast} setShowAddStudentModal={setShowAddStudentModal} />}
            {activeTab === 'attendance_marking' && <AttendanceMarkingTab />}
            {activeTab === 'subjects' && <SubjectsTab />}
            {activeTab === 'faculty_attendance' && <FacultyAttendanceTab />}
            {activeTab === 'timetable' && <TimetableTab />}
            {activeTab === 'announcements' && <AnnouncementsTab />}
            {activeTab === 'calendar' && <CalendarTab />}
            {activeTab === 'salary' && <SalaryTab />}
            {activeTab === 'personal' && <PersonalTab />}
            {activeTab === 'feedback' && <FeedbackTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </main>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddStudentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStudentModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-500" />
                  Add Student to Roster
                </h3>
                <button onClick={() => setShowAddStudentModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Manual Entry */}
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Student Name</label>
                    <input type="text" placeholder="e.g. Alex Smith" value={newStudName} onChange={(e) => setNewStudName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Email Address</label>
                    <input type="email" placeholder="e.g. alexsmith@gmail.com" value={newStudEmail} onChange={(e) => setNewStudEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-semibold bg-slate-50 dark:bg-slate-950" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 mt-2">
                    Register Manually
                  </button>
                </form>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">OR</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                {/* Bulk Upload */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-500">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Bulk Upload Roster</p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepts .csv, .xls, .xlsx files</p>
                  </div>
                  <button onClick={() => { triggerLocalToast('success', 'Roster processed successfully'); setShowAddStudentModal(false); }} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                    Select File
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
