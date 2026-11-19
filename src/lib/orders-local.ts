/**
 * STUB — temporary order storage in the shopper's browser.
 *
 * Milestone 2 (see PLAN.md) replaces `placeOrder` with a server function that
 * validates prices/stock and writes to the orders database. Keep this module's
 * function signatures so the checkout and confirmation pages do not change.
 */
import type { OrderStatus } from '@/data/admin-fixtures'

export interface PlacedOrder {
  id: string
  createdAt: string
  status: OrderStatus
  paymentMethod: 'COD'
  customer: {
    name: string
    phone: string
    email?: string
    address: string
    city: string
    province: string
    postalCode?: string
    notes?: string
  }
  items: Array<{ productId: string; name: string; image: string; qty: number; unitPrice: number }>
  subtotal: number
  delivery: number
  total: number
}

const KEY = 'mt-orders-v1'

function readAll(): Array<PlacedOrder> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function placeOrder(order: Omit<PlacedOrder, 'id' | 'createdAt' | 'status'>): PlacedOrder {
  const id = `MT-${Date.now().toString(36).toUpperCase().slice(-6)}`
  const full: PlacedOrder = { ...order, id, createdAt: new Date().toISOString(), status: 'pending' }
  localStorage.setItem(KEY, JSON.stringify([full, ...readAll()].slice(0, 20)))
  return full
}

export function getPlacedOrder(id: string) {
  return readAll().find((o) => o.id === id) ?? null
}
