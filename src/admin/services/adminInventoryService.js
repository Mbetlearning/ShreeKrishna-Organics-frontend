
import {
  getValidToken,
  clearAuthSession,
  AUTH_TOKEN_KEY,
} from "../../services/api";

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1"
).replace(/\/+$/, "").replace(/\/v1$/, "");

async function inventoryRequest(endpoint, options = {}) {
  const token = getValidToken();

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body != null && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Cannot connect to the backend server.");
  }

  if (
    response.status === 401 &&
    localStorage.getItem(AUTH_TOKEN_KEY) === token
  ) {
    clearAuthSession();
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.message || data.detail || data.error || message;
    } catch {
      // Keep the HTTP status message.
    }

    const error = new Error(
      typeof message === "string"
        ? message
        : `Request failed (${response.status})`
    );

    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid JSON response.");
  }
}

function validVariantId(variantId) {
  const id = Number(variantId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("A valid Variant ID is required.");
  }

  return id;
}

function validQuantity(quantity, allowZero = false) {
  const value = Number(quantity);

  if (
    !Number.isSafeInteger(value) ||
    value < (allowZero ? 0 : 1) ||
    value > 2147483647
  ) {
    throw new Error(
      allowZero
        ? "Stock quantity must be a non-negative whole number."
        : "Stock quantity must be a positive whole number."
    );
  }

  return value;
}

export const adminInventoryService = {
  getAvailableStock(variantId) {
    const id = validVariantId(variantId);

    return inventoryRequest(
      `/v1/inventory/variants/${id}/available`
    );
  },

  createInventory(variantId, quantity) {
    const id = validVariantId(variantId);

    return inventoryRequest(
      `/v1/inventory/variants/${id}`,
      {
        method: "POST",
        body: JSON.stringify({
          quantity: validQuantity(quantity, true),
        }),
      }
    );
  },

  addStock(variantId, quantity) {
    const id = validVariantId(variantId);

    return inventoryRequest(
      `/v1/inventory/variants/${id}/add-stock`,
      {
        method: "POST",
        body: JSON.stringify({
          quantity: validQuantity(quantity),
        }),
      }
    );
  },
};
