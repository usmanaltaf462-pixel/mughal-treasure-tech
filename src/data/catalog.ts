/**
 * STUB DATA — storefront catalog fixtures.
 *
 * This is the single source of catalog data for the first milestone. A later
 * milestone replaces these exports with database queries (see PLAN.md) while
 * keeping the same `Category` / `Product` shapes so the UI does not change.
 */

export interface Category {
  id: string
  slug: string
  name: string
  nameUr: string
  image: string
  /** Optional parent, so categories can nest without a schema change. */
  parentId?: string | null
}

export interface Product {
  id: string
  slug: string
  name: string
  nameUr: string
  categoryId: string
  images: Array<string>
  shortDescription: string
  description: string
  highlights: Array<string>
  /** Regular price in PKR. */
  price: number
  /** Discounted sale price in PKR, if on sale. */
  salePrice?: number | null
  stock: number
  rating: number
  reviews: number
  featured?: boolean
  isNew?: boolean
  createdAt: string
}

export const categories: Array<Category> = [
  { id: 'c-electronics', slug: 'electronics', name: 'Electronics', nameUr: 'الیکٹرانکس', image: '/img/cat-electronics.webp' },
  { id: 'c-kids', slug: 'kids', name: 'Kids Items', nameUr: 'بچوں کا سامان', image: '/img/cat-kids.webp' },
]

export const products: Array<Product> = [
  {
    id: 'p-1001',
    slug: 'wireless-earbuds-pro',
    name: 'Wireless Earbuds Pro',
    nameUr: 'وائرلیس ایئربڈز',
    categoryId: 'c-electronics',
    images: ['/img/earbuds.webp'],
    shortDescription: 'Bluetooth 5.3 earbuds with charging case and clear calls.',
    description: 'Bluetooth 5.3 earbuds with charging case and clear calls. Sample listing — replace with your real product details.',
    highlights: ['Bluetooth 5.3', 'Charging case', 'Touch controls', 'Mic for calls'],
    price: 3499,
    salePrice: 2499,
    stock: 25,
    rating: 4.5,
    reviews: 20,
    featured: true,
    isNew: true,
    createdAt: '2026-11-10',
  },
  {
    id: 'p-1002',
    slug: 'bluetooth-neckband',
    name: 'Bluetooth Neckband',
    nameUr: 'بلوٹوتھ نیک بینڈ',
    categoryId: 'c-electronics',
    images: ['/img/neckband.webp'],
    shortDescription: 'Lightweight neckband with deep bass and all-day battery.',
    description: 'Lightweight neckband with deep bass and all-day battery. Sample listing — replace with your real product details.',
    highlights: ['Deep bass', 'Long battery life', 'Magnetic earbuds', 'Mic for calls'],
    price: 1999,
    salePrice: 1499,
    stock: 25,
    rating: 4.6,
    reviews: 27,
    featured: true,
    isNew: false,
    createdAt: '2026-11-11',
  },
  {
    id: 'p-1003',
    slug: '20w-fast-charger',
    name: '20W Fast Charger',
    nameUr: '20 واٹ فاسٹ چارجر',
    categoryId: 'c-electronics',
    images: ['/img/charger.webp'],
    shortDescription: 'Compact fast charger for phones, with short-circuit protection.',
    description: 'Compact fast charger for phones, with short-circuit protection. Sample listing — replace with your real product details.',
    highlights: ['20W fast charging', 'Compact size', 'Overheat protection'],
    price: 1499,
    salePrice: 999,
    stock: 25,
    rating: 4.7,
    reviews: 34,
    featured: false,
    isNew: false,
    createdAt: '2026-11-12',
  },
  {
    id: 'p-1004',
    slug: 'power-bank-10000',
    name: 'Power Bank 10000mAh',
    nameUr: 'پاور بینک 10000mAh',
    categoryId: 'c-electronics',
    images: ['/img/powerbank.webp'],
    shortDescription: 'Slim 10000mAh power bank with dual USB output.',
    description: 'Slim 10000mAh power bank with dual USB output. Sample listing — replace with your real product details.',
    highlights: ['10000mAh', 'Dual USB output', 'LED indicator'],
    price: 3299,
    salePrice: 2599,
    stock: 25,
    rating: 4.8,
    reviews: 41,
    featured: true,
    isNew: true,
    createdAt: '2026-11-13',
  },
  {
    id: 'p-1005',
    slug: 'smart-watch-series',
    name: 'Smart Watch Series',
    nameUr: 'سمارٹ واچ',
    categoryId: 'c-electronics',
    images: ['/img/smartwatch.webp'],
    shortDescription: 'Smart watch with calls, heart-rate tracking and long battery.',
    description: 'Smart watch with calls, heart-rate tracking and long battery. Sample listing — replace with your real product details.',
    highlights: ['Bluetooth calling', 'Heart-rate tracking', 'Multiple sports modes'],
    price: 4999,
    salePrice: 3799,
    stock: 25,
    rating: 4.5,
    reviews: 48,
    featured: true,
    isNew: false,
    createdAt: '2026-11-14',
  },
  {
    id: 'p-1006',
    slug: 'type-c-cable',
    name: 'Type-C Charging Cable',
    nameUr: 'ٹائپ سی کیبل',
    categoryId: 'c-electronics',
    images: ['/img/cable.webp'],
    shortDescription: 'Durable braided Type-C cable for fast charging and data.',
    description: 'Durable braided Type-C cable for fast charging and data. Sample listing — replace with your real product details.',
    highlights: ['Braided cable', 'Fast charging', '1 metre'],
    price: 699,
    salePrice: 499,
    stock: 25,
    rating: 4.6,
    reviews: 55,
    featured: false,
    isNew: false,
    createdAt: '2026-11-15',
  },
  {
    id: 'p-1007',
    slug: 'kids-learning-toy-set',
    name: 'Kids Learning Toy Set',
    nameUr: 'بچوں کا لرننگ ٹوائے سیٹ',
    categoryId: 'c-kids',
    images: ['/img/kids-toy-set.webp'],
    shortDescription: 'Colourful learning toy set that builds skills through play.',
    description: 'Colourful learning toy set that builds skills through play. Sample listing — replace with your real product details.',
    highlights: ['Safe materials', 'Bright colours', 'Ages 3+'],
    price: 2499,
    salePrice: 1799,
    stock: 25,
    rating: 4.7,
    reviews: 62,
    featured: true,
    isNew: true,
    createdAt: '2026-11-16',
  },
  {
    id: 'p-1008',
    slug: 'kids-rc-car',
    name: 'Remote Control Car',
    nameUr: 'ریموٹ کنٹرول کار',
    categoryId: 'c-kids',
    images: ['/img/kids-rc-car.webp'],
    shortDescription: 'Fast rechargeable remote control car with lights.',
    description: 'Fast rechargeable remote control car with lights. Sample listing — replace with your real product details.',
    highlights: ['Rechargeable', 'Remote control', 'LED lights'],
    price: 2999,
    salePrice: 2299,
    stock: 25,
    rating: 4.8,
    reviews: 69,
    featured: true,
    isNew: false,
    createdAt: '2026-11-17',
  },
  {
    id: 'p-1009',
    slug: 'kids-school-backpack',
    name: 'Kids School Backpack',
    nameUr: 'بچوں کا اسکول بیگ',
    categoryId: 'c-kids',
    images: ['/img/kids-backpack.webp'],
    shortDescription: 'Lightweight, roomy school backpack with padded straps.',
    description: 'Lightweight, roomy school backpack with padded straps. Sample listing — replace with your real product details.',
    highlights: ['Padded straps', 'Roomy compartments', 'Water resistant'],
    price: 2199,
    salePrice: 1699,
    stock: 25,
    rating: 4.5,
    reviews: 76,
    featured: false,
    isNew: false,
    createdAt: '2026-11-18',
  },
  {
    id: 'p-1010',
    slug: 'kids-water-bottle',
    name: 'Kids Water Bottle',
    nameUr: 'بچوں کی پانی کی بوتل',
    categoryId: 'c-kids',
    images: ['/img/kids-bottle.webp'],
    shortDescription: 'Leak-proof bottle for school, with a handy carry strap.',
    description: 'Leak-proof bottle for school, with a handy carry strap. Sample listing — replace with your real product details.',
    highlights: ['Leak-proof', 'BPA free', 'Carry strap'],
    price: 899,
    salePrice: 649,
    stock: 25,
    rating: 4.6,
    reviews: 83,
    featured: false,
    isNew: true,
    createdAt: '2026-11-19',
  },
]

/** Flat delivery charge in PKR; free above the threshold. */
export const DELIVERY_FEE = 250
export const FREE_DELIVERY_THRESHOLD = 5000

export const pakistanCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
  'Hyderabad', 'Sialkot', 'Gujranwala', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Abbottabad', 'Other',
]

export function getCategory(id: string) {
  return categories.find((c) => c.id === id)
}
export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}
export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}
export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}
export function effectivePrice(p: Pick<Product, 'price' | 'salePrice'>) {
  return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price
}
export function discountPercent(p: Pick<Product, 'price' | 'salePrice'>) {
  if (!p.salePrice || p.salePrice >= p.price) return 0
  return Math.round(((p.price - p.salePrice) / p.price) * 100)
}
