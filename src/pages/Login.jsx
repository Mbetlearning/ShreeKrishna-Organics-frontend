
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, ShieldCheck, Loader2, ChevronDown, ChevronUp, LockKeyhole, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { getBuyNowIntent } from '../services/buyNowIntent';

const MSG91_WIDGET_ID = '366a7369364c373236343039';

// Add the tokenAuth from MSG91 Client Side Integration
// to the frontend .env.local file.
const MSG91_TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH;

const OTP_SCRIPT_URLS = [
  'https://verify.msg91.com/otp-provider.js',
  'https://verify.phone91.com/otp-provider.js',
];

let otpScriptPromise = null;

function loadMsg91Script() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Browser is required.'));
  }

  if (typeof window.initSendOTP === 'function') {
    return Promise.resolve();
  }

  if (otpScriptPromise) {
    return otpScriptPromise;
  }

  otpScriptPromise = new Promise((resolve, reject) => {
    const loadScript = (index) => {
      if (index >= OTP_SCRIPT_URLS.length) {
        reject(new Error('Unable to load MSG91 OTP service.'));
        return;
      }

      const script = document.createElement('script');
      script.src = OTP_SCRIPT_URLS[index];
      script.async = true;

      script.onload = () => {
        if (typeof window.initSendOTP === 'function') {
          resolve();
        } else {
          script.remove();
          loadScript(index + 1);
        }
      };

      script.onerror = () => {
        script.remove();
        loadScript(index + 1);
      };

      document.head.appendChild(script);
    };

    loadScript(0);
  }).catch((error) => {
    otpScriptPromise = null;
    throw error;
  });

  return otpScriptPromise;
}

function extractAccessToken(data) {
  if (typeof data === 'string') return data.trim();
  if (!data || typeof data !== 'object') return '';

  // MSG91 Web Widget success callback commonly returns
  // { type: 'success', message: '<access-token>' }.
  // Never treat a failed response's message as a token.
  if (data.type && String(data.type).toLowerCase() !== 'success') return '';

  const token =
    data.accessToken ||
    data.access_token ||
    data['access-token'] ||
    data.token ||
    data.message;

  return typeof token === 'string' ? token.trim() : '';
}

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const positivePrice = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

function CheckoutOrderSummary({ mode, items }) {
  const [expanded, setExpanded] = useState(false);
  const hasItems = items.length > 0;
  const pricedItems = hasItems && items.every((item) => item.unitPrice !== null);
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice ?? 0) * item.quantity, 0);
  const savings = items.reduce((sum, item) => {
    if (item.unitPrice === null || item.mrp === null) return sum;
    return sum + Math.max(0, item.mrp - item.unitPrice) * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E1D5C5] bg-white shadow-sm" aria-label="Checkout order summary">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls="checkout-login-order-detail"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5 sm:py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#086652]"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E9F3EB] text-[#00634F]"><ShoppingBag className="h-5 w-5" /></span>
          <span className="min-w-0">
            <span className="block font-serif text-base font-bold text-[#2B241D] sm:text-lg">Order Summary ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})</span>
            <span className="block text-[11px] text-stone-500">{mode === 'BUY_NOW' ? 'Buy Now · Selected product only' : 'Your shopping cart'} · Tap to {expanded ? 'hide' : 'view'} details</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-right">
          <span>
            <span className="block text-sm font-extrabold text-[#075E4C] sm:text-base">{pricedItems ? formatPrice(subtotal) : 'Price confirmed at checkout'}</span>
            {savings > 0 && <span className="block text-[11px] font-semibold text-[#B5563C]">Save {formatPrice(savings)}</span>}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-[#00634F]" /> : <ChevronDown className="h-4 w-4 text-[#00634F]" />}
        </span>
      </button>
      {expanded && (
        <div id="checkout-login-order-detail" className="border-t border-[#E8DFD3] bg-[#FFFCF7] px-4 py-3 sm:px-5">
          {hasItems ? <div className="space-y-4">
            {items.map((item, index) => <div key={`${item.variantId || 'item'}-${index}`} className="flex items-start gap-3">
              {item.image ? <img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-[#E8DFD3] object-cover" /> : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#EEE8DF] text-[#00634F]"><ShoppingBag className="h-5 w-5" /></div>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#2B241D]">{item.name}</p>
                {item.size && <p className="text-xs text-stone-500">{item.size}</p>}
                <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-[#2B241D]">{item.unitPrice !== null ? formatPrice(item.unitPrice * item.quantity) : 'Price at checkout'}</span>
            </div>)}
            {pricedItems && <div className="space-y-2 border-t border-[#E8DFD3] pt-3 text-sm">
              <div className="flex justify-between"><span className="text-stone-600">Estimated products total</span><span className="font-semibold text-[#2B241D]">{formatPrice(subtotal)}</span></div>
              {savings > 0 && <div className="flex justify-between text-[#0B7956]"><span>Product savings</span><span className="font-bold">{formatPrice(savings)}</span></div>}
            </div>}
            <div className="flex gap-2 rounded-lg bg-[#E9F3EB] px-3 py-2 text-xs leading-relaxed text-[#285E50]"><Truck className="mt-0.5 h-4 w-4 shrink-0" />Final delivery fees, taxes and payment charges are confirmed at checkout after your address is selected.</div>
          </div> : <p className="text-sm text-stone-600">Your selected products will be confirmed during checkout.</p>}
        </div>
      )}
    </section>
  );
}

export default function Login() {
  const { loginWithOtp, loading } = useAuth();
  const { cartItems } = useCart();

  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const requestedPath = location.state?.from;

  const redirectPath =
    typeof requestedPath === 'string'
      ? requestedPath
      : requestedPath?.pathname
        ? `${requestedPath.pathname}${requestedPath.search || ''}${requestedPath.hash || ''}`
        : '/';

  const safeRedirect =
    redirectPath.startsWith('/') &&
    !redirectPath.startsWith('//') &&
    !['/login', '/register'].includes(
      redirectPath.split(/[?#]/)[0]
    )
      ? redirectPath
      : '/';

  const handleOtpSuccess = async (data) => {
    if (!mountedRef.current || inFlightRef.current) {
      return;
    }

    const accessToken = extractAccessToken(data);

    if (!accessToken) {
      setError(
        'OTP was verified, but no verification token was received. Please try again.'
      );
      return;
    }

    inFlightRef.current = true;
    setProcessing(true);
    setError('');
    setStatus('Verifying your mobile number and signing you in...');

    try {
      // Backend verifies the token directly with MSG91.
      // Do not send the mobile as proof of identity.
      const result = await loginWithOtp({ accessToken });

      if (!mountedRef.current) {
        return;
      }

      if (result?.success) {
        navigate(safeRedirect, { replace: true });
      } else {
        setError(
          result?.error ||
          'Unable to sign in. Please try again with a new OTP.'
        );
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err?.message ||
          'OTP login failed. Please try again.'
        );
      }
    } finally {
      inFlightRef.current = false;

      if (mountedRef.current) {
        setProcessing(false);
        setStatus('');
      }
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (processing || loading) {
      return;
    }

    setError('');
    setStatus('');

    const cleanMobile = mobile.replace(/\D/g, '');

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!MSG91_TOKEN_AUTH) {
      setError('OTP service is not configured. Please contact support.');
      return;
    }

    setProcessing(true);
    setStatus('Opening secure OTP verification...');

    try {
      await loadMsg91Script();

      if (typeof window.initSendOTP !== 'function') {
        throw new Error('MSG91 OTP service is unavailable.');
      }

      // MSG91 handles OTP sending and verification.
      // The verified access token is returned in success().
      window.initSendOTP({
        widgetId: MSG91_WIDGET_ID,
        tokenAuth: MSG91_TOKEN_AUTH,
        identifier: `91${cleanMobile}`,
        exposeMethods: false,

        success: (data) => {
          if (!mountedRef.current) return;
          // Do not log the verification token or the raw callback.
          if (data?.type && String(data.type).toLowerCase() !== 'success') {
            setError('OTP verification was not successful. Please try again.');
            setProcessing(false);
            setStatus('');
            return;
          }
          void handleOtpSuccess(data);
        },
        failure: () => {
          if (!mountedRef.current) return;
          setProcessing(false);
          setStatus('');
          setError('OTP verification failed or was cancelled. Please try again.');
        },
      });

      // The MSG91 widget now owns the OTP interaction.
      // Do not keep the button permanently disabled.
      if (mountedRef.current) {
        setProcessing(false);
        setStatus('');
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err?.message ||
          'Unable to open OTP verification. Please try again.'
        );
        setProcessing(false);
        setStatus('');
      }
    }
  };

  const checkoutPath = safeRedirect.split(/[?#]/)[0] === '/checkout';
  const isBuyNow = checkoutPath && new URLSearchParams(safeRedirect.split('?')[1] || '').get('mode') === 'buy-now';
  const buyNow = isBuyNow ? getBuyNowIntent() : null;
  const summaryItems = isBuyNow
    ? buyNow ? [{
        variantId: buyNow.variantId,
        name: buyNow.productName || buyNow.name || 'Selected product',
        size: buyNow.size || '', image: buyNow.image || '',
        quantity: Number(buyNow.quantity) > 0 ? Number(buyNow.quantity) : 1,
        // Saved Buy Now metadata is only a preview, never an authoritative quote.
        unitPrice: positivePrice(buyNow.price ?? buyNow.unitPrice),
        mrp: positivePrice(buyNow.mrp ?? buyNow.originalPrice),
      }] : []
    : cartItems.map((item) => ({
        variantId: item.variantId, name: item.name, size: item.size,
        image: item.image, quantity: Number(item.quantity || 0),
        unitPrice: positivePrice(item.price), mrp: positivePrice(item.originalPrice),
      }));

  const busy = processing || loading;

  return (
    <main className="min-h-[70vh] bg-[#FAF6EF] px-3 py-5 sm:px-6 sm:py-9">
      <div className={`mx-auto w-full ${checkoutPath ? 'max-w-2xl' : 'max-w-lg'}`}>
        {checkoutPath && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <button type="button" onClick={() => navigate(isBuyNow ? '/shop' : '/cart')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#00634F] hover:underline">
              <ArrowLeft className="h-4 w-4" /> {isBuyNow ? 'Continue shopping' : 'Return to cart'}
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00634F]"><LockKeyhole className="h-3.5 w-3.5" /> Secure checkout</span>
          </div>
        )}
        <header className="mb-4 text-center">
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl bg-[#00634F] font-serif text-lg font-bold text-[#FFF4D7] shadow-sm">SK</div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.17em] text-[#00634F]">ShreeKrishna Organics</p>
          <h1 className="font-serif text-[1.75rem] font-bold tracking-tight text-[#2B241D] sm:text-4xl">{checkoutPath ? 'Continue to Checkout' : 'Welcome to ShreeKrishna'}</h1>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-stone-600">{checkoutPath ? 'Verify your mobile number to securely continue with your order.' : 'Sign in securely with your mobile number. No password needed.'}</p>
        </header>

        <div className="space-y-3">
          {checkoutPath && <CheckoutOrderSummary mode={isBuyNow ? 'BUY_NOW' : 'CART'} items={summaryItems} />}

          <section className="rounded-2xl border border-[#E8DFD3] bg-white px-4 py-5 shadow-sm sm:px-8 sm:py-7">
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 text-[#00634F]"><Phone className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-wider">Mobile verification</span></div>
              <h2 className="font-serif text-2xl font-bold text-[#2B241D]">Enter mobile number</h2>
              <p className="mt-1 text-sm text-stone-500">Provide your mobile number to continue.</p>
            </div>
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label htmlFor="login-mobile" className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">Mobile number</label>
                <div className="flex overflow-hidden rounded-xl border border-[#DED5C9] bg-[#FAF6EF] transition-colors focus-within:border-[#00634F] focus-within:ring-2 focus-within:ring-[#00634F]/10">
                  <div className="flex shrink-0 items-center gap-2 border-r border-[#DED5C9] px-3 text-sm font-semibold text-[#2B241D] sm:px-4"><span role="img" aria-label="India">🇮🇳</span><span className="hidden sm:inline">India</span><span>+91</span></div>
                  <input id="login-mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} required placeholder="10-digit mobile number" value={mobile}
                    onChange={(event) => { setMobile(event.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }} disabled={busy}
                    className="min-w-0 w-full bg-transparent px-4 py-3.5 text-base text-[#2B241D] outline-none placeholder:text-stone-400 disabled:opacity-60" />
                </div>
                <p className="mt-2 text-xs text-stone-500">Currently available for Indian mobile numbers.</p>
              </div>
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {status && <div role="status" className="flex items-center gap-2 rounded-xl border border-[#E8DFD3] bg-[#FAF6EF] px-4 py-3 text-sm text-stone-700"><Loader2 className="h-4 w-4 animate-spin" />{status}</div>}
              <Button type="submit" variant="primary" size="lg" disabled={busy} className="w-full rounded-xl font-bold shadow-sm">{busy ? 'Please wait...' : 'Send OTP'}</Button>
            </form>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E3EAE1] bg-[#F0F7F0] px-4 py-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00634F]" />
              <p className="text-xs leading-relaxed text-[#45645A]">Your mobile number will be verified securely through OTP. No password required. New customers can continue automatically after verification.</p>
            </div>
          </section>
        </div>
        <p className="mt-4 text-center text-xs text-stone-500">ShreeKrishna Organics · Pure products, thoughtful shopping</p>
      </div>
    </main>
  );
}
