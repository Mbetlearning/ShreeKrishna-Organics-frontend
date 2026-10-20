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

import { apiRequest } from '../services/api';
import { checkoutSessionApi } from '../services/checkoutSessionAPI';
import { clearBuyNowIntent } from '../services/buyNowIntent';

// Test Mode only. Do not turn on for a production build before completing payment/webhook tests.
const ONLINE_TEST_ENABLED = import.meta.env.VITE_ENABLE_CHECKOUT_RAZORPAY_TEST === 'true';
const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const found = document.querySelector('script[data-sko-razorpay]');
  if (found) {
    found.addEventListener('load', resolve, { once: true });
    found.addEventListener('error', () => reject(new Error('Razorpay did not load')), { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.dataset.skoRazorpay = '1';
  script.onload = resolve;
  script.onerror = () => reject(new Error('Razorpay did not load'));
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

export default function Checkout({ buyNowIntent = null }) {

  const navigate = useNavigate();
  const isBuyNow = Boolean(buyNowIntent);

  const { user } = useAuth();

  const { cartItems, cartLoading, refreshCart } = useCart();

  const { addToast } = useToast();

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [formData, setFormData] = useState(EMPTY_ADDRESS);

  const [summary, setSummary] = useState(null);
  const [buyNowDraft, setBuyNowDraft] = useState(null);
  const [buyNowQuoteError, setBuyNowQuoteError] = useState('');
  const [buyNowQuoteLoading, setBuyNowQuoteLoading] = useState(false);
  const [buyNowQuoteRetry, setBuyNowQuoteRetry] = useState(0);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

const [checkingPayment, setCheckingPayment] = useState(false);

  const [savingAddress, setSavingAddress] = useState(false);

  const [error, setError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [pendingOrder, setPendingOrder] = useState(null);
  const [pendingSessionId, setPendingSessionId] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [sessionNotice, setSessionNotice] = useState('');
  const paymentLock = useRef(false);
  const autoRecoverySessionRef = useRef(null);
  const sessionKey = user?.id != null ? `sko_checkout_session_${user.id}` :
    user?.email ? `sko_checkout_session_${user.email}` : null;

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

  useEffect(() => {
    if (!sessionKey) { setPendingSessionId(null); return; }
    setPendingSessionId(sessionStorage.getItem(sessionKey));
  }, [sessionKey]);

  const rememberSession = (id) => {
    setPendingSessionId(id);
    if (sessionKey) sessionStorage.setItem(sessionKey, id);
  };
  const forgetSession = () => {
    if (isBuyNow) clearBuyNowIntent();
    setPendingSessionId(null);
    setSessionNotice('');
    if (sessionKey) sessionStorage.removeItem(sessionKey);
  };

  const reconcileCheckoutSession = async (sessionId, { automatic = false } = {}) => {
    if (!sessionId || checkingPayment) return null;

    setCheckingPayment(true);
    setSessionNotice(
      automatic
        ? 'Checking your previous payment and confirming the order...'
        : 'Contacting the payment server...'
    );

    try {
      const recovery = await Promise.race([
        checkoutSessionApi.recovery(sessionId),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(
              new Error(
                'Payment status check timed out. Please try again later. Do not make another payment.'
              )
            ),
            20000
          )
        ),
      ]);

      if (
        recovery?.sessionStatus === 'FINALIZED' &&
        recovery?.finalizedOrderId
      ) {
        forgetSession();

        try {
          await refreshCart();
        } catch (err) {
          console.warn('Unable to refresh cart:', err);
        }

        navigate('/orders', {
          replace: true,
          state: { placedOrderId: recovery.finalizedOrderId },
        });

        return recovery;
      }

      if (recovery?.sessionStatus === 'ABANDONED') {
        forgetSession();
        setSessionNotice('Previous checkout was cancelled. You can start a fresh checkout.');
        return recovery;
      }

      if (recovery?.assessment === 'CAPTURED_NOT_FINALIZED') {
        setSessionNotice('Payment received. Confirming your order...');

        try {
          const finalized = await checkoutSessionApi.recoverCapturedPayment(
            sessionId
          );

          const orderId =
            finalized?.orderId ||
            finalized?.finalizedOrderId;

          if (finalized?.status === 'FINALIZED' && orderId) {
            forgetSession();

            try {
              await refreshCart();
            } catch (err) {
              console.warn(
                'Unable to refresh cart after payment recovery:',
                err
              );
            }

            addToast(
              'Payment received and order confirmed.',
              'success'
            );

            navigate('/orders', {
              replace: true,
              state: { placedOrderId: orderId },
            });

            return finalized;
          }

          setSessionNotice(
            finalized?.message ||
              'Payment was received, but order confirmation is still pending. Do not pay again.'
          );

          return finalized;
        } catch (err) {
          setSessionNotice(
            `${
              err.message ||
              'Payment was detected, but automatic order confirmation could not complete.'
            } Do not pay again.`
          );

          return null;
        }
      }

      if (recovery?.assessment === 'NO_CAPTURED_PAYMENT_OBSERVED') {
        setSessionNotice(
          'No captured payment was found at this time. You may retry the same online payment, switch safely to COD, or cancel this checkout after the server rechecks Razorpay.'
        );
        return recovery;
      }

      if (recovery?.assessment === 'AUTHORIZED_NOT_CAPTURED') {
        setSessionNotice(
          'Your payment is authorized but not yet captured. Please wait and check again. Do not retry, switch to COD, or cancel yet.'
        );
        return recovery;
      }

      setSessionNotice(
        `Status check completed: ${
          recovery?.assessment || recovery?.sessionStatus || 'UNKNOWN'
        }. ${recovery?.message || 'Please wait for payment reconciliation.'}`
      );

      return recovery;
    } catch (err) {
      setSessionNotice(
        err.message ||
          'Unable to check payment status. Do not make another payment until the status is known.'
      );
      return null;
    } finally {
      setCheckingPayment(false);
    }
  };

  const restoreBlockingSession = async () => {
    try {
      const eligibility = await checkoutSessionApi.eligibility();

      if (
        eligibility?.unresolvedPayment === true &&
        eligibility?.blockingSessionId
      ) {
        const blockingSessionId = eligibility.blockingSessionId;
        rememberSession(blockingSessionId);

        // Important recovery path:
        // If the customer paid and then closed the tab/browser before the
        // browser verification call completed, reconcile automatically when
        // checkout is opened again. A captured payment is finalized without
        // requiring the customer to click COD or Cancel Checkout.
        await reconcileCheckoutSession(blockingSessionId, {
          automatic: true,
        });

        return blockingSessionId;
      }

      return null;
    } catch (err) {
      console.warn('Unable to restore checkout session:', err);
      return null;
    }
  };

  const checkCheckoutSession = async () => {
    if (!pendingSessionId) return;
    await reconcileCheckoutSession(pendingSessionId);
  };
useEffect(() => {
  if (!pendingSessionId) return;

  // Run automatic recovery only once for each checkout session.
  if (autoRecoverySessionRef.current === pendingSessionId) {
    return;
  }

  if (
    checkingPayment ||
    submitting ||
    paymentOpen
  ) {
    return;
  }

  autoRecoverySessionRef.current = pendingSessionId;

  const timer = setTimeout(() => {
    setSessionNotice(
      'Checking your previous payment and confirming the order...'
    );

    checkCheckoutSession();
  }, 300);

  return () => clearTimeout(timer);
}, [pendingSessionId]);

  const clearPendingOrder = () => {

    setPendingOrder(null);

    if (pendingKey) sessionStorage.removeItem(pendingKey);

  };

const checkPendingOrder = async () => {

  if (!pendingOrder?.id) return null;

  try {

    const order = await customerOrderApi.getOrderById(pendingOrder.id);

    if (order.paymentStatus === 'PAID') {

      clearPendingOrder();

      await refreshCart();

      navigate('/orders', {

        replace: true,

        state: { placedOrderId: order.id },

      });

      return order;

    }

    if (order.status === 'CANCELLED') {

      clearPendingOrder();

      await loadCheckout();

      return order;

    }

    if (order.paymentStatus === 'PENDING') {

      addToast(

        'Payment is still pending. Please retry or check My Orders.',

        'info'

      );

    }

    return order;

  } catch (err) {

    addToast(

      err.message || 'Unable to check payment status.',

      'error'

    );

    return null;

  }

};

const loadCheckout = async () => {

    setLoading(true);

    setError('');

    try {

      const [addressList, checkoutSummary] =

        await Promise.all([

          addressApi.getAddresses(),

          isBuyNow ? Promise.resolve(null) : customerOrderApi.getCheckoutSummary(),

        ]);

      const list = Array.isArray(addressList)

        ? addressList

        : [];

      setAddresses(list);

      setSummary(isBuyNow ? {
        items: [{ variantId: buyNowIntent.variantId, productName: buyNowIntent.productName,
          quantity: buyNowIntent.quantity, available: true, unitPrice: 0, lineTotal: 0 }],
        subtotal: 0, totalAmount: 0, deliveryCharge: 0, taxAmount: 0,
      } : checkoutSummary);

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

            isBuyNow ? Promise.resolve(null) : customerOrderApi.getCheckoutSummary(),

          ]);

        if (!active) return;

        const list = Array.isArray(addressList)

          ? addressList

          : [];

        setAddresses(list);

        setSummary(isBuyNow ? {
        items: [{ variantId: buyNowIntent.variantId, productName: buyNowIntent.productName,
          quantity: buyNowIntent.quantity, available: true, unitPrice: 0, lineTotal: 0 }],
        subtotal: 0, totalAmount: 0, deliveryCharge: 0, taxAmount: 0,
      } : checkoutSummary);

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

    const initializePage = async () => {
      await initialize();
      if (active) {
        await restoreBlockingSession();
      }
    };

    initializePage();

    return () => {

      active = false;

    };

  }, []);

  // Stage 3: creating a CREATED Buy Now draft has no reservation or payment.
  // It lets the customer review the ACTUAL server-calculated price BEFORE paying.
  useEffect(() => {
    if (!isBuyNow || !selectedAddressId) return;
    let active = true;
    setBuyNowDraft(null);
    setBuyNowQuoteError('');
    setBuyNowQuoteLoading(true);
    checkoutSessionApi.createBuyNowDraft(
      selectedAddressId, buyNowIntent.variantId, buyNowIntent.quantity
    ).then(draft => {
      if (!active) return;
      if (!draft?.id || !draft?.items?.length) throw new Error('Buy Now quote unavailable.');
      setBuyNowDraft(draft);
      const subtotal = Number(draft.subtotal || 0);
      const totalAmount = Number(draft.totalAmount || 0);
      setSummary({
        items: draft.items.map(item => ({ ...item, available: true })),
        subtotal, totalAmount,
        deliveryCharge: Math.max(0, Math.round((totalAmount - subtotal) * 100) / 100),
        taxAmount: 0,
        discountAmount: 0,
      });
    }).catch(err => {
      if (active) setBuyNowQuoteError(err.message || 'Unable to calculate Buy Now total.');
    }).finally(() => {
      if (active) setBuyNowQuoteLoading(false);
    });
    return () => { active = false; };
  }, [isBuyNow, selectedAddressId, buyNowIntent?.variantId, buyNowIntent?.quantity, buyNowQuoteRetry]);

  const activeBuyNowDraft = isBuyNow && buyNowDraft &&
    String(buyNowDraft.addressId) === String(selectedAddressId) &&
    new Date(buyNowDraft.expiresAt).getTime() > Date.now()
      ? buyNowDraft : null;

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

  const openRazorpayForSession = async (sessionId, payment) => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      throw new Error('VITE_RAZORPAY_KEY_ID (public Test Key ID) is missing.');
    }

    if (!payment?.razorpayOrderId) {
      throw new Error(
        'Payment state is uncertain. Check Payment Status before trying again.'
      );
    }

    const amountPaise = Math.round(Number(payment.amount) * 100);
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
      throw new Error('Unexpected checkout amount. Payment blocked.');
    }

    await loadRazorpayScript();
    setPaymentOpen(true);

    const checkout = new window.Razorpay({
      key,
      order_id: payment.razorpayOrderId,
      amount: amountPaise,
      currency: payment.currency || 'INR',
      name: 'ShreeKrishna Organics',
      description: 'Secure online checkout',
      prefill: { email: user?.email || '' },
      handler: async (result) => {
        setPaymentOpen(false);
        setSubmitting(true);
        setSessionNotice('Verifying captured payment. Do not pay again.');

        try {
          const verified = await checkoutSessionApi.verify(sessionId, result);

          if (verified?.status !== 'FINALIZED' || !verified?.orderId) {
            throw new Error(
              'Verification is not finalized. Check payment status.'
            );
          }

          forgetSession();

          try {
            await refreshCart();
          } catch (err) {
            console.warn('Unable to refresh cart after payment:', err);
          }

          addToast('Payment verified. Order created!', 'success');
          navigate('/orders', {
            replace: true,
            state: { placedOrderId: verified.orderId },
          });
        } catch (err) {
          setSessionNotice(
            `${err.message || 'Verification pending.'} ` +
              'Do not pay again; check payment status.'
          );
          addToast(
            'Payment may have succeeded. Check status; do not pay again.',
            'error'
          );
        } finally {
          setSubmitting(false);
          paymentLock.current = false;
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentOpen(false);
          setSubmitting(false);
          paymentLock.current = false;
          setSessionNotice(
            'Razorpay closed. No new Razorpay order will be created. ' +
              'Use Check Payment Status, or Retry Same Online Payment to continue this checkout.'
          );
        },
      },
    });

    checkout.on('payment.failed', () => {
      setSessionNotice(
        'This payment attempt was reported failed. Check status first; ' +
          'then you may retry the SAME online checkout session.'
      );
    });

    checkout.open();
  };

  const resumePendingOnlinePayment = async () => {
    if (!ONLINE_TEST_ENABLED) {
      addToast('Online payment is not enabled for this environment.', 'info');
      return;
    }

    if (
      !pendingSessionId ||
      paymentLock.current ||
      submitting ||
      checkingPayment ||
      paymentOpen
    ) {
      return;
    }

    paymentLock.current = true;
    setSubmitting(true);
    setSessionNotice('Checking the existing payment before retrying...');

    try {
      const recovery = await checkoutSessionApi.recovery(pendingSessionId);

      if (
        recovery?.sessionStatus === 'FINALIZED' &&
        recovery?.finalizedOrderId
      ) {
        const orderId = recovery.finalizedOrderId;
        forgetSession();
        try {
          await refreshCart();
        } catch (err) {
          console.warn('Unable to refresh cart:', err);
        }
        navigate('/orders', {
          replace: true,
          state: { placedOrderId: orderId },
        });
        return;
      }

      if (recovery?.assessment === 'CAPTURED_NOT_FINALIZED') {
        setSessionNotice('Payment captured. Finalizing your order...');

        const finalized =
          await checkoutSessionApi.recoverCapturedPayment(pendingSessionId);

        const orderId = finalized?.orderId || finalized?.finalizedOrderId;
        if (finalized?.status === 'FINALIZED' && orderId) {
          forgetSession();
          try {
            await refreshCart();
          } catch (err) {
            console.warn('Unable to refresh cart:', err);
          }
          addToast('Payment recovered and order confirmed.', 'success');
          navigate('/orders', {
            replace: true,
            state: { placedOrderId: orderId },
          });
          return;
        }

        throw new Error(
          finalized?.message ||
            'Captured payment is still awaiting finalization. Do not pay again.'
        );
      }

      if (recovery?.assessment === 'AUTHORIZED_NOT_CAPTURED') {
        setSessionNotice(
          'A payment is authorized and may still be captured. Do not retry or choose COD yet.'
        );
        return;
      }

      if (recovery?.assessment !== 'NO_CAPTURED_PAYMENT_OBSERVED') {
        setSessionNotice(
          recovery?.message ||
            'Payment state is still uncertain. Do not start another payment.'
        );
        return;
      }

      // IMPORTANT: start-payment is intentionally called with the SAME session ID.
      // The backend reuses the existing PAYMENT_PENDING Razorpay order; it does not
      // create a new checkout session or a second Razorpay order.
      const payment = await checkoutSessionApi.startPayment(pendingSessionId);
      await openRazorpayForSession(pendingSessionId, payment);
    } catch (err) {
      setSessionNotice(
        err.message ||
          'Unable to safely resume this payment. Check status again before retrying.'
      );
      addToast(
        err.message || 'Unable to resume the existing payment.',
        'error'
      );
      paymentLock.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const switchPendingPaymentToCod = async () => {
    if (
      !pendingSessionId ||
      paymentLock.current ||
      submitting ||
      checkingPayment ||
      paymentOpen
    ) {
      return;
    }

    const confirmed = window.confirm(
      'Switch this checkout to Cash on Delivery? The server will first check Razorpay so a captured or authorized payment is not duplicated.'
    );
    if (!confirmed) return;

    paymentLock.current = true;
    setSubmitting(true);
    setSessionNotice('Checking Razorpay before switching this checkout to Cash on Delivery...');

    try {
      const result = await checkoutSessionApi.switchToCod(pendingSessionId);
      const orderId = result?.orderId || result?.finalizedOrderId;

      if (!orderId) {
        throw new Error(
          result?.message || 'The payment method could not be changed safely.'
        );
      }

      forgetSession();
      try {
        await refreshCart();
      } catch (err) {
        console.warn('Unable to refresh cart after payment-mode switch:', err);
      }

      if (result?.switchedToCod === true || result?.assessment === 'COD_ORDER_CREATED') {
        addToast('Order placed successfully with Cash on Delivery.', 'success');
      } else {
        addToast(
          result?.message || 'Online payment was already captured and the order was finalized.',
          'success'
        );
      }

      navigate('/orders', {
        replace: true,
        state: { placedOrderId: orderId },
      });
    } catch (err) {
      setSessionNotice(
        err.message ||
          'Unable to switch to COD safely. Check payment status before trying again.'
      );
      addToast(
        err.message || 'Unable to switch this checkout to Cash on Delivery.',
        'error'
      );
    } finally {
      setSubmitting(false);
      paymentLock.current = false;
    }
  };

  const cancelPendingCheckout = async () => {
    if (
      !pendingSessionId ||
      paymentLock.current ||
      submitting ||
      checkingPayment ||
      paymentOpen
    ) {
      return;
    }

    const confirmed = window.confirm(
      'Cancel this checkout and continue shopping? The server will first check Razorpay. If a payment is captured, authorized, processing, or otherwise uncertain, cancellation will be blocked.'
    );
    if (!confirmed) return;

    paymentLock.current = true;
    setSubmitting(true);
    setSessionNotice('Checking Razorpay before cancelling this checkout...');

    try {
      const result = await checkoutSessionApi.cancelCheckout(pendingSessionId);
      const orderId = result?.finalizedOrderId || result?.orderId;

      // A payment may have completed while the user was trying to cancel.
      if (
        result?.status === 'FINALIZED' ||
        result?.assessment === 'ONLINE_PAYMENT_FINALIZED'
      ) {
        forgetSession();
        try {
          await refreshCart();
        } catch (err) {
          console.warn('Unable to refresh cart after payment finalization:', err);
        }

        addToast(
          result?.message || 'Payment was already completed, so your order was confirmed instead of cancelled.',
          'success'
        );

        navigate('/orders', {
          replace: true,
          state: { placedOrderId: orderId },
        });
        return;
      }

      if (result?.cancelled === true || result?.status === 'ABANDONED') {
        forgetSession();

        try {
          await refreshCart();
        } catch (err) {
          console.warn('Unable to refresh cart after checkout cancellation:', err);
        }

        addToast(
          result?.message || 'Checkout cancelled. You can modify your cart and continue shopping.',
          'success'
        );

        navigate('/cart', { replace: true });
        return;
      }

      throw new Error(
        result?.message || 'This checkout could not be cancelled safely.'
      );
    } catch (err) {
      setSessionNotice(
        err.message ||
          'Unable to cancel this checkout safely. Check payment status before trying again.'
      );
      addToast(
        err.message || 'Unable to cancel this checkout safely.',
        'error'
      );
    } finally {
      setSubmitting(false);
      paymentLock.current = false;
    }
  };

  const startOnlineCheckout = async () => {
    if (!ONLINE_TEST_ENABLED) {
      addToast('Online payment is not enabled for this environment.', 'info');
      return;
    }

    if (paymentLock.current || submitting || pendingOrder) {
      return;
    }

    // A remembered unresolved session must be resumed, never replaced by a new one.
    if (pendingSessionId) {
      await resumePendingOnlinePayment();
      return;
    }

    if (
      !selectedAddressId ||
      !summary?.items?.length ||
      summary.items.some((item) => !item.available)
    ) {
      addToast('Select a valid address and check your selection.', 'error');
      return;
    }

    paymentLock.current = true;
    setSubmitting(true);

    try {
      const eligibility = await checkoutSessionApi.eligibility();

      if (eligibility?.unresolvedPayment === true) {
        if (eligibility?.blockingSessionId) {
          rememberSession(eligibility.blockingSessionId);
          setSessionNotice(
            eligibility.message ||
              'A previous payment requires reconciliation.'
          );
        }

        throw new Error(
          'A previous online checkout already exists. Use Retry Same Online Payment instead of creating another charge.'
        );
      }

      if (eligibility?.canStartNewOnlineCheckout !== true) {
        throw new Error(
          eligibility?.message || 'Online checkout is currently blocked.'
        );
      }

      if (isBuyNow && !activeBuyNowDraft) {
        throw new Error('Your Buy Now quote expired. Refresh the quote and review the amount before paying.');
      }
      const draft = isBuyNow
        ? activeBuyNowDraft
        : await checkoutSessionApi.createDraft(selectedAddressId);
      if (!draft?.id) {
        throw new Error('Checkout session was not created.');
      }

      // Save the session before contacting Razorpay.
      rememberSession(draft.id);

      const payment = await checkoutSessionApi.startPayment(draft.id);
      await openRazorpayForSession(draft.id, payment);
    } catch (err) {
      setPaymentOpen(false);
      setSessionNotice(err.message || 'Online checkout could not be started.');
      addToast(err.message || 'Unable to start payment.', 'error');
      paymentLock.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (submitting || savingAddress || loading || paymentLock.current) return;
    if (paymentMethod === 'RAZORPAY') return startOnlineCheckout();
    if (pendingSessionId || pendingOrder) {
      addToast('An earlier payment requires reconciliation before placing COD.', 'error');
      return;
    }
    if (!selectedAddressId) return addToast('Please select a delivery address.', 'error');
    if (!summary?.items?.length) return addToast('Your checkout selection is empty.', 'error');
    if (summary.items.some((item) => !item.available)) {
      return addToast('Some selected products are unavailable.', 'error');
    }
    setSubmitting(true);
    try {
      const eligibility = await checkoutSessionApi.eligibility();
      if (eligibility?.canAttemptCOD !== true || eligibility?.unresolvedPayment === true) {
        throw new Error(eligibility?.message || 'Earlier payment unresolved.');
      }
      let order;
      if (isBuyNow) {
        const draft = activeBuyNowDraft;
        if (!draft) throw new Error('Buy Now quote expired. Refresh it before ordering.');
        if (!draft?.id) throw new Error('Buy Now checkout draft was not created.');
        // Save the draft to prevent a second order after an ambiguous network failure.
        // Recovery APIs own any subsequent reconciliation; never blindly resubmit.
        rememberSession(draft.id);
        const result = await checkoutSessionApi.placeBuyNowCod(draft.id);
        if (!result?.orderId) throw new Error(result?.message || 'Order confirmation unavailable. Check My Orders before retrying.');
        order = { id: result.orderId };
        forgetSession();
        clearBuyNowIntent();
      } else {
        order = await customerOrderApi.placeOrder(selectedAddressId, 'COD');
        if (!order?.id) throw new Error('Order confirmation unavailable. Check your orders before retrying.');
      }
      try { await refreshCart(); } catch (e) { console.warn(e); }
      addToast(`Order ${order.orderNumber || order.id} placed successfully!`, 'success');
      navigate('/orders', { replace: true, state: { placedOrderId: order.id } });
    } catch (err) {
      addToast(err.message || 'Order could not be placed. Check your orders before retrying.', 'error');
      if (!isBuyNow) { try { setSummary(await customerOrderApi.getCheckoutSummary()); } catch { /* preserve original error */ } }
    } finally {
      setSubmitting(false);
    }
  };

  const items = summary?.items || [];

  const hasUnavailableItems = items.some((item) => !item.available);

  const noItems = !loading && items.length === 0;

  const subtotal = Number(summary?.subtotal || 0);

  const codCharge = paymentMethod === 'COD' ? Math.round(subtotal * 5) / 100 : 0;

  const payableTotal = Number(summary?.totalAmount || 0) + codCharge;

  // GST display is based on the server-provided tax amount.
  // The backend remains authoritative for the actual tax amount and final payable total.
  // Product prices are GST-inclusive, so the taxable value is subtotal - recorded GST.
  const gstPaise = Math.round(Number(summary?.taxAmount || 0) * 100);
  const subtotalPaise = Math.round(subtotal * 100);
  const productPriceExcludingGst = Math.max(0, (subtotalPaise - gstPaise) / 100);

  // Split the recorded GST amount in integer paise so CGST + SGST always equals
  // the server-provided GST amount exactly, even when there is a 1-paise rounding difference.
  const cgstPaise = Math.ceil(gstPaise / 2);
  const sgstPaise = gstPaise - cgstPaise;

  // Derive the effective TOTAL GST rate from the actual tax recorded by the backend.
  // Example: total GST 2.5% => CGST 1.25% + SGST 1.25%.
  const effectiveGstRate =
    gstPaise > 0 && productPriceExcludingGst > 0
      ? (Number(summary?.taxAmount || 0) / productPriceExcludingGst) * 100
      : 0;

  const cgstRate = effectiveGstRate / 2;
  const sgstRate = effectiveGstRate / 2;

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

            to={isBuyNow ? '/shop' : '/cart'}

            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#B5563C] mb-3"

          >

            <ArrowLeft size={16} />

            {isBuyNow ? 'Return to Shopping' : 'Return to Cart'}

          </Link>

          <h1 className="text-3xl font-serif font-bold text-[#2B241D]">

            {isBuyNow ? 'Buy Now — Checkout & Shipping' : 'Checkout & Shipping'}

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

{pendingSessionId && !paymentOpen && (
  <section className="mb-6 bg-white border border-amber-300 rounded-2xl p-5 space-y-3">
    <h2 className="font-bold text-stone-900">Online checkout payment needs confirmation</h2>
    <p className="text-sm text-stone-600">{sessionNotice || 'A prior checkout session exists. Do not pay again until its status is confirmed.'}</p>
    <p className="text-xs text-stone-500 break-all">Checkout Session: {pendingSessionId}</p>
    <button type="button" onClick={checkCheckoutSession} disabled={checkingPayment || submitting}
      className="px-5 py-3 border border-[#B5563C] rounded-xl disabled:opacity-50">
      {checkingPayment ? 'Checking...' : 'Check Payment Status'}
    </button>
    <button
      type="button"
      onClick={resumePendingOnlinePayment}
      disabled={checkingPayment || submitting || paymentOpen || !ONLINE_TEST_ENABLED}
      className="ml-3 px-5 py-3 bg-[#B5563C] text-white rounded-xl disabled:opacity-50"
    >
      {submitting ? 'Working...' : 'Retry Same Online Payment'}
    </button>
    <button
      type="button"
      onClick={switchPendingPaymentToCod}
      disabled={checkingPayment || submitting || paymentOpen}
      className="ml-3 px-5 py-3 bg-green-700 text-white rounded-xl disabled:opacity-50"
    >
      {submitting ? 'Checking Payment...' : 'Switch to COD & Place Order'}
    </button>
    <button
      type="button"
      onClick={cancelPendingCheckout}
      disabled={checkingPayment || submitting || paymentOpen}
      className="ml-3 px-5 py-3 border border-stone-400 text-stone-700 rounded-xl disabled:opacity-50"
    >
      {submitting ? 'Checking Payment...' : 'Cancel This Checkout & Continue Shopping'}
    </button>
    <p className="text-xs text-amber-800">Retry continues the same Razorpay order. Switch to COD converts this same checkout into one COD order. Cancel Checkout first verifies Razorpay, releases the checkout reservation only when safe, keeps your current cart unchanged, and lets you start a fresh checkout.</p>
  </section>
)}

{pendingOrder && (

  <section className="mb-6 bg-white border border-amber-300 rounded-2xl p-5 space-y-3">

    <h2 className="font-bold text-stone-900">

      Previous online order needs review — {pendingOrder.orderNumber || pendingOrder.id}

    </h2>

    <p className="text-sm text-stone-600">

      This order was created using the old online checkout. Check its payment status before placing another order. You can view address and payment choices below, but checkout submission is blocked until this order is resolved.

    </p>

    <div className="flex flex-wrap gap-3">

      {/* NEW: Check Payment Status Button */}

      <button

        type="button"

        disabled={submitting}

        onClick={checkPendingOrder}

        className="px-5 py-3 border border-[#B5563C] rounded-xl"

      >

        Check Payment Status

      </button>

      {/* Existing My Orders Button */}

      <Link

        to="/orders"

        className="px-5 py-3 border rounded-xl"

      >

        Check My Orders

      </Link>

    </div>

  </section>

)}

          {loading || (!isBuyNow && cartLoading) ? (

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

    <label className={`flex gap-3 p-4 rounded-2xl border-2 ${ONLINE_TEST_ENABLED ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'} ${paymentMethod === 'RAZORPAY' ? 'border-[#B5563C] bg-[#B5563C]/5' : 'border-[#E8DFD3]'}`}>
      <input type="radio" name="paymentMethod" disabled={!ONLINE_TEST_ENABLED} checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />
      <CreditCard className="text-[#B5563C]" />
      <span><strong>Pay Online (Razorpay)</strong><span className="block text-xs text-stone-500">{ONLINE_TEST_ENABLED ? 'Razorpay Test Mode — UPI / card' : 'Temporarily unavailable — Test Mode integration only'}</span></span>
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

                    const cartProduct = isBuyNow ? { image: buyNowIntent?.image } : cartItems.find(

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

                {isBuyNow ? (
                  <div className="pt-4 border-t border-[#E8DFD3] text-sm text-stone-700 space-y-3">
                    <p className="font-semibold">Buy Now — selected product only</p>
                    {buyNowQuoteLoading ? <p>Calculating final price using the backend...</p> :
                    buyNowQuoteError || !activeBuyNowDraft ? (
                      <div role="alert" className="text-red-700">
                        <p>{buyNowQuoteError || 'The quote expired. Please refresh to review the final amount.'}</p>
                        <button type="button" className="underline font-semibold mt-2" onClick={() => setBuyNowQuoteRetry(x => x + 1)}>Refresh Buy Now quote</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between"><span>Product subtotal</span><span>{money(summary.subtotal)}</span></div>
                        <div className="flex justify-between"><span>Delivery and applicable additional taxes</span><span>{money(Number(summary.totalAmount) - Number(summary.subtotal))}</span></div>
                        {paymentMethod === 'COD' && <div className="flex justify-between"><span>COD charge (5%)</span><span>{money(codCharge)}</span></div>}
                        <div className="flex justify-between font-bold text-lg border-t pt-3"><span>Total Payable</span><span>{money(payableTotal)}</span></div>
                        <p className="text-xs text-stone-500">Amounts are calculated by the backend checkout draft. GST included in product prices, if applicable, is not itemized in this draft response.</p>
                      </>
                    )}
                    <p className="text-xs">Your existing cart items are not included in or removed by this order.</p>
                  </div>
                ) : (
                <div className="space-y-3 pt-4 border-t border-[#E8DFD3] text-sm">
                  <div className="flex justify-between">
                    <span>Product Price (Excluding GST)</span>
                    <span>{money(productPriceExcludingGst)}</span>
                  </div>

                  {gstPaise > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>CGST ({cgstRate.toFixed(2)}%) — Included</span>
                        <span>{money(cgstPaise / 100)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>SGST ({sgstRate.toFixed(2)}%) — Included</span>
                        <span>{money(sgstPaise / 100)}</span>
                      </div>
                    </>
                  )}

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
                    GST is included in the product price.
                  </p>

                  {gstPaise > 0 && (
                    <p className="text-xs text-stone-500">
                      CGST and SGST are shown as an equal split of the GST recorded by the server.
                    </p>
                  )}

                  <div className="flex justify-between pt-4 border-t border-[#E8DFD3] font-bold text-[#2B241D] text-lg">
                    <span>Total Payable</span>
                    <span>{money(payableTotal)}</span>
                  </div>
                </div>

                )}

                {hasUnavailableItems && (

                  <p className="text-sm text-red-600">

                    Some products are unavailable. Please update

                    your cart before placing the order.

                  </p>

                )}

                {/* Explain exactly why checkout is blocked; never bypass payment reconciliation. */}
                {(pendingSessionId || pendingOrder || !selectedAddressId ||
                  hasUnavailableItems ||
                  (paymentMethod === 'RAZORPAY' && !ONLINE_TEST_ENABLED)) && (
                  <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    {pendingSessionId ? (
                      <>
                        <p className="font-semibold">Previous online checkout requires verification.</p>
                        <p className="mt-1">Please use Check Payment Status in the section above. If the server confirms that no payment was captured, use the safe retry, switch-to-COD, or cancel options there. A new order is blocked to prevent duplicate charges.</p>
                        <button type="button" onClick={checkCheckoutSession}
                          disabled={checkingPayment || submitting || paymentOpen}
                          className="mt-2 underline font-semibold disabled:opacity-50">
                          {checkingPayment ? 'Checking payment...' : 'Check Payment Status'}
                        </button>
                      </>
                    ) : pendingOrder ? (
                      <>An earlier online order is awaiting confirmation. Use Check Payment Status above before placing another order.</>
                    ) : !selectedAddressId ? (
                      <>Select or save a delivery address to continue.</>
                    ) : hasUnavailableItems ? (
                      <>Some cart items are unavailable. Update your cart before checkout.</>
                    ) : (
                      <>Razorpay test mode is disabled. Enable VITE_ENABLE_CHECKOUT_RAZORPAY_TEST=true in your local frontend environment and restart Vite, or choose COD.</>
                    )}
                  </div>
                )}

                <button

                  type="button"

                  onClick={handlePlaceOrder}

                  disabled={

                    submitting ||

                    savingAddress ||

                    loading ||

                    (!isBuyNow && cartLoading) ||
                    (isBuyNow && !activeBuyNowDraft) ||
                    buyNowQuoteLoading ||

                    checkingPayment ||

                    paymentOpen ||

                    !selectedAddressId ||

                    hasUnavailableItems ||
                      Boolean(pendingOrder) ||
                      Boolean(pendingSessionId) ||
                      (paymentMethod === 'RAZORPAY' && !ONLINE_TEST_ENABLED)

                  }

                  className="w-full bg-[#B5563C] hover:bg-[#98452E] text-white font-bold rounded-xl py-4 transition disabled:opacity-50 disabled:cursor-not-allowed"

                >

                  {submitting
                    ? paymentMethod === 'RAZORPAY'
                      ? 'Opening Secure Payment...'
                      : 'Placing COD Order...'
                    : paymentMethod === 'RAZORPAY'
                      ? `Pay Online — ${money(payableTotal)}`
                      : `Place COD Order — ${money(payableTotal)}`}

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
