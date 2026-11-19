# Mughal Treasure — Product Roadmap

Mughal Treasure is a full e-commerce platform (storefront + admin back office) for the Pakistani market: PKR pricing, Cash on Delivery, English/Urdu friendly UI, and an admin that is comfortable to run from an Android phone.

We are building it in milestones so the shopping experience can be reviewed early, then the data, security and back-office features are layered in.

## Milestone 1 — Product surface ✅ (done)

- Branded orange/white storefront: home page with rotating banners, category tiles, featured, deals and new arrivals.
- Shop page with keyword search, category / max-price / on-sale / in-stock filters and sorting (mobile bottom-sheet filters).
- Product detail page with images, description, highlights, regular + discounted price, stock status, sticky mobile "Add / Buy now" bar.
- Working shopping cart (drawer + full page), quantity limits by stock, free-delivery progress bar.
- Checkout form: name, Pakistani mobile validation, complete address, city, province, notes; Cash on Delivery only.
- Order confirmation page with status tracker.
- Admin preview (mobile bottom nav): dashboard KPIs, orders with status updates, products & stock, customers, daily/monthly sales, profit & expenses.
- **Stubs:** catalog in `src/data/catalog.ts`, admin data in `src/data/admin-fixtures.ts`, orders saved in the browser by `src/lib/orders-local.ts`.

## Milestone 2 — Database & real orders

- Postgres schema (Drizzle, `db/schema.ts`) for: `categories` (self-referencing `parent_id`, unlimited nesting, sort order, Urdu name), `products` (slug, prices, cost price, SKU, stock, status), `product_images`, `customers` (unique by phone), `orders`, `order_items` (price/cost snapshot), `order_status_history`, `expenses`.
- Integer PKR amounts (no floats), indexes on slug / category / status / created_at.
- Server functions to read catalog (replace `catalog.ts` imports) and to place orders: re-price items server-side, check and decrement stock in a transaction, upsert customer by phone.
- Confirmation page loads the order from the database.

## Milestone 3 — Secure admin sign-in

- Admin login with role-based access (`admin`, later `staff`). Every admin route and server function checks the role on the server; no credentials or keys in client code.
- **Decision for the owner:** Netlify Identity (built in, zero extra setup) or Supabase Auth (requested in the brief). The schema is plain Postgres, so either option works; Supabase would be connected via server-side environment variables only.

## Milestone 4 — Product & category management

- Add / edit / delete products, prices, discount prices, cost price and stock from the phone.
- Image upload (stored in Netlify Blobs, served via the Image CDN), multiple images per product.
- Create / rename / reorder / nest categories.

## Milestone 5 — Order & customer management

- Live orders list with status updates (Pending → Confirmed → Dispatched → Delivered / Cancelled), status history, restock on cancel.
- One-tap call / WhatsApp customer, printable packing slip.
- Customer database with order history and lifetime value.

## Milestone 6 — Reports, profit & expenses

- Daily and monthly sales reports from real orders, profit = revenue − cost of goods − expenses.
- Expense entry form and CSV export.

## Milestone 7 — Polish & growth

- Full Urdu (RTL) language toggle, order-tracking page by phone + order number, SMS/WhatsApp notifications, delivery-charge rules per city, SEO and sitemap. Online payment gateways only when a real provider is chosen.
