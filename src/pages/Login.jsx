import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Login() {
  const { login, loading, getDemoCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDevNote, setShowDevNote] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleFillDemo = () => {
    const creds = getDemoCredentials();
    setEmail(creds.email);
    setPassword(creds.password);
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
            Sign in to your ShreeKrishna Organics account to track orders & view purchases.
          </p>
        </div>

        {/* Quick Demo Autofill Helper */}
        <div className="bg-[#FAF6EF] border border-[#E8DFD3] rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#2B241D] block">Demo Showcase Mode</span>
            <span className="text-[11px] text-stone-500">Test login without creating an account</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3 py-1.5 bg-[#2B241D] text-white rounded-xl font-semibold text-xs hover:bg-[#B5563C] cursor-pointer shrink-0 transition-colors"
          >
            Autofill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Demo Password Reset: In production, Spring Boot will trigger a reset email.")}
                className="text-xs text-[#B5563C] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
              />
            </div>
          </div>

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
          <Link to="/register" className="font-bold text-[#B5563C] hover:underline">
            Create an account
          </Link>
        </div>

        {/* Developer Note */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowDevNote(!showDevNote)}
            className="flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-700 mx-auto cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-amber-700" />
            <span>{showDevNote ? 'Hide Spring Boot API Info' : 'Spring Boot REST API Target'}</span>
          </button>
          {showDevNote && (
            <p className="mt-2 p-2.5 bg-stone-100 rounded-xl text-[11px] font-mono text-stone-600 text-center leading-relaxed">
              Target endpoint: <code className="text-[#2B241D] font-bold">POST /api/auth/login</code> (Spring Security JWT).
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
