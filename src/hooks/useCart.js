// Lightweight cart store — localStorage + custom event, no external dep
const CART_KEY = 'meta-men-cart';

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const writeCart = (items) => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  window.dispatchEvent(new CustomEvent('cart:change', { detail: items }));
};

export const cartApi = {
  get: readCart,
  add: (product, opts = {}) => {
    const items = readCart();
    const key = `${product.id}::${opts.size || 'std'}`;
    const existing = items.find(i => i.key === key);
    if (existing) existing.qty += 1;
    else items.push({ key, id: product.id, name: product.name, price: product.price, currency: product.currency, image: product.image, size: opts.size || null, qty: 1 });
    writeCart(items);
  },
  remove: (key) => writeCart(readCart().filter(i => i.key !== key)),
  updateQty: (key, qty) => {
    const items = readCart().map(i => i.key === key ? { ...i, qty: Math.max(1, qty) } : i);
    writeCart(items);
  },
  clear: () => writeCart([]),
  count: () => readCart().reduce((s, i) => s + i.qty, 0),
  subtotal: () => readCart().reduce((s, i) => s + i.qty * i.price, 0),
};

// React hook — subscribes to cart changes
import { useEffect, useState } from 'react';
export function useCart() {
  const [items, setItems] = useState(readCart);
  useEffect(() => {
    const handler = (e) => setItems(e.detail);
    window.addEventListener('cart:change', handler);
    return () => window.removeEventListener('cart:change', handler);
  }, []);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  return {
    items,
    count,
    subtotal,
    add: cartApi.add,
    remove: cartApi.remove,
    updateQty: cartApi.updateQty,
    clear: cartApi.clear,
  };
}
