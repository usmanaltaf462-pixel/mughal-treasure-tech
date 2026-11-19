import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, effectivePrice, getProduct } from '@/data/catalog'
import type { Product } from '@/data/catalog'

export interface CartLine {
  productId: string
  qty: number
}

export interface CartItem extends CartLine {
  product: Product
  unitPrice: number
  lineTotal: number
}

interface CartContextValue {
  items: Array<CartItem>
  count: number
  subtotal: number
  savings: number
  delivery: number
  total: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const STORAGE_KEY = 'mt-cart-v1'
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Array<CartLine>>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setLines(JSON.parse(raw))
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const add = useCallback((productId: string, qty = 1) => {
    const product = getProduct(productId)
    if (!product || product.stock <= 0) return
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: Math.min(product.stock, l.qty + qty) } : l,
        )
      }
      return [...prev, { productId, qty: Math.min(product.stock, qty) }]
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    const product = getProduct(productId)
    if (!product) return
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty: Math.min(product.stock, qty) } : l)),
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const items: Array<CartItem> = []
    for (const line of lines) {
      const product = getProduct(line.productId)
      if (!product) continue
      const unitPrice = effectivePrice(product)
      items.push({ ...line, product, unitPrice, lineTotal: unitPrice * line.qty })
    }
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)
    const savings = items.reduce((s, i) => s + (i.product.price - i.unitPrice) * i.qty, 0)
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      savings,
      delivery,
      total: subtotal + delivery,
      isOpen,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }
  }, [lines, isOpen, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
