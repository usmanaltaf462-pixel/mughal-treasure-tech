# AGENTS.md — Mughal Treasure

E-commerce storefront + admin for the Pakistani market (PKR, Cash on Delivery, English/Urdu). **Continue from [PLAN.md](./PLAN.md)** — Milestone 1 (UI surface) is done; start with Milestone 2.

## Architecture

- TanStack Start (React 19, SSR) deployed on Netlify via `@netlify/vite-plugin-tanstack-start`. Server logic belongs in TanStack server functions / server routes (not a separate Netlify Server).
- `src/routes/_store.tsx` — pathless layout (header, footer, cart drawer) for all shopper routes in `src/routes/_store/`: `index` (home), `shop` (search params: q, category, sale, inStock, max, sort), `product/$slug`, `cart`, `checkout`, `order/$orderId`.
- `src/routes/admin.tsx` — admin layout (desktop sidebar, mobile bottom nav, preview banner) with `admin/` children: index, orders, products, customers, reports. Marked noindex. **No auth yet** — must be added (Milestone 3) before any real data is exposed.

## Stub data (swap these for the database)

- `src/data/catalog.ts` — categories, products, delivery fee rules, helpers (`effectivePrice`, `discountPercent`). Categories have `parentId` for nesting.
- `src/data/admin-fixtures.ts` — orders, customers, expenses, daily/monthly sales, product costs. Deterministic (seeded) so SSR and client match.
- `src/lib/orders-local.ts` — `placeOrder` / `getPlacedOrder` save orders in localStorage. Replace with a server function that re-prices from the DB and decrements stock; keep the signatures.
- `src/lib/cart.tsx` — cart context persisted to localStorage (`mt-cart-v1`); prices are looked up from the catalog, never stored in the cart.

## Conventions

- Prices are integer PKR; display with `formatPKR` (`src/lib/format.ts`).
- Images live in `public/img/` and are always rendered through `img(src, w, h?)` → Netlify Image CDN (`/.netlify/images?...&fm=webp`). Never link the full-size PNGs.
- Theme tokens (`brand-*`, `ink`, `cream`, `font-display`, `font-urdu`) are in `src/styles.css` (`@theme`). Urdu text uses the `.urdu` class (RTL + Nastaliq line-height).
- Mobile first: tap targets ≥ 36px, sticky bottom action bars, `text-base` inputs on mobile, safe-area padding.
- Browser APIs (localStorage, document) only inside effects/handlers.
- Only Cash on Delivery — do not add payment gateways until a real provider is chosen. Never put secrets in client code or `VITE_*` vars.
