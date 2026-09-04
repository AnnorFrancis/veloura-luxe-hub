import { useMemo } from 'react';
import { useLive } from './live';
import { PRODUCTS } from '../data/products';
import {
  INVENTORY, ORDERS, CREDIT, APPOINTMENTS, DISCOUNTS, stockState,
} from '../admin/data';

/**
 * One reading of the shop, shared by the website and the management system.
 *
 * The seeded catalogue is the base and the live layer sits on top, so both
 * sides always see the same stock, the same published pieces and the same
 * orders. Nothing here writes; changes go through `live` in ./live.js.
 */

const seedStock = Object.fromEntries(INVENTORY.map((i) => [i.id, i.stock]));

/** Every piece with its current stock and whether it is on the website. */
export function useCatalogue() {
  const s = useLive();
  return useMemo(
    () => INVENTORY.map((i) => ({
      ...i,
      stock: s.stock[i.id] ?? i.stock,
      published: s.published[i.id] !== false,
    })),
    [s.stock, s.published]
  );
}

/** What a shopper sees: published pieces only, with live stock. */
export function useShopProducts() {
  const s = useLive();
  return useMemo(
    () => PRODUCTS
      .filter((p) => s.published[p.id] !== false)
      .map((p) => ({ ...p, stock: s.stock[p.id] ?? seedStock[p.id] ?? 0 })),
    [s.stock, s.published]
  );
}

/** One piece for the product page, or null if it has been taken down. */
export function useShopProduct(id) {
  const s = useLive();
  return useMemo(() => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p || s.published[p.id] === false) return null;
    return { ...p, stock: s.stock[p.id] ?? seedStock[p.id] ?? 0 };
  }, [id, s.stock, s.published]);
}

/** Orders placed live, then the seeded history. */
export function useOrders() {
  const s = useLive();
  return useMemo(() => {
    const refunded = new Set(s.refunded);
    return [
      ...s.orders,
      ...ORDERS.map((o) => (refunded.has(o.id) ? { ...o, status: 'Refunded' } : o)),
    ];
  }, [s.orders, s.refunded]);
}

export function useCredit() {
  const s = useLive();
  return useMemo(() => {
    const settled = new Set(s.settled);
    return [...s.credit, ...CREDIT.filter((c) => !settled.has(c.id))];
  }, [s.credit, s.settled]);
}

export function useFittings() {
  const s = useLive();
  return useMemo(() => [...s.fittings, ...APPOINTMENTS], [s.fittings]);
}

export function useCodes() {
  const s = useLive();
  return useMemo(
    () => DISCOUNTS.map((d) => ({
      ...d,
      active: s.codes[d.code]?.active ?? d.active,
      used: d.used + (s.codes[d.code]?.used || 0),
    })),
    [s.codes]
  );
}

export function useActivity() {
  return useLive().activity;
}

export { stockState };
