
import { apiRequest } from "./api";

/* =========================================================
   SHREEKRISHNA ORGANICS - BLOG API SERVICE
   Backend Base URL: http://localhost:8080/api/v1
========================================================= */

const ADMIN_BLOGS_ENDPOINT = "/admin/blogs";
const PUBLIC_BLOGS_ENDPOINT = "/blogs";

/* =========================================================
   PUBLIC BLOG APIs
   No authentication required
========================================================= */

// GET all published blogs
export const getPublishedBlogs = async () => {
  return apiRequest(PUBLIC_BLOGS_ENDPOINT, {
    method: "GET",
    auth: false,
  });
};

// GET published blog by slug
export const getBlogBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Blog slug is required.");
  }

  return apiRequest(
    `${PUBLIC_BLOGS_ENDPOINT}/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      auth: false,
    }
  );
};

/* =========================================================
   ADMIN BLOG APIs
   ADMIN JWT authentication required
========================================================= */

// GET all blogs (DRAFT + PUBLISHED)
export const getAllAdminBlogs = async () => {
  return apiRequest(ADMIN_BLOGS_ENDPOINT, {
    method: "GET",
  });
};

// GET a single blog by ID
export const getAdminBlogById = async (id) => {
  if (id == null) {
    throw new Error("Blog ID is required.");
  }

  return apiRequest(`${ADMIN_BLOGS_ENDPOINT}/${id}`, {
    method: "GET",
  });
};

// CREATE a new blog (saved as DRAFT)
export const createBlog = async (blogData) => {
  return apiRequest(ADMIN_BLOGS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(blogData),
  });
};

// UPDATE an existing blog
export const updateBlog = async (id, blogData) => {
  if (id == null) {
    throw new Error("Blog ID is required.");
  }

  return apiRequest(`${ADMIN_BLOGS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(blogData),
  });
};

// PUBLISH a blog
export const publishBlog = async (id) => {
  if (id == null) {
    throw new Error("Blog ID is required.");
  }

  return apiRequest(
    `${ADMIN_BLOGS_ENDPOINT}/${id}/publish`,
    {
      method: "PATCH",
    }
  );
};

// MOVE a published blog back to DRAFT
export const moveBlogToDraft = async (id) => {
  if (id == null) {
    throw new Error("Blog ID is required.");
  }

  return apiRequest(
    `${ADMIN_BLOGS_ENDPOINT}/${id}/draft`,
    {
      method: "PATCH",
    }
  );
};

// DELETE a blog
export const deleteBlog = async (id) => {
  if (id == null) {
    throw new Error("Blog ID is required.");
  }

  return apiRequest(`${ADMIN_BLOGS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
};

/* =========================================================
   CLOUDINARY BLOG IMAGE UPLOAD
========================================================= */

export const uploadBlogImage = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Please select a valid image file.");
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

  const maxFileSize = 5 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("Image size must be 5MB or less.");
  }

  if (file.size === 0) {
    throw new Error("Selected image is empty.");
  }

  const formData = new FormData();

  // Backend expects @RequestParam("file")
  formData.append("file", file);

  // Do not manually set Content-Type for FormData.
  // The browser adds multipart/form-data boundary automatically.
  return apiRequest(`${ADMIN_BLOGS_ENDPOINT}/images`, {
    method: "POST",
    body: formData,
  });
};

/* =========================================================
   BLOG API OBJECT
   Optional convenient usage
========================================================= */

export const blogApi = {
  getPublishedBlogs,
  getBlogBySlug,
  getAllAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  publishBlog,
  moveBlogToDraft,
  deleteBlog,
  uploadBlogImage,
};

export default blogApi;
