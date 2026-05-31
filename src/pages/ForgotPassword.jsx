import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Landmark, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function ForgotPassword() {
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'faculty' | 'admin'
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });

  // Role Theme Color Config
  const roleThemes = {
    student: {
      accent: 'indigo',
      bgGlow: 'bg-indigo-500/20',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25',
      borderFocus: 'focus:border-indigo-500 focus:ring-indigo-500/30',
      activeTab: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30',
      textAccent: 'text-indigo-600 dark:text-indigo-400',
      iconGlow: 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/20'
    },
    faculty: {
      accent: 'emerald',
      bgGlow: 'bg-emerald-500/20',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
      borderFocus: 'focus:border-emerald-500 focus:ring-emerald-500/30',
      activeTab: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      iconGlow: 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20'
    },
    admin: {
      accent: 'rose',
      bgGlow: 'bg-rose-500/20',
      primaryBtn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25',
      borderFocus: 'focus:border-rose-500 focus:ring-rose-500/30',
      activeTab: 'bg-rose-600 text-white shadow-lg shadow-rose-500/30',
      textAccent: 'text-rose-600 dark:text-rose-400',
      iconGlow: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    }
  };

  const currentTheme = roleThemes[selectedRole];

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const validateEmailDomain = (value) => {
    if (!value) {
      setEmailError('');
      return false;
    }
    const formatRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatRe.test(value)) {
      setEmailError('Please enter a valid email format.');
      return false;
    }
    if (selectedRole === 'admin' && !value.endsWith('@admin.com')) {
      setEmailError('Admin email must end with @admin.com');
      return false;
    } else if (selectedRole !== 'admin' && !value.endsWith('@gmail.com')) {
      setEmailError('Student and Faculty emails must end with @gmail.com');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateEmailDomain(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      triggerToast('error', 'Please enter your email address.');
      return;
    }

    if (!validateEmailDomain(email)) {
      triggerToast('error', 'Please resolve form errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      triggerToast('success', response.data.message || 'Reset link sent to your email.');
    } catch (error) {
      triggerToast('error', error.response?.data?.message || 'Error sending reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${currentTheme.bgGlow}`} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 transition-all duration-500 ${currentTheme.iconGlow}`}>
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {/* Custom Tab Toggles */}
        {!success && (
          <div className="p-1 mb-6 rounded-2xl bg-slate-100 dark:bg-slate-900 flex border border-slate-200/50 dark:border-slate-800/80 relative">
            {['student', 'faculty', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  setEmail('');
                  setEmailError('');
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer relative z-10 ${
                  selectedRole === role
                    ? currentTheme.activeTab
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  If an account exists for that email, a password reset link has been sent. Please check your inbox (and spam folder).
                </p>
              </div>
              <Link 
                to="/student-login"
                className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={selectedRole === 'admin' ? 'yourname@admin.com' : 'yourname@gmail.com'}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 focus:outline-none focus:ring-2 transition-all text-sm font-semibold ${currentTheme.borderFocus}`}
                  />
                </div>
                {/* Real-time Email Domain Error message */}
                <AnimatePresence>
                  {emailError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 dark:text-rose-400"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{emailError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none ${currentTheme.primaryBtn}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link 
                  to="/student-login"
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5 inline mr-2" />
                  Back to login
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <Toast toast={toast} onClose={handleCloseToast} />
    </div>
  );
}
