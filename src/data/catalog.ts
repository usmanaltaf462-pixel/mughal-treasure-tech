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
  { id: 'c-women', slug: 'women', name: "Women's Fashion", nameUr: 'خواتین کا فیشن', image: '/img/lawn-suit.webp' },
  { id: 'c-men', slug: 'men', name: "Men's Fashion", nameUr: 'مردانہ فیشن', image: '/img/mens-kurta.webp' },
  { id: 'c-footwear', slug: 'footwear', name: 'Footwear', nameUr: 'جوتے', image: '/img/khussa.webp' },
  { id: 'c-jewellery', slug: 'jewellery', name: 'Jewellery', nameUr: 'زیورات', image: '/img/kundan-set.webp' },
  { id: 'c-home', slug: 'home-decor', name: 'Home Décor', nameUr: 'گھر کی سجاوٹ', image: '/img/blue-pottery.webp' },
  { id: 'c-fragrance', slug: 'fragrances', name: 'Fragrances', nameUr: 'خوشبو', image: '/img/attar.webp' },
]

export const products: Array<Product> = [
  {
    id: 'p-1001',
    slug: 'embroidered-lawn-3-piece',
    name: 'Embroidered Lawn 3-Piece Suit',
    nameUr: 'کڑھائی والا لان سوٹ',
    categoryId: 'c-women',
    images: ['/img/lawn-suit.webp'],
    shortDescription: 'Peach summer lawn with thread-embroidered front and chiffon dupatta.',
    description:
      'Breathable premium lawn shirt with an intricately embroidered neckline and front panel, paired with dyed cambric trousers and a printed chiffon dupatta. Unstitched — 3 metres shirt, 2.5 metres trouser, 2.5 metres dupatta.',
    highlights: ['Unstitched 3-piece', '100% cotton lawn', 'Embroidered front', 'Chiffon dupatta'],
    price: 8990,
    salePrice: 6490,
    stock: 42,
    rating: 4.7,
    reviews: 128,
    featured: true,
    createdAt: '2026-10-20',
  },
  {
    id: 'p-1002',
    slug: 'banarsi-chiffon-dupatta',
    name: 'Banarsi Chiffon Dupatta',
    nameUr: 'بنارسی شیفون دوپٹہ',
    categoryId: 'c-women',
    images: ['/img/chiffon-dupatta.webp'],
    shortDescription: 'Saffron chiffon dupatta with a woven gold banarsi border.',
    description:
      'A lightweight, flowing chiffon dupatta in festive saffron with a woven gold banarsi border on all four sides. Perfect for Eid, mehndi and weddings.',
    highlights: ['2.5 metres', 'Woven zari border', 'Festive wear'],
    price: 3490,
    salePrice: null,
    stock: 65,
    rating: 4.6,
    reviews: 54,
    isNew: true,
    createdAt: '2026-11-10',
  },
  {
    id: 'p-1003',
    slug: 'cotton-kurta-shalwar',
    name: "Men's Cotton Kurta Shalwar",
    nameUr: 'مردانہ کاٹن کرتا شلوار',
    categoryId: 'c-men',
    images: ['/img/mens-kurta.webp'],
    shortDescription: 'Crisp white kurta shalwar with subtle collar embroidery.',
    description:
      'A timeless white kurta shalwar in soft wash-and-wear cotton with tonal embroidery on the collar and placket. Stitched in regular fit; available in sizes S–XXL.',
    highlights: ['Stitched', 'Wash & wear cotton', 'Sizes S–XXL'],
    price: 5990,
    salePrice: 4790,
    stock: 30,
    rating: 4.8,
    reviews: 210,
    featured: true,
    createdAt: '2026-09-02',
  },
  {
    id: 'p-1004',
    slug: 'jamawar-waistcoat',
    name: 'Jamawar Waistcoat',
    nameUr: 'جامہ وار واسکٹ',
    categoryId: 'c-men',
    images: ['/img/waistcoat.webp'],
    shortDescription: 'Maroon and gold jamawar waistcoat for weddings and Eid.',
    description:
      'A tailored waistcoat in rich maroon jamawar with gold motifs, a mandarin collar and antique buttons. Fully lined for a structured fit.',
    highlights: ['Fully lined', 'Jamawar fabric', 'Antique buttons'],
    price: 7490,
    salePrice: null,
    stock: 6,
    rating: 4.5,
    reviews: 37,
    createdAt: '2026-08-14',
  },
  {
    id: 'p-1005',
    slug: 'hand-embroidered-khussa',
    name: 'Hand-Embroidered Khussa',
    nameUr: 'ہاتھ کی کڑھائی والا کھسہ',
    categoryId: 'c-footwear',
    images: ['/img/khussa.webp'],
    shortDescription: 'Traditional leather khussa with golden tilla work.',
    description:
      'Handmade by artisans in Multan, these soft leather khussas feature golden tilla embroidery and a cushioned insole for all-day comfort.',
    highlights: ['Genuine leather', 'Handmade in Multan', 'Cushioned insole'],
    price: 3990,
    salePrice: 2990,
    stock: 24,
    rating: 4.6,
    reviews: 96,
    featured: true,
    createdAt: '2026-10-01',
  },
  {
    id: 'p-1006',
    slug: 'peshawari-chappal',
    name: 'Classic Peshawari Chappal',
    nameUr: 'پشاوری چپل',
    categoryId: 'c-footwear',
    images: ['/img/peshawari-chappal.webp'],
    shortDescription: 'Hand-stitched brown leather Peshawari chappal.',
    description:
      'The iconic Peshawari chappal, hand-stitched from full-grain cow leather with a tyre-rubber sole built to last for years.',
    highlights: ['Full-grain leather', 'Hand-stitched', 'Durable sole'],
    price: 4490,
    salePrice: null,
    stock: 0,
    rating: 4.9,
    reviews: 312,
    createdAt: '2026-07-11',
  },
  {
    id: 'p-1007',
    slug: 'kundan-jewellery-set',
    name: 'Kundan Bridal Jewellery Set',
    nameUr: 'کندن زیورات سیٹ',
    categoryId: 'c-jewellery',
    images: ['/img/kundan-set.webp'],
    shortDescription: 'Kundan necklace and earrings with emerald and pearl drops.',
    description:
      'A statement kundan necklace with matching earrings, finished with emerald-green stones and freshwater pearl drops. Arrives in a velvet gift box.',
    highlights: ['Necklace + earrings', 'Pearl drops', 'Gift box included'],
    price: 14990,
    salePrice: 11990,
    stock: 9,
    rating: 4.8,
    reviews: 71,
    featured: true,
    createdAt: '2026-10-28',
  },
  {
    id: 'p-1008',
    slug: 'silver-jhumka-earrings',
    name: 'Oxidised Silver Jhumka',
    nameUr: 'چاندی کے جھمکے',
    categoryId: 'c-jewellery',
    images: ['/img/jhumka.webp'],
    shortDescription: 'Lightweight oxidised jhumkas with tiny bells.',
    description:
      'Everyday oxidised silver-tone jhumkas with delicate filigree and tiny bells. Lightweight and hypoallergenic.',
    highlights: ['Lightweight', 'Hypoallergenic', 'Filigree detail'],
    price: 1890,
    salePrice: 1490,
    stock: 120,
    rating: 4.4,
    reviews: 189,
    isNew: true,
    createdAt: '2026-11-12',
  },
  {
    id: 'p-1009',
    slug: 'multani-blue-pottery-vase',
    name: 'Multani Blue Pottery Vase',
    nameUr: 'ملتانی نیلی پوٹری گلدان',
    categoryId: 'c-home',
    images: ['/img/blue-pottery.webp'],
    shortDescription: 'Hand-painted cobalt and turquoise floral vase.',
    description:
      'A hand-thrown ceramic vase from Multan, painted by hand in the traditional cobalt and turquoise kashi style. Approx. 30 cm tall.',
    highlights: ['Hand-painted', 'Approx. 30 cm', 'Made in Multan'],
    price: 4990,
    salePrice: null,
    stock: 15,
    rating: 4.7,
    reviews: 44,
    featured: true,
    createdAt: '2026-09-18',
  },
  {
    id: 'p-1010',
    slug: 'hand-carved-brass-lantern',
    name: 'Hand-Carved Brass Lantern',
    nameUr: 'پیتل کی لالٹین',
    categoryId: 'c-home',
    images: ['/img/brass-lantern.webp'],
    shortDescription: 'Intricately cut brass lantern that throws patterned light.',
    description:
      'Hand-carved brass lantern with a glass inner chimney. Use with a candle or the included warm LED bulb for beautiful patterned shadows.',
    highlights: ['Solid brass', 'LED bulb included', 'Approx. 40 cm'],
    price: 9990,
    salePrice: 8490,
    stock: 4,
    rating: 4.9,
    reviews: 28,
    createdAt: '2026-10-05',
  },
  {
    id: 'p-1011',
    slug: 'ajrak-cushion-covers',
    name: 'Sindhi Ajrak Cushion Covers (Set of 4)',
    nameUr: 'اجرک کشن کور',
    categoryId: 'c-home',
    images: ['/img/ajrak-cushions.webp'],
    shortDescription: 'Block-printed ajrak cushion covers in deep red and indigo.',
    description:
      'Four 16×16 inch cushion covers block-printed with authentic Sindhi ajrak patterns on soft cotton. Hidden zip closure. Inserts not included.',
    highlights: ['Set of 4', '16×16 inch', 'Hand block-printed'],
    price: 3290,
    salePrice: 2790,
    stock: 38,
    rating: 4.5,
    reviews: 63,
    isNew: true,
    createdAt: '2026-11-05',
  },
  {
    id: 'p-1012',
    slug: 'hand-knotted-wool-rug',
    name: 'Hand-Knotted Wool Rug',
    nameUr: 'ہاتھ سے بنا اونی قالین',
    categoryId: 'c-home',
    images: ['/img/rug.webp'],
    shortDescription: '4×6 ft hand-knotted rug in warm geometric tones.',
    description:
      'A hand-knotted 4×6 ft rug in pure wool, woven with a bold geometric pattern in red, rust and orange. Each piece is unique.',
    highlights: ['4×6 ft', '100% wool', 'Hand-knotted'],
    price: 34990,
    salePrice: 29990,
    stock: 3,
    rating: 5,
    reviews: 12,
    createdAt: '2026-08-30',
  },
  {
    id: 'p-1013',
    slug: 'onyx-serving-tray',
    name: 'Green Onyx Serving Set',
    nameUr: 'سنگِ مرمر سرونگ سیٹ',
    categoryId: 'c-home',
    images: ['/img/onyx-tray.webp'],
    shortDescription: 'Polished green onyx tray with two matching bowls.',
    description:
      'A polished natural green onyx tray with two small bowls, carved from Balochistan stone. Ideal for dry fruit and mithai.',
    highlights: ['Natural onyx', 'Tray + 2 bowls', 'Gift-ready'],
    price: 6490,
    salePrice: null,
    stock: 11,
    rating: 4.6,
    reviews: 22,
    createdAt: '2026-09-25',
  },
  {
    id: 'p-1014',
    slug: 'oud-attar-collection',
    name: 'Royal Oud Attar Collection',
    nameUr: 'شاہی عود عطر',
    categoryId: 'c-fragrance',
    images: ['/img/attar.webp'],
    shortDescription: 'Three alcohol-free attars — Oud, Amber and Rose.',
    description:
      'A trio of long-lasting, alcohol-free attars in ornate glass bottles: Royal Oud, Amber Musk and Taif Rose. 12 ml each.',
    highlights: ['3 × 12 ml', 'Alcohol-free', 'Long-lasting'],
    price: 5490,
    salePrice: 4490,
    stock: 55,
    rating: 4.7,
    reviews: 147,
    featured: true,
    isNew: true,
    createdAt: '2026-11-14',
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
