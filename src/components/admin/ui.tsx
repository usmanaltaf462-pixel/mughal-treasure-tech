import type { OrderStatus } from '@/data/admin-fixtures'
import { ORDER_STATUSES } from '@/data/admin-fixtures'

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
  dispatched: 'bg-violet-50 text-violet-700 ring-violet-200',
  delivered: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUSES.find((x) => x.value === status)!
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}>{s.label}</span>
}

export function PageTitle({ title, ur, action }: { title: string; ur: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="urdu text-sm text-brand-600">{ur}</p>
      </div>
      {action}
    </div>
  )
}

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-ink/5 bg-white p-4 sm:p-5 ${className}`}>{children}</div>
}

export function Stat({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink/50">{sub}</p>}
    </Card>
  )
}

/** Simple vertical bar chart (single series), sized for phones. */
export function BarChart({ data, format }: { data: Array<{ label: string; value: number }>; format: (n: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-48 items-end gap-1.5 sm:gap-2" role="img" aria-label="Bar chart">
      {data.map((d) => (
        <div key={d.label} className="group relative flex h-full flex-1 flex-col justify-end">
          <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
            {d.label}: {format(d.value)}
          </span>
          <div className="w-full rounded-t-[4px] bg-brand-500 transition group-hover:bg-brand-600" style={{ height: `${(d.value / max) * 100}%` }} />
          <span className="mt-1.5 truncate text-center text-[10px] text-ink/45">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
