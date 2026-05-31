import React, { useState, useEffect } from 'react';
import StudentDashboard from './dashboard/StudentDashboard';
import FacultyDashboard from './dashboard/FacultyDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

export default function Dashboard({ user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Switch role dashboards into isolated modules
  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={onLogout} currentTime={currentTime} />;
  } else if (user.role === 'faculty') {
    return <FacultyDashboard user={user} onLogout={onLogout} currentTime={currentTime} />;
  } else {
    return <StudentDashboard user={user} onLogout={onLogout} currentTime={currentTime} />;
  }
}
