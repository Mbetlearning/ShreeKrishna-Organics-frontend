
/* =========================================================
   SHREEKRISHNA ORGANICS - COMMON API SERVICE
========================================================= */

const configuredBaseUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1";

const normalizedBaseUrl = configuredBaseUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/(?:\/v1)+$/, "/v1");

const BASE_URL = /\/api\/v1$/.test(normalizedBaseUrl)
  ? normalizedBaseUrl
  : /\/api$/.test(normalizedBaseUrl)
    ? `${normalizedBaseUrl}/v1`
    : `${normalizedBaseUrl}/api/v1`;

/* =========================================================
   AUTHENTICATION STORAGE
========================================================= */

export const AUTH_TOKEN_KEY = "prakriti_auth_token";
export const AUTH_USER_KEY = "prakriti_auth_user";

export const AUTH_CHANGED_EVENT =
  "shreekrishna:auth-changed";

/* =========================================================
   CLEAR AUTH SESSION
========================================================= */

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);

  window.dispatchEvent(
    new Event(AUTH_CHANGED_EVENT)
  );
}

/* =========================================================
   JWT TOKEN EXPIRY CHECK
========================================================= */

export function isTokenExpired(token) {
  if (
    !token ||
    typeof token !== "string" ||
    token.startsWith("jwt_mock_token_")
  ) {
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

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const payload = JSON.parse(
      atob(paddedBase64)
    );

    if (typeof payload.exp !== "number") {
      return true;
    }

    // Consider token expired 30 seconds early.
    return Date.now() >= payload.exp * 1000 - 30000;
  } catch {
    return true;
  }
}

/* =========================================================
   GET VALID JWT TOKEN
========================================================= */

export function getValidToken() {
  const token = localStorage.getItem(
    AUTH_TOKEN_KEY
  );

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
}

/* =========================================================
   NORMALIZE API ENDPOINT
========================================================= */

function normalizeEndpoint(endpoint) {
  return String(endpoint || "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/^(?:api\/)?v1(?:\/|$)/, "");
}

/* =========================================================
   COMMON API REQUEST

   Supports:
   - GET, POST, PUT, PATCH, DELETE
   - JWT Authorization
   - JSON Requests
   - FormData / Image Upload
   - Blob / PDF Responses
   - Text Responses
   - Error Handling
========================================================= */

export async function apiRequest(
  endpoint,
  options = {}
) {
  const {
    auth = true,
    responseType = "json",
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  const token = auth ? getValidToken() : null;

  /* =======================================================
     AUTHENTICATION CHECK
  ======================================================= */

  if (auth && !token) {
    const error = new Error(
      "Your session has expired. Please log in again."
    );

    error.status = 401;
    throw error;
  }

  /* =======================================================
     REQUEST HEADERS
  ======================================================= */

  const headers = new Headers(customHeaders);

  const body = fetchOptions.body;

  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  // Let browser set multipart boundary automatically.
  if (isFormData) {
    headers.delete("Content-Type");
  } else if (
    body != null &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  /* =======================================================
     ACCEPT HEADER

     PDF download  -> application/pdf
     Text response -> text/plain
     JSON response -> application/json
  ======================================================= */

  if (!headers.has("Accept")) {
    if (responseType === "blob") {
      headers.set(
        "Accept",
        "application/pdf"
      );
    } else if (responseType === "text") {
      headers.set(
        "Accept",
        "text/plain"
      );
    } else {
      headers.set(
        "Accept",
        "application/json"
      );
    }
  }

  /* =======================================================
     JWT AUTHORIZATION HEADER
  ======================================================= */

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  /* =======================================================
     BUILD API URL
  ======================================================= */

  const cleanEndpoint =
    normalizeEndpoint(endpoint);

  const url = cleanEndpoint
    ? `${BASE_URL}/${cleanEndpoint}`
    : BASE_URL;

  /* =======================================================
     SEND REQUEST
  ======================================================= */

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

  /* =======================================================
     HANDLE UNAUTHORIZED RESPONSE
  ======================================================= */

  if (response.status === 401 && token) {
    if (
      localStorage.getItem(AUTH_TOKEN_KEY) === token
    ) {
      clearAuthSession();
    }
  }

  /* =======================================================
     HANDLE API ERRORS
  ======================================================= */

  if (!response.ok) {
    let message =
      `Request failed (${response.status})`;

    try {
      const errorData = await response.json();

      message =
        errorData.message ||
        errorData.detail ||
        errorData.error ||
        message;

      if (typeof message !== "string") {
        message =
          `Request failed (${response.status})`;
      }

      if (
        response.status === 500 &&
        message === "An unexpected error occurred"
      ) {
        message =
          "Server error occurred. Please check backend logs.";
      }
    } catch {
      // Keep the HTTP status message.
    }

    const error = new Error(message);

    error.status = response.status;
    error.url = url;

    throw error;
  }

  /* =======================================================
     HANDLE EMPTY RESPONSE
  ======================================================= */

  if (response.status === 204) {
    return null;
  }

  /* =======================================================
     BLOB / PDF RESPONSE
  ======================================================= */

  if (responseType === "blob") {
    return response.blob();
  }

  /* =======================================================
     TEXT RESPONSE
  ======================================================= */

  if (responseType === "text") {
    return response.text();
  }

  /* =======================================================
     JSON RESPONSE
  ======================================================= */

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Server returned an invalid JSON response."
    );
  }
}

/* =========================================================
   PUBLIC API HELPER
========================================================= */

export function publicApiRequest(
  endpoint,
  options = {}
) {
  return apiRequest(endpoint, {
    ...options,
    auth: false,
  });
}

/* =========================================================
   IMAGE UPLOAD HELPER
   Works with Cloudinary-backed backend endpoints
========================================================= */

export async function uploadImageRequest(
  endpoint,
  file
) {
  if (
    typeof File === "undefined" ||
    !(file instanceof File)
  ) {
    throw new Error(
      "Please select a valid image file."
    );
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG and WEBP images are allowed."
    );
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size === 0) {
    throw new Error(
      "Selected image is empty."
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      "Image size must be 5MB or less."
    );
  }

  const formData = new FormData();

  // Backend expects @RequestParam("file")
  formData.append("file", file);

  return apiRequest(endpoint, {
    method: "POST",
    body: formData,
  });
}

/* =========================================================
   BLOG IMAGE UPLOAD HELPER
========================================================= */

export function uploadBlogImageRequest(file) {
  return uploadImageRequest(
    "/admin/blogs/images",
    file
  );
}

/* =========================================================
   DEMO SERVICE SUPPORT
========================================================= */

export const simulateLatency = (ms = 250) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
