
import { apiRequest } from './api';

export const addressApi = {
  getAddresses: () =>
    apiRequest('/addresses'),

  createAddress: (data) =>
    apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAddress: (id, data) =>
    apiRequest(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAddress: (id) =>
    apiRequest(`/addresses/${id}`, {
      method: 'DELETE',
    }),
};
