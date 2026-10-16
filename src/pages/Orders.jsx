import React, { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import {
  ArrowLeft,
  Package,
  MapPin,
  RefreshCw,
  XCircle,
  Download,
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


// Show the tax breakdown only when it is provided by the backend.
// Do not infer a GST rate or CGST/SGST split from the order total.
function OrderBreakdown({ order }) {
  const subtotal = Number(order.subtotal || 0);
  const tax = Number(order.taxAmount || 0);
  const hasTax = Number.isFinite(tax) && tax > 0 && tax <= subtotal;
  const cgst = order.cgstAmount == null ? null : Number(order.cgstAmount);
  const sgst = order.sgstAmount == null ? null : Number(order.sgstAmount);
  const igst = order.igstAmount == null ? null : Number(order.igstAmount);
  const hasCgstSgst = hasTax && cgst != null && sgst != null &&
    Math.abs(cgst + sgst - tax) < 0.011;
  const hasIgst = hasTax && igst != null && Math.abs(igst - tax) < 0.011;

  const line = (label, amount, strong = false) => (
    <div className={`flex items-start justify-between gap-4 ${strong ? 'font-bold text-[#2B241D]' : ''}`}>
      <span>{label}</span>
      <span className="whitespace-nowrap tabular-nums">{money(amount)}</span>
    </div>
  );

  return (
    <div className="text-sm text-stone-600 space-y-2">
      <p><strong>Payment:</strong> {order.paymentMethod}</p>
      <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
      <div className="border-t border-[#E8DFD3] pt-3 mt-3 space-y-2">
        {hasTax && line('Product Price (Excluding GST)', subtotal - tax)}
        {hasCgstSgst ? (
          <>
            {line('CGST — Included', cgst)}
            {line('SGST — Included', sgst)}
          </>
        ) : hasIgst ? (
          line('IGST — Included', igst)
        ) : hasTax ? (
          line('GST — Included (CGST 2.5% & SGST 2.5%)', tax)
        ) : null}
        {line(hasTax ? 'Product Price (Including GST)' : 'Product Subtotal', subtotal, true)}
        {line('Delivery Charge', order.deliveryCharge)}
        {Number(order.codCharge || 0) > 0 && line('COD Charge', order.codCharge)}
        {hasTax ? (
          <p className="text-xs text-emerald-700">GST is included in the product subtotal shown above.</p>
        ) : (
          <p className="text-xs text-amber-700">GST breakdown is unavailable for this order. The backend has not provided a recorded GST amount.</p>
        )}
        <div className="border-t border-[#E8DFD3] pt-3 mt-3">
          {line('Total Payable', order.totalAmount, true)}
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
const [downloadingInvoiceId, setDownloadingInvoiceId] =
  useState(null);

  const location = useLocation();

  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [cancellingId, setCancellingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null);

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

  const refreshSingleOrder = async (id) => {
    const current = await customerOrderApi.getOrderById(id);
    if (!current?.id) throw new Error('Unable to confirm the latest order status.');
    setOrders((previous) => previous.map((item) =>
      String(item.id) === String(id) ? current : item
    ));
    return current;
  };

  const handleCheckStatus = async (order) => {
    if (checkingId != null || cancellingId != null) return;
    setCheckingId(order.id);
    try {
      const current = await refreshSingleOrder(order.id);
      if (current.paymentStatus === 'PAID') {
        addToast('Payment confirmed successfully.', 'success');
      } else {
        addToast('Order status refreshed. If money was deducted, wait for confirmation before paying again.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Unable to check order status.', 'error');
    } finally {
      setCheckingId(null);
    }
  };

const handleDownloadInvoice = async (order) => {
  if (
    downloadingInvoiceId != null ||
    checkingId != null ||
    cancellingId != null
  ) {
    return;
  }

  setDownloadingInvoiceId(order.id);

  try {
    const blob =
      await customerOrderApi.downloadInvoice(order.id);

    if (!blob || blob.size === 0) {
      throw new Error('Invoice PDF is empty.');
    }

    const url = window.URL.createObjectURL(blob);

    const safeOrderNumber = String(
      order.orderNumber || order.id
    ).replace(/[^a-zA-Z0-9-_]/g, '_');

    const link = document.createElement('a');

    link.href = url;
    link.download =
      `ShreeKrishna-Invoice-${safeOrderNumber}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    addToast(
      'Invoice downloaded successfully.',
      'success'
    );
  } catch (err) {
    addToast(
      err.message || 'Unable to download invoice.',
      'error'
    );
  } finally {
    setDownloadingInvoiceId(null);
  }
};

  const handleCancel = async (order) => {
    if (checkingId != null || cancellingId != null) return;
    setCheckingId(order.id);
    try {
      const current = await refreshSingleOrder(order.id);
      if (current.paymentStatus === 'PAID' && current.paymentMethod === 'RAZORPAY') {
        addToast('Payment is already confirmed. Do not cancel through pending-payment recovery.', 'error');
        return;
      }
      if (current.status !== 'PLACED' || current.stockState !== 'RESERVED') {
        addToast('This order is not eligible for cancellation from My Orders.', 'error');
        return;
      }
      if (!window.confirm(`Cancel order ${current.orderNumber || current.id}?`)) return;
      setCancellingId(order.id);
      const updated = await customerOrderApi.cancelOrder(order.id);
      if (updated?.status !== 'CANCELLED') {
        throw new Error('Order cancellation was not confirmed by the server.');
      }
      setOrders((previous) => previous.map((item) =>
        String(item.id) === String(order.id) ? updated : item
      ));
      addToast('Order cancelled successfully.', 'success');
    } catch (err) {
      addToast(err.message || 'Unable to cancel order.', 'error');
    } finally {
      setCheckingId(null);
      setCancellingId(null);
    }
  };

  const canCancel = (order) =>
    order.status === 'PLACED' && order.stockState === 'RESERVED';

  const isPendingOnlinePayment = (order) =>
    order.paymentMethod === 'RAZORPAY' &&
    order.status === 'PENDING_PAYMENT' &&
    order.paymentStatus === 'PENDING';

  const statusStyle = (status) => {
    if (status === 'CANCELLED') return 'bg-red-100 text-red-700';
    if (status === 'PENDING_PAYMENT') return 'bg-amber-100 text-amber-800';
    if (status === 'PLACED') return 'bg-green-100 text-green-800';
    return 'bg-stone-100 text-stone-700';
  };

  const placedOrder = orders.find((order) =>
    String(order.id) === String(location.state?.placedOrderId)
  );
  const confirmedPlacement = placedOrder && (
    placedOrder.paymentMethod === 'COD' ||
    (placedOrder.paymentMethod === 'RAZORPAY' &&
      placedOrder.paymentStatus === 'PAID' && placedOrder.status === 'PLACED')
  );
  const placementMessage = confirmedPlacement
    ? placedOrder.paymentMethod === 'RAZORPAY'
      ? 'Your online payment was successful! Order placed successfully.'
      : 'Your Cash on Delivery order was placed successfully!'
    : 'Your order was created, but payment is not confirmed. Check the latest status before attempting another payment.';

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

  <div className={`mb-6 rounded-xl p-4 border ${confirmedPlacement ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>

    {placementMessage}

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

                        statusStyle(order.status)
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

                    <OrderBreakdown order={order} />

                  </div>


<div className="mt-6 pt-4 border-t border-[#E8DFD3]">
  <button
    type="button"
    onClick={() => handleDownloadInvoice(order)}
    disabled={
      downloadingInvoiceId != null ||
      checkingId != null ||
      cancellingId != null
    }
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075e4d] text-white text-sm font-bold hover:bg-[#064c3f] disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Download size={16} />

    {downloadingInvoiceId === order.id
      ? 'Downloading Invoice...'
      : 'Download Invoice PDF'}
  </button>

  {order.paymentMethod === 'COD' &&
    order.paymentStatus !== 'PAID' && (
      <p className="text-xs text-stone-500 mt-2">
        This invoice records the order amount.
        Cash on Delivery payment is still due.
      </p>
    )}

  {order.paymentMethod === 'RAZORPAY' &&
    order.paymentStatus === 'PAID' && (
      <p className="text-xs text-green-700 mt-2">
        Online payment has been received and
        recorded for this order.
      </p>
    )}
</div>

                  {isPendingOnlinePayment(order) && (
                    <div className="mt-6 pt-4 border-t border-amber-200 space-y-3">
                      <p className="text-sm text-amber-900">
                        Online payment is pending. If money was deducted, do not pay again until the payment is confirmed.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCheckStatus(order)}
                        disabled={checkingId != null || cancellingId != null}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-amber-300 rounded-xl text-sm font-bold text-amber-900 hover:bg-amber-50 disabled:opacity-50"
                      >
                        <RefreshCw size={16} />
                        {checkingId === order.id ? 'Checking...' : 'Check Payment Status'}
                      </button>
                      <p className="text-xs text-stone-500">
                        To retry a confirmed pending payment, return to Checkout using the same signed-in account. If payment may have been deducted, contact support before retrying.
                      </p>
                    </div>
                  )}

                  {canCancel(order) && (

                    <div className="mt-6 pt-4 border-t border-[#E8DFD3]">

                      <button

                        type="button"

                        onClick={() => handleCancel(order)}

                        disabled={cancellingId != null || checkingId != null}

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
