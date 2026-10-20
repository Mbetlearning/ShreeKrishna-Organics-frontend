import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { normalizeRole } from '../services/authService';
import Checkout from '../pages/Checkout';
import { getBuyNowIntent } from '../services/buyNowIntent';

export default function CheckoutGate() {
  const { user, isAuthenticated } = useAuth();
  const { mergeGuestCart } = useCart();
  const location = useLocation();
  const isBuyNow = new URLSearchParams(location.search).get('mode') === 'buy-now';
  const buyNowIntent = isBuyNow ? getBuyNowIntent() : null;
  const [state, setState] = useState({customer: null, ready: false, error: ''});
  const [retry, setRetry] = useState(0);
  const customerId = user?.id ?? user?.mobile ?? user?.email;
  const isCustomer = isAuthenticated && normalizeRole(user?.role) === 'CUSTOMER';

  useEffect(() => {
    if (!isCustomer) return;
    let active = true;
    setState({customer: customerId, ready: false, error: ''});
    (isBuyNow ? Promise.resolve() : mergeGuestCart()).then(() => {
      if (active) setState({customer: customerId, ready: true, error: ''});
    }).catch(error => {
      if (active) setState({customer: customerId, ready: false, error: error.message || 'Unable to restore your cart.'});
    });
    return () => { active = false; };
    // Merge once per authenticated identity and explicit retry.
  }, [isCustomer, customerId, retry, isBuyNow]);

  if (isBuyNow && !buyNowIntent) return <Navigate to="/shop" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{from: location}} />;
  if (!isCustomer) return <Navigate to="/" replace />;
  if (state.customer !== customerId || (!state.ready && !state.error))
    return <div className="min-h-[60vh] grid place-items-center">Preparing your checkout and transferring cart items...</div>;
  if (state.error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-red-700">{state.error}</p>
      <p className="text-sm">Your cart is still saved. Checkout has not started.</p>
      <button className="bg-stone-900 text-white px-5 py-2 rounded-lg" onClick={() => setRetry(value => value + 1)}>Retry cart transfer</button>
    </div>
  );
  return <Checkout key={isBuyNow ? 'buy-now' : 'cart'} buyNowIntent={buyNowIntent} />;
}
