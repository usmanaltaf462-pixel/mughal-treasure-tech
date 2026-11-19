import { createFileRoute } from '@tanstack/react-router'
import { Banknote, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { BarChart, Card, PageTitle, Stat } from '@/components/admin/ui'
import { dailySales, expenses, monthlySales } from '@/data/admin-fixtures'
import { formatPKR } from '@/lib/format'

export const Route = createFileRoute('/admin/reports')({
  component: Reports,
})

function Reports() {
  const [view, setView] = useState<'daily' | 'monthly'>('monthly')
  const month = monthlySales[monthlySales.length - 1]
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const rows = view === 'daily' ? dailySales.map((d) => ({ label: d.label, revenue: d.revenue, profit: d.profit, orders: d.orders })) : monthlySales

  return (
    <>
      <PageTitle
        title="Sales & Profit"
        ur="فروخت اور منافع"
        action={
          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-ink/10">
            {(['daily', 'monthly'] as const).map((v) => (
              <button key={v} type="button" onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${view === v ? 'bg-brand-500 text-white' : 'text-ink/60'}`}>
                {v}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Banknote} label="Revenue (Nov)" value={formatPKR(month.revenue)} />
        <Stat icon={Receipt} label="Expenses (Nov)" value={formatPKR(month.expense)} />
        <Stat icon={TrendingUp} label="Net profit (Nov)" value={formatPKR(month.profit)} sub={`${Math.round((month.profit / month.revenue) * 100)}% margin`} />
        <Stat icon={Wallet} label="Orders (Nov)" value={String(month.orders)} />
      </div>

      <Card className="mt-4">
        <h2 className="mb-4 font-bold">{view === 'daily' ? 'Daily revenue · last 14 days' : 'Monthly revenue · last 6 months'}</h2>
        <BarChart data={rows.map((r) => ({ label: view === 'daily' ? r.label.split(' ')[0] : r.label, value: r.revenue }))} format={formatPKR} />
      </Card>

      <Card className="mt-4 overflow-x-auto !p-0">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-[#faf7f4] text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">{view === 'daily' ? 'Day' : 'Month'}</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {[...rows].reverse().map((r) => (
              <tr key={r.label}>
                <td className="px-4 py-3 font-medium">{r.label}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.orders}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatPKR(r.revenue)}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-green-700">{formatPKR(r.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Recent expenses</h2>
          <span className="text-sm font-bold tabular-nums">{formatPKR(totalExpenses)}</span>
        </div>
        <ul className="divide-y divide-ink/5">
          {expenses.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{e.description}</p>
                <p className="text-xs text-ink/50">{e.date} · {e.category}</p>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-red-600">− {formatPKR(e.amount)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
