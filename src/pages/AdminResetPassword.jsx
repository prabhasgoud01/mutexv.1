import React, { useState } from 'react';
import { KeyRound, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import PasswordValidator, { isPasswordValid } from '../components/PasswordValidator';

export default function AdminResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      return setToast({ show: true, message: 'Password does not meet requirements', type: 'error' });
    }
    if (password !== confirmPassword) {
      return setToast({ show: true, message: 'Passwords do not match', type: 'error' });
    }
    setIsLoading(true);
    try {
      const { data } = await api.post(`/auth/admin-reset-password/${token}`, { password });
      setToast({ show: true, message: data.message || 'Password reset successful', type: 'success' });
      setTimeout(() => navigate('/admin-login'), 2000);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to reset password', type: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-slate-50"></div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 mb-6">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">Admin</h2>
        <p className="mt-2 text-center text-sm text-slate-500">Set a new security password</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-10 px-3 py-3 bg-white border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordValidator password={password} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-10 px-3 py-3 bg-white border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={isLoading || !isPasswordValid(password) || password !== confirmPassword} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 transition-all disabled:opacity-50 disabled:bg-slate-400">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Save Password <ArrowRight className="w-5 h-5 ml-2" /></>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/admin-login" className="text-sm font-medium text-rose-500 hover:text-rose-400">Cancel & Return to Login</Link>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
