import { orderWaLink } from '@/lib/site'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Banknote, CheckCircle2, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ORDER_STATUSES } from '@/data/admin-fixtures'
import { formatDate, formatPKR, img } from '@/lib/format'
import { getPlacedOrder } from '@/lib/orders-local'
import type { PlacedOrder } from '@/lib/orders-local'

export const Route = createFileRoute('/_store/order/$orderId')({
  head: () => ({ meta: [{ title: 'Order Confirmed — Mughal Treasure' }] }),
  component: OrderConfirmation,
})

function OrderConfirmation() {
  const { orderId } = Route.useParams()
  const [order, setOrder] = useState<PlacedOrder | null | undefined>(undefined)

  useEffect(() => setOrder(getPlacedOrder(orderId)), [orderId])

  if (order === undefined) return <div className="min-h-[60vh]" />
  if (order === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-ink/60">We couldn't find order {orderId} on this device.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white">Continue shopping</Link>
      </div>
    )
  }

  const step = ORDER_STATUSES.findIndex((s) => s.value === order.status)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="animate-fade-up text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/50">
          <CheckCircle2 className="h-11 w-11" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Thank you, {order.customer.name.split(' ')[0]}!</h1>
        <p className="urdu text-lg text-brand-600">آپ کا آرڈر موصول ہو گیا ہے</p>
        <p className="mt-2 text-ink/60">
          Your order <b className="text-ink">{order.id}</b> has been placed. Our team will call you on <b className="text-ink">{order.customer.phone}</b> to confirm.
        </p>
        <a href={orderWaLink(order)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white">Send order on WhatsApp</a>
      </div>

      <div className="mt-10 rounded-3xl border border-ink/5 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          {ORDER_STATUSES.filter((s) => s.value !== 'cancelled').map((s, i) => (
            <div key={s.value} className="flex flex-1 flex-col items-center gap-2 text-center">
              <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${i <= step ? 'bg-brand-500 text-white' : 'bg-ink/5 text-ink/40'}`}>{i + 1}</span>
              <span className={`text-xs font-semibold ${i <= step ? 'text-ink' : 'text-ink/40'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 rounded-3xl bg-cream p-5 text-sm">
          <h2 className="font-bold">Delivery to</h2>
          <p className="font-semibold">{order.customer.name}</p>
          <p className="flex gap-2 text-ink/70"><MapPin className="h-4 w-4 shrink-0 text-brand-600" /> {order.customer.address}, {order.customer.city}, {order.customer.province}</p>
          <p className="flex gap-2 text-ink/70"><Phone className="h-4 w-4 shrink-0 text-brand-600" /> {order.customer.phone}</p>
        </div>
        <div className="space-y-3 rounded-3xl bg-cream p-5 text-sm">
          <h2 className="font-bold">Payment</h2>
          <p className="flex items-center gap-2 font-semibold"><Banknote className="h-5 w-5 text-brand-600" /> Cash on Delivery</p>
          <p className="text-ink/70">Please keep <b className="text-ink">{formatPKR(order.total)}</b> ready when the rider arrives.</p>
          <p className="text-xs text-ink/50">Placed {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-ink/5 bg-white p-5 sm:p-6">
        <h2 className="mb-4 font-bold">Items</h2>
        <ul className="divide-y divide-ink/5">
          {order.items.map((i) => (
            <li key={i.productId} className="flex items-center gap-3 py-3 text-sm">
              <img src={img(i.image, 112, 112)} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <span className="flex-1">{i.name} <span className="text-ink/50">× {i.qty}</span></span>
              <span className="font-semibold">{formatPKR(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-ink/10 pt-3 text-sm">
          <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-ink/60">Delivery</span><span>{order.delivery ? formatPKR(order.delivery) : 'FREE'}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPKR(order.total)}</span></div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/shop" className="inline-block rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600">Continue shopping</Link>
      </div>
    </div>
  )
}
