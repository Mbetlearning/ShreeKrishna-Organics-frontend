
import {
  getValidToken,
  clearAuthSession,
  AUTH_TOKEN_KEY,
} from "../../services/api";

// Backend offer endpoints use /api/v1.
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1"
)
  .replace(/\/+$/, "")
  ;

// Common request function for Admin Offer APIs.
async function offerRequest(endpoint, options = {}) {
  const token = getValidToken();

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const headers = new Headers(options.headers || {});

  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body != null &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend server. Please check your connection."
    );
  }

  // Clear session only if the rejected token
  // is still the currently stored token.
  if (response.status === 401) {
    if (localStorage.getItem(AUTH_TOKEN_KEY) === token) {
      clearAuthSession();
    }
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();

      message =
        data.message ||
        data.detail ||
        data.error ||
        message;
    } catch {
      // Keep default HTTP error message.
    }

    const error = new Error(
      typeof message === "string"
        ? message
        : `Request failed (${response.status})`
    );

    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid JSON response.");
  }
}

// =======================================
// ADMIN HOT DEALS / PRODUCT OFFERS APIs
// =======================================

export const adminOfferService = {
  // GET /api/admin/offers
  getAll() {
    return offerRequest("/admin/offers");
  },

  // GET /api/admin/offers/{id}
  getById(id) {
    return offerRequest(`/admin/offers/${id}`);
  },

  // GET /api/admin/offers/product/{productId}
  getByProduct(productId) {
    return offerRequest(`/admin/offers/product/${productId}`);
  },

  // POST /api/admin/offers
  create(data) {
    return offerRequest("/admin/offers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/offers/{id}
  update(id, data) {
    return offerRequest(`/admin/offers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/admin/offers/{id}/activate
  activate(id) {
    return offerRequest(`/admin/offers/${id}/activate`, {
      method: "PATCH",
    });
  },

  // PATCH /api/admin/offers/{id}/deactivate
  deactivate(id) {
    return offerRequest(`/admin/offers/${id}/deactivate`, {
      method: "PATCH",
    });
  },
};
