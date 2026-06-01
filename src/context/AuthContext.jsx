import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        // No valid session found or token expired
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        delete api.defaults.headers.common['Authorization'];
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();

    // Listen for unauthorized events to automatically logout
    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    };
    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  // Login Function
  const login = async (email, password, portalRole) => {
    try {
      const { data } = await api.post('/auth/login', { email, password, portalRole });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      
      setUser(data);
      return { success: true, user: data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register Function
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      
      setUser(data);
      return { success: true, user: data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
