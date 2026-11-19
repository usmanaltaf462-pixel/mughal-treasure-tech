# Mughal Treasure

A mobile-first e-commerce store for Pakistani fashion, jewellery and home décor — orange & white brand, PKR pricing, Cash on Delivery and English/Urdu labels — plus an admin back office designed to be run from an Android phone.

## What's live

- **Storefront:** home (banners, categories, featured, deals, new arrivals), shop with search/filters/sort, product pages, cart drawer + cart page, COD checkout and order confirmation.
- **Admin preview** at `/admin`: dashboard, orders (status updates), products & stock, customers, sales/profit/expense reports — currently on sample data.

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, SSR) on Netlify
- Tailwind CSS v4, lucide-react icons
- Netlify Image CDN for responsive WebP product images
- Fonts: Plus Jakarta Sans, Fraunces, Noto Nastaliq Urdu

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Roadmap

See [PLAN.md](./PLAN.md). Next up: Postgres database for products & orders, secure admin sign-in, product/image/category management, real reports.
