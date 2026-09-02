# Veloura Luxe Hub

A client-approval sample for **Veloura Luxe Hub**, an intimates and everyday
essentials boutique in Osu, Accra.

Live: <https://annorfrancis.github.io/veloura-luxe-hub/>
Management system: <https://annorfrancis.github.io/veloura-luxe-hub/#/admin>

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:5173/veloura-luxe-hub/**. The `base` path is set in
`vite.config.js` for GitHub Pages, so the bare root will not serve the app.

## Deploy

The site is a project page, published from the `gh-pages` branch. `dist` is
its own small repo pointed at that branch, so a redeploy is a build and a
push:

```bash
npm run build && cd dist && git add -A && git commit -m Deploy && git push -f origin gh-pages
```

If git asks for the wrong GitHub account, prefix the push with
`git -c credential.helper="!gh auth git-credential"`. The machine has cached
HTTPS credentials for a second account, and that flag makes the push use the
account `gh` is signed in as instead.

## Pages

| Route | What it is |
|---|---|
| `/` | Home: hero slideshow, departments, best sellers, lookbook, story, journal, promises |
| `/shop` | Full shop, 307 products, filter by department, sort, load more |
| `/product/:id` | Product page: gallery, sizes, quantity, wishlist, care and delivery tabs, related |
| `/about` | Story, values, timeline, visit |
| `/journal` | Journal index |
| `/journal/:slug` | Article |
| `/contact` | Store details, hours, enquiry form |
| `/cart` | Cart, delivery options, discount codes, checkout |
| `/wishlist` | Saved pieces |
| `/size-guide` | Measuring tables for every department |
| `/delivery` | Delivery rates, returns, refunds |
| `/care` | How to make each fabric last |
| `/faq` | Grouped questions |
| `/terms` | Terms and privacy |
| `/admin` | Management system, unlinked from the shop |

## Management system

`/admin` is a working back office, not a static mock. Every figure derives from
the live catalogue through a seeded generator, so stock, sales and revenue stay
consistent between views and across reloads.

- **Overview** the week's takings, then three lists: pack and send, order more,
  in today
- **Orders** 68 orders, filter by status, search, order drawer, advance an order
  through paid, packing, shipped, delivered
- **Products** all 307 items with price, sales this month, stock level and a
  one-tap adjuster, with anything running low flagged
- **Customers** who they are, what they have spent, when they last ordered and
  whether their size is on file
- **Fittings** three day diary, confirm and cancel
- **Marketing** where orders come from, and discount codes you can switch on
  and off
- **Settings** shop details, operating preferences, delivery rates

## Departments

Nine: panties, underwear, bikinis, body shapers, nightwear, socks, **table
napkins**, face towels, raincoats. Napkins here means table and kitchen linen,
the Ghanaian usage, which is why the department label reads "Table Napkins" in
full.

## Photography

310 product images in `public/shop/<department>/` plus nineteen wide backdrop
plates in `public/backdrop/`, all under the
[Pexels licence](https://www.pexels.com/license/), free for commercial use with
no attribution required. Every image was reviewed by hand. Replace files in
place to swap in the client's own shots; the filenames are stable and
`src/data/products.js` maps to them by number.

## Brand

- **Display** Bodoni Moda, chosen to echo the Didone logotype
- **Body** Manrope
- **Palette** peach, sea blue, leaf green and rose over warm porcelain, with the
  logotype's antique olive as a secondary

The logo is the client's own artwork, cut three ways in `public/brand/` and
served by `src/components/Logo.jsx`:

- `veloura-lockup` mark beside the wordmark, for the header and other bars
- `veloura-logo` the original artwork, for the footer, loader and covers
- `veloura-mark` the figure alone, for tight corners and the app icon

The mark always travels with the name. WebP with a PNG fallback, both cut from
the supplied file with the background keyed out.

Tokens live at the top of `src/index.css`; each department carries a `tone` that
drives its accent. Headline accents use `--grad-text`, built from the deep
variants so every letter clears AA on porcelain. `--grad-brand` is for fills
only: its pale yellow tail disappears against the page.

## Performance

- First contentful paint under 200ms, DOM ready under 100ms
- Every route past the landing page is a separate chunk, loaded on demand
- WebGL runs on the home hero only; every other page uses a CSS gradient that
  looks near-identical and costs nothing
- The hero mounts three slides rather than seven, so the browser never fetches
  images it will not show
- Product images are capped at 1000px and re-encoded, taking the library from
  32 MB to 19 MB with no visible loss
- The header carries its own surface at every scroll position, so the logo
  never has to compete with a photograph behind it

Labels throughout are written the way the owner would say them out loud, not
the way a dashboard would print them.

Everything degrades under `prefers-reduced-motion`: the shader, the tilt, the
scroll pinning and the reveals all switch off.

## Notes

- Cart and wishlist are `localStorage` only. Checkout shows a confirmation, no
  payment is processed.
- Contact, newsletter and admin forms are visual only.
