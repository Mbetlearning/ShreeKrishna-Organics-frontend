
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

export default function Register() {
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const mobile = formData.phone.replace(/\D/g, '');

    if (!firstName || !lastName) {
      setError('Please enter your first and last name.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 72
    ) {
      setError('Password must be between 8 and 72 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // AuthContext forwards registration to authService.
      const res = await register({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        phone: mobile,
        password: formData.password,
      });

      if (res?.success) {
        navigate('/login', {
          replace: true,
          state: { registrationSuccess: true },
        });
      } else {
        setError(
          res?.error || 'Registration failed. Please try again.'
        );
      }
    } catch (err) {
      setError(
        err?.message || 'Unable to register. Please try again.'
      );
    }
  };

  const inputClass =
    'w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C] disabled:opacity-60';

  const labelClass =
    'block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1';

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
            Join the ShreeKrishna Organics community for
            natural wellness and pure heritage cooking.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                name: 'firstName',
                label: 'First Name',
                placeholder: 'First name',
              },
              {
                name: 'lastName',
                label: 'Last Name',
                placeholder: 'Last name',
              },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className={labelClass}>
                  {field.label} *
                </label>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

                  <input
                    id={field.name}
                    type="text"
                    name={field.name}
                    required
                    maxLength={100}
                    autoComplete={
                      field.name === 'firstName'
                        ? 'given-name'
                        : 'family-name'
                    }
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="register-email" className={labelClass}>
              Email Address *
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

              <input
                id="register-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="register-phone" className={labelClass}>
              Mobile Number *
            </label>

            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

              <input
                id="register-phone"
                type="tel"
                name="phone"
                required
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className={inputClass}
              />
            </div>

            <p className="mt-1 text-[11px] text-stone-400">
              Enter a 10-digit Indian mobile number without +91.
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="register-password" className={labelClass}>
              Password *
            </label>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="8–72 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#B5563C]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className={labelClass}>
              Confirm Password *
            </label>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirmation password'
                    : 'Show confirmation password'
                }
                aria-pressed={showConfirmPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#B5563C]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
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
            className="w-full font-bold shadow-md mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-stone-600 pt-2 border-t border-[#E8DFD3]">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-[#B5563C] hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
