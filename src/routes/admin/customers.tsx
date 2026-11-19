import { createFileRoute } from '@tanstack/react-router'
import { Phone } from 'lucide-react'
import { Card, PageTitle } from '@/components/admin/ui'
import { customers } from '@/data/admin-fixtures'
import { formatDate, formatPKR } from '@/lib/format'

export const Route = createFileRoute('/admin/customers')({
  component: Customers,
})

function Customers() {
  const list = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)
  return (
    <>
      <PageTitle title="Customers" ur="گاہک" action={<span className="text-sm text-ink/50">{list.length} customers</span>} />
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((c) => (
          <Card key={c.id} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">
              {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.name}</p>
              <p className="text-xs text-ink/50">{c.city} · {c.orders} orders · last {formatDate(c.lastOrderAt).split(',')[0]}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-sm font-bold tabular-nums">{formatPKR(c.totalSpent)}</span>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-1 text-xs font-semibold text-brand-700"><Phone className="h-3 w-3" /> Call</a>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
