/**
 * STUB DATA — admin dashboard fixtures (orders, customers, expenses, sales).
 *
 * Every admin screen reads from this module so a later milestone can swap it
 * for database queries in one place. See PLAN.md.
 */
import { products } from './catalog'

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'

export const ORDER_STATUSES: Array<{ value: OrderStatus; label: string; labelUr: string }> = [
  { value: 'pending', label: 'Pending', labelUr: 'زیرِ التوا' },
  { value: 'confirmed', label: 'Confirmed', labelUr: 'تصدیق شدہ' },
  { value: 'dispatched', label: 'Dispatched', labelUr: 'روانہ' },
  { value: 'delivered', label: 'Delivered', labelUr: 'پہنچا دیا' },
  { value: 'cancelled', label: 'Cancelled', labelUr: 'منسوخ' },
]

export interface AdminOrder {
  id: string
  createdAt: string
  customerId: string
  customerName: string
  phone: string
  city: string
  address: string
  items: Array<{ productId: string; name: string; qty: number; unitPrice: number; unitCost: number }>
  subtotal: number
  delivery: number
  total: number
  status: OrderStatus
  paymentMethod: 'COD'
}

export interface Customer {
  id: string
  name: string
  phone: string
  city: string
  orders: number
  totalSpent: number
  lastOrderAt: string
}

export interface Expense {
  id: string
  date: string
  category: 'Delivery' | 'Packaging' | 'Marketing' | 'Salaries' | 'Rent' | 'Other'
  description: string
  amount: number
}

/** Unit cost per product, used for profit reporting (price - cost). */
export const productCosts: Record<string, number> = Object.fromEntries(
  products.map((p) => [p.id, Math.round(p.price * 0.55)]),
)

const people: Array<[string, string, string, string]> = [
  ['cu-01', 'Ayesha Khan', '0300 1234567', 'Lahore'],
  ['cu-02', 'Muhammad Bilal', '0321 7654321', 'Karachi'],
  ['cu-03', 'Fatima Noor', '0333 4567890', 'Islamabad'],
  ['cu-04', 'Hamza Ali', '0345 1122334', 'Rawalpindi'],
  ['cu-05', 'Sana Tariq', '0301 9988776', 'Faisalabad'],
  ['cu-06', 'Usman Qureshi', '0312 5566778', 'Multan'],
  ['cu-07', 'Zainab Hussain', '0336 2233445', 'Peshawar'],
  ['cu-08', 'Ali Raza', '0302 6677889', 'Karachi'],
  ['cu-09', 'Maryam Siddiqui', '0322 3344556', 'Lahore'],
  ['cu-10', 'Ahmed Farooq', '0315 8899001', 'Sialkot'],
]

const statuses: Array<OrderStatus> = [
  'pending', 'pending', 'confirmed', 'dispatched', 'delivered', 'delivered', 'delivered', 'cancelled', 'confirmed', 'delivered',
]

// Deterministic pseudo-random so SSR and client render the same numbers.
function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const NOW = new Date('2026-11-17T12:00:00+05:00')

export const orders: Array<AdminOrder> = Array.from({ length: 18 }, (_, i) => {
  const person = people[i % people.length]
  const lineCount = 1 + Math.floor(seeded(i) * 3)
  const items = Array.from({ length: lineCount }, (_, j) => {
    const p = products[Math.floor(seeded(i * 7 + j) * products.length)]
    const unitPrice = p.salePrice ?? p.price
    return { productId: p.id, name: p.name, qty: 1 + Math.floor(seeded(i + j * 3) * 2), unitPrice, unitCost: productCosts[p.id] }
  })
  const subtotal = items.reduce((s, it) => s + it.qty * it.unitPrice, 0)
  const delivery = subtotal >= 5000 ? 0 : 250
  const created = new Date(NOW.getTime() - i * 1000 * 60 * 60 * (5 + seeded(i) * 10))
  return {
    id: `MT-${(4821 - i).toString()}`,
    createdAt: created.toISOString(),
    customerId: person[0],
    customerName: person[1],
    phone: person[2],
    city: person[3],
    address: `House ${12 + i}, Street ${3 + (i % 9)}, Block ${String.fromCharCode(65 + (i % 6))}`,
    items,
    subtotal,
    delivery,
    total: subtotal + delivery,
    status: i < 3 ? 'pending' : statuses[i % statuses.length],
    paymentMethod: 'COD',
  }
})

export const customers: Array<Customer> = people.map(([id, name, phone, city]) => {
  const mine = orders.filter((o) => o.customerId === id)
  return {
    id,
    name,
    phone,
    city,
    orders: mine.length,
    totalSpent: mine.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    lastOrderAt: mine[0]?.createdAt ?? NOW.toISOString(),
  }
})

export const expenses: Array<Expense> = [
  { id: 'e-1', date: '2026-11-16', category: 'Delivery', description: 'Courier settlement — TCS', amount: 18500 },
  { id: 'e-2', date: '2026-11-15', category: 'Packaging', description: 'Branded boxes & tissue (500 pcs)', amount: 22000 },
  { id: 'e-3', date: '2026-11-12', category: 'Marketing', description: 'Facebook & Instagram ads', amount: 35000 },
  { id: 'e-4', date: '2026-11-05', category: 'Rent', description: 'Warehouse rent — November', amount: 60000 },
  { id: 'e-5', date: '2026-11-01', category: 'Salaries', description: 'Staff salaries — 2 packers', amount: 90000 },
  { id: 'e-6', date: '2026-10-28', category: 'Other', description: 'Photography for new arrivals', amount: 15000 },
]

/** Last 14 days of sales (PKR). */
export const dailySales = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(NOW.getTime() - (13 - i) * 86400000)
  const revenue = Math.round(28000 + seeded(i + 100) * 62000)
  return {
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', timeZone: 'Asia/Karachi' }),
    revenue,
    orders: 4 + Math.floor(seeded(i + 200) * 12),
    profit: Math.round(revenue * (0.3 + seeded(i + 300) * 0.12)),
  }
})

/** Last 6 months of sales (PKR). */
export const monthlySales = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((label, i) => {
  const revenue = Math.round(820000 + i * 145000 + seeded(i + 400) * 220000)
  const expense = Math.round(revenue * (0.5 + seeded(i + 500) * 0.1))
  return { label, revenue, expense, profit: revenue - expense, orders: 140 + i * 22 + Math.floor(seeded(i) * 30) }
})
