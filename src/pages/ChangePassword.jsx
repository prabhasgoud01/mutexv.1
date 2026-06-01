import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      navigate('/student-login');
    }
  }, [user, navigate]);

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      triggerToast('error', 'Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/first-login-change-password', { password: newPassword });
      setLoading(false);
      
      if (response.data.success) {
        // Update user state locally or simply redirect
        if (user) {
          user.isFirstLogin = false;
        }
        triggerToast('success', 'Password updated successfully! Redirecting...');
        setTimeout(() => {
          navigate(`/dashboard/${user.role}`);
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
      triggerToast('error', error.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden transition-colors">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl rounded-3xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
              Action Required
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
              For security reasons, you must change your default password before accessing your dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
              New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-semibold"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
              Confirm New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-semibold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all cursor-pointer hover:brightness-105 active:scale-[0.98] bg-rose-600 hover:bg-rose-700 disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Update Password & Continue <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
      <Toast toast={toast} onClose={handleCloseToast} />
    </div>
  );
}
