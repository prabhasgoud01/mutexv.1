import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import AdminLogin from './pages/AdminLogin';
import StudentSignup from './pages/StudentSignup';
import FacultySignup from './pages/FacultySignup';
import AdminSignup from './pages/AdminSignup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './components/Dashboard';



// Proper Dashboard Wrapper
import { AuthContext } from './context/AuthContext';
const DashboardView = () => {
  const { user, logout } = React.useContext(AuthContext);
  return <Dashboard user={user} onLogout={logout} />;
};


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/student-login" replace />} />

          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/faculty-signup" element={<FacultySignup />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Dashboards */}
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
