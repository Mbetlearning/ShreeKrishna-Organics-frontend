import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  User, 
  ArrowLeft,
  Banknote,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import RazorpayModal from '../components/RazorpayModal';
import Button from '../components/Button';

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", 
  "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

export default function Checkout() {
  const { cartItems, subtotal, couponDiscount, deliveryFee, total, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || "Priya Sundaram",
    email: user?.email || "priya.s@example.com",
    phone: user?.phone || "+91 98765 43210",
    address: user?.address || "Flat 402, Green Meadows, 12th Main Road, Indiranagar",
    city: user?.city || "Bengaluru",
    state: user?.state || "Karnataka",
    pincode: user?.pincode || "560038"
  });

  const [paymentOption, setPaymentOption] = useState('razorpay'); // 'razorpay' or 'cod'
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty and not submitting, redirect to shop
  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF6EF]">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Your Cart is Empty</h2>
        <p className="text-sm text-stone-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Button to="/shop" variant="primary" className="mt-6">
          Explore Products
        </Button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFillDemoAddress = () => {
    setFormData({
      fullName: "Anand Verma",
      email: "anand.verma@example.com",
      phone: "+91 98450 11223",
      address: "B-204, Palm Grove Enclave, Bannerghatta Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560076"
    });
    addToast('Demo address filled for quick testing', 'info');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      addToast('Please complete all required shipping fields.', 'error');
      return;
    }

    if (paymentOption === 'razorpay') {
      setIsRazorpayModalOpen(true);
    } else {
      // Process Cash on Delivery directly
      setIsSubmitting(true);
      try {
        const orderPayload = {
          totalAmount: total,
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          discount: couponDiscount,
          paymentStatus: "Pending (Cash on Delivery)",
          paymentMethod: "Cash on Delivery (COD)",
          shippingAddress: formData,
          items: cartItems.map(item => ({
            id: item.productId,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        };

        const newOrder = await orderService.createOrder(orderPayload);
        clearCart();
        addToast(`🎉 Order #${newOrder.id} placed successfully!`);
        navigate('/orders');
      } catch (err) {
        addToast('Failed to place order. Please try again.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsRazorpayModalOpen(false);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        totalAmount: total,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: couponDiscount,
        paymentStatus: "Paid (Razorpay Gateway)",
        paymentMethod: `Online (${paymentDetails.method?.toUpperCase() || 'Razorpay'}) - Ref: ${paymentDetails.razorpay_payment_id}`,
        shippingAddress: formData,
        items: cartItems.map(item => ({
          id: item.productId,
          name: item.name,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const newOrder = await orderService.createOrder(orderPayload);
      clearCart();
      addToast(`🎉 Payment verified & Order #${newOrder.id} confirmed!`);
      navigate('/orders');
    } catch (err) {
      addToast('Failed to complete order. Please contact support.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-semibold mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
          </Link>
          <h1 className="text-3xl font-serif font-bold text-[#2B241D]">
            Checkout & Shipping
          </h1>
          <p className="text-xs text-stone-500 font-sans mt-1">
            Provide your delivery details to receive freshly packed organic products.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Customer & Address Information */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-subtle space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
                  <h3 className="font-serif font-bold text-lg text-[#2B241D] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#B5563C]" /> Customer Information
                  </h3>
                  <button
                    type="button"
                    onClick={handleFillDemoAddress}
                    className="text-xs font-semibold text-[#2B241D] hover:text-[#B5563C] bg-[#FAF6EF] px-2.5 py-1 rounded-lg border border-[#E8DFD3] cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#B5563C]" /> Autofill Demo Data
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Mobile Number (for Courier SMS) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-subtle space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#2B241D] pb-3 border-b border-[#E8DFD3] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#B5563C]" /> Shipping Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Flat / House No. / Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Flat 402, Green Meadows, 12th Main"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C] cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      PIN Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#B5563C]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-subtle space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#2B241D] pb-3 border-b border-[#E8DFD3] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#B5563C]" /> Payment Mode
                </h3>

                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentOption === 'razorpay'
                        ? 'border-[#B5563C] bg-[#B5563C]/5 ring-2 ring-[#B5563C]'
                        : 'border-[#E8DFD3] hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'razorpay'}
                      onChange={() => setPaymentOption('razorpay')}
                      className="mt-1 text-[#B5563C] focus:ring-[#B5563C]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900">
                          Pay Online with Razorpay Secure Gateway
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        UPI (GPay / PhonePe), Credit/Debit Cards, NetBanking. (Pre-configured for Spring Boot integration).
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentOption === 'cod'
                        ? 'border-[#B5563C] bg-[#B5563C]/5 ring-2 ring-[#B5563C]'
                        : 'border-[#E8DFD3] hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'cod'}
                      onChange={() => setPaymentOption('cod')}
                      className="mt-1 text-[#B5563C] focus:ring-[#B5563C]"
                    />
                    <div>
                      <span className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-800" /> Cash on Delivery (COD)
                      </span>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Pay cash or UPI directly to the courier agent upon arrival.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD3] shadow-subtle space-y-6">
                <h3 className="font-serif font-bold text-lg text-[#2B241D] pb-3 border-b border-[#E8DFD3]">
                  Order Items ({totalItems})
                </h3>

                {/* Items Mini List */}
                <div className="divide-y divide-[#E8DFD3] max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="py-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E8DFD3] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-stone-500">
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900 font-sans">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 pt-4 border-t border-[#E8DFD3] text-xs sm:text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{subtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Promo Discount</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-stone-900">
                      {deliveryFee === 0 ? <span className="text-emerald-800 uppercase font-bold text-xs">Free</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#E8DFD3] text-base font-bold text-[#2B241D]">
                    <span>Total Amount</span>
                    <span className="text-xl">₹{total}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-bold shadow-lg"
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : paymentOption === 'razorpay' ? (
                    `Proceed to Pay ₹${total} (Razorpay)`
                  ) : (
                    `Confirm Cash on Delivery (₹${total})`
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>256-Bit SSL Encrypted & 100% Authentic Organic Products</span>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Razorpay Simulation Modal */}
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          totalAmount={total}
          customerData={formData}
          itemsCount={totalItems}
        />

      </div>
    </div>
  );
}
