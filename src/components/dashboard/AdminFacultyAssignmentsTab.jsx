import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Check, Save, X, Trash2, Edit } from 'lucide-react';
import api from '../../services/api';

export default function AdminFacultyAssignmentsTab({ triggerLocalToast }) {
  const [assignments, setAssignments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentYear = new Date().getFullYear();
  const baseYear = new Date().getMonth() < 6 ? currentYear - 1 : currentYear;

  const [formData, setFormData] = useState({
    facultyId: '',
    department: 'Computer Science',
    academicYear: `${baseYear}-${baseYear+4}`,
    year: '1st Year',
    semester: '1',
    section: 'A',
    selectedSubjects: [] // array of selected subject codes
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, subRes, assignRes] = await Promise.all([
        api.get('/admin/faculty'),
        api.get('/admin/subjects'),
        api.get('/admin/faculty-assignments')
      ]);
      setFacultyList(facRes.data.faculty || []);
      setSubjectList(subRes.data.subjects || []);
      setAssignments(assignRes.data.assignments || []);
    } catch (error) {
      triggerLocalToast('error', 'Failed to load data for assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubjectToggle = (subjectCode) => {
    setFormData(prev => {
      const isSelected = prev.selectedSubjects.includes(subjectCode);
      if (isSelected) {
        return { ...prev, selectedSubjects: prev.selectedSubjects.filter(c => c !== subjectCode) };
      } else {
        return { ...prev, selectedSubjects: [...prev.selectedSubjects, subjectCode] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.facultyId) return triggerLocalToast('error', 'Select a Faculty');
    if (formData.selectedSubjects.length === 0) return triggerLocalToast('error', 'Select at least one subject');

    setIsSubmitting(true);
    try {
      const mappedSubjects = formData.selectedSubjects.map(code => {
        const sub = subjectList.find(s => s.subjectCode === code);
        return { subjectCode: code, subjectName: sub ? sub.subjectName : code };
      });

      await api.post('/admin/assign-subjects', {
        facultyId: formData.facultyId,
        department: formData.department,
        academicYear: formData.academicYear,
        year: formData.year,
        semester: formData.semester,
        section: formData.section,
        subjects: mappedSubjects
      });

      triggerLocalToast('success', 'Subjects assigned successfully');
      fetchData(); // reload table
      setFormData(prev => ({ ...prev, selectedSubjects: [] })); // reset selection
    } catch (error) {
      triggerLocalToast('error', error.response?.data?.message || 'Failed to assign subjects');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    try {
      await api.delete(`/admin/delete-assignment/${id}`);
      triggerLocalToast('success', 'Assignment removed');
      fetchData();
    } catch (error) {
      triggerLocalToast('error', 'Failed to delete assignment');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading assignment data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-500" />
          Faculty Subject Assignments
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Assignment Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">New Assignment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Faculty</label>
              <select 
                value={formData.facultyId} 
                onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
              >
                <option value="">-- Select Faculty --</option>
                {facultyList.map(f => (
                  <option key={f._id} value={f._id}>{f.name} ({f.department})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Department</label>
                <select 
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  {['Computer Science', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Batch</label>
                <select 
                  value={formData.academicYear} 
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  <option value={`${baseYear-3}-${baseYear+1}`}>{`${baseYear-3}-${baseYear+1}`}</option>
                  <option value={`${baseYear-2}-${baseYear+2}`}>{`${baseYear-2}-${baseYear+2}`}</option>
                  <option value={`${baseYear-1}-${baseYear+3}`}>{`${baseYear-1}-${baseYear+3}`}</option>
                  <option value={`${baseYear}-${baseYear+4}`}>{`${baseYear}-${baseYear+4}`}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Year</label>
                <select 
                  value={formData.year} 
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Sem</label>
                <select 
                  value={formData.semester} 
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Section</label>
                <select 
                  value={formData.section} 
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-semibold text-slate-500">Multi-Select Subjects</label>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 space-y-1">
                {subjectList.filter(s => s.department === formData.department || formData.department === 'All').map(sub => (
                  <label key={sub.subjectCode} className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-white border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                      checked={formData.selectedSubjects.includes(sub.subjectCode)}
                      onChange={() => handleSubjectToggle(sub.subjectCode)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{sub.subjectName}</span>
                      <span className="text-xs text-slate-500">{sub.subjectCode}</span>
                    </div>
                  </label>
                ))}
                {subjectList.length === 0 && <div className="text-xs text-slate-500 p-2">No subjects available</div>}
              </div>
              <p className="text-xs text-slate-400 text-right">{formData.selectedSubjects.length} selected</p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Assigning...' : 'Assign Subjects'}
            </button>
          </form>
        </div>

        {/* Existing Assignments Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Active Assignments</h3>
            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">
              {assignments.length} Records
            </span>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {assignments.map(assign => (
                <div key={assign._id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 dark:text-white">{assign.facultyName}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md">
                        {assign.department}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md">{assign.academicYear}</span>
                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">{assign.year}</span>
                      <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-md">Sem {assign.semester}</span>
                      <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md">Sec {assign.section}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {assign.subjects.map(sub => (
                        <span key={sub.subjectCode} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs rounded-md border border-emerald-100 dark:border-emerald-500/20">
                          {sub.subjectName} ({sub.subjectCode})
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(assign._id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                    title="Remove Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {assignments.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No subject assignments found. Create one using the form.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
