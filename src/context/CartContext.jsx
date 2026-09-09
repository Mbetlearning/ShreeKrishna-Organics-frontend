import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();
const CART_STORAGE_KEY = 'prakriti_cart_items';
const COUPON_STORAGE_KEY = 'prakriti_applied_coupon';

export function CartProvider({ children }) {
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save coupon to localStorage", e);
    }
  }, [appliedCoupon]);

  /**
   * Add item to cart
   */
  const addToCart = (product, selectedSize = null, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes.find(s => s.isDefault)) || product.sizes[0] || { size: '1 Litre', price: product.price, mrp: product.originalPrice };
    const cartItemId = `${product.id}-${size.size}`;

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            size: size.size,
            price: size.price,
            originalPrice: size.mrp || size.price * 1.15,
            image: product.image,
            categoryName: product.categoryName,
            quantity: quantity
          }
        ];
      }
    });

    addToast(`Added ${product.name} (${size.size}) to cart`);
  };

  /**
   * Update quantity of a cart item
   */
  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item)
    );
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (cartItemId) => {
    setCartItems(prev => {
      const itemToRemove = prev.find(item => item.cartItemId === cartItemId);
      if (itemToRemove) {
        addToast(`Removed ${itemToRemove.name} from cart`, 'info');
      }
      return prev.filter(item => item.cartItemId !== cartItemId);
    });
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  /**
   * Apply discount promo code
   */
  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();

    if (cleanCode === 'SHRIKRISHNA10' || cleanCode === 'PRAKRITI10' || cleanCode === 'ORGANIC10') {
      const coupon = { code: cleanCode, discountPercent: 10, description: '10% Welcome Discount' };
      setAppliedCoupon(coupon);
      addToast(`🎉 Coupon "${cleanCode}" applied! You saved 10%`);
      return { success: true, message: 'Coupon applied successfully!' };
    } else if (cleanCode === 'PUREOIL' || cleanCode === 'HERITAGE15') {
      const coupon = { code: cleanCode, discountPercent: 15, description: '15% Seasonal Festive Offer' };
      setAppliedCoupon(coupon);
      addToast(`🎉 Coupon "${cleanCode}" applied! You saved 15%`);
      return { success: true, message: 'Coupon applied successfully!' };
    } else {
      addToast('Invalid coupon code. Try SHRIKRISHNA10 or PUREOIL', 'error');
      return { success: false, message: 'Invalid coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const productSavings = Math.max(0, totalOriginalPrice - subtotal);
  
  const couponDiscount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const freeShippingThreshold = 999;
  const deliveryFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 49;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        totalOriginalPrice,
        productSavings,
        couponDiscount,
        deliveryFee,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        total,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
