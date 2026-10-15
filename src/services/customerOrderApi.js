
import { apiRequest } from './api';

export const customerOrderApi = {
  getCheckoutSummary: () =>
    apiRequest('/checkout/summary'),

 placeOrder: (addressId, paymentMethod) =>
  apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      addressId: Number(addressId),
      paymentMethod,
    }),
  }),

  getOrders: () =>
    apiRequest('/orders'),

  getOrderById: (id) =>
    apiRequest(`/orders/${id}`),

  cancelOrder: (id) =>
    apiRequest(`/orders/${id}/cancel`, {
      method: 'POST',
    }),
};
