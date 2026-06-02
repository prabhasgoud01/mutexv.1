import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/admin-forgot-password', { email });
      setSuccess(true);
      setToast({ show: true, message: data.message || 'Reset link sent to your email', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to send reset link', type: 'error' });
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
        <p className="mt-2 text-center text-sm text-slate-500">Recover your platform access</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Account Email</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-3 bg-white border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm" placeholder="admin@college.edu" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Send Recovery Link <ArrowRight className="w-5 h-5 ml-2" /></>}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-emerald-500 text-lg font-medium">Recovery email sent successfully.</div>
              <p className="text-sm text-slate-500">Please check your inbox for the reset link. It expires in 15 minutes.</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/admin-login" className="text-sm font-medium text-rose-500 hover:text-rose-400 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
