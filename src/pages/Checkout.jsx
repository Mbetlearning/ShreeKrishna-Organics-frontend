

import React, { useEffect, useState, useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {

  ArrowLeft,

  MapPin,

  CreditCard,

  Banknote,

  ShieldCheck,

  Plus,

  RefreshCw,

} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import { useCart } from '../context/CartContext';

import { useToast } from '../context/ToastContext';

import { addressApi } from '../services/addressApi';

import { customerOrderApi } from '../services/customerOrderApi';

import { paymentApi } from '../services/paymentApi';

const loadRazorpay = () => new Promise((resolve, reject) => {

  if (window.Razorpay) return resolve();

  const existing = document.querySelector('script[data-razorpay-checkout]');

  if (existing) {

    existing.addEventListener('load', () => resolve(), { once: true });

    existing.addEventListener('error', () => reject(new Error('Razorpay failed to load.')), { once: true });

    return;

  }

  const script = document.createElement('script');

  script.src = 'https://checkout.razorpay.com/v1/checkout.js';

  script.async = true;

  script.dataset.razorpayCheckout = 'true';

  script.onload = () => resolve();

  script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));

  document.body.appendChild(script);

});

const INDIAN_STATES = [

  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',

  'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',

  'Haryana', 'Himachal Pradesh', 'Jharkhand',

  'Karnataka', 'Kerala', 'Madhya Pradesh',

  'Maharashtra', 'Manipur', 'Meghalaya',

  'Mizoram', 'Nagaland', 'Odisha', 'Punjab',

  'Rajasthan', 'Sikkim', 'Tamil Nadu',

  'Telangana', 'Tripura', 'Uttar Pradesh',

  'Uttarakhand', 'West Bengal', 'Delhi',

  'Chandigarh', 'Jammu and Kashmir', 'Ladakh',

  'Puducherry', 'Andaman and Nicobar Islands',

  'Dadra and Nagar Haveli and Daman and Diu',

  'Lakshadweep',

];

const EMPTY_ADDRESS = {

  fullName: '',

  mobile: '',

  addressLine1: '',

  addressLine2: '',

  landmark: '',

  city: '',

  state: 'Maharashtra',

  postalCode: '',

  country: 'India',

  addressType: 'HOME',

  defaultAddress: false,

};

const money = (value) =>

  `₹${Number(value || 0).toLocaleString('en-IN', {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  })}`;

function validateAddress(address) {

  if (!address.fullName.trim()) {

    return 'Please enter your full name.';

  }

  if (!/^[6-9][0-9]{9}$/.test(address.mobile.trim())) {

    return 'Enter a valid 10-digit mobile number.';

  }

  if (!address.addressLine1.trim()) {

    return 'Please enter your street address.';

  }

  if (!address.city.trim() || !address.state.trim()) {

    return 'Please enter your city and state.';

  }

  if (!/^[1-9][0-9]{5}$/.test(address.postalCode.trim())) {

    return 'Enter a valid 6-digit PIN code.';

  }

  return null;

}

export default function Checkout() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const { cartItems, cartLoading, refreshCart } = useCart();

  const { addToast } = useToast();

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [formData, setFormData] = useState(EMPTY_ADDRESS);

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [savingAddress, setSavingAddress] = useState(false);

  const [error, setError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  const [pendingOrder, setPendingOrder] = useState(null);

  const [cancellingOrder, setCancellingOrder] = useState(false);

  const paymentInProgress = useRef(false);

  const pendingKey = user?.id != null ? `sko_pending_payment_${user.id}` :

    user?.email ? `sko_pending_payment_${user.email}` : null;

  useEffect(() => {

    if (!pendingKey) return;

    const stored = sessionStorage.getItem(pendingKey);

    if (!stored) return;

    try {

      const parsed = JSON.parse(stored);

      if (parsed?.id) setPendingOrder(parsed);

    } catch { sessionStorage.removeItem(pendingKey); }

  }, [pendingKey]);

  const savePendingOrder = (order) => {

    const next = { id: order.id, orderNumber: order.orderNumber, verificationUncertain: Boolean(order.verificationUncertain) };

    setPendingOrder(next);

    if (pendingKey) sessionStorage.setItem(pendingKey, JSON.stringify(next));

  };

  const clearPendingOrder = () => {

    setPendingOrder(null);

    if (pendingKey) sessionStorage.removeItem(pendingKey);

  };

  const loadCheckout = async () => {

    setLoading(true);

    setError('');

    try {

      const [addressList, checkoutSummary] =

        await Promise.all([

          addressApi.getAddresses(),

          customerOrderApi.getCheckoutSummary(),

        ]);

      const list = Array.isArray(addressList)

        ? addressList

        : [];

      setAddresses(list);

      setSummary(checkoutSummary);

      setSelectedAddressId((current) => {

        if (list.some((a) => String(a.id) === String(current))) {

          return current;

        }

        const preferred =

          list.find((a) => a.defaultAddress) || list[0];

        return preferred ? String(preferred.id) : '';

      });

      setShowAddressForm(list.length === 0);

    } catch (err) {

      setError(err.message || 'Unable to load checkout.');

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    let active = true;

    const initialize = async () => {

      try {

        const [addressList, checkoutSummary] =

          await Promise.all([

            addressApi.getAddresses(),

            customerOrderApi.getCheckoutSummary(),

          ]);

        if (!active) return;

        const list = Array.isArray(addressList)

          ? addressList

          : [];

        setAddresses(list);

        setSummary(checkoutSummary);

        const preferred =

          list.find((a) => a.defaultAddress) || list[0];

        setSelectedAddressId(

          preferred ? String(preferred.id) : ''

        );

        setShowAddressForm(list.length === 0);

      } catch (err) {

        if (active) {

          setError(err.message || 'Unable to load checkout.');

        }

      } finally {

        if (active) setLoading(false);

      }

    };

    initialize();

    return () => {

      active = false;

    };

  }, []);

  const handleInputChange = (event) => {

    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({

      ...previous,

      [name]: type === 'checkbox' ? checked : value,

    }));

  };

  const handleSaveAddress = async (event) => {

    event.preventDefault();

    const validationError = validateAddress(formData);

    if (validationError) {

      addToast(validationError, 'error');

      return;

    }

    setSavingAddress(true);

    try {

      const payload = {

        ...formData,

        fullName: formData.fullName.trim(),

        mobile: formData.mobile.trim(),

        addressLine1: formData.addressLine1.trim(),

        addressLine2: formData.addressLine2.trim(),

        landmark: formData.landmark.trim(),

        city: formData.city.trim(),

        state: formData.state.trim(),

        postalCode: formData.postalCode.trim(),

        country: 'India',

      };

      const saved = await addressApi.createAddress(payload);

      if (saved?.id == null) {

        throw new Error('Address saved without an ID.');

      }

      setAddresses((previous) => [

        ...previous.map((a) => ({

          ...a,

          defaultAddress: saved.defaultAddress

            ? false

            : a.defaultAddress,

        })),

        saved,

      ]);

      setSelectedAddressId(String(saved.id));

      setShowAddressForm(false);

      setFormData(EMPTY_ADDRESS);

      addToast('Delivery address saved successfully.', 'success');

    } catch (err) {

      addToast(err.message || 'Unable to save address.', 'error');

    } finally {

      setSavingAddress(false);

    }

  };

  // Read the authoritative order status before allowing another payment attempt.

  const checkPendingOrder = async (orderId) => {

    const current = await customerOrderApi.getOrderById(orderId);

    if (!current || String(current.id) !== String(orderId)) {

      throw new Error('Unable to confirm the current order status.');

    }

    if (current.paymentStatus === 'PAID') {

      clearPendingOrder();

      addToast('Your payment is already confirmed.', 'success');

      navigate('/orders', { replace: true, state: { placedOrderId: current.id } });

      return null;

    }

    if (current.status === 'CANCELLED') {

      clearPendingOrder();

      addToast('This order has been cancelled.', 'error');

      navigate('/orders', { replace: true });

      return null;

    }

    if (current.paymentMethod !== 'RAZORPAY' ||

        current.status !== 'PENDING_PAYMENT' ||

        current.paymentStatus !== 'PENDING' ||

        current.stockState !== 'RESERVED') {

      throw new Error('Order is not eligible for online payment. Check My Orders.');

    }

    return current;

  };



  const startRazorpayPayment = async (order, isRetry = false) => {

    if (paymentInProgress.current) return;

    paymentInProgress.current = true;

    setSubmitting(true);

    let popupOpened = false;

    try {

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!key) throw new Error('Razorpay public Key ID is not configured.');



      // For retries, do not assume that a previous attempt failed.

      if (isRetry) {

        if (order.verificationUncertain) {

          throw new Error('Payment verification is unresolved. Please contact support before attempting another payment.');

        }

        const current = await checkPendingOrder(order.id);

        if (!current) return;

      }



      await loadRazorpay();

      const payment = await paymentApi.createRazorpayPayment(order.id);

      const amountPaise = Math.round(Number(payment.amount) * 100);

      if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {

        throw new Error('Invalid payment amount returned by server.');

      }

      if (!payment.razorpayOrderId) throw new Error('Missing Razorpay order ID.');



      const razorpay = new window.Razorpay({

        key,

        amount: amountPaise,

        currency: payment.currency || 'INR',

        name: 'ShreeKrishna Organics',

        description: `Payment for order ${order.orderNumber || order.id}`,

        order_id: payment.razorpayOrderId,

        prefill: { email: user?.email || '' },

        theme: { color: '#B5563C' },

        handler: async (result) => {

          setSubmitting(true);

          try {

            const verified = await paymentApi.verifyRazorpayPayment(order.id, result);

            if (verified.status !== 'PAID') {

              throw new Error('Payment confirmation is pending.');

            }

            clearPendingOrder();

            addToast('Payment verified successfully!', 'success');

            try { await refreshCart(); } catch (e) { console.warn(e); }

            navigate('/orders', { replace: true, state: { placedOrderId: order.id } });

          } catch (err) {

            // The webhook may have completed payment despite a failed browser request.

            try {

              const current = await customerOrderApi.getOrderById(order.id);

              if (current?.paymentStatus === 'PAID') {

                clearPendingOrder();

                addToast('Payment confirmed successfully!', 'success');

                try { await refreshCart(); } catch (e) { console.warn(e); }

                navigate('/orders', { replace: true, state: { placedOrderId: order.id } });

                return;

              }

            } catch (statusError) {

              console.warn('Could not confirm payment status:', statusError);

            }

            savePendingOrder({ ...order, verificationUncertain: true });

            addToast('Payment confirmation is uncertain. Check My Orders and contact support if money was deducted. Do not pay again yet.', 'error');

          } finally {

            paymentInProgress.current = false;

            setSubmitting(false);

          }

        },

        modal: {

          ondismiss: () => {

            paymentInProgress.current = false;

            setSubmitting(false);

            addToast('Payment window closed. Check My Orders before retrying.', 'error');

          },

        },

      });

      razorpay.on('payment.failed', () => {

        addToast('Payment failed. Please check your order before retrying.', 'error');

      });

      razorpay.open();

      popupOpened = true;

    } catch (err) {

      addToast(err.message || 'Could not start Razorpay payment.', 'error');

    } finally {

      // This block finishes before the Razorpay popup callbacks run.

      // Keep the lock until the popup closes or its handler finishes.

      if (!popupOpened) {

        paymentInProgress.current = false;

        setSubmitting(false);

      }

    }

  };



  const handleCancelOrder = async () => {

    if (!pendingOrder?.id || submitting || cancellingOrder || paymentInProgress.current) return;

    const confirmed = window.confirm(

      `Are you sure you want to cancel order ${pendingOrder.orderNumber || pendingOrder.id}?`

    );

    if (!confirmed) return;

    setCancellingOrder(true);

    try {

      const current = await checkPendingOrder(pendingOrder.id);

      if (!current) return;

      const cancelledOrder = await customerOrderApi.cancelOrder(pendingOrder.id);

      if (cancelledOrder?.status !== 'CANCELLED') {

        throw new Error('Order cancellation was not confirmed.');

      }

      clearPendingOrder();

      try { await refreshCart(); } catch (e) { console.warn(e); }

      addToast('Order cancelled successfully.', 'success');

      navigate('/shop', { replace: true });

    } catch (err) {

      addToast(err.message || 'Could not cancel order. Check My Orders.', 'error');

    } finally {

      setCancellingOrder(false);

    }

  };



  const handlePlaceOrder = async () => {

    if (submitting || savingAddress || loading || paymentInProgress.current) return;

    if (pendingOrder) {

      addToast('Please resolve your pending online order first.', 'error');

      return;

    }

    if (!selectedAddressId) return addToast('Please select a delivery address.', 'error');

    if (!summary?.items?.length) return addToast('Your cart is empty.', 'error');

    if (summary.items.some((item) => !item.available)) {

      return addToast('Some products are unavailable. Update your cart.', 'error');

    }

    setSubmitting(true);

    let createdOrder = null;

    try {

      createdOrder = await customerOrderApi.placeOrder(selectedAddressId, paymentMethod);

      if (!createdOrder?.id) throw new Error('Order created without an ID. Check My Orders.');

      try { await refreshCart(); } catch (e) { console.warn(e); }

      if (paymentMethod === 'RAZORPAY') {

        savePendingOrder(createdOrder);

        setSubmitting(false);

        await startRazorpayPayment(createdOrder);

        return;

      }

      addToast(`Order ${createdOrder.orderNumber || createdOrder.id} placed successfully!`, 'success');

      navigate('/orders', { replace: true, state: { placedOrderId: createdOrder.id } });

    } catch (err) {

      addToast(err.message || 'Order could not be placed. Check My Orders before retrying.', 'error');

      if (!createdOrder) {

        try { setSummary(await customerOrderApi.getCheckoutSummary()); } catch { /* keep original error */ }

      }

    } finally {

      setSubmitting(false);

    }

  };

  const items = summary?.items || [];

  const hasUnavailableItems = items.some((item) => !item.available);

  const noItems = !loading && items.length === 0;

  const subtotal = Number(summary?.subtotal || 0);

  const codCharge = paymentMethod === 'COD' ? Math.round(subtotal * 5) / 100 : 0;

  // Backend summary.totalAmount already accounts for GST (inclusive or exclusive).
  // COD surcharge is calculated on the product subtotal, matching the backend.
  const payableTotal = Number(summary?.totalAmount || 0) + codCharge;

  // Split the server-calculated GST in paise to avoid a 1-paisa rounding mismatch.
  // This display assumes a 5% intra-state GST rate (CGST 2.5% + SGST 2.5%).
  const gstPaise = Math.round(Number(summary?.taxAmount || 0) * 100);
  const cgstPaise = Math.ceil(gstPaise / 2);
  const sgstPaise = gstPaise - cgstPaise;
  // GST is part of the subtotal, not an additional charge.
  // Calculate the pre-tax product price in paise to preserve exact totals.
  const subtotalPaise = Math.round(subtotal * 100);
  const productPriceExcludingGst = (subtotalPaise - gstPaise) / 100;


  const fieldClass =

    'w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl ' +

    'px-3.5 py-2.5 text-sm text-stone-900 ' +

    'focus:outline-none focus:border-[#B5563C]';

  const labelClass =

    'block text-xs font-bold text-stone-700 mb-1.5';

  const inputField = (label, name, props = {}) => (

    <div className={props.wide ? 'sm:col-span-2' : ''}>

      <label className={labelClass} htmlFor={`address-${name}`}>

        {label}

      </label>

      <input

        id={`address-${name}`}

        name={name}

        type={props.type || 'text'}

        required={props.required ?? false}

        maxLength={props.maxLength}

        value={formData[name]}

        onChange={handleInputChange}

        placeholder={props.placeholder || ''}

        className={fieldClass}

      />

    </div>

  );

  return (

    <div className="bg-[#FAF6EF] min-h-screen py-10 sm:py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">

          <Link

            to="/cart"

            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#B5563C] mb-3"

          >

            <ArrowLeft size={16} />

            Return to Cart

          </Link>

          <h1 className="text-3xl font-serif font-bold text-[#2B241D]">

            Checkout & Shipping

          </h1>

          <p className="text-sm text-stone-500 mt-2">

            Complete your delivery details and place your order.

          </p>

        </div>

        {error && (

          <div

            role="alert"

            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"

          >

            <p className="text-sm text-red-700">{error}</p>

            <button

              type="button"

              onClick={loadCheckout}

              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-red-700"

            >

              <RefreshCw size={14} />

              Retry

            </button>

          </div>

        )}

                  {pendingOrder && (

            <section className="mb-6 bg-white border border-amber-300 rounded-2xl p-5 space-y-3">

              <h2 className="font-bold text-stone-900">

                Online payment pending — Order {pendingOrder.orderNumber || pendingOrder.id}

              </h2>

              <p className="text-sm text-stone-600">

                Your order is already created and the cart has been cleared.

                If payment may have been deducted, check My Orders before retrying or cancelling.

              </p>

              <div className="flex flex-wrap gap-3">

                <button

                  type="button"

                  disabled={submitting || cancellingOrder}

                  onClick={() => startRazorpayPayment(pendingOrder, true)}

                  className="px-5 py-3 bg-[#B5563C] text-white rounded-xl disabled:opacity-50"

                >

                  {submitting ? 'Processing...' : 'Retry Pending Payment'}

                </button>

                <button

                  type="button"

                  disabled={submitting || cancellingOrder || paymentInProgress.current}

                  onClick={handleCancelOrder}

                  className="px-5 py-3 border border-red-400 text-red-700 rounded-xl hover:bg-red-50 disabled:opacity-50"

                >

                  {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}

                </button>

                <Link to="/orders" className="px-5 py-3 border rounded-xl">

                  Check My Orders

                </Link>

                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-5 py-3 border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50"
                >
                  Exit to Shop
                </Link>

              </div>

            </section>

          )}

          {pendingOrder ? null : loading || cartLoading ? (

          <div className="bg-white p-12 rounded-3xl text-center">

            Loading your checkout...

          </div>

        ) : error ? null : noItems ? (

          <div className="bg-white p-12 rounded-3xl text-center">

            <h2 className="text-xl font-bold text-stone-800">

              Your Cart is Empty

            </h2>

            <Link

              to="/shop"

              className="inline-block mt-5 bg-[#B5563C] text-white px-6 py-3 rounded-xl"

            >

              Continue Shopping

            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            <div className="lg:col-span-7 space-y-6">

              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3]">

                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8DFD3]">

                  <h2 className="font-serif font-bold text-lg text-[#2B241D] flex items-center gap-2">

                    <MapPin className="w-5 h-5 text-[#B5563C]" />

                    Delivery Address

                  </h2>

                  {!showAddressForm && (

                    <button

                      type="button"

                      onClick={() => setShowAddressForm(true)}

                      className="inline-flex items-center gap-1 text-sm font-bold text-[#B5563C]"

                    >

                      <Plus size={16} />

                      Add New Address

                    </button>

                  )}

                </div>

                {!showAddressForm && addresses.length > 0 && (

                  <div className="space-y-3 mt-5">

                    {addresses.map((address) => (

                      <label

                        key={address.id}

                        className={`flex gap-3 p-4 border rounded-2xl cursor-pointer ${

                          selectedAddressId === String(address.id)

                            ? 'border-[#B5563C] bg-[#B5563C]/5'

                            : 'border-[#E8DFD3]'

                        }`}

                      >

                        <input

                          type="radio"

                          name="selectedAddress"

                          checked={

                            selectedAddressId === String(address.id)

                          }

                          onChange={() =>

                            setSelectedAddressId(String(address.id))

                          }

                          className="mt-1 accent-[#B5563C]"

                        />

                        <div className="text-sm text-stone-700">

                          <div className="font-bold text-[#2B241D]">

                            {address.fullName}

                            <span className="ml-2 text-xs text-[#B5563C]">

                              {address.addressType}

                            </span>

                            {address.defaultAddress && (

                              <span className="ml-2 text-xs text-green-700">

                                Default

                              </span>

                            )}

                          </div>

                          <p className="mt-1">

                            {address.addressLine1}

                            {address.addressLine2

                              ? `, ${address.addressLine2}`

                              : ''}

                          </p>

                          {address.landmark && (

                            <p>{address.landmark}</p>

                          )}

                          <p>

                            {address.city}, {address.state} -{' '}

                            {address.postalCode}

                          </p>

                          <p className="mt-1">

                            Mobile: {address.mobile}

                          </p>

                        </div>

                      </label>

                    ))}

                  </div>

                )}

                {showAddressForm && (

                  <form

                    onSubmit={handleSaveAddress}

                    className="mt-5 space-y-5"

                  >

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {inputField('Full Name *', 'fullName', {

                        required: true,

                        wide: true,

                      })}

                      {inputField('Mobile Number *', 'mobile', {

                        required: true,

                        maxLength: 10,

                        placeholder: '9876543210',

                      })}

                      {inputField('Address Line 1 *', 'addressLine1', {

                        required: true,

                        wide: true,

                      })}

                      {inputField('Address Line 2', 'addressLine2', {

                        wide: true,

                      })}

                      {inputField('Landmark', 'landmark', {

                        wide: true,

                      })}

                      {inputField('City *', 'city', {

                        required: true,

                      })}

                      <div>

                        <label

                          htmlFor="address-state"

                          className={labelClass}

                        >

                          State *

                        </label>

                        <select

                          id="address-state"

                          name="state"

                          value={formData.state}

                          onChange={handleInputChange}

                          className={fieldClass}

                        >

                          {INDIAN_STATES.map((state) => (

                            <option key={state} value={state}>

                              {state}

                            </option>

                          ))}

                        </select>

                      </div>

                      {inputField('PIN Code *', 'postalCode', {

                        required: true,

                        maxLength: 6,

                      })}

                      <div>

                        <label

                          htmlFor="address-type"

                          className={labelClass}

                        >

                          Address Type

                        </label>

                        <select

                          id="address-type"

                          name="addressType"

                          value={formData.addressType}

                          onChange={handleInputChange}

                          className={fieldClass}

                        >

                          <option value="HOME">Home</option>

                          <option value="WORK">Work</option>

                          <option value="OTHER">Other</option>

                        </select>

                      </div>

                      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-stone-700">

                        <input

                          type="checkbox"

                          name="defaultAddress"

                          checked={formData.defaultAddress}

                          onChange={handleInputChange}

                          className="accent-[#B5563C]"

                        />

                        Make this my default address

                      </label>

                    </div>

                    <div className="flex flex-wrap gap-3">

                      <button

                        type="submit"

                        disabled={savingAddress}

                        className="bg-[#B5563C] text-white font-bold px-6 py-3 rounded-xl disabled:opacity-60"

                      >

                        {savingAddress

                          ? 'Saving...'

                          : 'Save Delivery Address'}

                      </button>

                      {addresses.length > 0 && (

                        <button

                          type="button"

                          onClick={() => setShowAddressForm(false)}

                          className="border border-[#E8DFD3] px-6 py-3 rounded-xl"

                        >

                          Cancel

                        </button>

                      )}

                    </div>

                  </form>

                )}

              </section>

              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3]">

  <h2 className="font-serif font-bold text-lg text-[#2B241D] flex items-center gap-2 pb-4 border-b border-[#E8DFD3]">

    <CreditCard className="w-5 h-5 text-[#B5563C]" /> Payment Method

  </h2>

  <div className="mt-5 space-y-3">

    <label className={`flex gap-3 p-4 rounded-2xl border-2 cursor-pointer ${paymentMethod === 'RAZORPAY' ? 'border-[#B5563C] bg-[#B5563C]/5' : 'border-[#E8DFD3]'}`}>

      <input type="radio" name="paymentMethod" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />

      <CreditCard className="text-[#B5563C]" />

      <span><strong>Pay Online (Razorpay)</strong><span className="block text-xs text-stone-500">UPI, cards and supported methods</span></span>

    </label>

    <label className={`flex gap-3 p-4 rounded-2xl border-2 cursor-pointer ${paymentMethod === 'COD' ? 'border-[#B5563C] bg-[#B5563C]/5' : 'border-[#E8DFD3]'}`}>

      <input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />

      <Banknote className="text-green-700" />

      <span><strong>Cash on Delivery (COD)</strong><span className="block text-xs text-stone-500">Additional 5% COD charge</span></span>

    </label>

  </div>

</section>

              {user?.email && (

                <p className="text-sm text-stone-500">

                  Ordering as: {user.email}

                </p>

              )}

            </div>

            <div className="lg:col-span-5">

              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] space-y-5 lg:sticky lg:top-24">

                <h2 className="font-serif font-bold text-lg text-[#2B241D] pb-4 border-b border-[#E8DFD3]">

                  Order Summary

                </h2>

                <div className="divide-y divide-[#E8DFD3] max-h-80 overflow-y-auto">

                  {items.map((item) => {

                    const cartProduct = cartItems.find(

                      (cartItem) =>

                        String(cartItem.variantId) ===

                        String(item.variantId)

                    );

                    return (

                      <div

                        key={item.variantId}

                        className="py-3 flex items-center gap-3"

                      >

                        {cartProduct?.image ? (

                          <img

                            src={cartProduct.image}

                            alt={item.productName}

                            className="w-14 h-14 object-cover rounded-xl border border-[#E8DFD3]"

                          />

                        ) : (

                          <div className="w-14 h-14 bg-[#FAF6EF] rounded-xl flex items-center justify-center text-xs text-stone-400">

                            Product

                          </div>

                        )}

                        <div className="flex-1 min-w-0">

                          <p className="text-sm font-bold text-stone-800">

                            {item.productName}

                          </p>

                          <p className="text-xs text-stone-500">

                            SKU: {item.sku}

                          </p>

                          <p className="text-xs text-stone-500">

                            {money(item.unitPrice)} × {item.quantity}

                          </p>

                          {!item.available && (

                            <p className="text-xs font-bold text-red-600">

                              Unavailable

                            </p>

                          )}

                        </div>

                        <span className="text-sm font-bold text-stone-800">

                          {money(item.lineTotal)}

                        </span>

                      </div>

                    );

                  })}

                </div>

                <div className="space-y-3 pt-4 border-t border-[#E8DFD3] text-sm">
                  <div className="flex justify-between">
                    <span>Product Price (Excluding GST)</span>
                    <span>{money(productPriceExcludingGst)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>CGST (2.5%) — Included</span>
                    <span>{money(cgstPaise / 100)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>SGST (2.5%) — Included</span>
                    <span>{money(sgstPaise / 100)}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-[#2B241D] pt-2 border-t border-[#E8DFD3]">
                    <span>Product Price (Including GST)</span>
                    <span>{money(summary.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{Number(summary.deliveryCharge) === 0 ? 'FREE' : money(summary.deliveryCharge)}</span>
                  </div>

                  {Number(summary.discountAmount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-{money(summary.discountAmount)}</span>
                    </div>
                  )}

                  {paymentMethod === 'COD' && (
                    <div className="flex justify-between">
                      <span>COD Charge (5%)</span>
                      <span>{money(codCharge)}</span>
                    </div>
                  )}

                  <p className="text-xs text-green-700">
                    GST is already included in the product price. No additional product GST is charged.
                  </p>
                  <p className="text-xs text-stone-500">
                    CGST/SGST split shown assumes 5% intra-state GST. For other tax rates or inter-state supplies, the backend must provide the applicable tax breakdown.
                  </p>

                  <div className="flex justify-between pt-4 border-t border-[#E8DFD3] font-bold text-[#2B241D] text-lg">
                    <span>Total Payable</span>
                    <span>{money(payableTotal)}</span>
                  </div>
                </div>

                {hasUnavailableItems && (

                  <p className="text-sm text-red-600">

                    Some products are unavailable. Please update

                    your cart before placing the order.

                  </p>

                )}

                <button

                  type="button"

                  onClick={handlePlaceOrder}

                  disabled={

                    submitting ||

                    savingAddress ||

                    !selectedAddressId ||

                    hasUnavailableItems

                  }

                  className="w-full bg-[#B5563C] hover:bg-[#98452E] text-white font-bold rounded-xl py-4 transition disabled:opacity-50 disabled:cursor-not-allowed"

                >

                  {submitting

                    ? 'Placing Order...'

                    : `${paymentMethod === 'COD' ? 'Place COD Order' : 'Pay Online'} — ${money(payableTotal)}`}

                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-stone-500">

                  <ShieldCheck size={16} className="text-green-700" />

                  Secure checkout

                </div>

              </section>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}