import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  ArrowLeft,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    productSavings,
    couponDiscount,
    deliveryFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
    totalItems
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF6EF] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-stone-400 mb-6 shadow-subtle">
          <ShoppingBag className="w-10 h-10 text-[#2B241D]/40" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B241D]">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-stone-500 max-w-md mt-2 mb-8 font-sans">
          Looks like you haven't added any pure organic products yet. Experience the authentic taste of single-origin Indian heritage.
        </p>
        <Button to="/shop" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
          Explore All Products
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2B241D]">
              Your Shopping Cart
            </h1>
            <p className="text-xs text-stone-500 font-sans mt-1">
              Review your items ({totalItems} {totalItems === 1 ? 'item' : 'items'}) before proceeding to secure checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-stone-500 hover:text-red-600 self-start sm:self-auto font-medium transition-colors cursor-pointer"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] shadow-subtle mb-8">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-stone-700">
              <Truck className="w-4 h-4 text-[#B5563C]" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-800 font-bold">🎉 Congratulations! You have unlocked Free Express Shipping!</span>
              ) : (
                <span>Add <strong className="text-[#2B241D]">₹{amountNeededForFreeShipping}</strong> more for Free Delivery</span>
              )}
            </span>
            <span className="text-stone-500">Goal: ₹{freeShippingThreshold}</span>
          </div>
          
          <div className="w-full bg-[#FAF6EF] rounded-full h-2 overflow-hidden border border-[#E8DFD3]">
            <div
              className="bg-[#B5563C] h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`
              }}
            />
          </div>
        </div>

        {/* Cart Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-subtle divide-y divide-[#E8DFD3] overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  
                  {/* Product Thumbnail */}
                  <Link to={`/product/${item.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF6EF] border border-[#E8DFD3] shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5563C] block">
                      {item.categoryName}
                    </span>
                    <Link to={`/product/${item.slug}`} className="hover:text-[#B5563C] transition-colors">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 truncate">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Selected Size: <strong className="text-stone-800">{item.size}</strong>
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm sm:text-base font-bold text-[#2B241D]">
                        ₹{item.price}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{Math.round(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Adjuster & Item Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DFD3]">
                    
                    <div className="flex items-center bg-[#FAF6EF] border border-[#E8DFD3] rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold font-sans text-stone-900 block">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 font-medium mt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#2B241D] hover:text-[#B5563C] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Coupon Box */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-subtle">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#B5563C]" /> Apply Promo Coupon
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                  <div>
                    <span className="font-mono font-bold text-emerald-900 block">{appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-700">{appliedCoupon.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex items-center bg-[#FAF6EF] rounded-2xl border border-[#E8DFD3] p-1 focus-within:border-[#B5563C]">
                    <input
                      type="text"
                      placeholder="e.g. SHRIKRISHNA10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-transparent px-3 py-2 text-xs uppercase font-mono text-stone-800 placeholder-stone-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#2B241D] hover:bg-[#B5563C] text-white px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Use code <code className="font-mono text-stone-700 bg-stone-100 px-1 py-0.5 rounded">SHRIKRISHNA10</code> for 10% off.
                  </p>
                </form>
              )}
            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#2B241D] pb-3 border-b border-[#E8DFD3]">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-stone-900 font-sans">₹{subtotal}</span>
                </div>

                {productSavings > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Retail MRP Discount</span>
                    <span className="font-semibold">-₹{productSavings}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span className="font-semibold text-stone-900 font-sans">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-800 font-bold uppercase text-xs">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-[#E8DFD3] flex items-baseline justify-between">
                <div>
                  <span className="text-base font-bold font-serif text-[#2B241D] block">Grand Total</span>
                  <span className="text-[10px] text-stone-400">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-bold font-sans text-[#2B241D]">
                  ₹{total}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                to="/checkout"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-md"
                icon={ArrowRight}
                iconPosition="right"
              >
                Proceed to Checkout (₹{total})
              </Button>

              {/* Trust Badge */}
              <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>100% Safe & Secure SSL Checkout</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
