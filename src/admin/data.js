// ─────────────────────────────────────────────────────────────
// Management data.
// Everything derives from the live catalogue with a seeded
// generator, so stock, sales and revenue stay consistent between
// views and across reloads instead of reshuffling on every render.
// ─────────────────────────────────────────────────────────────

import { PRODUCTS, CATEGORIES } from '../data/products';

const seed = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const between = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));

// ── Inventory ────────────────────────────────────────────────
export const INVENTORY = PRODUCTS.map((p) => {
  const rng = seed(p.id);
  const reorderAt = between(rng, 4, 10);
  const roll = rng();
  // a realistic spread: mostly healthy, a handful low, a couple out
  const stock = roll > 0.93 ? 0 : roll > 0.8 ? between(rng, 1, reorderAt) : between(rng, reorderAt + 1, 48);
  const sold30 = between(rng, 0, 34);
  return {
    ...p,
    sku: `VL-${p.category.slice(0, 3).toUpperCase()}-${p.id.slice(-3)}`,
    stock,
    reorderAt,
    sold30,
    revenue30: sold30 * p.price,
    cost: Math.round(p.price * (0.42 + rng() * 0.16)),
  };
});

export const stockState = (i) =>
  i.stock === 0 ? 'out' : i.stock <= i.reorderAt ? 'low' : 'ok';

export const LOW_STOCK = INVENTORY.filter((i) => stockState(i) !== 'ok')
  .sort((a, b) => a.stock - b.stock);

export const STOCK_VALUE = INVENTORY.reduce((s, i) => s + i.stock * i.cost, 0);

// ── Customers ────────────────────────────────────────────────
const FIRST = ['Akosua', 'Efua', 'Naa Adjeley', 'Mariam', 'Abena', 'Yaa', 'Adwoa', 'Selorm', 'Esi', 'Ama', 'Afia', 'Nana Ama', 'Hawa', 'Zainab', 'Akua', 'Serwaa', 'Dzifa', 'Elikem'];
const LAST = ['Boateng', 'Mensah', 'Owusu', 'Tetteh', 'Agbe', 'Darko', 'Asante', 'Quartey', 'Addo', 'Nyarko', 'Amoah', 'Osei', 'Danso', 'Kufuor', 'Larbi', 'Appiah'];
const AREAS = ['Osu', 'East Legon', 'Cantonments', 'Achimota', 'Spintex', 'Dansoman', 'Tema', 'Madina', 'Kumasi', 'Takoradi'];

export const CUSTOMERS = Array.from({ length: 42 }, (_, n) => {
  const rng = seed(`cust-${n}`);
  const orders = between(rng, 1, 14);
  const avg = between(rng, 120, 480);
  const spend = orders * avg;
  return {
    id: `C-${String(1200 + n)}`,
    name: `${pick(rng, FIRST)} ${pick(rng, LAST)}`,
    area: pick(rng, AREAS),
    phone: `+233 ${between(rng, 20, 27)} ${between(rng, 100, 999)} ${between(rng, 1000, 9999)}`,
    orders,
    spend,
    avg,
    lastSeen: between(rng, 1, 90),
    tier: spend > 3000 ? 'VIP' : spend > 1200 ? 'Regular' : 'New',
    fitted: rng() > 0.45,
  };
}).sort((a, b) => b.spend - a.spend);

// ── Orders ───────────────────────────────────────────────────
const CHANNELS = ['Website', 'WhatsApp', 'In store', 'Instagram'];
const PAYMENTS = ['MTN MoMo', 'Telecel Cash', 'Visa', 'Bank transfer', 'Cash on delivery'];

export const ORDERS = Array.from({ length: 68 }, (_, n) => {
  const rng = seed(`order-${n}`);
  const customer = CUSTOMERS[between(rng, 0, CUSTOMERS.length - 1)];
  const lineCount = between(rng, 1, 3);
  const lines = Array.from({ length: lineCount }, () => {
    const item = INVENTORY[between(rng, 0, INVENTORY.length - 1)];
    const qty = between(rng, 1, 2);
    return { id: item.id, name: item.name, image: item.image, price: item.price, qty, size: item.sizes[between(rng, 0, item.sizes.length - 1)] };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal >= 300 ? 0 : 30;
  const hoursAgo = n * between(rng, 2, 9);
  const statusRoll = rng();
  const status = n < 3 ? 'Paid'
    : n < 8 ? pick(rng, ['Paid', 'Packing'])
      : statusRoll > 0.96 ? 'Refunded'
        : statusRoll > 0.6 ? 'Delivered' : 'Shipped';

  return {
    id: `VL-${2841 - n}`,
    customer: customer.name,
    customerId: customer.id,
    area: customer.area,
    phone: customer.phone,
    lines,
    items: lines.reduce((s, l) => s + l.qty, 0),
    subtotal,
    shipping,
    total: subtotal + shipping,
    status,
    channel: pick(rng, CHANNELS),
    payment: pick(rng, PAYMENTS),
    hoursAgo,
  };
});

export const timeAgo = (h) => {
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
};

// ── Appointments ─────────────────────────────────────────────
const SERVICES = ['Bra fitting', 'Shapewear fitting', 'Bridal consultation', 'Swimwear fitting', 'Personal shop'];

export const APPOINTMENTS = Array.from({ length: 12 }, (_, n) => {
  const rng = seed(`appt-${n}`);
  const customer = CUSTOMERS[between(rng, 0, CUSTOMERS.length - 1)];
  const hour = 9 + (n % 9);
  const dayOffset = Math.floor(n / 4);
  return {
    id: `A-${300 + n}`,
    name: customer.name,
    phone: customer.phone,
    service: pick(rng, SERVICES),
    time: `${String(hour).padStart(2, '0')}:${rng() > 0.5 ? '30' : '00'}`,
    day: dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : 'Wednesday',
    status: n < 2 ? 'Confirmed' : rng() > 0.75 ? 'Pending' : 'Confirmed',
    note: rng() > 0.6 ? 'First visit, needs full measure' : '',
  };
});

// ── Discounts ────────────────────────────────────────────────
export const DISCOUNTS = [
  { code: 'VELOURA10', type: '10% off order', used: 84, cap: 200, active: true, ends: '30 Sep 2026' },
  { code: 'WELCOME5', type: '5% off first order', used: 213, cap: null, active: true, ends: 'No end date' },
  { code: 'FREEACCRA', type: 'Free Accra delivery', used: 41, cap: 100, active: true, ends: '15 Sep 2026' },
  { code: 'SLEEP20', type: '20% off nightwear', used: 156, cap: 156, active: false, ends: 'Ended 12 Aug 2026' },
];

// ── Aggregates ───────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SALES_7D = DAYS.map((d, i) => {
  const rng = seed(`day-${d}`);
  const base = [6200, 7100, 6600, 8400, 11800, 15200, 9700][i];
  return { d, revenue: base + between(rng, -900, 900), orders: between(rng, 14, 38) };
});

export const SALES_30D = Array.from({ length: 30 }, (_, i) => {
  const rng = seed(`d30-${i}`);
  return { d: `${i + 1}`, revenue: between(rng, 4200, 16800) };
});

export const CATEGORY_MIX = CATEGORIES.map((c) => {
  const items = INVENTORY.filter((i) => i.category === c.id);
  return {
    id: c.id,
    name: c.label,
    revenue: items.reduce((s, i) => s + i.revenue30, 0),
    units: items.reduce((s, i) => s + i.sold30, 0),
    skus: items.length,
  };
}).sort((a, b) => b.revenue - a.revenue);

export const TOP_PRODUCTS = [...INVENTORY].sort((a, b) => b.revenue30 - a.revenue30).slice(0, 6);

const revenue7 = SALES_7D.reduce((s, d) => s + d.revenue, 0);
const orders7 = SALES_7D.reduce((s, d) => s + d.orders, 0);

/* Labels are written the way the owner would say them out loud, not the way
   a dashboard would print them. */
export const KPIS = [
  { id: 'revenue', label: 'Money in this week', value: `GH₵ ${revenue7.toLocaleString()}`, delta: '21% more than last week', up: true },
  { id: 'orders', label: 'Orders this week', value: String(orders7), delta: '12% more than last week', up: true },
  { id: 'avg', label: 'Average basket', value: `GH₵ ${Math.round(revenue7 / orders7)}`, delta: '6% more than last week', up: true },
  { id: 'low', label: 'Needs restocking', value: String(LOW_STOCK.length), delta: `${INVENTORY.filter((i) => i.stock === 0).length} have run out completely`, up: false, warn: true },
];

export const CATEGORY_COLORS = {
  panties: '#E4738A',
  underwear: '#8FD3E2',
  bikinis: '#34A3BD',
  shapers: '#FF9E76',
  nightwear: '#A98FD8',
  socks: '#5FA97F',
  napkins: '#F7B3C0',
  towels: '#8A7F3F',
  raincoat: '#F5B93F',
};
