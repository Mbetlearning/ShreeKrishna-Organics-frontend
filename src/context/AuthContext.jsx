
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  authService,
  normalizeRole,
} from '../services/authService';

import { AUTH_CHANGED_EVENT } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { addToast } = useToast();

  const [user, setUser] = useState(
    () => authService.getCurrentUser()
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener('storage', syncSession);
    window.addEventListener('focus', syncSession);

    const interval = window.setInterval(syncSession, 30000);

    return () => {
      window.removeEventListener(
        AUTH_CHANGED_EVENT,
        syncSession
      );
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('focus', syncSession);
      window.clearInterval(interval);
    };
  }, []);

  // Existing Email + Password Login
  // Admin can call login(email, password, 'ADMIN').
  const login = async (
    email,
    password,
    expectedRole = 'CUSTOMER'
  ) => {
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      const actualRole = normalizeRole(response.user.role);
      const requiredRole = normalizeRole(expectedRole);

      if (requiredRole && actualRole !== requiredRole) {
        throw new Error(
          `This account cannot sign in to the ${requiredRole.toLowerCase()} portal.`
        );
      }

      authService.saveSession(response);
      setUser(response.user);

      addToast(
        `Welcome back, ${response.user.firstName || 'User'}!`
      );

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');

      return {
        success: false,
        error: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // New Customer Mobile OTP Login
  // Backend must verify OTP before issuing JWT.
  const loginWithOtp = async (verificationData) => {
    setLoading(true);

    try {
      const response = await authService.loginWithOtp(
        verificationData
      );

      if (normalizeRole(response.user.role) !== 'CUSTOMER') {
        throw new Error(
          'OTP login is available only for customers.'
        );
      }

      authService.saveSession(response);
      setUser(response.user);

      addToast('Mobile number verified. Login successful!');

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      addToast(
        error.message || 'OTP verification failed',
        'error'
      );

      return {
        success: false,
        error: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);

    try {
      const response = await authService.register(userData);

      addToast('Registration successful! Please sign in.');

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error');

      return {
        success: false,
        error: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const hasRole = (...roles) =>
    !!user &&
    roles.some(
      (role) =>
        normalizeRole(role) === normalizeRole(user.role)
    );

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithOtp,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
