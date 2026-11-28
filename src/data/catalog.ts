import productData from './products.json'
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
  flashPrice?: number | null // flash sale price, used only until flashEnds
  flashEnds?: string | null // ISO time when the flash sale stops
  drop?: { from: number; at: string } | null // set when the price was lowered
  stock: number
  rating: number
  reviews: number
  featured?: boolean
  isNew?: boolean
  hidden?: boolean
  createdAt: string
}

export const categories: Array<Category> = [
  { id: 'c-electronics', slug: 'electronics', name: 'Electronics', nameUr: 'الیکٹرانکس', image: '/img/cat-electronics.webp' },
  { id: 'c-kids', slug: 'kids', name: 'Kids Items', nameUr: 'بچوں کا سامان', image: '/img/cat-kids.webp' },
]

// Products live in products.json (managed from the /admin page).
const allProducts = productData as Array<Product>
// Hidden products are not shown in the store (shop, search, home).
export const products: Array<Product> = allProducts.filter((p) => !p.hidden)

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
  // Includes hidden products so existing carts and orders keep working.
  return allProducts.find((p) => p.id === id)
}
export type PriceFields = Pick<Product, 'price' | 'salePrice'> & Partial<Pick<Product, 'flashPrice' | 'flashEnds'>>
export function flashActive(p: Partial<Pick<Product, 'flashPrice' | 'flashEnds'>>) {
  return !!p.flashPrice && !!p.flashEnds && new Date(p.flashEnds).getTime() > Date.now()
}
export function effectivePrice(p: PriceFields) {
  if (flashActive(p) && (p.flashPrice as number) < p.price) return p.flashPrice as number
  return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price
}
export function discountPercent(p: PriceFields) {
  const e = effectivePrice(p)
  return e < p.price ? Math.round(((p.price - e) / p.price) * 100) : 0
}
// A recent price drop (last 14 days) that is still in effect.
export function dropActive(p: Product) {
  return !!p.drop && Date.now() - new Date(p.drop.at).getTime() < 14 * 864e5 && effectivePrice(p) < p.drop.from
}
