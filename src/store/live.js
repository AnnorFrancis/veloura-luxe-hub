import { useSyncExternalStore } from 'react';

/**
 * The link between the shop and the management system.
 *
 * Both sides read from here, so a change made in one is visible in the other
 * without a reload. Unpublish a piece in Products and it leaves the shop.
 * Place an order on the website and it arrives in Orders. Sell over the
 * counter and the stock on the website drops.
 *
 * Only what has actually changed is stored. The catalogue itself stays where
 * it is and this layer sits on top of it, which keeps the saved state small
 * and means the seeded numbers never drift.
 *
 * It writes to localStorage and listens for the browser's `storage` event, so
 * two tabs, the shop in one and the management system in the other, stay in
 * step with each other. That is the demonstration: the two are one system.
 */

const KEY = 'veloura-live-v1';

const EMPTY = {
  stock: {},        // id -> pieces on hand, once it has moved
  published: {},    // id -> false, only when taken off the website
  orders: [],       // placed on the website or over the counter
  credit: [],       // taken home now, paid later
  fittings: [],     // booked from the website
  codes: {},        // code -> { active, used }
  settled: [],      // seeded credit accounts that have since paid
  refunded: [],     // seeded orders that came back
  activity: [],     // what happened, newest first
  seq: 0,
};

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
};

let state = typeof localStorage === 'undefined' ? { ...EMPTY } : read();

const listeners = new Set();

const commit = (next) => {
  state = next;
  // Storage can throw in private mode or when the quota is full. The session
  // still works, so there is nothing useful to do here.
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
};

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getLive = () => state;

/* Another tab changed something, so pick it up and tell this one. */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    state = read();
    listeners.forEach((l) => l());
  });
}

export function useLive() {
  return useSyncExternalStore(subscribe, getLive, getLive);
}

/* ── Writing ─────────────────────────────────────────────── */

const log = (s, kind, text) => ({
  ...s,
  seq: s.seq + 1,
  activity: [{ id: `A${s.seq + 1}`, kind, text, at: Date.now() }, ...s.activity].slice(0, 40),
});

export const live = {
  /** Take a piece off the website, or put it back. */
  setPublished(id, name, published) {
    let next = { ...state, published: { ...state.published, [id]: published } };
    if (published) delete next.published[id];
    next = log(next, 'publish', published ? `${name} is back on the website` : `${name} taken off the website`);
    commit(next);
  },

  /** Move stock by a number of pieces, never below zero. */
  adjustStock(id, name, by, seedStock) {
    const current = state.stock[id] ?? seedStock;
    const value = Math.max(0, current + by);
    let next = { ...state, stock: { ...state.stock, [id]: value } };
    if (by !== 0) {
      next = log(next, 'stock', `${name}: ${by > 0 ? 'added' : 'removed'} ${Math.abs(by)}, ${value} left`);
    }
    commit(next);
  },

  setStock(id, value) {
    commit({ ...state, stock: { ...state.stock, [id]: Math.max(0, value) } });
  },

  /**
   * Record a sale. Used by the website checkout and by the counter, so both
   * reduce stock the same way and both show up in the same list.
   */
  placeOrder({ lines, customer, area, phone, channel, payment, shipping = 0, discount = 0, onCredit = false }) {
    const stock = { ...state.stock };
    lines.forEach((l) => {
      const current = stock[l.id] ?? l.stock ?? 0;
      stock[l.id] = Math.max(0, current - l.qty);
    });

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    const total = Math.max(0, subtotal - discount) + shipping;
    const items = lines.reduce((sum, l) => sum + l.qty, 0);
    const id = `VL-${2842 + state.orders.length}`;

    const order = {
      id,
      customer,
      customerId: 'C-NEW',
      area,
      phone,
      lines: lines.map((l) => ({ id: l.id, name: l.name, image: l.image, price: l.price, qty: l.qty, size: l.size || null })),
      items,
      subtotal,
      shipping,
      discount,
      total,
      status: onCredit ? 'Paid' : 'Paid',
      channel,
      payment,
      hoursAgo: 0,
      isNew: true,
    };

    let next = { ...state, stock, orders: [order, ...state.orders] };

    if (onCredit) {
      next = {
        ...next,
        credit: [{
          id: `D-N${state.credit.length + 1}`,
          customerId: 'C-NEW',
          name: customer,
          phone,
          area,
          owed: total,
          daysOwing: 0,
          tookHome: `${items} ${items === 1 ? 'piece' : 'pieces'}`,
          isNew: true,
        }, ...next.credit],
      };
    }

    next = log(next, 'order', `${channel === 'Website' ? 'Website order' : 'Counter sale'} ${id}, ${items} ${items === 1 ? 'piece' : 'pieces'}, GH₵ ${total.toLocaleString()}`);
    commit(next);
    return order;
  },

  /** Money came in against an account, whether it started here or seeded. */
  settleCredit(id, name) {
    const isLive = state.credit.some((c) => c.id === id);
    const base = isLive
      ? { ...state, credit: state.credit.filter((c) => c.id !== id) }
      : { ...state, settled: [...state.settled, id] };
    commit(log(base, 'credit', `${name} paid what they owed`));
  },

  /** A piece came back. Stock returns and the order is marked refunded. */
  refundOrder(order) {
    const stock = { ...state.stock };
    (order.lines || []).forEach((l) => {
      const current = stock[l.id] ?? l.stock ?? 0;
      stock[l.id] = current + l.qty;
    });
    const next = log(
      {
        ...state,
        stock,
        orders: state.orders.map((o) => (o.id === order.id ? { ...o, status: 'Refunded' } : o)),
        refunded: [...state.refunded, order.id],
      },
      'refund',
      `${order.id} refunded, ${order.items} ${order.items === 1 ? 'piece' : 'pieces'} back on the shelf`
    );
    commit(next);
  },

  setCode(code, active) {
    commit(log(
      { ...state, codes: { ...state.codes, [code]: { ...(state.codes[code] || {}), active } } },
      'code',
      `Discount code ${code} switched ${active ? 'on' : 'off'}`
    ));
  },

  useCode(code) {
    const entry = state.codes[code] || {};
    commit({ ...state, codes: { ...state.codes, [code]: { ...entry, used: (entry.used || 0) + 1 } } });
  },

  bookFitting({ name, phone, service, day, time, note }) {
    const next = log(
      {
        ...state,
        fittings: [{
          id: `A-N${state.fittings.length + 1}`,
          name, phone, service, day, time,
          status: 'Pending',
          note: note || '',
          isNew: true,
        }, ...state.fittings],
      },
      'fitting',
      `${name} asked for a ${service.toLowerCase()}`
    );
    commit(next);
  },

  /** Put the sample back the way it was. */
  reset() {
    commit({ ...EMPTY });
  },
};
