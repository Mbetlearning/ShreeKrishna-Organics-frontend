
import {
  getValidToken,
  clearAuthSession,
  AUTH_TOKEN_KEY,
} from "../../services/api";

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1"
)
  .replace(/\/+$/, "");

async function comboRequest(endpoint = "", options = {}) {
  const token = getValidToken();

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE}/admin/combos${endpoint}`,
      { ...options, headers }
    );
  } catch {
    throw new Error("Cannot connect to backend server.");
  }

  if (response.status === 401) {
    if (localStorage.getItem(AUTH_TOKEN_KEY) === token) {
      clearAuthSession();
    }
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.message || data.detail || data.error || message;
    } catch {
      // Keep default error.
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const adminComboService = {
  getAll() {
    return comboRequest();
  },

  getById(id) {
    return comboRequest(`/${id}`);
  },

  create(data) {
    return comboRequest("", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updatePrice(id, price) {
    return comboRequest(`/${id}/price`, {
      method: "PATCH",
      body: JSON.stringify(Number(price)),
    });
  },

  updateDetails(id, name, description) {
    return comboRequest(`/${id}/details`, {
      method: "PATCH",
      body: JSON.stringify({ name, description }),
    });
  },

  updateItems(id, items) {
    return comboRequest(`/${id}/items`, {
      method: "PUT",
      body: JSON.stringify(items),
    });
  },

  activate(id) {
    return comboRequest(`/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivate(id) {
    return comboRequest(`/${id}/deactivate`, {
      method: "PATCH",
    });
  },
};
