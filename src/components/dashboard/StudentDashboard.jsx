import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Clock, CheckSquare, LogOut, Award,
  LayoutDashboard, FileText, CreditCard, Bell, User, Calendar, Settings,
  ChevronDown, Download, CalendarDays, MessageSquare
} from 'lucide-react';
import api from '../../services/api';

// --- Sub-Components (Tabs) ---

const DashboardTab = ({ user, currentTime }) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit Advanced Algorithms Assignment 3', done: false, date: 'Today' },
    { id: 2, text: 'Read Deep Learning Research Paper', done: true, date: 'Yesterday' },
    { id: 3, text: 'Prepare for Web Dev midterm presentation', done: false, date: 'June 2' },
    { id: 4, text: 'Confirm internship application details', done: false, date: 'June 5' }
  ]);

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const courses = [
    { title: 'Advanced Algorithms', code: 'CS-401', progress: 84, grade: 'A', instructor: 'Dr. Sarah Jenkins' },
    { title: 'Neural Networks & Deep Learning', code: 'CS-425', progress: 92, grade: 'A+', instructor: 'Prof. Michael Chang' },
    { title: 'Cloud Systems Architecture', code: 'CS-390', progress: 68, grade: 'B+', instructor: 'Dr. Raymond Floyd' },
    { title: 'Human Computer Interaction', code: 'CS-322', progress: 98, grade: 'A+', instructor: 'Prof. Helen Myers' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">Spring Term 2026</span>
            <h2 className="text-3xl font-heading font-black">Welcome back, {user.name}!</h2>
            <p className="text-indigo-100 max-w-xl text-sm leading-relaxed">
              You are currently in the top 5% of your class. You have 2 assignments pending for this week. Keep up the amazing work!
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-24">
              <p className="text-[10px] uppercase font-bold text-indigo-200">Current GPA</p>
              <p className="text-3xl font-heading font-extrabold mt-1">3.92</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-24">
              <p className="text-[10px] uppercase font-bold text-indigo-200">Credits</p>
              <p className="text-3xl font-heading font-extrabold mt-1">18</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Active Curriculum
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-md">{course.code}</span>
                      <h4 className="font-heading font-bold text-sm mt-2 text-slate-800 dark:text-slate-100 pr-2 line-clamp-1">{course.title}</h4>
                    </div>
                    <span className="text-xl font-heading font-black text-slate-400 dark:text-slate-600">{course.grade}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>Course Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Instructor: {course.instructor}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-heading uppercase text-slate-400 tracking-wider">Academic GPA Progression</h3>
            <div className="w-full h-44 relative">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="studentGpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="rgba(156,163,175,0.08)" strokeDasharray="5 5" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(156,163,175,0.08)" strokeDasharray="5 5" />
                <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="rgba(156,163,175,0.08)" strokeDasharray="5 5" />
                <path d="M 0 150 Q 100 110, 200 90 T 400 30 T 500 20 L 500 150 Z" fill="url(#studentGpaGrad)" />
                <path d="M 0 150 Q 100 110, 200 90 T 400 30 T 500 20" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
                <circle cx="200" cy="90" r="5" fill="#4f46e5" className="animate-pulse" />
                <circle cx="400" cy="30" r="5" fill="#4f46e5" />
                <circle cx="500" cy="20" r="6" fill="#818cf8" />
              </svg>
              <div className="absolute inset-0 flex justify-between items-end text-[10px] font-bold text-slate-400 font-mono pt-32">
                <span>Freshman</span>
                <span>Sophomore</span>
                <span>Junior</span>
                <span>Senior (Current)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-5">
            <h3 className="text-md font-bold font-heading flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              Task Planner
            </h3>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${task.done ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'}`}>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.done ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {task.done && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-xs font-semibold ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>{task.text}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block font-medium">{task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-md font-bold font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Today's Schedule
            </h3>
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-indigo-500 py-1">
                <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold font-mono text-slate-400">10:00 AM - 11:30 AM</span>
                <h4 className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">Neural Networks Lecture</h4>
                <p className="text-[10px] text-slate-400">Hall 4B • Prof. Michael Chang</p>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-300 dark:border-slate-800 py-1">
                <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-800" />
                <span className="text-[10px] font-bold font-mono text-slate-400">01:00 PM - 02:30 PM</span>
                <h4 className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">Advanced Algorithms Seminar</h4>
                <p className="text-[10px] text-slate-400">Online • Dr. Sarah Jenkins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/profile').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
      <h3 className="text-lg font-bold font-heading mb-6 flex items-center gap-2"><User className="w-5 h-5 text-indigo-500" /> Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Full Name', value: data.fullName },
          { label: 'Student ID', value: data.studentId },
          { label: 'Email', value: data.email },
          { label: 'Phone Number', value: data.phone },
          { label: 'Department', value: data.department },
          { label: 'Course', value: data.course },
          { label: 'Year/Semester', value: data.year },
          { label: 'Date of Birth', value: data.dob },
          { label: 'Address', value: data.address },
          { label: 'Parent/Guardian', value: `${data.parents.fatherName} (${data.parents.fatherPhone})` }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-400 text-center bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
        Read-only access. To edit these details, please contact the Administration Office.
      </p>
    </div>
  );
};

const AcademicTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/academic-details').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="p-6 rounded-2xl bg-indigo-600 text-white flex-1 shadow-lg shadow-indigo-500/20">
          <p className="text-xs uppercase font-bold text-indigo-200">Current CGPA</p>
          <p className="text-4xl font-heading font-black mt-2">{data.cgpa}</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-800 text-white flex-1 shadow-lg">
          <p className="text-xs uppercase font-bold text-slate-400">Total Credits</p>
          <p className="text-4xl font-heading font-black mt-2">{data.totalCredits}</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-lg font-bold font-heading mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Current Subjects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Code</th>
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Subject</th>
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Credits</th>
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects.map((sub, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold">{sub.code}</td>
                  <td className="py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{sub.name}</td>
                  <td className="py-4 text-sm text-slate-500">{sub.credits}</td>
                  <td className="py-4 text-sm text-slate-500">{sub.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AttendanceTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/attendance').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-xl shadow-teal-500/20 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-teal-100 uppercase tracking-wider">Overall Attendance</p>
          <p className="text-4xl font-heading font-black mt-1">{data.totalPercentage}%</p>
        </div>
        <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 font-bold">
          Status: {data.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-md font-bold font-heading flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Subject-wise</h3>
          <div className="space-y-4">
            {data.subjects.map((sub, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>{sub.name}</span>
                  <span>{sub.attended}/{sub.total} ({sub.percentage}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sub.percentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${sub.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-md font-bold font-heading flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Monthly Breakdown</h3>
          <div className="space-y-4">
            {data.monthly.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-sm">{m.month}</span>
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{m.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/results').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex-1 min-w-[200px]">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Current Term</p>
          <p className="text-2xl font-heading font-black mt-1 text-slate-800 dark:text-slate-100">{data.currentSemester}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex-1 min-w-[200px]">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">SGPA</p>
          <p className="text-2xl font-heading font-black mt-1 text-indigo-600 dark:text-indigo-400">{data.sgpa}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex-1 min-w-[200px] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Status</p>
            <p className="text-2xl font-heading font-black mt-1 text-emerald-500">{data.status}</p>
          </div>
          <button className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-lg font-bold font-heading mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-500" /> Subject Marks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Subject</th>
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Marks</th>
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Grade</th>
                <th className="pb-3 text-xs uppercase text-slate-400 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects.map((sub, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{sub.name}</td>
                  <td className="py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{sub.marks}/100</td>
                  <td className="py-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">{sub.grade}</td>
                  <td className="py-4 text-sm">
                    <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 uppercase tracking-wider">{sub.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FeesTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/fees').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Fee</p>
          <p className="text-2xl font-heading font-black mt-1">${data.totalFee}</p>
        </div>
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <p className="text-xs uppercase font-bold text-emerald-600/70 dark:text-emerald-400/70 tracking-wider">Paid</p>
          <p className="text-2xl font-heading font-black mt-1 text-emerald-600 dark:text-emerald-400">${data.paid}</p>
        </div>
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <p className="text-xs uppercase font-bold text-rose-600/70 dark:text-rose-400/70 tracking-wider">Pending</p>
          <p className="text-2xl font-heading font-black mt-1 text-rose-600 dark:text-rose-400">${data.pending}</p>
          <p className="text-[10px] font-semibold text-rose-500 mt-2">Due: {data.dueDate}</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-heading flex items-center gap-2"><CreditCard className="w-5 h-5 text-indigo-500" /> Transaction History</h3>
          {data.pending > 0 && (
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors">
              Pay Now
            </button>
          )}
        </div>
        <div className="space-y-3">
          {data.history.map((tx, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{tx.receipt}</p>
                <p className="text-xs text-slate-400 mt-1">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-mono text-emerald-500">${tx.amount}</p>
                <span className="text-[10px] uppercase font-bold text-slate-400">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnnouncementsTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/announcements').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2"><Bell className="w-6 h-6 text-indigo-500" /> College Announcements</h3>
      {data.map((item) => (
        <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/30 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                item.type === 'Exam' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' :
                item.type === 'Event' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' :
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {item.type}
              </span>
              <span className="text-xs font-semibold text-slate-400">{item.date}</span>
            </div>
          </div>
          <h4 className="text-md font-bold mt-3 text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h4>
        </div>
      ))}
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">
        <h3 className="text-lg font-bold font-heading flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-500" /> Account Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Password</label>
            <input type="password" placeholder="New Password" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
            Update Password
          </button>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />
        
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Notification Preferences</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300" defaultChecked />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Email notifications for assignments</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300" defaultChecked />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">SMS alerts for fee payments</span>
          </label>
        </div>
        
        <p className="mt-6 text-xs text-slate-400 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
          Role changes and academic modifications are restricted. Contact administration for these updates.
        </p>
      </div>
    </div>
  );
};

const CalendarTab = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/calendar').then(res => setData(res.data.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-indigo-500" /> Academic Calendar</h3>
      {data.map((item) => (
        <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
            <span className="text-lg font-black font-heading">{new Date(item.date).getDate()}</span>
          </div>
          <div>
            <h4 className="text-md font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 block">{item.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FeedbackTab = () => {
  const [status, setStatus] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/feedback', { category: 'General', message: 'Test feedback' });
      setStatus('Feedback submitted successfully!');
      e.target.reset();
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Failed to submit feedback.');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6">
        <h3 className="text-lg font-bold font-heading flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500" /> Submit Feedback</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
            <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500">
              <option>Academic</option>
              <option>Infrastructure</option>
              <option>Hostel</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message</label>
            <textarea required rows="5" placeholder="Share your feedback..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500"></textarea>
          </div>
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
            Submit Feedback
          </button>
          {status && <p className="text-sm font-semibold text-emerald-500 mt-2">{status}</p>}
        </form>
      </div>
    </div>
  );
};

// --- Main Layout ---

export default function StudentDashboard({ user, onLogout, currentTime }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'fees', label: 'Fee Payment', icon: CreditCard },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'academic', label: 'Academic Details', icon: BookOpen },
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg tracking-tight">MuTeX</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Student Portal</p>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
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
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:text-rose-400 transition-colors">
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
             {/* Mobile Logo */}
             <div className="p-1.5 rounded-lg bg-indigo-600 text-white"><GraduationCap className="w-5 h-5" /></div>
             <h1 className="font-heading font-bold">MuTeX</h1>
          </div>
          
          <div className="hidden md:flex flex-col">
            <h2 className="text-xl font-heading font-black capitalize">{menuItems.find(m => m.id === activeTab)?.label}</h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">{currentTime}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto relative">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-tight">{user.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400">Student</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => {setActiveTab('personal'); setDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"><User className="w-4 h-4 text-slate-400"/> Profile</button>
                  <button onClick={() => {setActiveTab('settings'); setDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"><Settings className="w-4 h-4 text-slate-400"/> Settings</button>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab user={user} currentTime={currentTime} />}
            {activeTab === 'results' && <ResultsTab />}
            {activeTab === 'fees' && <FeesTab />}
            {activeTab === 'announcements' && <AnnouncementsTab />}
            {activeTab === 'calendar' && <CalendarTab />}
            {activeTab === 'academic' && <AcademicTab />}
            {activeTab === 'personal' && <PersonalTab />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'feedback' && <FeedbackTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
