import { Link } from '@tanstack/react-router'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { FREE_DELIVERY_THRESHOLD } from '@/data/catalog'
import { useCart } from '@/lib/cart'
import { formatPKR, img } from '@/lib/format'

export function QtyStepper({ qty, max, onChange }: { qty: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/10 bg-white">
      <button type="button" onClick={() => onChange(qty - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-brand-50" aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button type="button" disabled={qty >= max} onClick={() => onChange(qty + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-brand-50 disabled:opacity-30" aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  return (
    <div className="rounded-xl bg-brand-50 p-3 text-sm">
      <p className="mb-2 font-medium text-brand-800">
        {remaining > 0 ? <>Add <b>{formatPKR(remaining)}</b> more for <b>FREE delivery</b></> : <>🎉 You've unlocked <b>FREE delivery</b></>}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-brand-100">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { isOpen, setOpen, items, subtotal, count, setQty, remove } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, setOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Close cart" />
      <aside className="animate-slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
          <h2 className="text-lg font-bold">
            Your Cart <span className="text-ink/40">({count})</span> <span className="urdu mr-2 text-sm font-normal text-ink/50">آپ کی ٹوکری</span>
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-50" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-500">
              <ShoppingBag className="h-9 w-9" />
            </div>
            <p className="font-semibold">Your cart is empty</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <FreeDeliveryBar subtotal={subtotal} />
              {items.map((it) => (
                <div key={it.productId} className="flex gap-3">
                  <img src={img(it.product.images[0], 160, 160)} alt="" className="h-20 w-20 shrink-0 rounded-xl bg-cream object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link to="/product/$slug" params={{ slug: it.product.slug }} onClick={() => setOpen(false)} className="line-clamp-2 text-sm font-semibold hover:text-brand-600">
                        {it.product.name}
                      </Link>
                      <button type="button" onClick={() => remove(it.productId)} className="text-ink/30 hover:text-red-500" aria-label={`Remove ${it.product.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-ink/50">{formatPKR(it.unitPrice)} each</p>
                    <div className="mt-auto flex items-center justify-between">
                      <QtyStepper qty={it.qty} max={it.product.stock} onChange={(n) => setQty(it.productId, n)} />
                      <span className="font-bold">{formatPKR(it.lineTotal)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-ink/5 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex justify-between text-base">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-bold">{formatPKR(subtotal)}</span>
              </div>
              <Link to="/checkout" onClick={() => setOpen(false)} className="block rounded-full bg-brand-500 py-3.5 text-center font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">
                Checkout · Cash on Delivery
              </Link>
              <Link to="/cart" onClick={() => setOpen(false)} className="block py-1 text-center text-sm font-medium text-ink/60 hover:text-brand-600">
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
