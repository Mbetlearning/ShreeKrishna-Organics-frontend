/**
 * AUTHENTICATION SERVICE (DEMO / MOCK AUTH)
 * 
 * NOTE FOR SPRING BOOT DEVELOPER:
 * In a real backend setup, these methods will send HTTP POST requests
 * to Spring Security endpoints:
 *   POST /api/auth/login     -> returns { token: "jwt...", user: { id, name, email } }
 *   POST /api/auth/register  -> returns { token: "jwt...", user: { id, name, email } }
 *   GET  /api/auth/me        -> returns { user: { ... } }
 */

import { simulateLatency } from './api';

const AUTH_USER_KEY = 'prakriti_auth_user';
const AUTH_TOKEN_KEY = 'prakriti_auth_token';

// Initial demo user for quick testing
const DEMO_USER = {
  id: "USR-101",
  name: "Priya Sundaram",
  email: "priya.s@example.com",
  phone: "+91 98765 43210",
  address: "Flat 402, Green Meadows, 12th Main Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038"
};

export const authService = {
  /**
   * Log in user with email & password
   */
  async login(email, password) {
    await simulateLatency(250);

    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    // Check if user exists in demo storage or match demo credentials
    const storedUsers = JSON.parse(localStorage.getItem('prakriti_demo_accounts') || '[]');
    let matchedUser = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      // Default to demo user with entered email
      matchedUser = {
        ...DEMO_USER,
        email: email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
    }

    const mockToken = `jwt_mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(matchedUser));
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

    return { user: matchedUser, token: mockToken };
  },

  /**
   * Register a new customer
   */
  async register(userData) {
    await simulateLatency(300);

    const { name, email, phone, password } = userData;

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required.");
    }

    const newUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone: phone || "+91 98000 00000",
      address: userData.address || "",
      city: userData.city || "",
      state: userData.state || "",
      pincode: userData.pincode || ""
    };

    // Save to demo accounts array
    const storedUsers = JSON.parse(localStorage.getItem('prakriti_demo_accounts') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('prakriti_demo_accounts', JSON.stringify(storedUsers));

    const mockToken = `jwt_mock_token_${Date.now()}`;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

    return { user: newUser, token: mockToken };
  },

  /**
   * Log out user
   */
  async logout() {
    await simulateLatency(100);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  },

  /**
   * Get current authenticated user from storage
   */
  getCurrentUser() {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get current auth token
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Demo convenience helper
   */
  getDemoCredentials() {
    return {
      email: DEMO_USER.email,
      password: "password123"
    };
  }
};
