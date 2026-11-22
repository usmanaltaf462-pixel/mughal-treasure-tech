import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

type Review = { id: number; name: string; rating: number; comment: string; created_at: string }
type Data = { avg: number; count: number; reviews: Array<Review> }

function Stars({ value, size = 'h-4 w-4' }: { value: number; size?: string }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-black/20'}`} />
      ))}
    </span>
  )
}

export function Reviews({ productId }: { productId: string }) {
  const [data, setData] = useState<Data | null>(null)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hp, setHp] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/reviews?product=' + encodeURIComponent(productId))
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ avg: 0, count: 0, reviews: [] }))
  }, [productId])

  async function submit() {
    setBusy(true)
    setMsg('')
    try {
      const r = await fetch('/api/review', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId, name, rating, comment, website: hp }) })
      const d = await r.json()
      if (!r.ok) setMsg(d.error || 'Review nahi bhej saka.')
      else {
        setMsg('Shukriya! Aap ka review check hone ke baad yahan nazar aayega.')
        setName('')
        setComment('')
        setRating(5)
      }
    } catch {
      setMsg('Internet check karein aur dobara try karein.')
    }
    setBusy(false)
  }

  const inp = 'w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-base'
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-bold">Customer Reviews</h2>
      {data && data.count > 0 && (
        <div className="mt-2 flex items-center gap-2 text-sm text-ink/70">
          <Stars value={data.avg} size="h-5 w-5" />
          <b className="text-ink">{data.avg.toFixed(1)}</b> ({data.count} review{data.count > 1 ? 's' : ''})
        </div>
      )}
      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {data && data.count === 0 && <p className="text-ink/60">Abhi tak koi review nahi. Sab se pehle aap review likhein!</p>}
          {data?.reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-black/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <b>{r.name}</b>
                <span className="text-xs text-ink/50">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <div className="mt-1"><Stars value={r.rating} /></div>
              <p className="mt-2 whitespace-pre-line text-ink/80">{r.comment}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-black/10 p-4">
          <h3 className="font-semibold">Apna review likhein</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star`}>
                <Star className={`h-8 w-8 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-black/20'}`} />
              </button>
            ))}
          </div>
          <input className={inp} placeholder="Aap ka naam" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
          <textarea className={inp} rows={4} placeholder="Product kaisa laga?" value={comment} maxLength={600} onChange={(e) => setComment(e.target.value)} />
          <input className="hidden" tabIndex={-1} autoComplete="off" name="website" value={hp} onChange={(e) => setHp(e.target.value)} />
          <button type="button" disabled={busy || !name.trim() || comment.trim().length < 3} onClick={submit} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white disabled:opacity-50">
            {busy ? 'Bhej rahe hain…' : 'Review bhejein'}
          </button>
          {msg && <p className="text-sm text-ink/70">{msg}</p>}
        </div>
      </div>
    </section>
  )
}
