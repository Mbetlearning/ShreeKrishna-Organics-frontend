// Separate from guest/authenticated cart. Never use client prices to create orders.
const KEY = 'sko_buy_now_intent_v1';
const MAX_QTY = 100;

export function saveBuyNowIntent(product, variant, quantity) {
  const variantId = Number(variant?.variantId);
  const qty = Number(quantity);
  if (!Number.isSafeInteger(variantId) || variantId <= 0 ||
      !Number.isSafeInteger(qty) || qty < 1 || qty > MAX_QTY) {
    throw new Error('Choose a valid product variant and quantity.');
  }
  const intent = {
    variantId, quantity: qty,
    productName: String(product?.name || 'Product'),
    image: product?.image || '',
    slug: product?.slug || '',
  };
  sessionStorage.setItem(KEY, JSON.stringify(intent));
  return intent;
}

export function getBuyNowIntent() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (Number.isSafeInteger(value?.variantId) && value.variantId > 0 &&
        Number.isSafeInteger(value?.quantity) && value.quantity >= 1 && value.quantity <= MAX_QTY)
      return value;
  } catch { /* malformed/expired browser state */ }
  return null;
}

export function clearBuyNowIntent() { sessionStorage.removeItem(KEY); }
