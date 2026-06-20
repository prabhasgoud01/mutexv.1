import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Search,
  Filter,
  Check,
  X,
  RotateCcw,
  Save,
  Users,
  CheckCircle,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Book,
} from 'lucide-react';

export default function FacultyAttendanceMarkingTab({ user, triggerLocalToast }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  const [filters, setFilters] = useState({
    assignmentId: '',
    subjectCode: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/faculty/assigned-subjects');
        const data = res.data.assignments || [];
        setAssignments(data);
        if (data.length > 0) {
          setFilters(prev => ({
            ...prev,
            assignmentId: data[0]._id,
            subjectCode: data[0].subjects.length > 0 ? data[0].subjects[0].subjectCode : ''
          }));
        }
      } catch (err) {
        triggerLocalToast?.('error', 'Failed to load assigned subjects');
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignmentId') {
      const selectedAssignment = assignments.find(a => a._id === value);
      setFilters({ 
        ...filters, 
        assignmentId: value, 
        subjectCode: selectedAssignment?.subjects.length > 0 ? selectedAssignment.subjects[0].subjectCode : '' 
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const loadStudents = async () => {
    if (!filters.assignmentId) {
       triggerLocalToast?.('error', 'Please select an assigned class');
       return;
    }
    const selectedAssignment = assignments.find(a => a._id === filters.assignmentId);
    if (!selectedAssignment) return;
    
    setLoading(true);
    try {
      const res = await api.post('/attendance/faculty/load-students', {
        batch: selectedAssignment.academicYear,
        year: selectedAssignment.year,
        semester: selectedAssignment.semester,
        section: selectedAssignment.section
      });
      // Initialize with no status (or could fetch if already marked)
      const formattedStudents = res.data.students.map(s => ({
        ...s,
        status: null, // P, A, L
      }));
      setStudents(formattedStudents);
      triggerLocalToast?.('success', `Loaded ${formattedStudents.length} students`);
    } catch (error) {
      triggerLocalToast?.('error', error.response?.data?.message || 'Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(s => s._id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status) => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const resetAll = () => {
    setStudents(students.map(s => ({ ...s, status: null })));
  };
  
  const saveAttendance = async () => {
    // Validate
    if (!filters.assignmentId) {
      triggerLocalToast?.('error', 'Please select a class');
      return;
    }
    if (!filters.subjectCode) {
      triggerLocalToast?.('error', 'Please select a subject');
      return;
    }

    const selectedAssignment = assignments.find(a => a._id === filters.assignmentId);
    const subject = selectedAssignment?.subjects.find(s => s.subjectCode === filters.subjectCode);
    const subjectName = subject ? subject.subjectName : filters.subjectCode;

    const unmarked = students.filter(s => !s.status);
    if (unmarked.length > 0) {
      triggerLocalToast?.('error', `Please mark attendance for all students. ${unmarked.length} remaining.`);
      return;
    }
    
    if (students.length === 0) {
      triggerLocalToast?.('error', 'No students to save');
      return;
    }
    
    setSaving(true);
    try {
      const attendanceData = students.map(s => ({
        studentId: s._id,
        rollNumber: s.rollNumber,
        status: s.status
      }));

      const res = await api.post('/attendance/faculty/mark', {
        subjectCode: filters.subjectCode,
        subjectName,
        date: filters.date,
        batch: selectedAssignment.academicYear,
        year: selectedAssignment.year,
        semester: selectedAssignment.semester,
        section: selectedAssignment.section,
        attendanceData
      });
      
      if (res.data.duplicatesSkipped > 0) {
        triggerLocalToast?.('info', `${res.data.duplicatesSkipped} duplicate records skipped.`);
      }
      triggerLocalToast?.('success', res.data.message || 'Attendance saved successfully');
    } catch (error) {
      triggerLocalToast?.('error', error.response?.data?.message || 'Error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'P').length;
  const absentCount = students.filter(s => s.status === 'A').length;
  const lateCount = students.filter(s => s.status === 'L').length;
  const attendancePercentage = Math.round(((presentCount + (lateCount * 0.5)) / (totalStudents || 1)) * 100) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold font-heading mb-4 text-slate-800 dark:text-slate-100">Select Class & Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          
          <div className="space-y-2 xl:col-span-2">
            <label className="text-xs font-semibold text-slate-500">Assigned Class</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              {assignmentsLoading ? (
                 <select disabled className="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                    <option>Loading classes...</option>
                 </select>
              ) : (
                <select name="assignmentId" value={filters.assignmentId} onChange={handleFilterChange} className="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                  {assignments.length === 0 && <option value="">No Classes Assigned</option>}
                  {assignments.map(a => (
                    <option key={a._id} value={a._id}>{a.academicYear} | {a.year} | Sem {a.semester} | Sec {a.section} ({a.department})</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          <div className="space-y-2 xl:col-span-1">
            <label className="text-xs font-semibold text-slate-500">Subject</label>
            <div className="relative">
              <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select name="subjectCode" value={filters.subjectCode} onChange={handleFilterChange} className="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                {(!filters.assignmentId || assignments.find(a => a._id === filters.assignmentId)?.subjects.length === 0) && (
                   <option value="">No Subjects</option>
                )}
                {filters.assignmentId && assignments.find(a => a._id === filters.assignmentId)?.subjects.map(s => (
                  <option key={s.subjectCode} value={s.subjectCode}>{s.subjectName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 xl:col-span-1">
            <label className="text-xs font-semibold text-slate-500">Date</label>
            <div className="relative">
              <input name="date" type="date" value={filters.date} onChange={handleFilterChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={loadStudents} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 disabled:opacity-70">
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Load Students'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Stats and Table */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Stats Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-8 items-center justify-between">
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</p>
                <p className="text-2xl font-heading font-bold mt-1 text-slate-800 dark:text-slate-100">{totalStudents}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present</p>
                <p className="text-2xl font-heading font-bold mt-1 text-emerald-600 dark:text-emerald-400">{presentCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-full dark:bg-rose-900/30 dark:text-rose-400">
                <X className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent</p>
                <p className="text-2xl font-heading font-bold mt-1 text-rose-600 dark:text-rose-400">{absentCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late</p>
                <p className="text-2xl font-heading font-bold mt-1 text-blue-600 dark:text-blue-400">{lateCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-8 border-l border-slate-200 dark:border-slate-800">
               <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-800"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3.5"
                    />
                    <path
                      className="text-emerald-500 transition-all duration-1000 ease-out"
                      strokeDasharray={`${attendancePercentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"
                    />
                  </svg>
               </div>
               <div>
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</p>
                 <p className="text-2xl font-heading font-bold mt-1 text-slate-800 dark:text-slate-100">{attendancePercentage}%</p>
               </div>
            </div>

          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Header/Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search student by name or roll no..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider text-left">
                    <th className="px-6 py-4 font-semibold w-16">#</th>
                    <th className="px-6 py-4 font-semibold">Roll No.</th>
                    <th className="px-6 py-4 font-semibold">Student Name</th>
                    <th className="px-6 py-4 font-semibold">Attendance <Info className="inline w-3 h-3 ml-1" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredStudents.length > 0 ? filteredStudents.map((student, index) => (
                    <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{student.rollNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={student.profilePhoto || `https://ui-avatars.com/api/?name=${student.name}&background=random`} alt={student.name} className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleStatusChange(student._id, 'P')}
                            className={`relative w-10 h-10 rounded-lg font-bold transition-all flex items-center justify-center ${
                              student.status === 'P' 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800' 
                                : 'bg-white dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            P
                            {student.status === 'P' && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"><Check className="w-2.5 h-2.5 text-white" /></div>}
                          </button>
                          
                          <button 
                            onClick={() => handleStatusChange(student._id, 'A')}
                            className={`relative w-10 h-10 rounded-lg font-bold transition-all flex items-center justify-center ${
                              student.status === 'A' 
                                ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border border-rose-200 dark:border-rose-800' 
                                : 'bg-white dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            A
                            {student.status === 'A' && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"><Check className="w-2.5 h-2.5 text-white" /></div>}
                          </button>

                          <button 
                            onClick={() => handleStatusChange(student._id, 'L')}
                            className={`relative w-10 h-10 rounded-lg font-bold transition-all flex items-center justify-center ${
                              student.status === 'L' 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-200 dark:border-blue-800' 
                                : 'bg-white dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            L
                            {student.status === 'L' && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"><Check className="w-2.5 h-2.5 text-white" /></div>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center p-8 text-slate-500">No students loaded. Click "Load Students" after selecting filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>

        {/* Right Side: Actions Sidebar */}
        <div className="space-y-6">
          
          {/* Legend */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold font-heading text-slate-800 dark:text-slate-100 mb-4 text-sm">Mark Attendance</h4>
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">P</span>
                <span className="text-[10px] font-semibold text-emerald-700/70 dark:text-emerald-400/70">Present</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-900/10">
                <span className="font-bold text-rose-600 dark:text-rose-400">A</span>
                <span className="text-[10px] font-semibold text-rose-700/70 dark:text-rose-400/70">Absent</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
                <span className="font-bold text-blue-600 dark:text-blue-400">L</span>
                <span className="text-[10px] font-semibold text-blue-700/70 dark:text-blue-400/70">Late</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold font-heading text-slate-800 dark:text-slate-100 mb-4 text-sm">Quick Actions</h4>
            
            <button 
              onClick={() => markAll('P')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors font-bold text-sm border border-emerald-100 dark:border-emerald-800/30"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Present
            </button>

            <button 
              onClick={() => markAll('A')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors font-bold text-sm border border-rose-100 dark:border-rose-800/30"
            >
              <XCircle className="w-4 h-4" />
              Mark All Absent
            </button>

            <button 
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <button onClick={saveAttendance} disabled={saving} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-colors font-bold text-base shadow-lg shadow-blue-600/30 disabled:opacity-70">
            <Save className={`w-5 h-5 ${saving ? 'animate-bounce' : ''}`} />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">Attendance will be saved with Date, Subject & Class</p>
          </div>

        </div>

      </div>
    </div>
  );
}
