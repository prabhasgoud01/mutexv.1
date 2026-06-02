import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function SuperAdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/super-admin-forgot-password', { email });
      setSuccess(true);
      setToast({ show: true, message: data.message || 'Reset link sent to your email', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to send reset link', type: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Super Admin</h2>
        <p className="mt-2 text-center text-sm text-slate-400">Recover your platform access</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-800/50">
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-300">System Email</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-3 bg-slate-950/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="admin@system.local" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Send Recovery Link <ArrowRight className="w-5 h-5 ml-2" /></>}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-emerald-400 text-lg font-medium">Recovery email sent successfully.</div>
              <p className="text-sm text-slate-400">Please check your inbox for the reset link. It expires in 15 minutes.</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/super-admin-login" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Terminal
            </Link>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
