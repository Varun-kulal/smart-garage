import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default baseURL for backend API
  axios.defaults.baseURL = 'http://localhost:5001/api';

  useEffect(() => {
    // If token exists, set default headers and fetch current user profile
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post('/auth/user/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.data);
        return { success: true, role: res.data.data.role };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const loginGarageManager = async (garageId) => {
    try {
      const res = await axios.post('/auth/garage/login', { garageId });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.data);
        return { success: true, role: res.data.data.role };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Garage login failed. Ensure a manager is assigned.'
      };
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const res = await axios.post('/auth/admin/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.data);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin login failed. Please check your credentials.'
      };
    }
  };

  const loginStaff = async (email, password) => {
    try {
      const res = await axios.post('/auth/staff/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.data);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Staff login failed. Please check your credentials.'
      };
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password, phone, role });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.data);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (formData) => {
    try {
      // Send multipart form-data for uploads support
      const res = await axios.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setUser(res.data.data);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Profile update failed.'
      };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.put('/auth/change-password', { oldPassword, newPassword });
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Password update failed.'
      };
    }
  };

  const resetPassword = async (email, code, newPassword, role) => {
    try {
      const res = await axios.post('/auth/reset-password', { email, code, newPassword, role });
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Reset password failed.'
      };
    }
  };

  const forgotPassword = async (email, role) => {
    try {
      const res = await axios.post('/auth/forgot-password', { email, role });
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Email recovery request failed.'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    loginUser,
    loginAdmin,
    loginGarageManager,
    loginStaff,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
