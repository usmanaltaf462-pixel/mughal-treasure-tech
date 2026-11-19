import { createFileRoute } from '@tanstack/react-router'
import { Minus, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Card, PageTitle } from '@/components/admin/ui'
import { productCosts } from '@/data/admin-fixtures'
import { categories, getCategory, products as seed } from '@/data/catalog'
import { formatPKR, img } from '@/lib/format'

export const Route = createFileRoute('/admin/products')({
  component: Products,
})

function Products() {
  const [items, setItems] = useState(seed)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const needle = q.toLowerCase().trim()
  const list = items.filter((p) => (cat === 'all' || p.categoryId === cat) && (!needle || p.name.toLowerCase().includes(needle)))
  const adjust = (id: string, d: number) => setItems((all) => all.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + d) } : p)))

  return (
    <>
      <PageTitle
        title="Products & Inventory"
        ur="مصنوعات اور اسٹاک"
        action={
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/60 ring-1 ring-ink/10">
            {items.length} products · {categories.length} categories
          </span>
        }
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search products" className="h-11 w-full rounded-xl border border-ink/10 bg-white pl-10 pr-4 text-base outline-none focus:border-brand-400 sm:text-sm" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-11 rounded-xl border border-ink/10 bg-white px-3 text-sm font-medium" aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((p) => {
          const sell = p.salePrice ?? p.price
          const margin = sell - productCosts[p.id]
          return (
            <Card key={p.id} className="flex gap-3">
              <img src={img(p.images[0], 160, 160)} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-ink/50">{getCategory(p.categoryId)?.name} · SKU {p.id}</p>
                <p className="mt-1 text-sm">
                  <b>{formatPKR(sell)}</b>
                  {p.salePrice && <span className="ml-1.5 text-xs text-ink/40 line-through">{formatPKR(p.price)}</span>}
                  <span className="ml-2 text-xs text-green-700">+{formatPKR(margin)} margin</span>
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-600' : p.stock <= 10 ? 'text-amber-600' : 'text-green-700'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                  </span>
                  <div className="inline-flex items-center rounded-full ring-1 ring-ink/10">
                    <button type="button" onClick={() => adjust(p.id, -1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-50" aria-label="Decrease stock"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">{p.stock}</span>
                    <button type="button" onClick={() => adjust(p.id, 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-50" aria-label="Increase stock"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
