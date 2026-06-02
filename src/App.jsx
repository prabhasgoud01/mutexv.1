import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import AdminLogin from './pages/AdminLogin';
import SuperAdminForgotPassword from './pages/SuperAdminForgotPassword';
import SuperAdminResetPassword from './pages/SuperAdminResetPassword';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import FacultyForgotPassword from './pages/FacultyForgotPassword';
import FacultyResetPassword from './pages/FacultyResetPassword';
import StudentForgotPassword from './pages/StudentForgotPassword';
import StudentResetPassword from './pages/StudentResetPassword';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './components/Dashboard';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';



// Proper Dashboard Wrapper
import { AuthContext } from './context/AuthContext';
const DashboardView = () => {
  const { user, logout } = React.useContext(AuthContext);
  
  if (user?.role === 'superadmin') {
    return <SuperAdminDashboard user={user} onLogout={logout} />;
  }
  
  return <Dashboard user={user} onLogout={logout} />;
};


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/student-login" replace />} />

          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          <Route path="/super-admin-forgot-password" element={<SuperAdminForgotPassword />} />
          <Route path="/super-admin-reset-password/:token" element={<SuperAdminResetPassword />} />
          <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin-reset-password/:token" element={<AdminResetPassword />} />
          <Route path="/faculty-forgot-password" element={<FacultyForgotPassword />} />
          <Route path="/faculty-reset-password/:token" element={<FacultyResetPassword />} />
          <Route path="/student-forgot-password" element={<StudentForgotPassword />} />
          <Route path="/student-reset-password/:token" element={<StudentResetPassword />} />

          <Route path="/change-password" element={<ChangePassword />} />

          {/* Dashboards */}
          <Route
            path="/dashboard/super-admin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <DashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardView />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/student-login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
