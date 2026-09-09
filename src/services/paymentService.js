/**
 * ============================================================================
 * PAYMENT SERVICE (RAZORPAY INTEGRATION ABSTRACTION)
 * ============================================================================
 * 
 * IMPORTANT FOR SPRING BOOT / JAVA DEVELOPER:
 * --------------------------------------------
 * This service contains the mock frontend flow for Razorpay payments.
 * 
 * In a real production environment with Spring Boot:
 * 
 * STEP 1: Backend creates Razorpay order
 *   Frontend calls: POST /api/payment/create-order
 *   Payload: { amount: 389, currency: "INR", receipt: "order_rcptid_11" }
 *   Spring Boot uses Razorpay Java SDK:
 *     RazorpayClient client = new RazorpayClient("KEY_ID", "KEY_SECRET");
 *     JSONObject orderRequest = new JSONObject();
 *     orderRequest.put("amount", amount * 100); // amount in paise
 *     orderRequest.put("currency", "INR");
 *     Order order = client.orders.create(orderRequest);
 *     return ResponseEntity.ok(order.toString());
 * 
 * STEP 2: Frontend opens Razorpay Checkout modal with the returned `order_id`
 * 
 * STEP 3: Upon user payment, Razorpay returns:
 *   - razorpay_order_id
 *   - razorpay_payment_id
 *   - razorpay_signature
 * 
 * STEP 4: Frontend verifies signature with Spring Boot:
 *   Frontend calls: POST /api/payment/verify
 *   Spring Boot validates HMAC-SHA256 signature:
 *     Utils.verifyPaymentSignature(attributes, "KEY_SECRET");
 */

import { simulateLatency } from './api';

export const paymentService = {
  /**
   * Simulate Step 1: Creating a Razorpay Order
   * (Future endpoint: POST /api/payment/create-order)
   */
  async createRazorpayOrder(amountInRupees) {
    await simulateLatency(200);

    const amountInPaise = Math.round(amountInRupees * 100);
    const mockRazorpayOrderId = `order_${Math.random().toString(36).substring(2, 14)}`;

    return {
      success: true,
      razorpayOrderId: mockRazorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: "rzp_test_demo_prakriti_key"
    };
  },

  /**
   * Simulate Step 4: Verifying the Razorpay Payment Signature
   * (Future endpoint: POST /api/payment/verify)
   */
  async verifyPayment(paymentDetails) {
    await simulateLatency(300);

    const { razorpay_order_id, razorpay_payment_id } = paymentDetails;

    if (!razorpay_order_id || !razorpay_payment_id) {
      throw new Error("Invalid payment parameters received.");
    }

    return {
      success: true,
      message: "Payment successfully verified against mock gateway.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    };
  }
};
