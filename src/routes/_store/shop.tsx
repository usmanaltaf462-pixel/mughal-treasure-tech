import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { categories, effectivePrice, getCategoryBySlug, products } from '@/data/catalog'
import { formatPKR } from '@/lib/format'

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'discount'

interface ShopSearch {
  q?: string
  category?: string
  sale?: boolean
  inStock?: boolean
  max?: number
  sort?: Sort
}

const SORTS: Array<{ value: Sort; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
]

const PRICE_STEPS = [2000, 5000, 10000, 20000]

export const Route = createFileRoute('/_store/shop')({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s.q === 'string' && s.q ? s.q : undefined,
    category: typeof s.category === 'string' && s.category ? s.category : undefined,
    sale: s.sale === true || s.sale === 'true' ? true : undefined,
    inStock: s.inStock === true || s.inStock === 'true' ? true : undefined,
    max: Number(s.max) > 0 ? Number(s.max) : undefined,
    sort: SORTS.some((o) => o.value === s.sort) ? (s.sort as Sort) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Shop — Mughal Treasure' }] }),
  component: Shop,
})

function Shop() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const category = search.category ? getCategoryBySlug(search.category) : undefined
  const set = (patch: Partial<ShopSearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  const q = search.q?.toLowerCase().trim()
  let list = products.filter((p) => {
    if (category && p.categoryId !== category.id) return false
    if (search.sale && !p.salePrice) return false
    if (search.inStock && p.stock <= 0) return false
    if (search.max && effectivePrice(p) > search.max) return false
    if (q) {
      const hay = `${p.name} ${p.nameUr} ${p.shortDescription} ${p.description}`.toLowerCase()
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false
    }
    return true
  })
  const sort = search.sort ?? 'featured'
  list = [...list].sort((a, b) => {
    switch (sort) {
      case 'newest': return b.createdAt.localeCompare(a.createdAt)
      case 'price-asc': return effectivePrice(a) - effectivePrice(b)
      case 'price-desc': return effectivePrice(b) - effectivePrice(a)
      case 'discount': return (b.price - effectivePrice(b)) / b.price - (a.price - effectivePrice(a)) / a.price
      default: return Number(!!b.featured) - Number(!!a.featured)
    }
  })

  const activeCount = [search.category, search.sale, search.inStock, search.max].filter(Boolean).length

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink/50">Category</h3>
        <div className="flex flex-col gap-1">
          <button type="button" onClick={() => set({ category: undefined })} className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${!category ? 'bg-brand-50 text-brand-700' : 'hover:bg-ink/5'}`}>
            All categories
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" onClick={() => set({ category: c.slug })} className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium ${category?.id === c.id ? 'bg-brand-50 text-brand-700' : 'hover:bg-ink/5'}`}>
              <span>{c.name}</span>
              <span className="text-xs text-ink/40">{products.filter((p) => p.categoryId === c.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink/50">Max price</h3>
        <div className="flex flex-wrap gap-2">
          <Chip active={!search.max} onClick={() => set({ max: undefined })}>Any</Chip>
          {PRICE_STEPS.map((v) => (
            <Chip key={v} active={search.max === v} onClick={() => set({ max: v })}>
              Under {formatPKR(v)}
            </Chip>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50">Availability</h3>
        <Toggle label="On sale only" checked={!!search.sale} onChange={(v) => set({ sale: v || undefined })} />
        <Toggle label="In stock only" checked={!!search.inStock} onChange={(v) => set({ inStock: v || undefined })} />
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <nav className="mb-3 text-xs text-ink/50">
        <Link to="/" className="hover:text-brand-600">Home</Link> / <span className="text-ink">{category?.name ?? 'Shop'}</span>
      </nav>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {search.q ? <>Results for “{search.q}”</> : category?.name ?? (search.sale ? 'Sale' : 'All Products')}
          </h1>
          {category && <p className="urdu text-brand-600">{category.nameUr}</p>}
          <p className="mt-1 text-sm text-ink/50">{list.length} products</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" onClick={() => setFiltersOpen(true)} className="flex h-11 items-center gap-2 rounded-full border border-ink/10 px-4 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[11px] text-white">{activeCount}</span>}
          </button>
          <select
            value={sort}
            onChange={(e) => set({ sort: e.target.value === 'featured' ? undefined : (e.target.value as Sort) })}
            className="h-11 flex-1 rounded-full border border-ink/10 bg-white px-4 text-sm font-medium outline-none focus:border-brand-400 sm:flex-none"
            aria-label="Sort products"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {(search.q || activeCount > 0) && (
        <div className="mb-5 flex flex-wrap gap-2">
          {search.q && <ActiveTag onClear={() => set({ q: undefined })}>“{search.q}”</ActiveTag>}
          {category && <ActiveTag onClear={() => set({ category: undefined })}>{category.name}</ActiveTag>}
          {search.max && <ActiveTag onClear={() => set({ max: undefined })}>Under {formatPKR(search.max)}</ActiveTag>}
          {search.sale && <ActiveTag onClear={() => set({ sale: undefined })}>On sale</ActiveTag>}
          {search.inStock && <ActiveTag onClear={() => set({ inStock: undefined })}>In stock</ActiveTag>}
          <button type="button" onClick={() => navigate({ search: {} })} className="text-sm font-semibold text-brand-600 hover:underline">Clear all</button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          {list.length === 0 ? (
            <div className="rounded-3xl bg-cream p-12 text-center">
              <p className="text-lg font-semibold">No products match your filters</p>
              <p className="urdu text-ink/50">کوئی پروڈکٹ نہیں ملی</p>
              <button type="button" onClick={() => navigate({ search: {} })} className="mt-4 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white">Reset filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-50" aria-label="Close filters"><X className="h-5 w-5" /></button>
            </div>
            {filters}
            <button type="button" onClick={() => setFiltersOpen(false)} className="mt-6 w-full rounded-full bg-brand-500 py-3.5 font-semibold text-white">
              Show {list.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink/10 hover:border-brand-300'}`}>
      {children}
    </button>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-ink/15 transition peer-checked:bg-brand-500 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  )
}

function ActiveTag({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-medium text-brand-800">
      {children}
      <button type="button" onClick={onClear} className="grid h-6 w-6 place-items-center rounded-full hover:bg-brand-100" aria-label="Remove filter"><X className="h-3.5 w-3.5" /></button>
    </span>
  )
}
