// Admin API for Mughal Treasure Tech. Runs only for /api/* requests.
// Needs two secrets in Cloudflare: ADMIN_PASSWORD and GITHUB_TOKEN (Contents: read & write on this repo).
const REPO = 'usmanaltaf462-pixel/mughal-treasure-tech'
const BRANCH = 'main'
const FILE = 'src/data/products.json'
const MODEL = '@cf/meta/llama-3.2-11b-vision-instruct'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })

function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

async function gh(env, path, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'user-agent': 'mughal-treasure-admin',
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

async function getProducts(env) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`, {
    headers: { authorization: `Bearer ${env.GITHUB_TOKEN}`, accept: 'application/vnd.github.raw+json', 'user-agent': 'mughal-treasure-admin' },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return JSON.parse(await res.text())
}


const SCHEMA = `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', name TEXT, phone TEXT, city TEXT, address TEXT, notes TEXT, items TEXT, subtotal INTEGER, delivery INTEGER, total INTEGER)`
const STATUSES = ['new', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled']
let ready = false
async function ensure(env) {
  if (ready) return
  await env.DB.prepare(SCHEMA).run()
  try { await env.DB.prepare('ALTER TABLE orders ADD COLUMN tracking TEXT').run() } catch (e) { /* column already exists */ }
  ready = true
}
const digits = (v) => String(v || '').replace(/\D/g, '').slice(-10)
const str = (v, n) => String(v == null ? '' : v).slice(0, n)
const num = (v) => (Number.isFinite(Number(v)) ? Math.max(0, Math.round(Number(v))) : 0)

async function saveOrder(env, o) {
  const c = (o && o.customer) || {}
  if (!o || !o.id || !c.name || !c.phone || !Array.isArray(o.items) || !o.items.length || o.items.length > 40) throw new Error('Bad order')
  await ensure(env)
  const items = o.items.map((i) => ({ name: str(i.name, 120), qty: num(i.qty), unitPrice: num(i.unitPrice), productId: str(i.productId, 40) }))
  await env.DB.prepare('INSERT OR IGNORE INTO orders (id, created_at, status, name, phone, city, address, notes, items, subtotal, delivery, total) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(str(o.id, 40), new Date().toISOString(), 'new', str(c.name, 80), str(c.phone, 30), str(c.city, 60), str(c.address, 300), str(c.notes, 300), JSON.stringify(items), num(o.subtotal), num(o.delivery), num(o.total)).run()
}

const IMG_PATH = /^public\/img\/[a-z0-9-]{1,80}\.webp$/

async function commit(env, products, images) {
  if (!Array.isArray(products)) throw new Error('products must be a list')
  for (const p of products) {
    if (!p || typeof p.slug !== 'string' || typeof p.name !== 'string' || typeof p.price !== 'number') throw new Error('Bad product data')
  }
  const entries = []
  for (const [path, b64] of Object.entries(images || {})) {
    if (!IMG_PATH.test(path)) throw new Error('Bad image path')
    if (typeof b64 !== 'string' || b64.length > 2_000_000) throw new Error('Image too large')
    const blob = await gh(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: b64, encoding: 'base64' }) })
    entries.push({ path, mode: '100644', type: 'blob', sha: blob.sha })
  }
  const jsonBlob = await gh(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: JSON.stringify(products, null, 2) + '\n', encoding: 'utf-8' }) })
  entries.push({ path: FILE, mode: '100644', type: 'blob', sha: jsonBlob.sha })

  const ref = await gh(env, `/git/ref/heads/${BRANCH}`)
  const parent = await gh(env, `/git/commits/${ref.object.sha}`)
  const tree = await gh(env, '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: parent.tree.sha, tree: entries }) })
  const made = await gh(env, '/git/commits', { method: 'POST', body: JSON.stringify({ message: 'Update products from admin page', tree: tree.sha, parents: [ref.object.sha] }) })
  await gh(env, `/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: made.sha }) })
  return made.sha
}

const PROMPT = `You write product listings for a Pakistani online store that sells electronics and kids items.
Look at the product photo and reply with ONLY a JSON object, no other text:
{"name": "short product name, max 6 words", "nameUr": "the name in Urdu script", "shortDescription": "one sentence", "description": "2-3 sentences describing only what is visible", "highlights": ["3 or 4 short bullet points"]}
Do not invent technical specs such as battery hours or ratings. Use simple, friendly English.`

async function runModel(env, dataUrl, hint) {
  const messages = [{ role: 'user', content: [
    { type: 'text', text: PROMPT + (hint ? `\nThe seller says this product is: ${hint}` : '') },
    { type: 'image_url', image_url: { url: dataUrl } },
  ] }]
  return env.AI.run(MODEL, { messages, max_tokens: 600 })
}

async function describe(env, dataUrl, hint) {
  let out
  try {
    out = await runModel(env, dataUrl, hint)
  } catch (e) {
    // First use of this model needs a one-time licence acceptance.
    await env.AI.run(MODEL, { prompt: 'agree' })
    out = await runModel(env, dataUrl, hint)
  }
  // Workers AI sometimes returns the reply as an already-parsed object instead of a string.
  const raw = typeof out === 'string' ? out : out && out.response
  let d
  if (raw && typeof raw === 'object') {
    d = raw
  } else {
    const text = String(raw || '')
    const a = text.indexOf('{')
    const b = text.lastIndexOf('}')
    if (a < 0 || b < a) throw new Error('AI did not return a listing')
    d = JSON.parse(text.slice(a, b + 1))
  }
  return {
    name: String(d.name || ''),
    // The model writes Urdu badly (often Hindi/Punjabi letters), so only keep it if it is really Urdu script.
    nameUr: /[\u0600-\u06FF]/.test(String(d.nameUr || '')) && !/[\u0900-\u0DFF]/.test(String(d.nameUr)) ? String(d.nameUr) : '',
    shortDescription: String(d.shortDescription || ''),
    description: String(d.description || ''),
    highlights: Array.isArray(d.highlights) ? d.highlights.map(String).slice(0, 5) : [],
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url)
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req)
    if (url.pathname === '/api/order' && req.method === 'POST') {
      try { await saveOrder(env, await req.json()); return json({ ok: true }) } catch (e) { return json({ error: String(e && e.message ? e.message : e) }, 400) }
    }
    if (url.pathname === '/api/track' && req.method === 'POST') {
      try {
        const { id, phone } = await req.json()
        await ensure(env)
        const r = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(str(id, 40).trim()).first()
        if (!r || digits(r.phone) !== digits(phone) || digits(phone).length < 10) {
          await new Promise((res) => setTimeout(res, 600))
          return json({ error: 'Order nahi mila. Order ID aur phone number dobara check karein.' }, 404)
        }
        const items = JSON.parse(r.items || '[]').map((i) => ({ name: i.name, qty: i.qty }))
        return json({ id: r.id, status: r.status === 'shipped' ? 'dispatched' : r.status, created_at: r.created_at, total: r.total, items, tracking: r.tracking || '', courier: 'PostEx' })
      } catch (e) { return json({ error: 'Kuch masla aa gaya, dobara try karein.' }, 400) }
    }
    if (!env.ADMIN_PASSWORD || !env.GITHUB_TOKEN) return json({ error: 'Server is not set up yet (missing secrets).' }, 500)
    if (!same(req.headers.get('x-admin-key') || '', env.ADMIN_PASSWORD)) {
      await new Promise((r) => setTimeout(r, 800))
      return json({ error: 'Wrong password' }, 401)
    }
    try {
      if (url.pathname === '/api/products' && req.method === 'GET') return json(await getProducts(env))
      if (url.pathname === '/api/orders' && req.method === 'GET') {
        await ensure(env)
        const { results } = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500').all()
        return json(results.map((r) => ({ ...r, status: r.status === 'shipped' ? 'dispatched' : r.status, items: JSON.parse(r.items || '[]') })))
      }
      if (url.pathname === '/api/order-status' && req.method === 'POST') {
        const { id, status, tracking } = await req.json()
        if (!STATUSES.includes(status)) return json({ error: 'Bad status' }, 400)
        await ensure(env)
        await env.DB.prepare('UPDATE orders SET status = ?, tracking = COALESCE(?, tracking) WHERE id = ?').bind(status, typeof tracking === 'string' ? str(tracking, 60) : null, str(id, 40)).run()
        return json({ ok: true })
      }
      if (url.pathname === '/api/describe' && req.method === 'POST') {
        const { image, hint } = await req.json()
        if (typeof image !== 'string' || !image.startsWith('data:image/')) return json({ error: 'Bad image' }, 400)
        return json(await describe(env, image, typeof hint === 'string' ? hint.slice(0, 80) : ''))
      }
      if (url.pathname === '/api/commit' && req.method === 'POST') {
        const { products, images } = await req.json()
        return json({ ok: true, sha: await commit(env, products, images) })
      }
      return json({ error: 'Not found' }, 404)
    } catch (e) {
      return json({ error: String(e && e.message ? e.message : e) }, 500)
    }
  },
}
