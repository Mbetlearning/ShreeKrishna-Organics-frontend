
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

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

export default function Login() {
  const { loginWithOtp, loading } = useAuth();

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

  const busy = processing || loading;

  return (
    <div className="bg-[#FAF6EF] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFD3] shadow-card space-y-6">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2B241D] text-[#FAF6EF] flex items-center justify-center font-serif font-bold text-lg mx-auto shadow-xs border border-[#B5563C]/30">
            SK
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D]">
            Welcome to ShreeKrishna
          </h1>

          <p className="text-xs text-stone-500 font-sans">
            Sign in securely using your mobile number.
            No password or registration required.
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">

          <div>
            <label
              htmlFor="login-mobile"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1"
            >
              Mobile Number
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Phone className="w-4 h-4" />
              </div>

              <span className="absolute inset-y-0 left-10 flex items-center text-sm text-stone-700 font-semibold">
                +91
              </span>

              <input
                id="login-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                required
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(event) => {
                  setMobile(
                    event.target.value.replace(/\D/g, '').slice(0, 10)
                  );
                  setError('');
                }}
                disabled={busy}
                className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-20 pr-3.5 py-3 text-sm text-stone-900 focus:outline-none focus:border-[#B5563C] disabled:opacity-60"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs sm:text-sm"
            >
              {error}
            </div>
          )}

          {status && (
            <div
              role="status"
              className="bg-stone-50 border border-[#E8DFD3] text-stone-700 rounded-xl px-4 py-3 text-xs sm:text-sm flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {status}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={busy}
            className="w-full font-bold shadow-md"
          >
            {busy ? 'Please Wait...' : 'Send OTP'}
          </Button>
        </form>

        <div className="flex items-start gap-3 rounded-xl bg-[#FAF6EF] border border-[#E8DFD3] px-4 py-3">
          <ShieldCheck className="w-5 h-5 text-[#B5563C] shrink-0" />
          <p className="text-xs text-stone-600 leading-relaxed">
            Your mobile number will be verified securely.
            New customers are registered automatically
            after successful verification.
          </p>
        </div>

        <p className="text-center text-[11px] text-stone-400">
          ShreeKrishna Organics — Connect with Nature
          and Boost Your Health
        </p>
      </div>
    </div>
  );
}
