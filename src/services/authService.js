
import { apiRequest } from './api';

const AUTH_USER_KEY = 'prakriti_auth_user';
const AUTH_TOKEN_KEY = 'prakriti_auth_token';

export const authService = {
  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (!data.accessToken) {
      throw new Error('Backend did not return an access token.');
    }

    if (data.role !== 'CUSTOMER') {
      throw new Error('Please sign in using a customer account.');
    }

    const user = {
      id: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      name: [data.firstName, data.lastName]
        .filter(Boolean)
        .join(' '),
      email: data.email,
      role: data.role,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);

    return { user, token: data.accessToken };
  },

  async register(userData) {
    const parts = userData.name.trim().split(/\s+/);

    if (parts.length < 2) {
      throw new Error('Please enter your first and last name.');
    }

    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
        email: userData.email.trim(),
        mobile: (userData.phone || '').replace(/\D/g, ''),
        password: userData.password,
      }),
    });

    return { user: response };
  },

  async logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  },

  getCurrentUser() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const savedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !savedUser || token.startsWith('jwt_mock_token_')) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
