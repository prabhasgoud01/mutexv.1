import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Terminal, UserPlus } from 'lucide-react';
import Toast from '../components/Toast';
import api from '../services/api';

export default function SuperAdminSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in as superadmin
  useEffect(() => {
    if (user && user.role === 'superadmin') {
      navigate('/dashboard/super-admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/superadmin/signup', { name, email, password });
      
      if (response.status === 201) {
        setToast({ show: true, message: 'Registration successful! Please log in.', type: 'success' });
        setTimeout(() => {
          navigate('/super-admin-login');
        }, 1500);
      }
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Registration failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="absolute -left-48 top-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob"></div>
        <div className="absolute -right-48 top-3/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform hover:scale-105 transition-transform duration-300">
          <Terminal className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Super Admin Setup
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Register a new master account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-[0_0_40px_-15px_rgba(79,70,229,0.3)] sm:rounded-2xl sm:px-10 border border-slate-800/50">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="System Administrator"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                System Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="admin@system.local"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Security Passkey
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Confirm Security Passkey
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register Account
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4" />
              <span>Platform-wide access controls are active.</span>
            </div>
            <div className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/super-admin-login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Toast
        toast={toast}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
