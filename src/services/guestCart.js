// The guest cart is a browser-side shopping list, never a source of trusted prices.
// Server-side cart/checkout endpoints validate stock and pricing after OTP.
import { cartApi } from './cartApi';

const KEY = 'sko_guest_cart_v1';
const JOURNAL_KEY = 'sko_guest_cart_merge_v1';
const MAX_QUANTITY = 99;

function readJson(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}

export function readGuestCart() {
  const raw = readJson(KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter(item => Number.isSafeInteger(item.variantId) && item.variantId > 0 &&
    Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= MAX_QUANTITY)
    .map(item => ({...item, cartItemId: `guest-${item.variantId}`}));
}

export function writeGuestCart(items) {
  // Throw storage errors: never claim that an unsaved cart action succeeded.
  localStorage.setItem(KEY, JSON.stringify(items.map(({cartItemId, ...item}) => item)));
  window.dispatchEvent(new Event('sko-guest-cart-changed'));
}

export function guestItemFromProduct(product, size, quantity) {
  const variantId = Number(size?.variantId);
  const qty = Number(quantity);
  if (!Number.isSafeInteger(variantId) || variantId <= 0 ||
      !Number.isSafeInteger(qty) || qty <= 0 || qty > MAX_QUANTITY) {
    throw new Error('Invalid product variant or quantity.');
  }
  return {
    cartItemId: `guest-${variantId}`,
    productId: product.id, variantId, quantity: qty,
    name: product.name ?? 'Product',
    slug: product.slug ?? null,
    image: product.image ?? null,
    categoryName: product.categoryName ?? '',
    size: size.size ?? [size.sizeValue, size.sizeUnit].filter(Boolean).join(' '),
    price: Number(size.price ?? product.price ?? 0),
    originalPrice: Number(size.mrp ?? product.originalPrice ?? size.price ?? 0),
    available: true,
  };
}

// The persistent target journal avoids re-adding quantities after a refresh
// or re-entry while the merge is partially complete. The same customer must
// finish the journal, otherwise we refuse to merge into another account.
export async function mergeGuestCartIntoCustomer(customerId) {
  if (customerId == null || String(customerId).trim() === '')
    throw new Error('Unable to identify the authenticated customer.');
  const identity = String(customerId);
  const current = readGuestCart();
  let journal = readJson(JOURNAL_KEY, null);
  if (!journal && !current.length) return;
  if (journal && journal.customerId !== identity)
    throw new Error('Cart transfer belongs to a different account. Please sign in with the original account to finish transferring it.');

  if (!journal) {
    const server = await cartApi.getCart();
    const existing = new Map((server?.items ?? []).map(item => [String(item.variantId), Number(item.quantity)]));
    journal = {customerId: identity, targets: current.map(item => ({
      variantId: item.variantId,
      quantity: Math.min(MAX_QUANTITY, (existing.get(String(item.variantId)) ?? 0) + item.quantity),
    }))};
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  }

  for (const target of journal.targets) {
    const server = await cartApi.getCart();
    const existing = (server?.items ?? []).find(item => String(item.variantId) === String(target.variantId));
    const actual = Number(existing?.quantity ?? 0);
    if (actual === target.quantity) continue;
    if (existing) await cartApi.updateItem(existing.cartItemId, target.quantity);
    else await cartApi.addItem(target.variantId, target.quantity);
  }
  // Only remove the entries included in the completed journal.
  const transferred = new Set(journal.targets.map(item => String(item.variantId)));
  writeGuestCart(readGuestCart().filter(item => !transferred.has(String(item.variantId))));
  localStorage.removeItem(JOURNAL_KEY);
}
