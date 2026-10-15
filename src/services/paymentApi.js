import { apiRequest } from './api';

export const paymentApi = {
  createRazorpayPayment: (orderId) => apiRequest(`/payments/razorpay/create/${orderId}`, { method: 'POST' }),
  verifyRazorpayPayment: (orderId, details) => apiRequest(`/payments/razorpay/verify/${orderId}`, {
    method: 'POST',
    body: JSON.stringify({
      razorpayOrderId: details.razorpay_order_id,
      razorpayPaymentId: details.razorpay_payment_id,
      razorpaySignature: details.razorpay_signature,
    }),
  }),
};
