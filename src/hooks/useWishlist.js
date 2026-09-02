import { useEffect, useState } from 'react';

const KEY = 'veloura-luxe-wishlist';

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (ids) => {
  // Storage can throw in private mode or when the quota is full. The list
  // still works for the session, so there is nothing useful to do here.
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('wishlist:change', { detail: ids }));
};

export const wishlistApi = {
  get: read,
  has: (id) => read().includes(id),
  toggle: (id) => {
    const ids = read();
    write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  },
  remove: (id) => write(read().filter((x) => x !== id)),
  clear: () => write([]),
};

export function useWishlist() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const handler = (e) => setIds(e.detail);
    window.addEventListener('wishlist:change', handler);
    return () => window.removeEventListener('wishlist:change', handler);
  }, []);

  return {
    ids,
    count: ids.length,
    has: (id) => ids.includes(id),
    toggle: wishlistApi.toggle,
    remove: wishlistApi.remove,
    clear: wishlistApi.clear,
  };
}
