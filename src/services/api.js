/**
 * ============================================================================
 * CENTRAL API SERVICE (PRE-CONFIGURED FOR SPRING BOOT REST BACKEND)
 * ============================================================================
 * 
 * Future Spring Boot Backend Configuration:
 * -----------------------------------------
 * When your Java Spring Boot backend is ready, you can update BASE_URL:
 *   const BASE_URL = 'http://localhost:8080/api';
 * 
 * Typical Spring Boot Controller endpoints:
 *   - Auth:    POST /api/auth/login, POST /api/auth/register, GET /api/auth/me
 *   - Product: GET /api/products, GET /api/products/{id}, GET /api/products/slug/{slug}
 *   - Orders:  POST /api/orders, GET /api/orders/my-orders, GET /api/orders/{id}
 *   - Payment: POST /api/payment/create-order, POST /api/payment/verify
 * 
 * Token Authentication:
 *   The helper automatically includes JWT Bearer tokens from localStorage
 *   in the Authorization header if available.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Generic HTTP Request Wrapper
 * (Can easily be swapped with Axios or kept as lightweight native fetch)
 */
export async function apiRequest(endpoint, options = {}) {
  // Retrieve demo/stored JWT token from localStorage if user is logged in
  const token = localStorage.getItem('prakriti_auth_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    }
  };

  try {
    // In demo mode without active backend, mock fallback is handled in services
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Log helpful debugging information for development
    // console.warn(`[API] Fetch failed for ${endpoint}. Falling back to demo mock data.`, error.message);
    throw error;
  }
}

/**
 * Utility helper to simulate network latency for realistic demo UX
 */
export const simulateLatency = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));
