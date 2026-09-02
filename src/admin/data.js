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
  /* A boutique, not a supermarket. Most pieces move once or twice a month,
     a quarter of the rail is steady, and a handful are the real sellers. */
  const sellRoll = rng();
  const sold30 = sellRoll > 0.94 ? between(rng, 6, 12)
    : sellRoll > 0.70 ? between(rng, 2, 4)
      : between(rng, 0, 1);
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

/* ── The month, from one source ───────────────────────────────
   Every money figure in the management system comes from these three
   lines. Inventing a separate revenue series is how a dashboard ends up
   claiming one department out-earned the whole shop. */
export const UNITS_30 = INVENTORY.reduce((s, i) => s + i.sold30, 0);
export const REVENUE_30 = INVENTORY.reduce((s, i) => s + i.revenue30, 0);
export const COST_OF_GOODS_30 = INVENTORY.reduce((s, i) => s + i.sold30 * i.cost, 0);

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

/* One week is the month spread over the shape a shop actually trades in,
   quiet Monday through to a busy Saturday, so the chart and the totals can
   never disagree. */
const DAY_SHAPE = [0.10, 0.11, 0.11, 0.14, 0.19, 0.22, 0.13];
const WEEK_REVENUE = Math.round(REVENUE_30 / 4.345);

export const SALES_7D = DAYS.map((d, i) => ({
  d,
  revenue: Math.round(WEEK_REVENUE * DAY_SHAPE[i]),
  orders: Math.max(1, Math.round((UNITS_30 / 4.345) * DAY_SHAPE[i] / 1.6)),
}));

export const SALES_30D = Array.from({ length: 30 }, (_, i) => {
  const rng = seed(`d30-${i}`);
  const share = REVENUE_30 / 30;
  return { d: `${i + 1}`, revenue: Math.round(share * (0.6 + rng() * 0.85)) };
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
  { id: 'orders', label: 'Sales this week', value: String(orders7), delta: 'Counter and online together', up: true },
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

// ── Suppliers ────────────────────────────────────────────────
export const SUPPLIERS = [
  { id: 'S-01', name: 'Makola Textiles', supplies: 'panties', contact: 'Mr Osei', phone: '+233 24 551 0912', area: 'Makola, Accra', terms: 'Pay on collection', lastOrder: 6 },
  { id: 'S-02', name: 'Adabraka Lace House', supplies: 'nightwear', contact: 'Auntie Comfort', phone: '+233 20 447 3388', area: 'Adabraka, Accra', terms: '30 days', lastOrder: 12 },
  { id: 'S-03', name: 'Tema Knit Works', supplies: 'socks', contact: 'Kofi Mensah', phone: '+233 27 880 1204', area: 'Tema Industrial', terms: 'Half up front', lastOrder: 3 },
  { id: 'S-04', name: 'Coastline Swim Imports', supplies: 'bikinis', contact: 'Ivy Boateng', phone: '+233 55 219 7745', area: 'Spintex, Accra', terms: '30 days', lastOrder: 21 },
  { id: 'S-05', name: 'Kaneshie Home Linen', supplies: 'napkins', contact: 'Mrs Adjei', phone: '+233 24 776 5510', area: 'Kaneshie, Accra', terms: 'Pay on collection', lastOrder: 9 },
  { id: 'S-06', name: 'Ashaiman Towel Mills', supplies: 'towels', contact: 'Yaw Darko', phone: '+233 26 334 9081', area: 'Ashaiman', terms: '14 days', lastOrder: 17 },
  { id: 'S-07', name: 'Rainline Ghana', supplies: 'raincoat', contact: 'Selina Amoah', phone: '+233 50 662 4417', area: 'Achimota, Accra', terms: 'Pay on collection', lastOrder: 34 },
  { id: 'S-08', name: 'Shapewear Direct', supplies: 'shapers', contact: 'Nana Yaa', phone: '+233 23 908 5566', area: 'East Legon, Accra', terms: '30 days', lastOrder: 8 },
  { id: 'S-09', name: 'Cotton Basics Ltd', supplies: 'underwear', contact: 'Emmanuel Tetteh', phone: '+233 24 118 2390', area: 'Odorkor, Accra', terms: 'Half up front', lastOrder: 5 },
];

// ── Expenses ─────────────────────────────────────────────────
const EXPENSE_KINDS = [
  ['Shop rent', 'Rent', 4500],
  ['Electricity', 'Bills', 380],
  ['Water', 'Bills', 90],
  ['Internet and airtime', 'Bills', 220],
  ['Delivery rider', 'Delivery', 1400],
  ['Packaging bags', 'Packaging', 620],
  ['Shop assistant wages', 'Wages', 3200],
  ['Cleaning and sundries', 'Sundries', 260],
  ['Instagram promotion', 'Marketing', 1200],
  ['Shop repairs', 'Sundries', 275],
];

export const EXPENSES = EXPENSE_KINDS.map(([what, category, base], n) => {
  const rng = seed(`exp-${n}`);
  return {
    id: `E-${400 + n}`,
    what,
    category,
    amount: base + between(rng, -60, 120),
    daysAgo: between(rng, 1, 28),
    paidWith: pick(rng, ['MTN MoMo', 'Cash', 'Bank transfer']),
  };
}).sort((a, b) => a.daysAgo - b.daysAgo);

export const EXPENSE_TOTAL = EXPENSES.reduce((s, e) => s + e.amount, 0);

// ── Credit book ──────────────────────────────────────────────
/* Buying on account and settling later is normal in Accra retail, so the
   shop needs one page that answers "who still owes me". */
export const CREDIT = CUSTOMERS.slice(0, 9).map((c, n) => {
  const rng = seed(`credit-${c.id}`);
  const owed = between(rng, 60, 720);
  const daysOwing = between(rng, 2, 64);
  return {
    id: `D-${700 + n}`,
    customerId: c.id,
    name: c.name,
    phone: c.phone,
    area: c.area,
    owed,
    daysOwing,
    tookHome: pick(rng, ['1 piece', '2 pieces', '3 pieces', '4 pieces']),
  };
}).sort((a, b) => b.daysOwing - a.daysOwing);

export const CREDIT_TOTAL = CREDIT.reduce((s, c) => s + c.owed, 0);

// ── Payment methods offered at the counter ───────────────────
export const PAY_METHODS = ['MTN MoMo', 'Telecel Cash', 'Cash', 'Card', 'On credit'];
