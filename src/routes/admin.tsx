import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — Mughal Treasure Tech' }, { name: 'robots', content: 'noindex,nofollow' }] }),
  component: Admin,
})

type P = Record<string, any>
const empty = { name: '', nameUr: '', shortDescription: '', description: '', highlights: '' }

async function shrink(file: File): Promise<string> {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, 1000 / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k)
  c.height = Math.round(bmp.height * k)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  return c.toDataURL('image/webp', 0.82)
}

function Admin() {
  const [key, setKey] = useState('')
  const [products, setProducts] = useState<P[] | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [imgs, setImgs] = useState<string[]>([])
  const [cat, setCat] = useState('c-electronics')
  const [price, setPrice] = useState('')
  const [sale, setSale] = useState('')
  const [stock, setStock] = useState('20')
  const [f, setF] = useState(empty)
  const [tab, setTab] = useState<'products' | 'orders' | 'sales' | 'customers' | 'reviews'>('products')
  const [orders, setOrders] = useState<P[] | null>(null)
  const [customers, setCustomers] = useState<P[] | null>(null)
  const [reviews, setReviews] = useState<P[] | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => { try { setKey(localStorage.getItem('adminKey') || '') } catch { /* ignore */ } }, [])

  async function api(path: string, body?: unknown) {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: { 'x-admin-key': key, 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
    return data
  }
  async function run(label: string, fn: () => Promise<void>) {
    setBusy(true); setMsg(label)
    try { await fn() } catch (e: any) { setMsg('❌ ' + e.message) }
    setBusy(false)
  }
  const login = () => run('Login ho raha hai…', async () => {
    try { localStorage.setItem('adminKey', key) } catch { /* ignore */ }
    setProducts(await api('/api/products')); setMsg('')
  })
  const loadOrders = () => run('Orders load ho rahe hain…', async () => { setOrders(await api('/api/orders')); setMsg('') })
  const loadCustomers = () => run('Customers load ho rahe hain…', async () => { setCustomers(await api('/api/customers')); setMsg('') })
  const loadReviews = () => run('Reviews load ho rahe hain…', async () => { setReviews(await api('/api/admin-reviews')); setMsg('') })
  const go = (t: 'products' | 'orders' | 'sales' | 'customers' | 'reviews') => {
    setTab(t)
    if (t === 'orders' || t === 'sales') loadOrders()
    if (t === 'customers') loadCustomers()
    if (t === 'reviews') loadReviews()
  }
  const reviewStatus = (r: P, status: string) => run('Update ho raha hai…', async () => {
    await api('/api/review-status', { id: r.id, status })
    setReviews((reviews || []).map((x) => (x.id === r.id ? { ...x, status } : x))); setMsg('✅ Update ho gaya')
  })
  const reviewDelete = (r: P) => confirm('Ye review delete karein?') && run('Delete ho raha hai…', async () => {
    await api('/api/review-delete', { id: r.id })
    setReviews((reviews || []).filter((x) => x.id !== r.id)); setMsg('✅ Delete ho gaya')
  })
  const downloadCsv = () => {
    const rows = [['Name', 'Phone', 'City', 'Address', 'Orders', 'Total spent', 'Last order'], ...(customers || []).map((c) => [c.name, c.phone, c.city, c.address, c.orders, c.spent, c.last_order])]
    const csv = rows.map((r) => r.map((v) => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }))
    a.download = 'customers.csv'; a.click()
  }
  const setStatus = (o: P, status: string, tracking?: string) => run('Status update ho raha hai…', async () => {
    await api('/api/order-status', { id: o.id, status, tracking })
    setOrders((orders || []).map((x) => (x.id === o.id ? { ...x, status, tracking: tracking ?? x.tracking } : x))); setMsg('✅ Update ho gaya')
  })
  const wa = (ph: string) => 'https://wa.me/' + ph.replace(/\D/g, '').replace(/^0/, '92')
  const msgFor = (o: P) => {
    const m: Record<string, string> = {
      new: `Assalam o Alaikum ${o.name}, aap ka order ${o.id} hamein mil gaya hai. Shukriya!`,
      confirmed: `Assalam o Alaikum ${o.name}, aap ka order ${o.id} confirm ho gaya hai.`,
      packed: `Assalam o Alaikum ${o.name}, aap ka order ${o.id} pack ho gaya hai aur jald dispatch hoga.`,
      dispatched: `Assalam o Alaikum ${o.name}, aap ka order ${o.id} PostEx se dispatch ho gaya hai.${o.tracking ? ' Tracking number: ' + o.tracking + '.' : ''}`,
      delivered: `Assalam o Alaikum ${o.name}, aap ka order ${o.id} deliver ho gaya hai. Shukriya, Mughal Treasure Tech ko chunne ka!`,
      cancelled: `Assalam o Alaikum ${o.name}, aap ka order ${o.id} cancel ho gaya hai.`,
    }
    return `${m[o.status] || ''}\nOrder track karein: ${location.origin}/track?id=${o.id}`
  }
  const live = (orders || []).filter((o) => o.status !== 'cancelled')
  const since = (d: number) => live.filter((o) => Date.now() - new Date(o.created_at).getTime() < d * 864e5)
  const sum = (l: P[]) => l.reduce((a, o) => a + o.total, 0)
  const top: Record<string, number> = {}
  live.forEach((o) => o.items.forEach((i: P) => { top[i.name] = (top[i.name] || 0) + i.qty }))
  const pick = async (files: FileList | null) => {
    if (!files) return
    setImgs(await Promise.all(Array.from(files).slice(0, 4).map(shrink)))
  }
  const generate = () => run('AI photo dekh raha hai (10-20 second)…', async () => {
    const d = await api('/api/describe', { image: imgs[0], hint: cat === 'c-kids' ? 'kids item' : 'electronics' })
    setF({ name: d.name, nameUr: d.nameUr, shortDescription: d.shortDescription, description: d.description, highlights: d.highlights.join('\n') })
    setMsg('✅ Tayyar. Ab check karke edit kar lein.')
  })
  const commit = (list: P[], images: Record<string, string> = {}, done: string) =>
    run('Publish ho raha hai…', async () => {
      await api('/api/commit', { products: list, images })
      setProducts(list); setMsg('✅ ' + done)
    })
  const publish = () => {
    if (!imgs.length || !f.name || !price) return setMsg('Photo, naam aur qeemat zaroori hain.')
    const slug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) + '-' + Date.now().toString(36).slice(-4)
    const images: Record<string, string> = {}
    imgs.forEach((d, i) => { images[`public/img/${slug}-${i + 1}.webp`] = d.split(',')[1] })
    const p: P = {
      id: 'p-' + Date.now(), slug, name: f.name, nameUr: f.nameUr || f.name, categoryId: cat,
      images: imgs.map((_, i) => `/img/${slug}-${i + 1}.webp`),
      shortDescription: f.shortDescription, description: f.description,
      highlights: f.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      price: Number(price), salePrice: sale ? Number(sale) : null, stock: Number(stock) || 0,
      rating: 0, reviews: 0, featured: true, isNew: true, createdAt: new Date().toISOString().slice(0, 10),
    }
    commit([p, ...(products || [])], images, 'Publish ho gaya! 1-2 minute mein site par nazar aayega.').then(() => {
      setImgs([]); setF(empty); setPrice(''); setSale('')
    })
  }
  const del = (p: P) => confirm(`"${p.name}" delete karein?`) && commit((products || []).filter((x) => x.id !== p.id), {}, 'Delete ho gaya (1-2 minute mein site se hat jayega).')
  const toggleHide = (p: P) => commit((products || []).map((x) => (x.id === p.id ? { ...x, hidden: !x.hidden } : x)), {}, p.hidden ? 'Product dobara dikhne laga (1-2 minute mein).' : 'Product hide ho gaya (1-2 minute mein store se hat jayega).')
  const edit = (p: P) => {
    const np = prompt(`${p.name}\nNayi qeemat:`, String(p.price)); if (np === null) return
    const ns = prompt('Sale price (khali = koi nahi):', p.salePrice ? String(p.salePrice) : ''); if (ns === null) return
    const nk = prompt('Stock:', String(p.stock)); if (nk === null) return
    commit((products || []).map((x) => x.id === p.id ? { ...x, price: Number(np), salePrice: ns ? Number(ns) : null, stock: Number(nk) } : x), {}, 'Update ho gaya (1-2 minute mein site par).')
  }

  const inp = 'w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-base'
  const btn = 'rounded-full bg-brand-500 px-5 py-3 font-semibold text-white disabled:opacity-50'
  return (
    <div className="mx-auto max-w-xl space-y-5 p-4 pb-24">
      <h1 className="font-display text-2xl font-bold">Admin — Products</h1>
      {!products ? (
        <div className="space-y-3">
          <input className={inp} type="password" placeholder="Admin password" value={key} onChange={(e) => setKey(e.target.value)} />
          <button className={btn} disabled={busy || !key} onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            {(['products', 'orders', 'sales', 'customers', 'reviews'] as const).map((t) => (
              <button key={t} onClick={() => go(t)} className={'rounded-full px-4 py-2 text-sm font-semibold capitalize ' + (tab === t ? 'bg-brand-500 text-white' : 'bg-black/5')}>{t}</button>
            ))}
          </div>
          {tab === 'orders' && (
            <section className="space-y-3">
              <h2 className="font-bold">Orders ({orders?.length ?? 0})</h2>
              {(orders || []).map((o) => (
                <div key={o.id} className="space-y-1 rounded-2xl border border-black/10 p-3 text-sm">
                  <div className="flex justify-between font-semibold"><span>{o.id}</span><span>Rs {o.total.toLocaleString()}</span></div>
                  <div className="text-black/50">{new Date(o.created_at).toLocaleString()}</div>
                  <div>{o.name} · <a className="text-brand-600" href={'tel:' + o.phone}>{o.phone}</a> · <a className="text-brand-600" href={wa(o.phone)}>WhatsApp</a></div>
                  <div>{o.address}, {o.city}</div>
                  {o.notes && <div className="text-black/60">Note: {o.notes}</div>}
                  <ul className="list-disc pl-5">{o.items.map((i: P, k: number) => <li key={k}>{i.name} × {i.qty}</li>)}</ul>
                  <select className={inp} value={o.status} disabled={busy} onChange={(e) => setStatus(o, e.target.value)}>
                    {['new', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'].map((x) => <option key={x}>{x}</option>)}
                  </select>
                  <input className={inp} placeholder="PostEx tracking number" defaultValue={o.tracking || ''} onBlur={(e) => e.target.value.trim() !== (o.tracking || '') && setStatus(o, o.status, e.target.value.trim())} />
                  <a className="block rounded-full bg-[#25D366] px-4 py-2.5 text-center font-semibold text-white" target="_blank" rel="noreferrer" href={wa(o.phone) + '?text=' + encodeURIComponent(msgFor(o))}>Customer ko WhatsApp bhejein</a>
                </div>
              ))}
              {orders && !orders.length && <p className="text-black/50">Abhi koi order nahi.</p>}
            </section>
          )}
          {tab === 'sales' && (
            <section className="space-y-3">
              <h2 className="font-bold">Sales (cancelled orders ke baghair)</h2>
              {([['Aaj', 1], ['Pichle 7 din', 7], ['Pichle 30 din', 30]] as const).map(([l, d]) => (
                <div key={l} className="flex justify-between rounded-xl border border-black/10 p-3"><span>{l} · {since(d).length} orders</span><b>Rs {sum(since(d)).toLocaleString()}</b></div>
              ))}
              <div className="flex justify-between rounded-xl border border-black/10 p-3"><span>Kul · {live.length} orders</span><b>Rs {sum(live).toLocaleString()}</b></div>
              <h3 className="pt-2 font-semibold">Sab se zyada bikne wale</h3>
              {Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([n, q]) => <div key={n} className="flex justify-between text-sm"><span>{n}</span><span>{q} pcs</span></div>)}
            </section>
          )}
          {tab === 'customers' && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">Customers ({customers?.length ?? 0})</h2>
                <button className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold" disabled={!customers?.length} onClick={downloadCsv}>CSV download</button>
              </div>
              <input className={inp} placeholder="Naam, phone ya shehar se dhoondhein" value={q} onChange={(e) => setQ(e.target.value)} />
              {(customers || []).filter((c) => (c.name + ' ' + c.phone + ' ' + c.city).toLowerCase().includes(q.toLowerCase())).map((c) => (
                <div key={c.phone} className="space-y-1 rounded-2xl border border-black/10 p-3 text-sm">
                  <div className="flex justify-between font-semibold"><span>{c.name}</span><span>Rs {Number(c.spent).toLocaleString()}</span></div>
                  <div><a className="text-brand-600" href={'tel:' + c.phone}>{c.phone}</a> · <a className="text-brand-600" href={wa(c.phone)}>WhatsApp</a></div>
                  <div className="text-black/70">{c.address}, {c.city}</div>
                  <div className="text-black/50">{c.orders} order{c.orders > 1 ? 's' : ''} · aakhri: {new Date(c.last_order).toLocaleDateString()}</div>
                </div>
              ))}
              {customers && !customers.length && <p className="text-black/50">Abhi koi customer nahi. Pehla order aate hi yahan save ho jayega.</p>}
            </section>
          )}
          {tab === 'reviews' && (
            <section className="space-y-3">
              <h2 className="font-bold">Reviews ({reviews?.length ?? 0})</h2>
              {(reviews || []).map((r) => (
                <div key={r.id} className="space-y-1 rounded-2xl border border-black/10 p-3 text-sm">
                  <div className="flex justify-between font-semibold"><span>{r.name} · {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span><span className={r.status === 'pending' ? 'text-amber-600' : 'text-green-600'}>{r.status === 'pending' ? 'Pending' : 'Live'}</span></div>
                  <div className="text-black/50">{(products || []).find((p) => p.id === r.product_id)?.name || r.product_id} · {new Date(r.created_at).toLocaleDateString()}</div>
                  <p className="whitespace-pre-line">{r.comment}</p>
                  <div className="flex gap-4 pt-1">
                    {r.status === 'pending'
                      ? <button className="font-semibold text-green-700" disabled={busy} onClick={() => reviewStatus(r, 'approved')}>Approve</button>
                      : <button className="font-semibold text-black/60" disabled={busy} onClick={() => reviewStatus(r, 'pending')}>Hide</button>}
                    <button className="font-semibold text-red-600" disabled={busy} onClick={() => reviewDelete(r)}>Delete</button>
                  </div>
                </div>
              ))}
              {reviews && !reviews.length && <p className="text-black/50">Abhi koi review nahi.</p>}
            </section>
          )}
          {tab === 'products' && (<>
          <section className="space-y-3 rounded-2xl border border-black/10 p-4">
            <h2 className="font-bold">Naya product</h2>
            <input type="file" accept="image/*" multiple onChange={(e) => pick(e.target.files)} />
            <div className="flex gap-2">{imgs.map((d, i) => <img key={i} src={d} alt="" className="h-20 w-20 rounded-lg object-cover" />)}</div>
            <select className={inp} value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="c-electronics">Electronics</option><option value="c-kids">Kids Items</option>
            </select>
            <div className="grid grid-cols-3 gap-2">
              <input className={inp} inputMode="numeric" placeholder="Qeemat" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input className={inp} inputMode="numeric" placeholder="Sale (optional)" value={sale} onChange={(e) => setSale(e.target.value)} />
              <input className={inp} inputMode="numeric" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <button className={btn} disabled={busy || !imgs.length} onClick={generate}>✨ AI se naam aur description banayen</button>
            <input className={inp} placeholder="Naam" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input className={inp} placeholder="Urdu naam (khali chhor sakte hain)" value={f.nameUr} onChange={(e) => setF({ ...f, nameUr: e.target.value })} />
            <input className={inp} placeholder="Chhoti description" value={f.shortDescription} onChange={(e) => setF({ ...f, shortDescription: e.target.value })} />
            <textarea className={inp} rows={4} placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            <textarea className={inp} rows={4} placeholder="Features (har line mein ek)" value={f.highlights} onChange={(e) => setF({ ...f, highlights: e.target.value })} />
            <button className={btn} disabled={busy} onClick={publish}>Publish</button>
          </section>
          <section className="space-y-2">
            <h2 className="font-bold">Maujooda products ({products.length})</h2>
            {products.map((p) => (
              <div key={p.id} className={'flex items-center gap-3 rounded-xl border border-black/10 p-2 ' + (p.hidden ? 'opacity-50' : '')}>
                <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1 text-sm"><div className="truncate font-semibold">{p.name}</div><div>Rs {p.salePrice || p.price} · stock {p.stock}{p.hidden ? ' · HIDDEN' : ''}</div></div>
                <button className="text-sm font-semibold text-brand-600" disabled={busy} onClick={() => edit(p)}>Edit</button>
                <button className="text-sm font-semibold text-black/60" disabled={busy} onClick={() => toggleHide(p)}>{p.hidden ? 'Show' : 'Hide'}</button>
                <button className="text-sm font-semibold text-red-600" disabled={busy} onClick={() => del(p)}>Delete</button>
              </div>
            ))}
          </section>
          </>)}
        </>
      )}
      {msg && <p className="fixed inset-x-4 bottom-4 rounded-xl bg-ink p-3 text-center text-sm text-white">{msg}</p>}
    </div>
  )
}
