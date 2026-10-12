
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
)
  .replace(/\/+$/, "");

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

  // GET /api/categories
  getCategories() {
    return productRequest("/categories");
  },

  // GET /api/categories/{id}
  getCategoryById(id) {
    return productRequest(`/categories/${id}`);
  },

  // =========================
  // PRODUCT APIs
  // =========================

  // GET /api/products
  getAll() {
    return productRequest("/products");
  },

  // GET /api/products/{id}
  getById(id) {
    return productRequest(`/products/${id}`);
  },

  // GET /api/products/featured
  getFeatured() {
    return productRequest("/products/featured");
  },

  // GET /api/products/category/{categoryId}
  getByCategory(categoryId) {
    return productRequest(
      `/products/category/${categoryId}`
    );
  },

  // POST /api/admin/products
  create(data) {
    return productRequest("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/products/{id}
  update(id, data) {
    return productRequest(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/products/{id}
  delete(id) {
    return productRequest(`/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  // =========================
  // PRODUCT IMAGE APIs
  // =========================

  // GET /api/products/{productId}/images
  getImages(productId) {
    return productRequest(
      `/products/${productId}/images`
    );
  },

  // POST /api/admin/products/{productId}/images
  uploadImage(productId, file) {
    const formData = new FormData();
    formData.append("file", file);

    return productRequest(
      `/admin/products/${productId}/images`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  // PATCH /api/admin/products/{productId}/images/{imageId}/primary
  setPrimaryImage(productId, imageId) {
    return productRequest(
      `/admin/products/${productId}/images/${imageId}/primary`,
      {
        method: "PATCH",
      }
    );
  },

  // DELETE /api/admin/products/{productId}/images/{imageId}
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

  // GET /api/products/{productId}/variants
  getVariants(productId) {
    return productRequest(
      `/products/${productId}/variants`
    );
  },

  // POST /api/admin/product-variants
  createVariant(data) {
    return productRequest(
      "/admin/product-variants",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // PUT /api/admin/product-variants/{id}
  updateVariant(id, data) {
    return productRequest(
      `/admin/product-variants/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  // DELETE /api/admin/product-variants/{id}
  deleteVariant(id) {
    return productRequest(
      `/admin/product-variants/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
