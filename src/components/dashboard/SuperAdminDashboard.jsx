import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Shield, BookOpen, UserX, UserCheck, 
  RefreshCcw, AlertTriangle, Calendar, UserPlus, Mail, Phone, MapPin
} from 'lucide-react';
import api from '../../services/api';
import Toast from '../Toast';

export default function SuperAdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [activeTab, setActiveTab] = useState('overview'); // overview, colleges, users, create_admin, sms_gateway
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', collegeName: '', phoneNumber: '', age: '', state: '' });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  
  // SMS States
  const [smsTargetCollege, setSmsTargetCollege] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, collegesRes, usersRes] = await Promise.all([
        api.get('/super-admin/stats'),
        api.get('/super-admin/colleges'),
        api.get('/super-admin/users')
      ]);
      setStats(statsRes.data);
      setColleges(collegesRes.data);
      setAllUsers(usersRes.data.data || []);
    } catch (error) {
      setToast({ show: true, message: 'Failed to fetch data', type: 'error' });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBlock = async (collegeId) => {
    try {
      await api.put(`/super-admin/colleges/${collegeId}/block`);
      setToast({ show: true, message: 'College status updated', type: 'success' });
      fetchData(); // Refresh data
    } catch (error) {
      setToast({ show: true, message: 'Failed to update status', type: 'error' });
    }
  };

  const handleUpdateSubscription = async (collegeId, dateStr) => {
    try {
      await api.put(`/super-admin/colleges/${collegeId}/subscription`, { expiryDate: dateStr });
      setToast({ show: true, message: 'Subscription updated', type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ show: true, message: 'Failed to update subscription', type: 'error' });
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsCreatingAdmin(true);
    try {
      await api.post('/super-admin/create-admin', newAdmin);
      setToast({ show: true, message: 'College Admin created successfully and credentials emailed!', type: 'success' });
      setNewAdmin({ name: '', email: '', collegeName: '', phoneNumber: '', age: '', state: '' });
      fetchData();
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to create admin', type: 'error' });
    }
    setIsCreatingAdmin(false);
  };

  const handleSuperAdminSmsBroadcast = async (e) => {
    e.preventDefault();
    if (!smsTargetCollege || !smsBody.trim()) {
      setToast({ show: true, message: 'Please select a college and enter a message', type: 'error' });
      return;
    }
    
    setSmsLoading(true);
    try {
      const res = await api.post('/super-admin/send-sms', {
        targetType: 'Specific College',
        targetCollege: smsTargetCollege,
        message: smsBody
      });
      setToast({ show: true, message: res.data.message || 'SMS Broadcast completed successfully.', type: 'success' });
      setSmsBody('');
      setSmsTargetCollege('');
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to send SMS.', type: 'error' });
    } finally {
      setSmsLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Colleges', value: stats.colleges, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Admins', value: stats.admins, icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Total Faculty', value: stats.faculty, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Students', value: stats.students, icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Top Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Super Admin Console
                </h1>
                <p className="text-xs text-slate-500">Global System Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchData}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all"
                title="Refresh Data"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-indigo-400 uppercase font-semibold">Super Admin</div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all duration-200"
                >
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl mb-8 border border-slate-800/50 inline-flex">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('colleges')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'colleges' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Colleges
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('create_admin')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'create_admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <UserPlus className="w-4 h-4" />
            Create Admin
          </button>
          <button 
            onClick={() => setActiveTab('sms_gateway')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'sms_gateway' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Phone className="w-4 h-4" />
            SMS Broadcast
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, idx) => (
                <div key={idx} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex items-start justify-between group hover:border-slate-700 transition-all duration-300">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stat.value.toLocaleString()}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                    System Alerts
                  </h3>
                  {colleges.filter(c => c.isBlocked || (c.subscriptionExpiry && new Date(c.subscriptionExpiry) < new Date())).length === 0 ? (
                    <div className="text-slate-400 text-sm py-4">All systems normal. No blocked colleges or expired subscriptions.</div>
                  ) : (
                    <div className="space-y-3">
                      {colleges.map(c => {
                        if (c.isBlocked) {
                          return (
                            <div key={`alert-block-${c._id}`} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                              <div className="flex items-center">
                                <UserX className="w-4 h-4 text-red-400 mr-2" />
                                <span className="text-sm text-slate-300"><strong>{c.name}</strong> is currently blocked.</span>
                              </div>
                            </div>
                          );
                        }
                        if (c.subscriptionExpiry && new Date(c.subscriptionExpiry) < new Date()) {
                          return (
                            <div key={`alert-exp-${c._id}`} className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-amber-400 mr-2" />
                                <span className="text-sm text-slate-300"><strong>{c.name}</strong> subscription has expired.</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* Colleges Tab */}
        {activeTab === 'colleges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">College Management</h2>
              <span className="text-sm text-slate-400">Total: {colleges.length}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-sm">
                      <th className="p-4 font-medium">College Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Subscription Expiry</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {colleges.map(college => (
                      <tr key={college._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="font-medium text-slate-200">{college.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            college.isBlocked 
                              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {college.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 text-sm">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="date"
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                              value={college.subscriptionExpiry ? new Date(college.subscriptionExpiry).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleUpdateSubscription(college._id, e.target.value)}
                            />
                            {college.subscriptionExpiry && new Date(college.subscriptionExpiry) < new Date() && (
                              <span className="text-amber-500 text-xs flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" /> Expired
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleBlock(college._id)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              college.isBlocked
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {college.isBlocked ? (
                              <><UserCheck className="w-3.5 h-3.5 mr-1.5" /> Unblock</>
                            ) : (
                              <><UserX className="w-3.5 h-3.5 mr-1.5" /> Block</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {colleges.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">
                          No colleges registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Global User Directory</h2>
              <span className="text-sm text-slate-400">Total: {allUsers.length}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-sm">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">College</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {allUsers.map((u, idx) => (
                      <tr key={u._id || idx} className="hover:bg-slate-800/20 transition-colors text-sm">
                        <td className="p-4 font-medium text-slate-200">{u.name}</td>
                        <td className="p-4 text-slate-400">{u.email}</td>
                        <td className="p-4">
                           <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${
                             u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                             u.role === 'faculty' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                             'bg-pink-500/10 text-pink-400 border-pink-500/20'
                           }`}>
                             {u.role}
                           </span>
                        </td>
                        <td className="p-4 text-slate-400">{u.collegeName}</td>
                      </tr>
                    ))}
                    {allUsers.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Create Admin Tab */}
      {activeTab === 'create_admin' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="w-32 h-32 text-indigo-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create College Admin</h2>
                  <p className="text-sm text-slate-400">Deploy a new administrator for a college institution</p>
                </div>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <input type="text" required value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="email" required value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="admin@college.edu" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">College Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="text" required value={newAdmin.collegeName} onChange={(e) => setNewAdmin({ ...newAdmin, collegeName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="University of Technology" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="tel" value={newAdmin.phoneNumber} onChange={(e) => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">State / Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="text" value={newAdmin.state} onChange={(e) => setNewAdmin({ ...newAdmin, state: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="California" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
                    <input type="number" value={newAdmin.age} onChange={(e) => setNewAdmin({ ...newAdmin, age: e.target.value })} className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="35" />
                  </div>
                </div>
                
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start mt-6">
                  <AlertTriangle className="w-5 h-5 text-indigo-400 mr-3 shrink-0 mt-0.5" />
                  <div className="text-sm text-indigo-200/80">
                    <strong className="text-indigo-300 block mb-1">Security Notice:</strong>
                    A secure temporary passkey (<span className="font-mono bg-indigo-950/50 px-1 py-0.5 rounded text-indigo-400">sai111</span>) will be automatically generated and securely dispatched to the administrator's email. The system will forcefully mandate a password change upon their initial login sequence to ensure cryptographically secure access.
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isCreatingAdmin} className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50">
                    {isCreatingAdmin ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <UserPlus className="w-5 h-5 mr-2" />
                    )}
                    Deploy Administrator
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SMS GATEWAY TAB */}
      {activeTab === 'sms_gateway' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <Phone className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Super Admin SMS Gateway</h3>
                  <p className="text-sm text-slate-400 mt-1">Broadcast SMS to all users (Students & Faculty) of a specific college.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSuperAdminSmsBroadcast} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none -mr-4 -mt-4"></div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Target College</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <select 
                      required
                      value={smsTargetCollege}
                      onChange={(e) => setSmsTargetCollege(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white appearance-none"
                    >
                      <option value="">Select a college...</option>
                      {colleges.map(c => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">SMS Text Body</label>
                    <span className={`text-[10px] font-mono font-bold ${smsBody.length > 160 ? 'text-rose-500' : 'text-slate-500'}`}>{smsBody.length} / 160</span>
                  </div>
                  <textarea 
                    required
                    rows={4}
                    maxLength={160}
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={smsLoading || !smsTargetCollege || !smsBody.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {smsLoading ? (
                  <><RefreshCcw className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Phone className="w-4 h-4" /> Send College Broadcast</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast
        toast={toast}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
