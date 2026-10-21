import { apiRequest } from './api';

// All methods use the existing customer JWT via apiRequest.
export const checkoutSessionApi = {
  eligibility: () =>
    apiRequest('/checkout-sessions/eligibility'),

  createDraft: (addressId) =>
    apiRequest('/checkout-sessions/draft', {
      method: 'POST',
      body: JSON.stringify({
        addressId: Number(addressId),
      }),
    }),

  createBuyNowDraft: (addressId, variantId, quantity) =>
    apiRequest('/checkout-sessions/buy-now/draft', {
      method: 'POST',
      body: JSON.stringify({
        addressId: Number(addressId),
        variantId: Number(variantId),
        quantity: Number(quantity),
      }),
    }),

  placeBuyNowCod: (id) =>
    apiRequest(`/checkout-sessions/${encodeURIComponent(id)}/buy-now-cod`, {
      method: 'POST',
    }),

  startPayment: (id) =>
    apiRequest(
      `/checkout-sessions/${encodeURIComponent(id)}/start-payment`,
      {
        method: 'POST',
      }
    ),

  verify: (id, result) =>
    apiRequest(
      `/checkout-sessions/${encodeURIComponent(id)}/verify`,
      {
        method: 'POST',
        body: JSON.stringify({
          razorpayOrderId: result.razorpay_order_id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        }),
      }
    ),

  recovery: (id) =>
    apiRequest(
      `/checkout-sessions/${encodeURIComponent(id)}/recovery`
    ),

  recoverCapturedPayment: (id) =>
    apiRequest(
      `/checkout-sessions/${encodeURIComponent(id)}/recover-captured-payment`,
      {
        method: 'POST',
      }
    ),

  switchToCod: (id) =>
    apiRequest(
      `/checkout-sessions/${encodeURIComponent(id)}/switch-to-cod`,
      {
        method: 'POST',
      }
    ),

  cancelCheckout: (id) =>
    apiRequest(
      `/checkout-sessions/${encodeURIComponent(id)}/cancel`,
      {
        method: 'POST',
      }
    ),
};
