import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight, ArrowLeft, Landmark, Eye, EyeOff } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });

  const { token } = useParams();
  const navigate = useNavigate();

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      triggerToast('error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      triggerToast('error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      triggerToast('error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      triggerToast('success', response.data.message || 'Password reset successful!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/student-login');
      }, 2000);
      
    } catch (error) {
      triggerToast('error', error.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none bg-emerald-500/20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-4">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
            Create New Password
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Please enter your new password below. Make sure it's at least 6 characters.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
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
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Update Password
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link 
              to="/student-login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cancel and return to login
            </Link>
          </div>
        </motion.form>
      </div>

      <Toast toast={toast} onClose={handleCloseToast} />
    </div>
  );
}
