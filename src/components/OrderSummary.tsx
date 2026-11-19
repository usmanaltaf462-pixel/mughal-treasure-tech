import { useCart } from '@/lib/cart'
import { formatPKR } from '@/lib/format'

export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { subtotal, savings, delivery, total } = useCart()
  return (
    <div className="space-y-3 rounded-3xl border border-ink/5 bg-cream p-5 sm:p-6">
      <h2 className="text-lg font-bold">Order Summary <span className="urdu mr-1 text-sm font-normal text-ink/50">خلاصہ</span></h2>
      <Row label="Subtotal" value={formatPKR(subtotal)} />
      {savings > 0 && <Row label="You save" value={`− ${formatPKR(savings)}`} className="text-green-700" />}
      <Row label="Delivery" value={delivery === 0 ? 'FREE' : formatPKR(delivery)} />
      <div className="border-t border-ink/10 pt-3">
        <Row label="Total (PKR)" value={formatPKR(total)} bold />
      </div>
      {children}
    </div>
  )
}

function Row({ label, value, bold, className = '' }: { label: string; value: string; bold?: boolean; className?: string }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-lg font-bold' : 'text-sm'} ${className}`}>
      <span className={bold ? '' : 'text-ink/60'}>{label}</span>
      <span className={bold ? '' : 'font-semibold'}>{value}</span>
    </div>
  )
}
