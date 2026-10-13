
import { apiRequest } from './api';

export const cartApi = {
  getCart: () => apiRequest('cart'),

  addItem: (variantId, quantity = 1) =>
    apiRequest('cart/items', {
      method: 'POST',
      body: JSON.stringify({ variantId, quantity }),
    }),

  updateItem: (itemId, quantity) =>
    apiRequest(`cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId) =>
    apiRequest(`cart/items/${itemId}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    apiRequest('cart', {
      method: 'DELETE',
    }),
};
