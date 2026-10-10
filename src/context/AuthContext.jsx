
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { addToast } = useToast();

  const [user, setUser] = useState(
    () => authService.getCurrentUser()
  );

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      setUser(response.user);

      addToast(
        `Welcome back, ${response.user.firstName || 'Customer'}!`
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

  const register = async (userData) => {
  setLoading(true);
  try {
    const response = await authService.register(userData);
    addToast('Registration successful! Please sign in.');
    return { success: true, user: response.user };
  } catch (error) {
    addToast(error.message || 'Registration failed', 'error');
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    await authService.logout();
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
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
