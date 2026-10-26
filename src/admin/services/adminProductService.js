import {
  getValidToken,
  clearAuthSession,
  AUTH_TOKEN_KEY,
} from "../../services/api";

// Shared API defaults to /api/v1.
// Product and Category Controllers use /api.
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1"
).replace(/\/+$/, "");

async function productRequest(endpoint, options = {}) {
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
  // is still the current token.
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

export const adminProductService = {
  // =========================
  // CATEGORY APIs
  // =========================

  getCategories() {
    return productRequest("/categories");
  },

  getCategoryById(id) {
    return productRequest(`/categories/${id}`);
  },

  // =========================
  // PRODUCT APIs
  // =========================

  getAll() {
    return productRequest("/products");
  },

  getById(id) {
    return productRequest(`/products/${id}`);
  },

  getFeatured() {
    return productRequest("/products/featured");
  },

  getByCategory(categoryId) {
    return productRequest(
      `/products/category/${categoryId}`
    );
  },

  create(data) {
    return productRequest("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return productRequest(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return productRequest(`/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  // =========================
  // PRODUCT IMAGE APIs
  // =========================

  // Get normal and variant-specific images.
  // Response includes variantId.
  getImages(productId) {
    return productRequest(
      `/products/${productId}/images`
    );
  },

  /*
   * Upload normal product image OR variant image.
   *
   * Normal image:
   * uploadImage(productId, file)
   *
   * Variant image:
   * uploadImage(productId, file, variantId)
   *
   * Backend handles replacing existing variant images.
   */
  uploadImage(productId, file, variantId = null) {
    const formData = new FormData();

    formData.append("file", file);

    if (variantId !== null && variantId !== undefined) {
      formData.append("variantId", String(variantId));
    }

    return productRequest(
      `/admin/products/${productId}/images`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  // Set primary image.
  // Backend allows only normal product images.
  setPrimaryImage(productId, imageId) {
    return productRequest(
      `/admin/products/${productId}/images/${imageId}/primary`,
      {
        method: "PATCH",
      }
    );
  },

  // Delete normal or variant-specific image.
  deleteImage(productId, imageId) {
    return productRequest(
      `/admin/products/${productId}/images/${imageId}`,
      {
        method: "DELETE",
      }
    );
  },

  // =========================
  // PRODUCT VARIANT APIs
  // =========================

  getVariants(productId) {
    return productRequest(
      `/products/${productId}/variants`
    );
  },

  createVariant(data) {
    return productRequest(
      "/admin/product-variants",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateVariant(id, data) {
    return productRequest(
      `/admin/product-variants/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteVariant(id) {
    return productRequest(
      `/admin/product-variants/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};