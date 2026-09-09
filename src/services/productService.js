/**
 * PRODUCT SERVICE
 * 
 * Handles all product catalog operations.
 * Currently serves data from src/data/products.js with async simulation.
 * Ready for replacement with:
 *   GET /api/products
 *   GET /api/products/:id
 *   GET /api/products/slug/:slug
 */

import { products } from '../data/products';
import { simulateLatency } from './api';

export const productService = {
  /**
   * Get all products with optional filtering, search, and sorting
   * Future Spring Boot endpoint: GET /api/products?category=x&search=y&sort=z
   */
  async getAllProducts({ category = 'all', search = '', sortBy = 'featured' } = {}) {
    await simulateLatency(150);

    let filtered = [...products];

    // Filter by Category
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by Search Query (name, description, ingredients)
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.seedSource.toLowerCase().includes(q)
      );
    }

    // Sort Products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  },

  /**
   * Get featured products for homepage
   * Future Spring Boot endpoint: GET /api/products/featured
   */
  async getFeaturedProducts() {
    await simulateLatency(100);
    return products.filter(p => p.isFeatured);
  },

  /**
   * Get single product by URL slug
   * Future Spring Boot endpoint: GET /api/products/slug/{slug}
   */
  async getProductBySlug(slug) {
    await simulateLatency(150);
    const item = products.find(p => p.slug === slug);
    if (!item) {
      throw new Error(`Product with slug '${slug}' not found.`);
    }
    return item;
  },

  /**
   * Get single product by ID
   * Future Spring Boot endpoint: GET /api/products/{id}
   */
  async getProductById(id) {
    await simulateLatency(100);
    const item = products.find(p => p.id === Number(id));
    if (!item) {
      throw new Error(`Product with ID '${id}' not found.`);
    }
    return item;
  },

  /**
   * Get related/recommended products (excluding the current product)
   */
  async getRelatedProducts(currentId, limit = 3) {
    await simulateLatency(100);
    return products.filter(p => p.id !== Number(currentId)).slice(0, limit);
  }
};
