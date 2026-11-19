import { Link, createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, Banknote, Clock, ShoppingCart, TrendingUp } from 'lucide-react'
import { BarChart, Card, PageTitle, Stat, StatusBadge } from '@/components/admin/ui'
import { dailySales, monthlySales, orders } from '@/data/admin-fixtures'
import { products } from '@/data/catalog'
import { formatDate, formatPKR } from '@/lib/format'

export const Route = createFileRoute('/admin/')({
  component: Dashboard,
})

function Dashboard() {
  const today = dailySales[dailySales.length - 1]
  const month = monthlySales[monthlySales.length - 1]
  const pending = orders.filter((o) => o.status === 'pending').length
  const lowStock = products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock)

  return (
    <>
      <PageTitle title="Dashboard" ur="ڈیش بورڈ" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Banknote} label="Today's sales" value={formatPKR(today.revenue)} sub={`${today.orders} orders`} />
        <Stat icon={TrendingUp} label="This month" value={formatPKR(month.revenue)} sub={`Profit ${formatPKR(month.profit)}`} />
        <Stat icon={Clock} label="Pending orders" value={String(pending)} sub="Need confirmation" />
        <Stat icon={AlertTriangle} label="Low stock" value={String(lowStock.length)} sub="10 or fewer left" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Daily sales · last 14 days</h2>
            <Link to="/admin/reports" className="text-xs font-semibold text-brand-600">Reports →</Link>
          </div>
          <BarChart data={dailySales.map((d) => ({ label: d.label.split(' ')[0], value: d.revenue }))} format={formatPKR} />
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">Low stock alerts</h2>
          <ul className="space-y-2.5">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{p.name}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                  {p.stock === 0 ? 'Out' : `${p.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold"><ShoppingCart className="h-4 w-4 text-brand-600" /> Recent orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-brand-600">All orders →</Link>
        </div>
        <ul className="divide-y divide-ink/5">
          {orders.slice(0, 6).map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-semibold">{o.id} · {o.customerName}</p>
                <p className="text-xs text-ink/50">{o.city} · {formatDate(o.createdAt)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-bold tabular-nums">{formatPKR(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
