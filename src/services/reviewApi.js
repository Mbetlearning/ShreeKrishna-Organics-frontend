
import { apiRequest } from "./api";

// Public APIs — approved reviews only
export const getProductReviews = (productId) =>
  apiRequest(`products/${productId}/reviews`, {
    auth: false,
  });

export const getReviewSummary = (productId) =>
  apiRequest(`products/${productId}/reviews/summary`, {
    auth: false,
  });

// Admin APIs — valid Admin JWT required
export const getAdminReviews = (productId) =>
  apiRequest(`admin/reviews/product/${productId}`);

export const getAdminReviewById = (reviewId) =>
  apiRequest(`admin/reviews/${reviewId}`);

export const addReview = (data) =>
  apiRequest("admin/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateReview = (reviewId, data) =>
  apiRequest(`admin/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteReview = (reviewId) =>
  apiRequest(`admin/reviews/${reviewId}`, {
    method: "DELETE",
  });

export const approveReview = (reviewId) =>
  apiRequest(`admin/reviews/${reviewId}/approve`, {
    method: "PATCH",
  });

export const rejectReview = (reviewId) =>
  apiRequest(`admin/reviews/${reviewId}/reject`, {
    method: "PATCH",
  });
