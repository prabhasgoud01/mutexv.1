import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Eye, EyeOff, Sparkles, Sun, Moon,
  ArrowRight, KeyRound, AlertCircle, Info, Landmark, HelpCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function FacultyLogin() {
  const selectedRole = 'faculty';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleQuickFill = () => {
    setEmail('jenkins@gmail.com');
    setPassword('faculty_pass');
    setEmailError('');
    triggerToast('info', 'Quick-filled credentials for FACULTY');
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
    if (!value.endsWith('@gmail.com')) {
      setEmailError('Faculty emails must end with @gmail.com');
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email) { triggerToast('error', 'Please enter your email address.'); return; }
    if (!password) { triggerToast('error', 'Please enter your password.'); return; }
    if (!validateEmailDomain(email)) { triggerToast('error', 'Please resolve form errors before logging in.'); return; }

    setLoading(true);
    const result = await login(email, password, selectedRole);
    setLoading(false);

    if (result.success) {
      triggerToast('success', `Welcome back, ${result.user.name}! Logged in successfully.`);
      if (result.user.isFirstLogin) {
        navigate('/change-password');
      } else {
        navigate('/dashboard/faculty');
      }
    } else {
      triggerToast('error', result.message || 'Login failed. Please check your credentials.');
    }
  };

  const theme = {
    accent: 'emerald',
    gradient: 'from-emerald-600 to-teal-600',
    bgGlow: 'bg-emerald-500/25',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
    borderFocus: 'focus:border-emerald-500 focus:ring-emerald-500/30',
    activeTab: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    textAccent: 'text-emerald-600 dark:text-emerald-400'
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden">
      <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${theme.bgGlow}`} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] pointer-events-none" />

      <div className="w-full flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900/10 dark:bg-slate-950/30 backdrop-blur-[1px] border-r border-slate-200/50 dark:border-slate-800/40 relative flex-col justify-between p-12">
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white shadow-lg shadow-black/10`}>
              <Landmark className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white">MuTeX</h2>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Faculty Portal</p>
            </div>
          </div>

          <div className="my-auto space-y-6 max-w-lg relative z-10">
            <AnimatePresence mode="wait">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className={`text-xs font-bold uppercase tracking-wider ${theme.textAccent} font-mono flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" /> Educator Workspace
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Educator Centralized Workspace.
                </h1>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base font-medium">
                  Manage your digital classrooms, student grades database, review capstone timelines, and organize classroom attendance metrics. Focus on teaching, we handle the workflow.
                </p>
                <div className="flex flex-wrap gap-2 pt-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">Classroom Grid</span>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/10">One-Click Grader</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 relative z-10">
            &copy; 2026 MuTeX Inc. Developed with React & Tailwind CSS.
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 relative z-10 bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm">
          <div className="flex justify-between items-center w-full">
            <div className="flex lg:hidden items-center gap-2">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${theme.gradient} text-white shadow-md`}>
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-lg text-slate-900 dark:text-white">MuTeX</span>
            </div>
            <div className="hidden lg:block" />
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="my-auto max-w-md w-full mx-auto space-y-8 pt-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
                Faculty Sign In
              </h2>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-3">
              <Info className="w-4.5 h-4.5 text-slate-400 mt-0.5" />
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                <span>FACULTY login verification requires standard accounts ending with <strong className={theme.textAccent}>@gmail.com</strong></span>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Organization Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input type="text" value={email} onChange={handleEmailChange} placeholder="yourname@gmail.com" className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 focus:outline-none focus:ring-2 focus:ring-opacity-35 transition-all text-sm font-semibold ${theme.borderFocus}`} />
                </div>
                <AnimatePresence>
                  {emailError && (
                    <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 dark:text-rose-400">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{emailError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Security Password</label>
                  <Link to="/faculty-forgot-password" className={`text-[11px] font-bold hover:underline cursor-pointer ${theme.textAccent}`}>Forgot Password?</Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 focus:outline-none focus:ring-2 focus:ring-opacity-35 transition-all text-sm font-semibold ${theme.borderFocus}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className={`w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-opacity-25 bg-slate-100 dark:bg-slate-900`} />
                  Remember identity info
                </label>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all cursor-pointer hover:brightness-105 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none ${theme.primaryBtn}`}>
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify & Log In <ArrowRight className="w-4.5 h-4.5" /></>}
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/60">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Quick-Testing Credentials Helper
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleQuickFill} className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-500/5 dark:hover:bg-emerald-950/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Faculty Quickfill
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
            </div>

            <div className="text-center pt-2">
              <Link to="/student-login" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Student Login
              </Link>
            </div>

          </div>

          <div className="block lg:hidden text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-6">
            &copy; 2026 MuTeX Inc. Powered by React & Tailwind.
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={handleCloseToast} />
    </div>
  );
}
