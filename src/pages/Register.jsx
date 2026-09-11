import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

export default function Register() {
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: 'Bengaluru',
    state: 'Karnataka'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="bg-[#FAF6EF] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFD3] shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2B241D] text-[#FAF6EF] flex items-center justify-center font-serif font-bold text-lg mx-auto shadow-xs border border-[#B5563C]/30">
            SK
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D]">
            Create an Account
          </h1>
          <p className="text-xs text-stone-500 font-sans">
            Join the ShreeKrishna Organics community for unrefined wellness & pure heritage cooking.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                name="name"
                placeholder="e.g. Ramesh Iyer"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  name="password"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full font-bold shadow-md mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-stone-600 pt-2 border-t border-[#E8DFD3]">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-[#B5563C] hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
