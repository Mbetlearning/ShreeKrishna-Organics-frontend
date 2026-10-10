
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Login() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const requestedPath = location.state?.from;
  const redirectPath =
    typeof requestedPath === 'string'
      ? requestedPath
      : requestedPath?.pathname
        ? `${requestedPath.pathname}${requestedPath.search || ''}${requestedPath.hash || ''}`
        : '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('CUSTOMER LOGIN COMPONENT RUNNING');
console.log('API BASE URL:', import.meta.env.VITE_API_URL);
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      const res = await login(trimmedEmail, password);

      if (res?.success) {
        // Avoid redirecting back to login or registration.
        const safeRedirect =
          redirectPath.startsWith('/') &&
          !redirectPath.startsWith('//') &&
          !['/login', '/register'].includes(
            redirectPath.split(/[?#]/)[0]
          )
            ? redirectPath
            : '/';

        navigate(safeRedirect, { replace: true });
      } else {
        setError(
          res?.error ||
          'Login failed. Please check your credentials.'
        );
      }
    } catch (err) {
      setError(
        err?.message ||
        'Unable to sign in. Please try again.'
      );
    }
  };

  return (
    <div className="bg-[#FAF6EF] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFD3] shadow-card space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2B241D] text-[#FAF6EF] flex items-center justify-center font-serif font-bold text-lg mx-auto shadow-xs border border-[#B5563C]/30">
            SK
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D]">
            Welcome Back
          </h1>

          <p className="text-xs text-stone-500 font-sans">
            Sign in to your ShreeKrishna Organics account
            to track orders and view purchases.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1"
            >
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>

              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={loading}
                className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C] disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1"
            >
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>

              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={loading}
                className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C] disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#B5563C] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs sm:text-sm"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full font-bold shadow-md"
          >
            {loading ? 'Signing In...' : 'Sign In to Account'}
          </Button>

        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-stone-600 pt-2 border-t border-[#E8DFD3]">
          <span>Don't have an account yet? </span>

          <Link
            to="/register"
            className="font-bold text-[#B5563C] hover:underline"
          >
            Create an account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-stone-400">
          ShreeKrishna Organics — Connect with Nature
          and Boost Your Health
        </p>

      </div>
    </div>
  );
}
