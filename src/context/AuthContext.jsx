import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('freshcart_token'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('freshcart_token');
    if (savedToken) {
      try {
        return jwtDecode(savedToken);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('freshcart_token', token);
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      localStorage.removeItem('freshcart_token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(ENDPOINTS.SIGNIN, { email, password });
      if (res.data.message === 'success' || res.data.token) {
        setToken(res.data.token);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(ENDPOINTS.SIGNUP, userData);
      if (res.data.message === 'success' || res.data.token) {
        setToken(res.data.token);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('freshcart_token');
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send reset code.',
      };
    }
  };

  const verifyResetCode = async (resetCode) => {
    try {
      const res = await axiosInstance.post(ENDPOINTS.VERIFY_RESET_CODE, { resetCode });
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid or expired reset code.',
      };
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const res = await axiosInstance.put(ENDPOINTS.RESET_PASSWORD, { email, newPassword });
      if (res.data.token) {
        setToken(res.data.token);
      }
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to reset password.',
      };
    }
  };

  const changePassword = async (currentPassword, password, rePassword) => {
    try {
      const res = await axiosInstance.put(ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        password,
        rePassword,
      });
      if (res.data.token) {
        setToken(res.data.token);
      }
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to change password.',
      };
    }
  };

  const updateProfile = async (name, email, phone) => {
    try {
      const res = await axiosInstance.put(ENDPOINTS.UPDATE_ME, { name, email, phone });
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update user details.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userId: user?.id || user?._id || null,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        verifyResetCode,
        resetPassword,
        changePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
