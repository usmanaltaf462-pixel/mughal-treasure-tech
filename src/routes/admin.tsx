import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SITE } from '@/lib/site'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — Mughal Treasure Tech' }, { name: 'robots', content: 'noindex,nofollow' }] }),
  component: Admin,
})

type P = Record<string, any>
const empty = { name: '', nameUr: '', shortDescription: '', description: '', highlights: '' }

// ---------- Share card (WhatsApp Status / Facebook post) ----------
const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src })
const money = (n: number) => 'Rs ' + Number(n).toLocaleString('en-PK')
type Fmt = 'square' | 'story'
const LAYOUT = {
  square: { W: 1080, H: 1080, hh: 110, photoY: 135, photoH: 500, photoW: 860, nameFont: 54, nameY: 692, nameLH: 62, priceFont: 100, priceY: 862, pillY: 886, pillH: 52, pillFont: 28, extraY: 0, footY: 980, footFont: 44 },
  story: { W: 1080, H: 1920, hh: 160, photoY: 210, photoH: 800, photoW: 900, nameFont: 76, nameY: 1125, nameLH: 90, priceFont: 150, priceY: 1400, pillY: 1440, pillH: 72, pillFont: 38, extraY: 1620, footY: 1740, footFont: 56 },
}
function rr(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) {
  x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath()
}
function wrapText(x: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const words = text.split(/\s+/); const lines: string[] = []; let cur = ''
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w
    if (x.measureText(t).width <= maxW || !cur) cur = t
    else { lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  if (lines.length > maxLines) { const keep = lines.slice(0, maxLines); keep[maxLines - 1] = keep[maxLines - 1].replace(/\s+\S*$/, '') + '…'; return keep }
  return lines
}
async function makeCard(p: P, fmt: Fmt): Promise<Blob> {
  const L = LAYOUT[fmt]; const c = document.createElement('canvas'); c.width = L.W; c.height = L.H
  const x = c.getContext('2d')!; const cx = L.W / 2; const FONT = 'Arial, Helvetica, sans-serif'
  const bg = x.createLinearGradient(0, 0, 0, L.H); bg.addColorStop(0, '#fff7ed'); bg.addColorStop(1, '#ffe8cc'); x.fillStyle = bg; x.fillRect(0, 0, L.W, L.H)
  x.fillStyle = '#f47721'; x.fillRect(0, 0, L.W, L.hh)
  const r = L.hh * 0.36
  x.fillStyle = '#fff'; x.beginPath(); x.arc(L.hh * 0.62, L.hh / 2, r, 0, Math.PI * 2); x.fill()
  try { const lg = await loadImg('/logo.webp'); x.drawImage(lg, L.hh * 0.62 - r * 0.9, L.hh / 2 - r * 0.9, r * 1.8, r * 1.8) } catch { /* logo optional */ }
  x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'left'
  let hf = L.hh * 0.36; x.font = `800 ${hf}px ${FONT}`; const hx = L.hh * 1.15
  while (x.measureText('MUGHAL TREASURE TECH').width > L.W - hx - 30) { hf -= 2; x.font = `800 ${hf}px ${FONT}` }
  x.fillText('MUGHAL TREASURE TECH', hx, L.hh / 2)
  // photo card
  const px = (L.W - L.photoW) / 2
  x.save(); x.shadowColor = 'rgba(20,33,61,.25)'; x.shadowBlur = 40; x.shadowOffsetY = 12; x.fillStyle = '#fff'; rr(x, px, L.photoY, L.photoW, L.photoH, 36); x.fill(); x.restore()
  try {
    const im = await loadImg(p.images[0]); const pad = 26; const bw = L.photoW - pad * 2; const bh = L.photoH - pad * 2
    const k = Math.min(bw / im.naturalWidth, bh / im.naturalHeight); const w = im.naturalWidth * k; const h = im.naturalHeight * k
    x.save(); rr(x, px + 8, L.photoY + 8, L.photoW - 16, L.photoH - 16, 30); x.clip(); x.drawImage(im, px + (L.photoW - w) / 2, L.photoY + (L.photoH - h) / 2, w, h); x.restore()
  } catch { /* photo missing */ }
  const price = Number(p.salePrice || p.price); const old = p.salePrice && Number(p.price) > Number(p.salePrice) ? Number(p.price) : 0
  if (old) {
    const off = Math.round((1 - price / old) * 100); const bw = L.W * 0.2; const bh = L.W * 0.075
    x.fillStyle = '#16a34a'; rr(x, px + L.photoW - bw - 24, L.photoY + 24, bw, bh, bh / 2); x.fill()
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = `800 ${bh * 0.5}px ${FONT}`; x.fillText(`${off}% OFF`, px + L.photoW - bw / 2 - 24, L.photoY + 24 + bh / 2)
  }
  // name
  x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = '#14213d'; x.font = `800 ${L.nameFont}px ${FONT}`
  wrapText(x, String(p.name), L.W - 120, 2).forEach((ln, i) => x.fillText(ln, cx, L.nameY + i * L.nameLH))
  // price (and old price next to it)
  x.font = `900 ${L.priceFont}px ${FONT}`; const pt = money(price); const pw = x.measureText(pt).width
  let ow = 0; const of = L.priceFont * 0.42; const ot = old ? money(old) : ''
  if (old) { x.font = `700 ${of}px ${FONT}`; ow = x.measureText(ot).width + 28 }
  const sx = cx - (pw + ow) / 2
  x.textAlign = 'left'; x.fillStyle = '#f47721'; x.font = `900 ${L.priceFont}px ${FONT}`; x.fillText(pt, sx, L.priceY)
  if (old) { x.fillStyle = '#7a8497'; x.font = `700 ${of}px ${FONT}`; const ox = sx + pw + 28; x.fillText(ot, ox, L.priceY); x.fillRect(ox, L.priceY - of * 0.32, x.measureText(ot).width, 4) }
  // Cash on delivery pill
  x.textAlign = 'center'; x.textBaseline = 'middle'; const pillText = 'CASH ON DELIVERY  •  ALL OVER PAKISTAN'; x.font = `800 ${L.pillFont}px ${FONT}`
  const pwid = x.measureText(pillText).width + 60; x.fillStyle = '#14213d'; rr(x, cx - pwid / 2, L.pillY, pwid, L.pillH, L.pillH / 2); x.fill(); x.fillStyle = '#fff'; x.fillText(pillText, cx, L.pillY + L.pillH / 2 + 2)
  if (L.extraY) { x.fillStyle = '#14213d'; x.font = `700 40px ${FONT}`; x.fillText('Delivery 2–5 working days  •  7-day easy returns', cx, L.extraY) }
  // footer
  x.fillStyle = '#14213d'; x.fillRect(0, L.footY, L.W, L.H - L.footY)
  x.fillStyle = '#fff'; x.font = `800 ${L.footFont}px ${FONT}`; x.fillText(`Order on WhatsApp: ${SITE.phoneDisplay}`, cx, L.footY + (L.H - L.footY) / 2)
  return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Image nahi bani'))), 'image/jpeg', 0.92))
}
const blobToB64 = (b: Blob) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(b) })
// 1200x630 picture that WhatsApp / Facebook show as the link preview of a product.
async function makeOgCard(p: P, photoSrc: string): Promise<Blob> {
  const W = 1200, H = 630; const c = document.createElement('canvas'); c.width = W; c.height = H
  const x = c.getContext('2d')!; const FONT = 'Arial, Helvetica, sans-serif'
  x.fillStyle = '#fff0e0'; x.fillRect(0, 0, W, H); x.fillStyle = '#f47721'; x.fillRect(0, 0, W, 96)
  x.fillStyle = '#fff'; x.beginPath(); x.arc(60, 48, 36, 0, Math.PI * 2); x.fill()
  try { const lg = await loadImg('/logo.webp'); x.drawImage(lg, 29, 17, 62, 62) } catch { /* logo optional */ }
  x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = `800 38px ${FONT}`; x.fillText('MUGHAL TREASURE TECH', 118, 48)
  x.fillStyle = '#fff'; rr(x, 40, 128, 540, 420, 30); x.fill()
  try { const im = await loadImg(photoSrc); const k = Math.min(500 / im.naturalWidth, 380 / im.naturalHeight); const w = im.naturalWidth * k; const h = im.naturalHeight * k; x.drawImage(im, 40 + (540 - w) / 2, 128 + (420 - h) / 2, w, h) } catch { /* photo missing */ }
  x.fillStyle = '#14213d'; x.textBaseline = 'alphabetic'; x.font = `800 54px ${FONT}`
  let y = 190; wrapText(x, String(p.name), 560, 3).forEach((ln) => { x.fillText(ln, 620, y); y += 66 })
  x.font = `800 26px ${FONT}`; let pill = 'CASH ON DELIVERY  •  ALL OVER PAKISTAN'; if (x.measureText(pill).width + 50 > 560) pill = 'CASH ON DELIVERY  •  PAKISTAN'
  const pw = Math.min(560, x.measureText(pill).width + 50)
  x.fillStyle = '#14213d'; rr(x, 620, y + 20, pw, 54, 27); x.fill(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(pill, 620 + pw / 2, y + 47)
  x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillStyle = '#f47721'; x.font = `800 34px ${FONT}`; x.fillText('Order now on WhatsApp', 620, y + 120)
  x.fillStyle = '#14213d'; x.fillRect(0, 570, W, 60); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `800 34px ${FONT}`; x.fillText(`WhatsApp: ${SITE.phoneDisplay}`, W / 2, 600)
  return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Image nahi bani'))), 'image/jpeg', 0.9))
}

function makeCaption(p: P) {
  const price = Number(p.salePrice || p.price); const old = p.salePrice && Number(p.price) > Number(p.salePrice) ? Number(p.price) : 0
  return [
    `🔥 ${p.name}`, p.shortDescription ? `✨ ${p.shortDescription}` : '',
    `💰 Price: ${money(price)}${old ? ` (pehle ${money(old)})` : ''}`,
    '✅ Cash on Delivery — poore Pakistan mein', '🚚 Delivery 2–5 working days',
    `📲 Order karein WhatsApp par: ${SITE.phoneDisplay}`, `🛒 ${location.origin}/product/${p.slug}`,
  ].filter(Boolean).join('\n')
}

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
  const [feat, setFeat] = useState(true)
  const [f, setF] = useState(empty)
  const [tab, setTab] = useState<'products' | 'orders' | 'sales' | 'customers' | 'reviews' | 'visitors'>('products')
  const [orders, setOrders] = useState<P[] | null>(null)
  const [customers, setCustomers] = useState<P[] | null>(null)
  const [reviews, setReviews] = useState<P[] | null>(null)
  const [q, setQ] = useState('')
  const [stats, setStats] = useState<P | null>(null)
  const [shareFor, setShareFor] = useState<P | null>(null)
  const [fmt, setFmt] = useState<Fmt>('story')
  const [shareImg, setShareImg] = useState('')
  const [shareBlob, setShareBlob] = useState<Blob | null>(null)
  const [caption, setCaption] = useState('')

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
    try { localStorage.setItem('adminKey', key); localStorage.setItem('mt-owner', '1') } catch { /* ignore */ }
    setProducts(await api('/api/products')); setMsg('')
  })
  const loadOrders = () => run('Orders load ho rahe hain…', async () => { setOrders(await api('/api/orders')); setMsg('') })
  const loadCustomers = () => run('Customers load ho rahe hain…', async () => { setCustomers(await api('/api/customers')); setMsg('') })
  const loadReviews = () => run('Reviews load ho rahe hain…', async () => { setReviews(await api('/api/admin-reviews')); setMsg('') })
  const loadStats = () => run('Visitors load ho rahe hain…', async () => { setStats(await api('/api/stats')); setMsg('') })
  const go = (t: 'products' | 'orders' | 'sales' | 'customers' | 'reviews' | 'visitors') => {
    setTab(t)
    if (t === 'orders' || t === 'sales') loadOrders()
    if (t === 'customers') loadCustomers()
    if (t === 'reviews') loadReviews()
    if (t === 'visitors') loadStats()
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
  const publish = async () => {
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
      rating: 0, reviews: 0, featured: feat, isNew: true, createdAt: new Date().toISOString().slice(0, 10),
    }
    try { const ob = await makeOgCard(p, imgs[0]); images[`public/img/og-${slug}.jpg`] = await blobToB64(ob); p.og = `/img/og-${slug}.jpg` } catch { /* link preview picture is optional */ }
    commit([p, ...(products || [])], images, 'Publish ho gaya! 1-2 minute mein site par nazar aayega.').then(() => {
      setImgs([]); setF(empty); setPrice(''); setSale(''); setFeat(true)
    })
  }
  const del = (p: P) => confirm(`"${p.name}" delete karein?`) && commit((products || []).filter((x) => x.id !== p.id), {}, 'Delete ho gaya (1-2 minute mein site se hat jayega).')
  useEffect(() => {
    if (!shareFor) return
    let dead = false; let url = ''
    setShareImg(''); setShareBlob(null)
    makeCard(shareFor, fmt).then((b) => { if (dead) return; url = URL.createObjectURL(b); setShareBlob(b); setShareImg(url) }).catch(() => setMsg('❌ Share image nahi ban saki.'))
    return () => { dead = true; if (url) URL.revokeObjectURL(url) }
  }, [shareFor, fmt])
  const openShare = (p: P) => { setCaption(makeCaption(p)); setShareFor(p) }
  const fileName = () => `${shareFor?.slug || 'product'}-${fmt}.jpg`
  const downloadShare = () => { if (!shareImg) return; const a = document.createElement('a'); a.href = shareImg; a.download = fileName(); a.click() }
  const copyCaption = async () => { try { await navigator.clipboard.writeText(caption); setMsg('✅ Caption copy ho gaya.') } catch { setMsg('Caption copy nahi hua, haath se copy kar lein.') } }
  const doShare = async () => {
    if (!shareBlob) return
    const file = new File([shareBlob], fileName(), { type: 'image/jpeg' })
    const nav = navigator as any
    if (nav.canShare && nav.canShare({ files: [file] })) {
      try { await nav.share({ files: [file], text: caption }); return } catch (e: any) { if (e?.name === 'AbortError') return }
    }
    downloadShare(); await copyCaption()
    setMsg('Is browser mein direct share nahi hota: image download ho gayi aur caption copy ho gaya. WhatsApp ya Facebook mein jaa kar image lagayein aur caption paste karein.')
  }
  const shareUrl = () => location.origin + '/product/' + shareFor?.slug
  const shortText = () => { const pr = Number(shareFor?.salePrice || shareFor?.price); return `🔥 ${shareFor?.name} — ${money(pr)}\n✅ Cash on Delivery all over Pakistan` }
  const shareLink = async () => {
    const nav = navigator as any
    if (nav.share) { try { await nav.share({ title: shareFor?.name, text: shortText(), url: shareUrl() }); return } catch (e: any) { if (e?.name === 'AbortError') return } }
    try { await navigator.clipboard.writeText(shareUrl()); setMsg('✅ Product ka link copy ho gaya.') } catch { setMsg(shareUrl()) }
  }
  const shareSite = async () => {
    const nav = navigator as any
    const text = `🛍️ Mughal Treasure Tech — Electronics & Kids Items\n✅ Cash on Delivery all over Pakistan\n📲 WhatsApp: ${SITE.phoneDisplay}`
    if (nav.share) { try { await nav.share({ title: 'Mughal Treasure Tech', text, url: location.origin }); return } catch (e: any) { if (e?.name === 'AbortError') return } }
    try { await navigator.clipboard.writeText(location.origin); setMsg('✅ Website ka link copy ho gaya.') } catch { setMsg(location.origin) }
  }
  const copySite = async () => { try { await navigator.clipboard.writeText(location.origin); setMsg('✅ Website ka link copy ho gaya.') } catch { setMsg(location.origin) } }
  const toggleFeatured = (p: P) => commit((products || []).map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)), {}, p.featured ? 'Featured se hata diya (1-2 minute mein).' : 'Featured mein add ho gaya (1-2 minute mein).')
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
          <div className="flex flex-wrap gap-2">
            {(['products', 'orders', 'sales', 'customers', 'reviews', 'visitors'] as const).map((t) => (
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
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-black/[0.03] p-2">
            <span className="px-1 text-xs font-semibold text-black/60">Website:</span>
            <button className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white" onClick={shareSite}>Poori website share karein</button>
            <a className="rounded-full bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white" target="_blank" rel="noreferrer" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.origin)}>Facebook</a>
            <button className="rounded-full bg-black/10 px-4 py-2 text-sm font-semibold" onClick={copySite}>Link copy</button>
          </div>
          {tab === 'visitors' && stats && (
            <section className="space-y-4">
              <h2 className="font-bold">Visitors</h2>
              <div className="grid grid-cols-2 gap-2">
                {([['Aaj', stats.today], ['Pichle 7 din', stats.week], ['Pichle 30 din', stats.month]] as const).map(([l, d]) => (
                  <div key={l} className="rounded-2xl border border-black/10 p-3">
                    <div className="text-xs text-black/50">{l}</div>
                    <div className="text-2xl font-bold">{d.v}</div>
                    <div className="text-xs text-black/60">{d.u} alag visitors</div>
                  </div>
                ))}
                <div className="rounded-2xl border border-black/10 p-3">
                  <div className="text-xs text-black/50">Ab tak kul</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-black/60">page views</div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Pichle 14 din (page views)</h3>
                <div className="flex h-32 items-end gap-1">
                  {stats.daily.map((d: P) => {
                    const max = Math.max(1, ...stats.daily.map((x: P) => x.v))
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.day}: ${d.v} views, ${d.u} visitors`}>
                        <span className="text-[10px] text-black/60">{d.v}</span>
                        <div className="w-full rounded-t bg-brand-500" style={{ height: `${Math.max(4, (d.v / max) * 100)}%` }} />
                        <span className="text-[10px] text-black/40">{d.day.slice(8)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              {([['Sab se zyada dekhe gaye pages', stats.pages], ['Log kahan se aaye', stats.refs], ['Shehar', stats.cities], ['Device', stats.devices]] as const).map(([title, rows]) => (
                <div key={title}>
                  <h3 className="mb-1 text-sm font-semibold">{title} (30 din)</h3>
                  {rows.length === 0 && <p className="text-sm text-black/50">Abhi data nahi.</p>}
                  {rows.map((r: P) => (
                    <div key={r.name} className="flex justify-between border-b border-black/5 py-1 text-sm"><span className="truncate pr-3">{r.name}</span><b>{r.v}</b></div>
                  ))}
                </div>
              ))}
              <p className="text-xs text-black/50">Aap ke apne phone ya browser ki visits (jis se admin mein login kiya) ginti mein nahi aati. Bots bhi nahi gine jate. Din Pakistan ke waqt ke mutabiq hai.</p>
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
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={feat} onChange={(e) => setFeat(e.target.checked)} /> Home page par Featured mein dikhayen</label>
            <button className={btn} disabled={busy} onClick={publish}>Publish</button>
          </section>
          <section className="space-y-2">
            <h2 className="font-bold">Maujooda products ({products.length})</h2>
            {products.map((p) => (
              <div key={p.id} className={'flex items-center gap-3 rounded-xl border border-black/10 p-2 ' + (p.hidden ? 'opacity-50' : '')}>
                <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1 text-sm"><div className="truncate font-semibold">{p.name}</div><div>Rs {p.salePrice || p.price} · stock {p.stock}{p.featured ? ' · ★' : ''}{p.hidden ? ' · HIDDEN' : ''}</div></div>
                <div className="flex max-w-[48%] flex-wrap justify-end gap-x-3 gap-y-1">
                <button className="text-sm font-semibold text-green-700" onClick={() => openShare(p)}>Share</button>
                <button className="text-sm font-semibold text-brand-600" disabled={busy} onClick={() => edit(p)}>Edit</button>
                <button className="text-sm font-semibold text-black/60" disabled={busy} onClick={() => toggleHide(p)}>{p.hidden ? 'Show' : 'Hide'}</button>
                <button className="text-sm font-semibold text-amber-600" disabled={busy} onClick={() => toggleFeatured(p)}>{p.featured ? 'Unfeature' : 'Feature'}</button>
                <button className="text-sm font-semibold text-red-600" disabled={busy} onClick={() => del(p)}>Delete</button>
                </div>
              </div>
            ))}
          </section>
          </>)}
        </>
      )}
      {shareFor && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={() => setShareFor(null)}>
          <div className="max-h-[92vh] w-full max-w-md space-y-3 overflow-auto rounded-3xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="truncate font-bold">Share: {shareFor.name}</h3>
              <button className="text-3xl leading-none text-black/50" onClick={() => setShareFor(null)} aria-label="Band karein">×</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['story', 'square'] as const).map((f) => (
                <button key={f} onClick={() => setFmt(f)} className={'rounded-xl px-3 py-2 text-sm font-semibold ' + (fmt === f ? 'bg-brand-500 text-white' : 'bg-black/5')}>
                  {f === 'story' ? 'WhatsApp Status (9:16)' : 'Facebook Post (1:1)'}
                </button>
              ))}
            </div>
            {shareImg ? <img src={shareImg} alt="Share preview" className="mx-auto max-h-[42vh] rounded-xl border border-black/10" /> : <p className="py-10 text-center text-sm text-black/50">Image ban rahi hai…</p>}
            <textarea className={inp} rows={7} value={caption} onChange={(e) => setCaption(e.target.value)} />
            <button className={btn + ' w-full'} disabled={!shareBlob} onClick={doShare}>Share karein (WhatsApp Status / Facebook)</button>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-full bg-black/5 px-4 py-3 text-sm font-semibold" disabled={!shareImg} onClick={downloadShare}>Image download</button>
              <button className="rounded-full bg-black/5 px-4 py-3 text-sm font-semibold" onClick={copyCaption}>Caption copy</button>
            </div>
            <button className="w-full rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white" onClick={shareLink}>Link share karein (tap karne par product khule)</button>
            <a className="block rounded-full bg-[#128c7e] px-4 py-3 text-center text-sm font-semibold text-white" target="_blank" rel="noreferrer" href={'https://wa.me/?text=' + encodeURIComponent(shortText() + '\n' + shareUrl())}>WhatsApp par link bhejein</a>
            <a className="block rounded-full bg-[#1877f2] px-4 py-3 text-center text-sm font-semibold text-white" target="_blank" rel="noreferrer" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.origin + '/product/' + shareFor.slug)}>Facebook par product ka link share karein</a>
            <p className="text-xs text-black/50"><b>Link share</b> mein product ki tasveer aur naam ke saath ek card banta hai, jise dabane par seedha product ka page khulta hai. <b>Share karein</b> (tasveer wala) mein tasveer jati hai aur link caption mein hota hai. Share dabane par phone ki share list khulti hai. WhatsApp chunein aur "My status" (status ke liye) ya kisi chat ko bhejein. Facebook app bhi list mein aati hai.</p>
          </div>
        </div>
      )}
      {msg && <p className="fixed inset-x-4 bottom-4 rounded-xl bg-ink p-3 text-center text-sm text-white">{msg}</p>}
    </div>
  )
}
