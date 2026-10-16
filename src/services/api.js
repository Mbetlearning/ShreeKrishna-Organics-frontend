
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1"
)
  .replace(/\/+$/, "")
  .replace(/(?:\/v1)+$/, "/v1");

export const AUTH_TOKEN_KEY = "prakriti_auth_token";
export const AUTH_USER_KEY = "prakriti_auth_user";
export const AUTH_CHANGED_EVENT = "shreekrishna:auth-changed";

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function isTokenExpired(token) {
  if (!token || token.startsWith("jwt_mock_token_")) {
    return true;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return true;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(atob(base64));

    if (typeof payload.exp !== "number") {
      return true;
    }

    // Consider the token expired 30 seconds early.
    return Date.now() >= payload.exp * 1000 - 30000;
  } catch {
    return true;
  }
}

export function getValidToken() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
}

export async function apiRequest(endpoint, options = {}) {
  const {
    auth = true,
    responseType = "json",
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  const token = auth ? getValidToken() : null;

  const headers = new Headers(customHeaders);

  if (
    fetchOptions.body != null &&
    !(fetchOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Remove duplicate API version from endpoint if present.
  const cleanEndpoint = String(endpoint)
    .replace(/^\/+/, "")
    .replace(/^(?:api\/)?v1\//, "");

  const url = `${BASE_URL}/${cleanEndpoint}`;

  

  let response;

  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please check your connection."
    );
  }

  // Clear the current session only if its token receives 401.
  if (response.status === 401 && token) {
    if (localStorage.getItem(AUTH_TOKEN_KEY) === token) {
      clearAuthSession();
    }
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const errorData = await response.json();

      message =
        errorData.message ||
        errorData.detail ||
        errorData.error ||
        message;

      if (typeof message !== "string") {
        message = `Request failed (${response.status})`;
      }
    } catch {
      // Keep the HTTP status message.
    }

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  if (responseType === "blob") {
    return response.blob();
  }

  if (responseType === "text") {
    return response.text();
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

// Retained for existing demo services.
// Do not use for real authentication.
export const simulateLatency = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));
