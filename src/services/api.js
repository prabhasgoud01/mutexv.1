import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic for dealing with unauthorized access (e.g., redirect to login)
      // Usually done via context or custom event, handled at the App level
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
