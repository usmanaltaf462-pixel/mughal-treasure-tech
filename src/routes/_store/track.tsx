import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/PageShell'

export const Route = createFileRoute('/_store/track')({
  validateSearch: (s: Record<string, unknown>): { id?: string } => ({ id: typeof s.id === 'string' ? s.id : undefined }),
  head: () => ({ meta: [{ title: 'Track Order — Mughal Treasure Tech' }] }),
  component: Track,
})

const STEPS = [
  ['new', 'Order mil gaya'],
  ['confirmed', 'Order confirm ho gaya'],
  ['packed', 'Pack ho gaya'],
  ['dispatched', 'PostEx se dispatch ho gaya'],
  ['delivered', 'Deliver ho gaya'],
] as const

function Track() {
  const { id: initial } = Route.useSearch()
  const [id, setId] = useState(initial || '')
  const [phone, setPhone] = useState('')
  const [res, setRes] = useState<any>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function go() {
    setBusy(true); setErr(''); setRes(null)
    try {
      const r = await fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: id.trim(), phone }) })
      const d = await r.json()
      if (!r.ok) setErr(d.error || 'Order nahi mila.')
      else setRes(d)
    } catch { setErr('Internet check karein aur dobara try karein.') }
    setBusy(false)
  }
  const idx = res ? STEPS.findIndex((x) => x[0] === res.status) : -1
  const inp = 'w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-base'
  return (
    <PageShell title="Track Your Order" ur="آرڈر ٹریک کریں">
      <p>Apna Order ID aur order mein likha hua phone number likhein.</p>
      <input className={inp} placeholder="Order ID (jaise MT-XXXXX)" value={id} onChange={(e) => setId(e.target.value)} />
      <input className={inp} inputMode="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button disabled={busy || !id || !phone} onClick={go} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Dekh rahe hain…' : 'Track karein'}</button>
      {err && <p className="text-red-600">{err}</p>}
      {res && (
        <div className="space-y-3 rounded-2xl border border-black/10 p-4">
          <div className="font-semibold text-ink">Order {res.id} · Rs {Number(res.total).toLocaleString()}</div>
          {res.status === 'cancelled' ? (
            <p className="font-semibold text-red-600">Ye order cancel ho chuka hai.</p>
          ) : (
            <ol className="space-y-2">
              {STEPS.map(([k, label], i) => (
                <li key={k} className={'flex items-center gap-3 ' + (i <= idx ? 'font-semibold text-ink' : 'text-ink/40')}>
                  <span className={'grid h-6 w-6 place-items-center rounded-full text-xs text-white ' + (i <= idx ? 'bg-green-600' : 'bg-black/20')}>{i <= idx ? '✓' : i + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          )}
          {res.tracking && (
            <p>PostEx tracking number: <b className="text-ink">{res.tracking}</b> — <a className="text-brand-600 underline" href="https://postex.pk" target="_blank" rel="noopener noreferrer">postex.pk par track karein</a></p>
          )}
          <ul className="text-sm">{res.items.map((i: any, k: number) => <li key={k}>{i.name} × {i.qty}</li>)}</ul>
        </div>
      )}
    </PageShell>
  )
}
