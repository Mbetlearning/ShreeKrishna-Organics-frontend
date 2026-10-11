
import {
  apiRequest,
  AUTH_USER_KEY,
  AUTH_TOKEN_KEY,
  clearAuthSession,
  getValidToken,
  AUTH_CHANGED_EVENT,
} from './api';

export const normalizeRole = (role) =>
  String(role || '')
    .replace(/^ROLE_/i, '')
    .toUpperCase();

export const authService = {
  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (!data?.accessToken) {
      throw new Error('Backend did not return an access token.');
    }

    const role = normalizeRole(data.role);

    if (!role) {
      throw new Error('Backend did not return a user role.');
    }

    const user = {
      id: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      name: [data.firstName, data.lastName]
        .filter(Boolean)
        .join(' '),
      email: data.email,
      role,
    };

    return {
      user,
      token: data.accessToken,
    };
  },

  saveSession({ user, token }) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  },

  async register(userData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        mobile: userData.phone.replace(/\D/g, ''),
        password: userData.password,
      }),
    });

    return { user: response };
  },

  async logout() {
    clearAuthSession();
    return true;
  },

  getCurrentUser() {
    const token = getValidToken();
    const savedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !savedUser) return null;

    try {
      const user = JSON.parse(savedUser);

      if (!user?.role || !user?.email) {
        clearAuthSession();
        return null;
      }

      return {
        ...user,
        role: normalizeRole(user.role),
      };
    } catch {
      clearAuthSession();
      return null;
    }
  },

  getToken() {
    return getValidToken();
  },
};
