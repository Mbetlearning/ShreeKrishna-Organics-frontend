
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, ShieldCheck, Loader2, ChevronDown, ChevronUp, LockKeyhole, ShoppingBag, ArrowLeft, Truck, Leaf, FlaskConical, Heart, Sprout, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
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
    <section className="overflow-hidden rounded-2xl border border-[#D9E4F1] bg-gradient-to-r from-[#F0F7FF] via-white to-[#EAF8F1] shadow-[0_12px_32px_-22px_rgba(17,50,100,.45)]" aria-label="Checkout order summary">
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

  const highlights = [
    { icon: Leaf, title: 'Traditionally crafted', caption: 'Inspired by nature' },
    { icon: FlaskConical, title: 'Quality focused', caption: 'Carefully selected products' },
    { icon: Sprout, title: 'Thoughtful sourcing', caption: 'From trusted growers' },
  ];

  return (
    <main className="relative isolate min-h-[78vh] overflow-hidden bg-[#F7F5EA] px-4 pb-12 pt-6 text-[#25372C] sm:px-6 lg:pt-10">
      {/* Premium organic background — CSS only, no external images */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(125deg,#E7F2E7_0%,#FFFDF5_38%,#F9EED9_72%,#E7F2EA_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-80 bg-[radial-gradient(ellipse_at_8%_26%,rgba(105,154,103,0.24)_0%,transparent_38%),radial-gradient(ellipse_at_92%_28%,rgba(235,197,117,0.26)_0%,transparent_37%),radial-gradient(ellipse_at_50%_100%,rgba(58,130,101,0.17)_0%,transparent_45%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 -z-10 h-[480px] w-[480px] rounded-full bg-[#A7C99A]/20 blur-[85px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-[520px] w-[520px] rounded-full bg-[#EBCB91]/30 blur-[95px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-[#CFE5D5]/55 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-[12%] -z-10 h-40 w-40 rotate-12 rounded-[45%_55%_35%_65%] border border-[#7CA989]/20 bg-white/10 blur-[2px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[7%] top-[18%] -z-10 h-52 w-52 -rotate-12 rounded-[60%_40%_55%_45%] border border-[#CDAA6C]/20 bg-white/10 blur-[2px]" />

      <div className="mx-auto max-w-7xl">
        {checkoutPath && (
          <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between gap-3">
            <button type="button" onClick={() => navigate(isBuyNow ? '/shop' : '/cart')} className="group inline-flex items-center gap-2 text-sm font-semibold text-[#075E4C] transition hover:text-[#B85B3F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075E4C]">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {isBuyNow ? 'Continue shopping' : 'Return to cart'}
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E5D8] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#075E4C]"><LockKeyhole className="h-3.5 w-3.5" /> Secure checkout</span>
          </div>
        )}

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,.7fr)] lg:gap-7 xl:gap-10">
          <aside className="relative hidden min-h-[480px] flex-col justify-center lg:flex">
            <div className="absolute left-0 top-8 h-64 w-64 rounded-full bg-[#DFE9D6] blur-3xl" />
            <div className="relative rounded-[2rem] border border-[#B9DCCC] bg-gradient-to-br from-[#E3F6EA] via-[#FFF9E8] to-[#FCE7D9] p-8 shadow-[0_22px_65px_-35px_rgba(15,75,49,.25)]">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7EFE2] text-[#07644F]"><Leaf className="h-9 w-9" strokeWidth={1.5} /></div>
              <span className="text-[11px] font-extrabold uppercase tracking-[.24em] text-[#A66A3E]">Pure by nature</span>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#194C3B] xl:text-5xl">Goodness in<br />every order.</h2>
              <p className="mt-5 max-w-xs text-sm leading-7 text-[#68776C]">Bring home the simple goodness of thoughtfully sourced, traditional products.</p>
              <div className="mt-8 flex items-center gap-3 border-t border-[#DCE5D9] pt-6 text-[#075E4C]"><Heart className="h-5 w-5" /><span className="text-sm font-semibold">Made for mindful living</span></div>
            </div>
          </aside>

          <div className="mx-auto w-full max-w-[620px]">
            <header className="mb-6 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-[1.15rem] bg-gradient-to-br from-[#08705A] to-[#034735] font-serif text-2xl font-bold text-[#FFF4D7] shadow-[0_10px_22px_-10px_#075E4C]">SK</div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#00634F]">ShreeKrishna Organics</p>
              <h1 className="font-serif text-[2.1rem] font-bold leading-tight tracking-tight text-[#30231D] sm:text-[2.7rem]">{checkoutPath ? <>Continue to <span className="text-[#08765A]">Checkout</span></> : <>Welcome to <span className="text-[#08765A]">ShreeKrishna</span></>}</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#786E63]">{checkoutPath ? 'One quick verification and you’re on your way to completing your order.' : 'Sign in securely with your mobile number. No password needed.'}</p>
            </header>

            <div className="space-y-4">
              {checkoutPath && <CheckoutOrderSummary mode={isBuyNow ? 'BUY_NOW' : 'CART'} items={summaryItems} />}
              <section className="rounded-[1.7rem] border border-[#C9D9EE] bg-gradient-to-br from-white via-[#F3F8FF] to-[#ECF8F3] p-5 shadow-[0_22px_55px_-32px_rgba(29,57,111,.35)] sm:p-8">
                <div className="mb-6 flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF4EC] text-[#00634F]"><Phone className="h-6 w-6" /></span>
                  <div>
                    <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#08765A]">Secure mobile verification</div>
                    <h2 className="font-serif text-[1.65rem] font-bold leading-tight text-[#30231D]">Enter mobile number</h2>
                    <p className="mt-1 text-sm text-[#85796F]">We’ll send you a one-time verification code.</p>
                  </div>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label htmlFor="login-mobile" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#50483F]">Mobile number</label>
                    <div className="flex overflow-hidden rounded-2xl border border-[#DDD4C8] bg-[#FCFAF6] transition-all focus-within:border-[#08765A] focus-within:ring-4 focus-within:ring-[#08765A]/10">
                      <div className="flex shrink-0 items-center gap-2 border-r border-[#E6DED3] px-3 text-sm font-bold text-[#2B241D] sm:px-4"><span role="img" aria-label="India">🇮🇳</span><span>+91</span></div>
                      <input id="login-mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} required placeholder="Enter 10-digit number" value={mobile}
                        onChange={(event) => { setMobile(event.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }} disabled={busy}
                        className="min-w-0 w-full bg-transparent px-4 py-4 text-base text-[#2B241D] outline-none placeholder:text-[#AAA095] disabled:opacity-60" />
                    </div>
                    <p className="mt-2 text-xs text-[#92877C]">Currently available for Indian mobile numbers.</p>
                  </div>
                  {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                  {status && <div role="status" className="flex items-center gap-2 rounded-xl border border-[#E8DFD3] bg-[#FAF6EF] px-4 py-3 text-sm text-stone-700"><Loader2 className="h-4 w-4 animate-spin" />{status}</div>}
                  <Button type="submit" variant="primary" size="lg" disabled={busy} className="group flex w-full items-center justify-center gap-2 rounded-2xl !bg-[#102F69] !py-4 font-bold !text-white shadow-[0_10px_22px_-10px_#102F69] transition-all hover:!bg-[#0A2250] hover:shadow-lg disabled:opacity-60">
                    {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait...</> : <>Send OTP <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                  </Button>
                </form>
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#DFEBE1] bg-[#F0F7F0] px-4 py-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00634F]" />
                  <p className="text-xs leading-6 text-[#45645A]">Your number is verified securely through OTP. No password required. New customers can continue after verification.</p>
                </div>
              </section>
              <p className="text-center text-xs text-[#92877C]">ShreeKrishna Organics · Pure products, thoughtful shopping</p>
            </div>
          </div>

          <aside className="hidden space-y-5 lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4D9C5] bg-[#FFF9EC] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#987345]"><Sparkles className="h-4 w-4" /> Why shop with us</div>
            {highlights.map(({ icon: Icon, title, caption }, index) => (
              <div key={title} className={`flex items-center gap-4 rounded-2xl border px-4 py-4 shadow-[0_8px_22px_-15px_rgba(20,62,120,.4)] ${["border-[#B9DCD0] bg-gradient-to-r from-[#DDF6EA] to-[#F2FFF8]", "border-[#E9D6AE] bg-gradient-to-r from-[#FFF0C8] to-[#FFFBEB]", "border-[#C8D5F5] bg-gradient-to-r from-[#E4EBFF] to-[#F4F7FF]"][index]}`}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E7EFDF] text-[#08634D]"><Icon className="h-6 w-6" strokeWidth={1.6} /></span>
                <div><p className="text-sm font-bold text-[#283D31]">{title}</p><p className="mt-1 text-xs text-[#778075]">{caption}</p></div>
              </div>
            ))}
            <div className="flex items-center gap-2 pl-2 text-xs font-semibold text-[#376E5A]"><CheckCircle2 className="h-4 w-4" /> A thoughtful shopping experience</div>
          </aside>
        </div>
      </div>
    </main>
  );
}
