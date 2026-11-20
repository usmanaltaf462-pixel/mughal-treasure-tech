import { Link, createFileRoute } from '@tanstack/react-router'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { FreeDeliveryBar, QtyStepper } from '@/components/CartDrawer'
import { useCart } from '@/lib/cart'
import { OrderSummary } from '@/components/OrderSummary'
import { formatPKR, img } from '@/lib/format'

export const Route = createFileRoute('/_store/cart')({
  head: () => ({ meta: [{ title: 'Shopping Cart — Mughal Treasure Tech' }] }),
  component: CartPage,
})

function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-brand-50 text-brand-500"><ShoppingBag className="h-10 w-10" /></div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="urdu text-ink/50">آپ کی ٹوکری خالی ہے</p>
        <Link to="/shop" className="mt-6 rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white hover:bg-brand-600">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Shopping Cart</h1>
      <p className="mb-6 text-sm text-ink/50">{count} items</p>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <FreeDeliveryBar subtotal={subtotal} />
          <div className="divide-y divide-ink/5 rounded-3xl border border-ink/5 bg-white">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-4 p-4 sm:p-5">
                <Link to="/product/$slug" params={{ slug: it.product.slug }} className="shrink-0">
                  <img src={img(it.product.images[0], 220, 220)} alt="" className="h-24 w-24 rounded-2xl bg-cream object-cover sm:h-28 sm:w-28" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to="/product/$slug" params={{ slug: it.product.slug }} className="font-semibold hover:text-brand-600">{it.product.name}</Link>
                      <p className="urdu text-xs text-ink/50">{it.product.nameUr}</p>
                    </div>
                    <button type="button" onClick={() => remove(it.productId)} className="grid h-9 w-9 place-items-center rounded-full text-ink/30 hover:bg-red-50 hover:text-red-500" aria-label={`Remove ${it.product.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-ink/60">
                    {formatPKR(it.unitPrice)}
                    {it.unitPrice < it.product.price && <span className="ml-2 text-xs text-ink/40 line-through">{formatPKR(it.product.price)}</span>}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QtyStepper qty={it.qty} max={it.product.stock} onChange={(n) => setQty(it.productId, n)} />
                    <span className="text-lg font-bold">{formatPKR(it.lineTotal)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/shop" className="inline-block text-sm font-semibold text-brand-600 hover:underline">← Continue shopping</Link>
        </div>
        <div className="lg:sticky lg:top-40 lg:self-start">
          <OrderSummary>
            <Link to="/checkout" className="mt-2 block rounded-full bg-brand-500 py-3.5 text-center font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">
              Proceed to Checkout
            </Link>
            <p className="text-center text-xs text-ink/50">Pay with Cash on Delivery</p>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}
