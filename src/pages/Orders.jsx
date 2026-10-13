
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  RefreshCw,
  XCircle,
} from 'lucide-react';

import { customerOrderApi } from '../services/customerOrderApi';
import { useToast } from '../context/ToastContext';

const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return '-';

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? String(date)
    : parsed.toLocaleString('en-IN');
};

export default function Orders() {
  const location = useLocation();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await customerOrderApi.getOrders();

      setOrders(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    customerOrderApi.getOrders()
      .then((response) => {
        if (active) {
          setOrders(Array.isArray(response) ? response : []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Unable to load orders.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCancel = async (order) => {
    const confirmed = window.confirm(
      `Cancel order ${order.orderNumber || order.id}?`
    );

    if (!confirmed) return;

    setCancellingId(order.id);

    try {
      const updated = await customerOrderApi.cancelOrder(order.id);

      setOrders((previous) =>
        previous.map((item) =>
          item.id === order.id ? updated : item
        )
      );

      addToast('Order cancelled successfully.', 'success');
    } catch (err) {
      addToast(
        err.message || 'Unable to cancel order.',
        'error'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (order) =>
    order.status === 'PLACED' &&
    order.stockState === 'RESERVED';
const placedOrder = orders.find(
  (order) =>
    String(order.id) ===
    String(location.state?.placedOrderId)
);

const successMessage =
  placedOrder?.paymentMethod === 'RAZORPAY'
    ? placedOrder.paymentStatus === 'PAID'
      ? 'Your online payment was successful! Order placed successfully.'
      : 'Your order was created. Payment confirmation is pending.'
    : 'Your Cash on Delivery order was placed successfully!';
  return (
    <div className="bg-[#FAF6EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#B5563C]"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-5 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2B241D]">
              My Orders
            </h1>

            <p className="text-sm text-stone-500 mt-2">
              View your ShreeKrishna Organics orders.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DFD3] bg-white text-sm font-bold"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {location.state?.placedOrderId && placedOrder && (
  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
    {successMessage}
  </div>
)}

        {error && (
          <div
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center">
            Loading your orders...
          </div>
        ) : orders.length === 0 && !error ? (
          <div className="bg-white rounded-3xl border border-[#E8DFD3] p-12 text-center">
            <Package
              size={44}
              className="mx-auto text-[#B5563C] mb-4"
            />

            <h2 className="text-xl font-bold text-stone-800">
              No Orders Yet
            </h2>

            <p className="text-sm text-stone-500 mt-2">
              Your orders will appear here after checkout.
            </p>

            <Link
              to="/shop"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#B5563C] text-white font-bold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="bg-white border border-[#E8DFD3] rounded-3xl overflow-hidden"
              >
                <div className="p-5 sm:p-6 bg-[#FFFCF8] border-b border-[#E8DFD3] flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500">
                      Order Number
                    </p>

                    <h2 className="font-bold text-[#2B241D] break-all">
                      {order.orderNumber || `#${order.id}`}
                    </h2>

                    <p className="text-xs text-stone-500 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status}
                    </span>

                    <p className="text-sm font-bold text-stone-800 mt-2">
                      {money(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="space-y-3">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={item.id ?? `${item.variantId}-${index}`}
                        className="flex justify-between gap-4 text-sm border-b border-[#F0E9E0] pb-3"
                      >
                        <div>
                          <p className="font-bold text-stone-800">
                            {item.productName}
                          </p>

                          <p className="text-xs text-stone-500 mt-1">
                            {item.sku && `SKU: ${item.sku} · `}
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <span className="font-bold whitespace-nowrap">
                          {money(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                    <div className="text-sm text-stone-600">
                      <p className="font-bold text-[#2B241D] flex items-center gap-2 mb-2">
                        <MapPin size={16} />
                        Delivery Address
                      </p>

                      <p>{order.shippingFullName}</p>
                      <p>{order.shippingAddressLine1}</p>
                      {order.shippingAddressLine2 && (
                        <p>{order.shippingAddressLine2}</p>
                      )}
                      {order.shippingLandmark && (
                        <p>{order.shippingLandmark}</p>
                      )}
                      <p>
                        {order.shippingCity}, {order.shippingState}
                      </p>
                      <p>{order.shippingPostalCode}</p>
                      <p>{order.shippingMobile}</p>
                    </div>

                    <div className="text-sm text-stone-600 space-y-2">
                      <p>
                        <strong>Payment:</strong>{' '}
                        {order.paymentMethod}
                      </p>

                      <p>
                        <strong>Payment Status:</strong>{' '}
                        {order.paymentStatus}
                      </p>

                      <p>
                        <strong>Subtotal:</strong>{' '}
                        {money(order.subtotal)}
                      </p>

                      <p>
                        <strong>Delivery:</strong>{' '}
                        {money(order.deliveryCharge)}
                      </p>

                      <p>
                        <strong>Total:</strong>{' '}
                        {money(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {canCancel(order) && (
                    <div className="mt-6 pt-4 border-t border-[#E8DFD3]">
                      <button
                        type="button"
                        onClick={() => handleCancel(order)}
                        disabled={cancellingId === order.id}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 rounded-xl text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle size={16} />

                        {cancellingId === order.id
                          ? 'Cancelling...'
                          : 'Cancel Order'}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
