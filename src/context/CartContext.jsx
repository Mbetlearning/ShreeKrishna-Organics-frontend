
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/cartApi';
import { normalizeRole } from '../services/authService';
import { productService } from '../services/productService';
import { readGuestCart, writeGuestCart, guestItemFromProduct, mergeGuestCartIntoCustomer } from '../services/guestCart';
const CartContext = createContext(null);

// Convert backend cart item into the format used by Cart.jsx.
function mapCartItem(item) {
  const size = [item.sizeValue, item.sizeUnit]
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ''
    )
    .join(' ');

  return {
    cartItemId: item.cartItemId,
    productId: item.productId,
    variantId: item.variantId,

    // These fields will be available when the backend
    // CartItemResponse includes them.
    slug: item.productSlug ?? null,
    image: item.productImageUrl ?? null,
    categoryName: item.categoryName ?? '',

    name: item.productName ?? 'Product',
    size,
    price: Number(item.price ?? 0),
    originalPrice: Number(item.mrp ?? item.price ?? 0),
    quantity: Number(item.quantity ?? 0),
    lineTotal: Number(item.lineTotal ?? 0),
    availableStock: item.availableStock,
    available: item.available,
  };
}

async function enrichCartItems(items) {
  if (!items.length) return items;

  const productIds = [
    ...new Set(
      items
        .map(item => item.productId)
        .filter(id => id != null)
    ),
  ];

  const results = await Promise.allSettled(
    productIds.map(id => productService.getProductById(id))
  );

  const productMap = new Map();

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      productMap.set(
        String(productIds[index]),
        result.value
      );
    } else {
      console.error(
        `Failed to load product ${productIds[index]}:`,
        result.reason
      );
    }
  });

  return items.map(item => {
    const product = productMap.get(String(item.productId));

    if (!product) return item;

    return {
      ...item,
      slug: item.slug || product.slug || null,
      image: item.image || product.image || null,
      categoryName:
        item.categoryName || product.categoryName || '',
    };
  });
}


export function CartProvider({ children }) {
  const { addToast } = useToast();
  const { user } = useAuth();

  const isCustomer =
    !!user && normalizeRole(user.role) === 'CUSTOMER';

  const customerKey = isCustomer
    ? String(user.id ?? user.email ?? '')
    : '';

  const [cartItems, setCartItems] = useState(() => readGuestCart());
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [cartBusy, setCartBusy] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Prevent old requests from updating a new user's cart.
  const generationRef = useRef(0);

  // Prevent overlapping cart modifications.
  const busyRef = useRef(false);

  // Apply the cart returned by the backend.
 
const applyCartResponse = async (response, generation) => {
  if (generation !== generationRef.current) return;

  const items = Array.isArray(response?.items)
    ? response.items
    : [];

  const mappedItems = items.map(mapCartItem);

  // Display cart data immediately.
  setCartItems(mappedItems);

  // Fetch missing image, slug and category information.
  const enrichedItems = await enrichCartItems(mappedItems);

  // Prevent stale requests from updating another user's cart.
  if (generation === generationRef.current) {
    setCartItems(enrichedItems);
  }
};


  // Load cart when the authenticated customer changes.
  useEffect(() => {
    const generation = ++generationRef.current;

    setCartItems(isCustomer ? [] : readGuestCart());
    setAppliedCoupon(null);
    setCartError(null);
    setCartBusy(false);
    busyRef.current = false;

    if (!isCustomer) {
      setCartLoading(false);
      return;
    }

    setCartLoading(true);

    cartApi.getCart()
      .then((response) => applyCartResponse(response, generation))
      .catch((error) => {
        if (generation !== generationRef.current) {
          return;
        }

        setCartError(
          error.message || 'Unable to load your cart.'
        );
      })
      .finally(() => {
        if (generation === generationRef.current) {
          setCartLoading(false);
        }
      });

    return () => {
      generationRef.current++;
    };
  }, [isCustomer, customerKey]);

  // Manually refresh cart from backend.
  const refreshCart = async () => {
    if (!isCustomer) {
      return null;
    }

    const generation = generationRef.current;

    setCartLoading(true);
    setCartError(null);

    try {
      const response = await cartApi.getCart();

      await applyCartResponse(response, generation);

      return response;
    } catch (error) {
      if (generation === generationRef.current) {
        setCartError(error.message);
        addToast(
          error.message || 'Unable to refresh cart.',
          'error'
        );
      }

      throw error;
    } finally {
      if (generation === generationRef.current) {
        setCartLoading(false);
      }
    }
  };

  // Guest operations never call authenticated cart APIs.
  const mutateGuest = (modifier, message) => {
    try {
      const updated = modifier(readGuestCart());
      writeGuestCart(updated);
      setCartItems(updated);
      setCartError(null);
      if (message) addToast(message);
      return true;
    } catch (error) {
      const message = error?.message || 'Unable to save guest cart.';
      setCartError(message);
      addToast(message, 'error');
      return false;
    }
  };

  const mergeGuestCart = async () => {
    if (!isCustomer) throw new Error('Please verify your mobile number first.');
    await mergeGuestCartIntoCustomer(user.id ?? user.mobile ?? user.email);
    return refreshCart();
  };

  // Shared handler for cart modification requests.
  const performMutation = async (
    request,
    successMessage = null
  ) => {
    if (!isCustomer) {
      return false; // Guest mutations use local storage, not this backend helper.
    }

    if (busyRef.current || cartLoading) {
      return false;
    }

    const generation = generationRef.current;

    busyRef.current = true;
    setCartBusy(true);
    setCartError(null);

    try {
      const response = await request();

      if (generation !== generationRef.current) {
        return false;
      }

      await applyCartResponse(response, generation);
      if (successMessage) {
        addToast(successMessage);
      }

      return true;
    } catch (error) {
      if (generation === generationRef.current) {
        setCartError(
          error.message || 'Cart operation failed.'
        );

        addToast(
          error.message || 'Cart operation failed.',
          'error'
        );
      }

      return false;
    } finally {
      if (generation === generationRef.current) {
        busyRef.current = false;
        setCartBusy(false);
      }
    }
  };

  // POST /api/v1/cart/items
  const addToCart = async (
    product,
    selectedSize = null,
    quantity = 1
  ) => {
    const size =
      selectedSize ??
      product.sizes?.find((s) => s.isDefault) ??
      product.sizes?.[0];

    const variantId = Number(size?.variantId);
    const validQuantity = Number(quantity);

    if (
      !Number.isSafeInteger(variantId) ||
      variantId <= 0
    ) {
      addToast(
        'Please select a valid product size.',
        'error'
      );
      return false;
    }

    if (
      !Number.isSafeInteger(validQuantity) ||
      validQuantity < 1
    ) {
      addToast('Invalid quantity.', 'error');
      return false;
    }

    if (!isCustomer) {
      return mutateGuest((items) => {
        const found = items.find(item => item.variantId === variantId);
        if (found) {
          const updated = found.quantity + validQuantity;
          if (updated > 99) throw new Error('Maximum 99 units per product.');
          return items.map(item => item.variantId === variantId ? {...item, quantity: updated} : item);
        }
        return [...items, guestItemFromProduct(product, size, validQuantity)];
      }, `${product.name} added to cart`);
    }

    return performMutation(
      () => cartApi.addItem(variantId, validQuantity),
      `${product.name} added to cart`
    );
  };

  // PUT /api/v1/cart/items/{itemId}
  const updateQuantity = async (
    cartItemId,
    newQty
  ) => {
    if (newQty <= 0) {
      return removeFromCart(cartItemId);
    }

    if (
      !Number.isSafeInteger(newQty) ||
      newQty < 1
    ) {
      return false;
    }

    if (!isCustomer) {
      if (newQty > 99) return false;
      return mutateGuest(items => items.map(item =>
        String(item.cartItemId) === String(cartItemId) ? {...item, quantity: newQty} : item));
    }
    return performMutation(
      () => cartApi.updateItem(cartItemId, newQty)
    );
  };

  // DELETE /api/v1/cart/items/{itemId}
  const removeFromCart = async (cartItemId) => {
    if (!isCustomer) return mutateGuest(items => items.filter(item =>
      String(item.cartItemId) !== String(cartItemId)), 'Item removed from cart');
    return performMutation(
      () => cartApi.removeItem(cartItemId),
      'Item removed from cart'
    );
  };

  // DELETE /api/v1/cart
  const clearCart = async () => {
    if (!isCustomer) return mutateGuest(() => [], 'Cart cleared');
    const success = await performMutation(
      () => cartApi.clearCart(),
      'Cart cleared'
    );

    if (success) {
      setAppliedCoupon(null);
    }

    return success;
  };

  // Frontend-only coupon support.
  // Backend validation is required before checkout/payment.
  const applyCoupon = (code) => {
    const cleanCode = (code || '')
      .trim()
      .toUpperCase();

    const tenPercent = [
      'SHREEKRISHNA10',
      'SHRIKRISHNA10',
      'PRAKRITI10',
      'ORGANIC10',
    ];

    const fifteenPercent = [
      'PUREOIL',
      'HERITAGE15',
    ];

    let coupon = null;

    if (tenPercent.includes(cleanCode)) {
      coupon = {
        code: cleanCode,
        discountPercent: 10,
        description: '10% Welcome Discount',
      };
    } else if (fifteenPercent.includes(cleanCode)) {
      coupon = {
        code: cleanCode,
        discountPercent: 15,
        description: '15% Seasonal Festive Offer',
      };
    }

    if (!coupon) {
      addToast('Invalid coupon code', 'error');

      return {
        success: false,
        message: 'Invalid coupon code.',
      };
    }

    setAppliedCoupon(coupon);

    addToast(`Coupon "${cleanCode}" applied!`);

    return {
      success: true,
      message: 'Coupon applied successfully!',
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Cart totals
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const totalOriginalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.originalPrice * item.quantity,
    0
  );

  const productSavings = Math.max(
    0,
    totalOriginalPrice - subtotal
  );

  const couponDiscount = appliedCoupon
    ? Math.round(
        (subtotal * appliedCoupon.discountPercent) / 100
      )
    : 0;

  const freeShippingThreshold = 999;

  const deliveryFee =
    subtotal === 0 ||
    subtotal >= freeShippingThreshold
      ? 0
      : 49;

  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  const total = Math.max(
    0,
    subtotal - couponDiscount + deliveryFee
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        cartBusy,
        refreshCart,
        mergeGuestCart,
        addToCart,
        updateQuantity,
        removeFromCart,
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
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }

  return context;
}
