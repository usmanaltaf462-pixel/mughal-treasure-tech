import { Link } from '@tanstack/react-router'
import { Plus, Star } from 'lucide-react'
import { discountPercent, dropActive, flashActive, getCategory } from '@/data/catalog'
import type { Product } from '@/data/catalog'
import { img } from '@/lib/format'
import { useCart } from '@/lib/cart'
import { Price } from './Price'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const off = discountPercent(product)
  const soldOut = product.stock <= 0
  const category = getCategory(product.categoryId)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-900/5">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-cream">
        <img
          src={img(product.images[0], 480, 480)}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${soldOut ? 'opacity-60 grayscale' : ''}`}
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {flashActive(product) && <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">⚡ FLASH</span>}
          {dropActive(product) && <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">📉 PRICE DROP</span>}
          {off > 0 && <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">-{off}%</span>}
          {product.isNew && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">NEW</span>}
        </div>
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-wide text-ink/45">
          <span className="truncate">{category?.name}</span>
          {product.reviews > 0 && (
            <span className="flex shrink-0 items-center gap-0.5 normal-case text-ink/60">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-brand-600 sm:text-[15px]">
          {product.name}
        </Link>
        {product.nameUr !== product.name && <p className="urdu text-xs text-ink/50">{product.nameUr}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <Price product={product} />
          <button
            type="button"
            disabled={soldOut}
            onClick={() => add(product.id)}
            aria-label={`Add ${product.name} to cart`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:shadow-none"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
