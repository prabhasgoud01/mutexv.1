import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Clock, CheckSquare, LogOut, Award 
} from 'lucide-react';

export default function StudentDashboard({ user, onLogout, currentTime }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit Advanced Algorithms Assignment 3', done: false, date: 'Today' },
    { id: 2, text: 'Read Deep Learning Research Paper', done: true, date: 'Yesterday' },
    { id: 3, text: 'Prepare for Web Dev midterm presentation', done: false, date: 'June 2' },
    { id: 4, text: 'Confirm internship application details', done: false, date: 'June 5' }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const courses = [
    { title: 'Advanced Algorithms', code: 'CS-401', progress: 84, grade: 'A', instructor: 'Dr. Sarah Jenkins' },
    { title: 'Neural Networks & Deep Learning', code: 'CS-425', progress: 92, grade: 'A+', instructor: 'Prof. Michael Chang' },
    { title: 'Cloud Systems Architecture', code: 'CS-390', progress: 68, grade: 'B+', instructor: 'Dr. Raymond Floyd' },
    { title: 'Human Computer Interaction', code: 'CS-322', progress: 98, grade: 'A+', instructor: 'Prof. Helen Myers' }
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Navbar */}
      <nav className="shrink-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg tracking-tight">MuTeX</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Student Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Current Session</span>
            <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{currentTime}</span>
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
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
          
          {/* Courses & Grades Progression */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Courses Overview */}
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
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-md">
                          {course.code}
                        </span>
                        <h4 className="font-heading font-bold text-sm mt-2 text-slate-800 dark:text-slate-100 pr-2 line-clamp-1">
                          {course.title}
                        </h4>
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

            {/* GPA SVG Curve Progress Chart */}
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
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="rgba(156,163,175,0.08)" strokeDasharray="5 5" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(156,163,175,0.08)" strokeDasharray="5 5" />
                  <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="rgba(156,163,175,0.08)" strokeDasharray="5 5" />

                  {/* Gradient Area */}
                  <path d="M 0 150 Q 100 110, 200 90 T 400 30 T 500 20 L 500 150 Z" fill="url(#studentGpaGrad)" />
                  
                  {/* Line Curve */}
                  <path d="M 0 150 Q 100 110, 200 90 T 400 30 T 500 20" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Glowing Dots */}
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

          {/* Right Column Tasklist / Schedule */}
          <div className="space-y-8">
            
            {/* Task Checklist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-5">
              <h3 className="text-md font-bold font-heading flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-500" />
                Task Planner
              </h3>
              
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      task.done 
                        ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800 opacity-60' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      task.done 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {task.done && <CheckSquare className="w-4 h-4" />}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-xs font-semibold ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                        {task.text}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Schedule Card */}
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
      </main>
    </div>
  );
}
