import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Phone, Search } from 'lucide-react'
import { useState } from 'react'
import { Card, PageTitle, StatusBadge } from '@/components/admin/ui'
import { ORDER_STATUSES, orders as seedOrders } from '@/data/admin-fixtures'
import type { OrderStatus } from '@/data/admin-fixtures'
import { formatDate, formatPKR } from '@/lib/format'

export const Route = createFileRoute('/admin/orders')({
  component: Orders,
})

function Orders() {
  const [orders, setOrders] = useState(seedOrders)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const needle = q.toLowerCase().trim()
  const list = orders.filter(
    (o) =>
      (filter === 'all' || o.status === filter) &&
      (!needle || `${o.id} ${o.customerName} ${o.phone} ${o.city}`.toLowerCase().includes(needle)),
  )
  const setStatus = (id: string, status: OrderStatus) => setOrders((all) => all.map((o) => (o.id === id ? { ...o, status } : o)))

  return (
    <>
      <PageTitle title="Orders" ur="آرڈرز" />
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search order #, name, phone or city" className="h-11 w-full rounded-xl border border-ink/10 bg-white pl-10 pr-4 text-base outline-none focus:border-brand-400 sm:text-sm" />
      </div>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {(['all', ...ORDER_STATUSES.map((s) => s.value)] as const).map((s) => {
          const count = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length
          return (
            <button key={s} type="button" onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize ${filter === s ? 'bg-brand-500 text-white' : 'bg-white text-ink/60 ring-1 ring-ink/10'}`}>
              {s} <span className="opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {list.map((o) => (
          <Card key={o.id} className="!p-0">
            <button type="button" onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
              <div className="min-w-0">
                <p className="font-bold">{o.id} <span className="font-medium text-ink/60">· {o.customerName}</span></p>
                <p className="text-xs text-ink/50">{formatDate(o.createdAt)} · {o.items.length} item(s) · COD</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-bold tabular-nums">{formatPKR(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </button>
            {open === o.id && (
              <div className="space-y-4 border-t border-ink/5 p-4 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-semibold text-brand-700"><Phone className="h-4 w-4" /> {o.phone}</a>
                  <p className="flex gap-2 text-ink/70"><MapPin className="h-4 w-4 shrink-0" /> {o.address}, {o.city}</p>
                </div>
                <ul className="divide-y divide-ink/5 rounded-xl bg-[#faf7f4] px-3">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-2 py-2">
                      <span>{it.name} × {it.qty}</span>
                      <span className="font-semibold tabular-nums">{formatPKR(it.unitPrice * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">Update status</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {ORDER_STATUSES.map((s) => (
                      <button key={s.value} type="button" onClick={() => setStatus(o.id, s.value)} className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${o.status === s.value ? 'bg-brand-500 text-white' : 'bg-white ring-1 ring-ink/10 hover:ring-brand-300'}`}>
                        {s.label}
                        <span className="urdu block text-[11px] font-normal leading-[1.6] opacity-70">{s.labelUr}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
        {list.length === 0 && <p className="py-10 text-center text-sm text-ink/50">No orders match.</p>}
      </div>
    </>
  )
}
