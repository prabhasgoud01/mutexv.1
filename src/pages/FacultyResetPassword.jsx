import React, { useState } from 'react';
import { KeyRound, ArrowRight, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function FacultyResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setToast({ show: true, message: 'Passwords do not match', type: 'error' });
    }
    setIsLoading(true);
    try {
      const { data } = await api.post(`/auth/faculty-reset-password/${token}`, { password });
      setToast({ show: true, message: data.message || 'Password reset successful', type: 'success' });
      setTimeout(() => navigate('/faculty-login'), 2000);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to reset password', type: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-slate-50"></div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">Faculty</h2>
        <p className="mt-2 text-center text-sm text-slate-500">Set a new security password</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-10 px-3 py-3 bg-white border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-10 px-3 py-3 bg-white border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all disabled:opacity-50">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Save Password <ArrowRight className="w-5 h-5 ml-2" /></>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/faculty-login" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">Cancel & Return to Login</Link>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
