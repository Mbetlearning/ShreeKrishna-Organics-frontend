/**
 * ORDER SERVICE (DEMO DATA & PERSISTENCE)
 * 
 * NOTE FOR SPRING BOOT DEVELOPER:
 * In your backend, this will map to:
 *   POST /api/orders             -> Save order to MySQL DB with JPA
 *   GET  /api/orders/my-orders   -> Retrieve user's order history
 *   GET  /api/orders/{id}        -> Retrieve detailed order tracking
 */

import { simulateLatency } from './api';

const ORDERS_STORAGE_KEY = 'prakriti_orders_history';

// Default realistic sample orders for demo showcase
const INITIAL_DEMO_ORDERS = [
  {
    id: "PO-1024",
    date: "2026-08-18",
    createdAtFormatted: "18 Aug 2026",
    status: "Delivered",
    paymentStatus: "Paid (Razorpay)",
    paymentMethod: "UPI (Google Pay)",
    totalAmount: 938,
    subtotal: 838,
    deliveryFee: 0,
    discount: 0,
    shippingAddress: {
      fullName: "Priya Sundaram",
      phone: "+91 98765 43210",
      address: "Flat 402, Green Meadows, 12th Main Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    items: [
      {
        id: 1,
        name: "Wood-Pressed Yellow Mustard Oil",
        size: "1 Litre",
        price: 389,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: 2,
        name: "Cold-Pressed Raw Coconut Oil",
        size: "1 Litre",
        price: 449,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80"
      }
    ],
    tracking: {
      courier: "Delhivery Express",
      trackingNumber: "DEL-849204918",
      estimatedDelivery: "Delivered on 21 Aug 2026",
      currentStep: 4, // 1: Placed, 2: Packed, 3: In Transit, 4: Delivered
      timeline: [
        { title: "Order Placed", time: "18 Aug, 09:30 AM", completed: true },
        { title: "Cold-Pressed & Bottled", time: "18 Aug, 03:15 PM", completed: true },
        { title: "Dispatched from Erode Unit", time: "19 Aug, 10:00 AM", completed: true },
        { title: "Delivered to Customer", time: "21 Aug, 02:45 PM", completed: true }
      ]
    }
  },
  {
    id: "PO-1038",
    date: "2026-08-22",
    createdAtFormatted: "22 Aug 2026",
    status: "Processing",
    paymentStatus: "Paid (Razorpay)",
    paymentMethod: "Credit Card (HDFC)",
    totalAmount: 1149,
    subtotal: 1149,
    deliveryFee: 0,
    discount: 0,
    shippingAddress: {
      fullName: "Priya Sundaram",
      phone: "+91 98765 43210",
      address: "Flat 402, Green Meadows, 12th Main Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    items: [
      {
        id: 9,
        name: "Shrikrishna Heritage Trio (Mustard + Coconut + Groundnut)",
        size: "3 x 1 Litre Bottles",
        price: 1149,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
      }
    ],
    tracking: {
      courier: "BlueDart Surface",
      trackingNumber: "BD-991823741",
      estimatedDelivery: "25 Aug 2026",
      currentStep: 2, // In packing
      timeline: [
        { title: "Order Confirmed", time: "22 Aug, 04:12 PM", completed: true },
        { title: "Freshly Bottling in Wood Mills", time: "23 Aug, 11:30 AM", completed: true },
        { title: "Handover to Courier", time: "Expected 24 Aug", completed: false },
        { title: "Delivery to Doorstep", time: "Expected 25 Aug", completed: false }
      ]
    }
  }
];

export const orderService = {
  /**
   * Get all orders for the current user
   */
  async getUserOrders() {
    await simulateLatency(200);
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  },

  /**
   * Get a single order by ID
   */
  async getOrderById(orderId) {
    await simulateLatency(150);
    const orders = await this.getUserOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order #${orderId} not found.`);
    }
    return order;
  },

  /**
   * Create and persist a new order
   */
  async createOrder(orderPayload) {
    await simulateLatency(300);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const orderId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      date: now.toISOString().split('T')[0],
      createdAtFormatted: formattedDate,
      status: "Processing",
      paymentStatus: orderPayload.paymentStatus || "Paid (Razorpay)",
      paymentMethod: orderPayload.paymentMethod || "Online (Razorpay)",
      totalAmount: orderPayload.totalAmount,
      subtotal: orderPayload.subtotal,
      deliveryFee: orderPayload.deliveryFee,
      discount: orderPayload.discount || 0,
      shippingAddress: orderPayload.shippingAddress,
      items: orderPayload.items,
      tracking: {
        courier: "Delhivery Air Express",
        trackingNumber: `DEL-${Math.floor(100000000 + Math.random() * 900000000)}`,
        estimatedDelivery: "Delivery in 2-3 Business Days",
        currentStep: 1,
        timeline: [
          { title: "Order Confirmed & Placed", time: "Just now", completed: true },
          { title: "Fresh Batch Extraction & Packing", time: "Scheduled next", completed: false },
          { title: "Handover to Courier", time: "Pending", completed: false },
          { title: "Delivered to Doorstep", time: "Pending", completed: false }
        ]
      }
    };

    const currentOrders = await this.getUserOrders();
    const updated = [newOrder, ...currentOrders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));

    return newOrder;
  }
};
