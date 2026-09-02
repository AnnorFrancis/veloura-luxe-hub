// ─────────────────────────────────────────────────────────────
// Site content: navigation, help pages, journal.
// Copy lives here so pages stay layout-only.
// ─────────────────────────────────────────────────────────────

const B = import.meta.env.BASE_URL || '/';
const img = (cat, n) => `${B}shop/${cat}/${cat}-${String(n).padStart(2, '0')}.jpg`;

export const STORE = {
  name: 'Veloura Luxe Hub',
  street: '12 Oxford Street',
  area: 'Osu, Accra',
  phone: '+233 20 123 4567',
  phoneHref: 'tel:+233201234567',
  whatsapp: '+233 20 123 4567',
  email: 'hello@velouraluxe.com',
  hours: [
    ['Monday to Friday', '9:00 to 19:00'],
    ['Saturday', '10:00 to 20:00'],
    ['Sunday', '13:00 to 18:00'],
  ],
};

export const PRIMARY_NAV = [
  { to: '/shop', label: 'Shop', mega: true },
  { to: '/journal', label: 'Journal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { to: '/shop', label: 'All products' },
      { to: '/shop?cat=panties', label: 'Panties' },
      { to: '/shop?cat=underwear', label: 'Underwear' },
      { to: '/shop?cat=bikinis', label: 'Bikinis' },
      { to: '/shop?cat=shapers', label: 'Body shapers' },
      { to: '/shop?cat=nightwear', label: 'Nightwear' },
    ],
  },
  {
    title: 'Home & care',
    links: [
      { to: '/shop?cat=socks', label: 'Socks' },
      { to: '/shop?cat=napkins', label: 'Table napkins' },
      { to: '/shop?cat=towels', label: 'Face towels' },
      { to: '/shop?cat=raincoat', label: 'Raincoats' },
      { to: '/wishlist', label: 'Wishlist' },
      { to: '/cart', label: 'Your cart' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/size-guide', label: 'Size guide' },
      { to: '/delivery', label: 'Delivery & returns' },
      { to: '/care', label: 'Care guide' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact us' },
    ],
  },
  {
    title: 'Veloura',
    links: [
      { to: '/about', label: 'Our story' },
      { to: '/journal', label: 'Journal' },
      { to: '/terms', label: 'Terms & privacy' },
    ],
  },
];

// ── Help pages ───────────────────────────────────────────────
export const SIZE_GUIDE = {
  eyebrow: 'Fit',
  title: 'Size guide',
  lede: 'Measure over bare skin, keep the tape level and do not pull it tight. If you fall between two sizes, take the larger one for shapewear and the smaller for lace.',
  hero: img('shapers', 35),
  tables: [
    {
      caption: 'Intimates and nightwear',
      head: ['Size', 'Bust (cm)', 'Waist (cm)', 'Hip (cm)'],
      rows: [
        ['XS', '78 to 82', '60 to 64', '86 to 90'],
        ['S', '83 to 87', '65 to 69', '91 to 95'],
        ['M', '88 to 93', '70 to 75', '96 to 101'],
        ['L', '94 to 99', '76 to 81', '102 to 107'],
        ['XL', '100 to 106', '82 to 88', '108 to 114'],
        ['XXL', '107 to 114', '89 to 96', '115 to 122'],
      ],
    },
    {
      caption: 'Body shapers',
      head: ['Size', 'Waist (cm)', 'Hip (cm)', 'Control'],
      rows: [
        ['S', '62 to 68', '88 to 94', 'Light to medium'],
        ['M', '69 to 75', '95 to 101', 'Medium'],
        ['L', '76 to 83', '102 to 109', 'Medium to firm'],
        ['XL', '84 to 91', '110 to 117', 'Firm'],
        ['XXL', '92 to 100', '118 to 126', 'Firm'],
        ['3XL', '101 to 110', '127 to 136', 'Firm'],
      ],
    },
    {
      caption: 'Socks',
      head: ['Size', 'Shoe (EU)', 'Foot length (cm)'],
      rows: [
        ['One size', '36 to 41', '23 to 26'],
        ['35 to 38', '35 to 38', '22 to 24'],
        ['39 to 42', '39 to 42', '25 to 27'],
      ],
    },
    {
      caption: 'Table napkins',
      head: ['Cut', 'Size (cm)', 'Best for'],
      rows: [
        ['Cocktail', '25 by 25', 'Drinks, small plates, canapes'],
        ['Lunch', '40 by 40', 'Everyday meals and breakfast'],
        ['Dinner', '50 by 50', 'Full place settings and events'],
      ],
    },
  ],
  notes: [
    'Bring a well fitting bra to your appointment and we will size you against it.',
    'Cotton relaxes slightly after the first wash. Lace and spandex do not.',
    'If you are between sizes and plan to wear it under a fitted dress, size up.',
    'Napkins are sold in sets. Cotton shrinks about two centimetres on the first wash, linen a little more.',
  ],
};

export const DELIVERY = {
  eyebrow: 'Orders',
  title: 'Delivery & returns',
  lede: 'Everything leaves the shop in plain, unbranded packaging. No product names on the label, no description on the waybill.',
  hero: img('underwear', 15),
  sections: [
    {
      h: 'Delivery',
      rows: [
        ['Greater Accra', 'Same day on orders placed before 2pm, otherwise next day', 'GH₵ 30'],
        ['Greater Accra over GH₵ 300', 'Same day or next day', 'Free'],
        ['Kumasi, Takoradi, Cape Coast', 'One to two working days', 'GH₵ 45'],
        ['Rest of Ghana', 'Two to four working days', 'GH₵ 60'],
        ['International', 'Seven to fourteen working days, quoted at checkout', 'From GH₵ 380'],
      ],
    },
  ],
  blocks: [
    {
      h: 'Returns and exchanges',
      p: [
        'You have seven days from delivery to exchange anything that does not fit, as long as it is unworn, unwashed and still has the hygiene strip in place.',
        'For hygiene reasons we cannot accept returns on panties, g-strings or swimwear once the hygiene strip has been removed. This is standard practice and it protects every customer.',
        'Send a WhatsApp message with your order number and we will arrange collection in Accra, or send you a return address if you are outside the city.',
      ],
    },
    {
      h: 'Refunds',
      p: [
        'Faulty items are refunded in full, including the delivery you paid. We check every piece before it ships, so this is rare.',
        'Change of mind is handled as an exchange or store credit rather than a refund.',
        'Refunds are returned to the same method you paid with, within five working days of us receiving the item.',
      ],
    },
  ],
};

export const CARE = {
  eyebrow: 'Care',
  title: 'How to make it last',
  lede: 'Most intimates are thrown away long before they wear out. A little care doubles the life of a good set.',
  hero: img('underwear', 17),
  blocks: [
    {
      h: 'Lace and silk',
      p: [
        'Hand wash in cool water with a mild soap. Press the water out, never wring it.',
        'Dry flat in the shade. Direct Accra sun will fade dye and weaken elastane within a season.',
        'Never use bleach or fabric softener. Softener coats the fibres and kills the stretch.',
      ],
    },
    {
      h: 'Cotton and everyday underwear',
      p: [
        'Machine wash at 30 degrees on a gentle cycle, inside a mesh bag so straps do not tangle.',
        'Wash colours separately for the first three washes.',
        'Tumble drying is the fastest way to ruin a waistband. Line dry instead.',
      ],
    },
    {
      h: 'Body shapers',
      p: [
        'Hand wash after every second wear. Body oils break down compression fabric faster than dirt does.',
        'Do not iron. Heat destroys the bonded seams that stop the hems rolling.',
        'Store flat rather than folded tight, so the panels keep their shape.',
      ],
    },
    {
      h: 'Swimwear',
      p: [
        'Rinse in fresh water straight after swimming, before the chlorine or salt dries in.',
        'Dry in the shade, never on a hot surface.',
        'Rotate between two swimsuits if you swim often. Elastane needs a day to recover.',
      ],
    },
    {
      h: 'Towels',
      p: [
        'Wash new towels once before use to open up the pile.',
        'Skip the softener here too. It makes towels feel plush and stop absorbing.',
        'A cool tumble or a shaded line both work. Shake them out before drying.',
      ],
    },
    {
      h: 'Table napkins',
      p: [
        'Wash at 40 degrees with like colours. Treat oil marks with a drop of washing-up liquid before the wash, not after.',
        'Iron while still slightly damp. That is the only way to get a crease sharp enough to hold a fold.',
        'Store flat rather than on a hanger, and linen will keep softening for years.',
      ],
    },
  ],
};

export const FAQ = {
  eyebrow: 'Questions',
  title: 'Frequently asked',
  lede: 'If your question is not here, send a WhatsApp message. A real person answers, usually within the hour.',
  hero: img('nightwear', 22),
  groups: [
    {
      title: 'Sizing and fit',
      items: [
        {
          q: 'I do not know my size. Can you help?',
          a: 'Yes. Come into the Osu shop and we will measure you properly, or send us your bust, waist and hip measurements on WhatsApp and we will recommend a size. Fittings are free and take about fifteen minutes.',
        },
        {
          q: 'Do you carry larger sizes?',
          a: 'We stock XS to XXL across intimates and nightwear, and XS to 3XL in body shapers. If a piece you want is not in your size, ask us. We can usually order it in.',
        },
        {
          q: 'What if it does not fit when it arrives?',
          a: 'Exchange it within seven days, as long as it is unworn and the hygiene strip is still attached. Message us and we will arrange collection in Accra.',
        },
      ],
    },
    {
      title: 'Orders and delivery',
      items: [
        {
          q: 'Is the packaging discreet?',
          a: 'Always. Plain outer packaging, no branding, and nothing on the label that says what is inside. The courier sees a parcel, nothing more.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Same day within Greater Accra for orders placed before 2pm. One to two working days for Kumasi, Takoradi and Cape Coast, and two to four days elsewhere in Ghana.',
        },
        {
          q: 'Can I collect from the shop?',
          a: 'Yes, and there is no charge. Choose collection at checkout and we will message you when it is ready, usually within two hours.',
        },
        {
          q: 'Do you deliver outside Ghana?',
          a: 'We do. International shipping is quoted at checkout and takes seven to fourteen working days.',
        },
      ],
    },
    {
      title: 'Payment',
      items: [
        {
          q: 'How can I pay?',
          a: 'MTN Mobile Money, Telecel Cash, Visa, Mastercard, or bank transfer. Everything goes through Paystack, so your card details never reach us.',
        },
        {
          q: 'Can I pay on delivery?',
          a: 'Within Greater Accra, yes. Choose pay on delivery at checkout and settle with the rider by mobile money or cash.',
        },
      ],
    },
    {
      title: 'Products',
      items: [
        {
          q: 'Are the products authentic?',
          a: 'Every piece is bought from the brand or an approved distributor, and each one is checked by hand before it goes on the rail.',
        },
        {
          q: 'Do you restock sold out items?',
          a: 'Usually within two to three weeks. Add the piece to your wishlist and we will message you the day it lands.',
        },
        {
          q: 'Can I buy in bulk for resale?',
          a: 'Yes. We supply a number of shops across Ghana. Send us a note through the contact page and we will send the wholesale list.',
        },
      ],
    },
  ],
};

export const LEGAL = {
  eyebrow: 'Legal',
  title: 'Terms & privacy',
  lede: 'The short version: we sell you what we say we are selling, we keep your details to ourselves, and we do not put anything on your parcel that gives you away.',
  hero: img('towels', 7),
  blocks: [
    {
      h: 'Terms of sale',
      p: [
        'Prices are in Ghana cedis and include VAT. We may change prices at any time, but never after you have paid.',
        'A sale is complete when payment clears and we confirm your order by message. If a piece sells out between your order and our confirmation, we will offer an alternative or refund you in full.',
        'Photographs are as accurate as we can make them. Screens vary, so slight colour differences are not a fault.',
      ],
    },
    {
      h: 'What we collect',
      p: [
        'Your name, phone number, email and delivery address, so we can get your order to you.',
        'Your order history, so we can help when you message us.',
        'Nothing else. We do not track you across other websites and we do not build a profile on you.',
      ],
    },
    {
      h: 'What we do with it',
      p: [
        'We use it to fulfil your order and to answer your questions. That is all.',
        'We share your address with the courier and your payment details with Paystack. Neither of them gets anything else.',
        'We never sell your details, and we never pass them to another shop or marketer.',
      ],
    },
    {
      h: 'Your choices',
      p: [
        'Ask us for a copy of what we hold on you and we will send it within seven days.',
        'Ask us to delete it and we will, apart from records we are required to keep for tax.',
        'Marketing messages only go to people who asked for them, and every one has an unsubscribe link.',
      ],
    },
  ],
};

// ── Journal ──────────────────────────────────────────────────
export const JOURNAL = [
  {
    slug: 'finding-your-true-size',
    title: 'Finding your true size',
    excerpt: 'Most women in Accra are wearing a bra one to two sizes off. Here is how to check at home in five minutes.',
    body: [
      'The most common thing we hear in the fitting room is that the band rides up at the back. That is almost always a band one size too big, paired with a cup one size too small.',
      'Measure snugly around your ribcage, directly under the bust, keeping the tape level. Then measure around the fullest part of the bust, standing straight, without pulling. The difference between those two numbers gives you the cup.',
      'A band that fits should sit level and firm on the loosest hook, so you have two hooks left to tighten as it stretches. If you can pull it more than five centimetres off your back, it is too big.',
      'Bring the numbers to us or send them on WhatsApp and we will tell you exactly where to start.',
    ],
    cat: 'Fit',
    read: '4 min',
    image: img('shapers', 30),
    date: '18 August 2026',
  },
  {
    slug: 'what-to-wear-under-white',
    title: 'What to wear under white',
    excerpt: 'White cotton is not the answer. The colour that actually disappears is the one closest to your skin.',
    body: [
      'White underwear under a white dress is the single most common mistake, and it is the one that shows up hardest in a photograph.',
      'Under white and other pale fabrics, a bra and brief matched to your own skin tone will vanish. White sits on top of the fabric and catches the light, so it reads as a bright block underneath.',
      'The second thing that matters is the seam. A moulded cup and a bonded, laser cut edge sit flat. A lace edge, however pretty, will print through anything with a close fit.',
      'If you only own one nude set, make it a smooth moulded cup with a bonded brief in your own tone. It will get more wear than anything else in the drawer.',
    ],
    cat: 'Styling',
    read: '3 min',
    image: img('underwear', 4),
    date: '2 August 2026',
  },
  {
    slug: 'caring-for-lace-in-accra-heat',
    title: 'Caring for lace in Accra heat',
    excerpt: 'Sun, sweat and a hot line are what actually kill a good set. None of them have to.',
    body: [
      'Elastane is the first thing to go in a piece of lingerie, and heat is what takes it. Direct sun on a line at midday will do more damage in a month than a year of wearing.',
      'Hand wash in cool water, press the water out rather than wringing, and dry flat in the shade. It takes an extra two minutes and doubles the life of the piece.',
      'Fabric softener is the other quiet killer. It coats the fibre so it feels soft, and in doing so it stops the elastane recovering. Skip it entirely.',
      'Rotate. Give a set a day off between wears and the elastic recovers its shape instead of stretching out permanently.',
    ],
    cat: 'Care',
    read: '3 min',
    image: img('nightwear', 39),
    date: '21 July 2026',
  },
  {
    slug: 'shapewear-without-the-squeeze',
    title: 'Shapewear without the squeeze',
    excerpt: 'If you have to lie down to get into it, it is the wrong piece. Comfortable shaping is a fit problem, not a strength problem.',
    body: [
      'Firm control is not the same as small. A shaper two sizes down does not smooth you, it displaces you, and it shows as a ridge above the waistband.',
      'Start with your true measurements and choose the control level after that. Light control smooths a line under jersey. Medium holds a shape under a fitted dress. Firm is for a specific outfit, not for a whole day.',
      'Look for a bonded hem rather than a stitched one. Bonded edges lie flat and do not roll, which is the single most common complaint we hear.',
      'And check for a gusset. Anything you plan to wear for more than two hours needs one.',
    ],
    cat: 'Fit',
    read: '4 min',
    image: img('shapers', 22),
    date: '9 July 2026',
  },
  {
    slug: 'building-a-drawer-that-works',
    title: 'Building a drawer that works',
    excerpt: 'Eleven pieces cover almost everything. Here is the list we give customers who want to start again.',
    body: [
      'Two smooth moulded bras in your skin tone. These do the heavy lifting and go under everything.',
      'One black smooth bra, one lace set for the days you want it, and one strapless if you own a single strapless dress.',
      'Five everyday briefs in cotton, in your own tone, plus two seamless for fitted clothes.',
      'That is eleven pieces. Add a shaper and one good nightwear set and you have a drawer that handles a full year without thinking about it.',
    ],
    cat: 'Edit',
    read: '3 min',
    image: img('underwear', 20),
    date: '28 June 2026',
  },
  {
    slug: 'swimwear-that-survives-the-season',
    title: 'Swimwear that survives the season',
    excerpt: 'Chlorine, salt and sunscreen all attack swimwear differently. A rinse solves most of it.',
    body: [
      'Chlorine breaks down elastane, salt dries it out and stiffens it, and the oils in sunscreen stain light colours permanently if they sit.',
      'The fix for all three is the same and it takes thirty seconds. Rinse in fresh water before the suit dries, every single time.',
      'Never leave a wet swimsuit rolled in a bag. Warm and damp is where colour bleeds and elastic gives up.',
      'Dry in the shade, flat if you can. Hanging a wet one piece by the straps stretches the shoulders out of shape.',
    ],
    cat: 'Care',
    read: '3 min',
    image: img('bikinis', 22),
    date: '14 June 2026',
  },
];

export const findPost = (slug) => JOURNAL.find((p) => p.slug === slug);
