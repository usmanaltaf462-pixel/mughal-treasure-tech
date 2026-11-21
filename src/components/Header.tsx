import { Link, useNavigate } from '@tanstack/react-router'
import { Menu, Phone, Search, ShoppingBag, Truck, X } from 'lucide-react'
import { useState } from 'react'
import { categories } from '@/data/catalog'
import { useCart } from '@/lib/cart'
import { SITE, waLink } from '@/lib/site'
import { Logo } from './Logo'

export function Header() {
  const { count, setOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setMenuOpen(false)
    navigate({ to: '/shop', search: { q: q.trim() || undefined } })
  }

  const searchBox = (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder="Search earbuds, chargers, toys…  |  تلاش کریں"
        className="h-11 w-full rounded-full border border-ink/10 bg-cream pl-10 pr-4 text-base sm:text-sm outline-none transition placeholder:text-ink/40 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </form>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="bg-brand-500 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Cash on Delivery all over Pakistan · Free delivery over Rs 5,000
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Phone className="h-3.5 w-3.5" /> <a href={waLink()} target="_blank" rel="noopener noreferrer">{SITE.phoneDisplay}</a>
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
        <button type="button" onClick={() => setMenuOpen(true)} className="-ml-1 grid h-10 w-10 place-items-center rounded-full hover:bg-brand-50 md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <div className="hidden max-w-xl flex-1 md:block">{searchBox}</div>
        <nav className="ml-auto flex items-center gap-1">
          <Link to="/shop" className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600 lg:block">
            Shop All
          </Link>
          <Link to="/about" className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600 lg:block">About</Link>
          <Link to="/contact" className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600 lg:block">Contact</Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
      <div className="px-4 pb-3 md:hidden">{searchBox}</div>
      <div className="border-y border-ink/5">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.slug }}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-ink/70 transition hover:bg-brand-50 hover:text-brand-700"
              activeProps={{ className: 'bg-brand-50 text-brand-700' }}
              activeOptions={{ includeSearch: true }}
            >
              {c.name}
            </Link>
          ))}
          <Link to="/shop" search={{ sale: true }} className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold text-brand-600 hover:bg-brand-50">
            Sale %
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-50" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-brand-50">Home</Link>
              <Link to="/shop" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-brand-50">Shop All</Link>
              <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wider text-ink/40">Categories</p>
              {categories.map((c) => (
                <Link key={c.id} to="/shop" search={{ category: c.slug }} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-brand-50">
                  <span className="font-medium">{c.name}</span>
                  <span className="urdu text-xs text-ink/50">{c.nameUr}</span>
                </Link>
              ))}
              <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wider text-ink/40">Help</p>
              <Link to="/track" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 font-medium hover:bg-brand-50">Track Order</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 font-medium hover:bg-brand-50">About Us</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 font-medium hover:bg-brand-50">Contact Us</Link>
              <Link to="/shipping-returns" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 font-medium hover:bg-brand-50">Shipping &amp; Returns</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="mt-4 rounded-xl bg-brand-500 px-3 py-3 text-center font-semibold text-white">
                View Cart ({count})
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
