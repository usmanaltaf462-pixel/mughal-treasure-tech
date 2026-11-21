import { Link, createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { Banknote, Check, RotateCcw, ShoppingBag, Star, Truck } from 'lucide-react'
import { useState } from 'react'
import { QtyStepper } from '@/components/CartDrawer'
import { Price } from '@/components/Price'
import { ProductCard } from '@/components/ProductCard'
import { getCategory, getProductBySlug, products } from '@/data/catalog'
import { useCart } from '@/lib/cart'
import { img } from '@/lib/format'

export const Route = createFileRoute('/_store/product/$slug')({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug)
    if (!product) throw notFound()
    return { product }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Mughal Treasure` },
          { name: 'description', content: loaderData.product.shortDescription },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block font-semibold text-brand-600">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
})

function ProductPage() {
  const { product } = Route.useLoaderData()
  const category = getCategory(product.categoryId)
  const { add } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const soldOut = product.stock <= 0
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <nav className="mb-5 text-xs text-ink/50">
        <Link to="/" className="hover:text-brand-600">Home</Link> /{' '}
        <Link to="/shop" search={{ category: category?.slug }} className="hover:text-brand-600">{category?.name}</Link> /{' '}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="overflow-hidden rounded-3xl bg-cream">
            <img
              src={img(product.images[active] || product.images[0], 1000, 1000)}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((src: string, i: number) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={'h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream ' + (i === active ? 'border-brand-500' : 'border-transparent')}
                >
                  <img src={img(src, 200, 200)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col pb-24 lg:pb-0">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{category?.name}</p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
          {product.nameUr !== product.name && <p className="urdu text-lg text-ink/60">{product.nameUr}</p>}
          {product.reviews > 0 && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-ink/20'}`} />
              ))}
            </span>
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-ink/50">({product.reviews} reviews)</span>
          </div>
          )}

          <div className="mt-5">
            <Price product={product} size="lg" />
            <p className="mt-1 text-xs text-ink/50">Inclusive of all taxes</p>
          </div>

          <p className="mt-5 leading-relaxed text-ink/75">{product.description}</p>

          <ul className="mt-5 grid grid-cols-2 gap-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-brand-500" /> {h}
              </li>
            ))}
          </ul>

          <p className={`mt-6 text-sm font-semibold ${soldOut ? 'text-red-600' : product.stock <= 10 ? 'text-amber-600' : 'text-green-700'}`}>
            {soldOut ? 'Out of stock' : product.stock <= 10 ? `Only ${product.stock} left in stock — order soon` : 'In stock, ready to ship'}
          </p>

          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-ink/5 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] lg:static lg:mt-4 lg:border-0 lg:p-0 lg:shadow-none">
            {!soldOut && <QtyStepper qty={qty} max={product.stock} onChange={(n) => setQty(Math.max(1, n))} />}
            <button
              type="button"
              disabled={soldOut}
              onClick={() => add(product.id, qty)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-brand-500 font-semibold text-brand-600 transition hover:bg-brand-50 disabled:border-ink/10 disabled:text-ink/30"
            >
              <ShoppingBag className="h-4 w-4" /> <span className="hidden sm:inline">Add to cart</span><span className="sm:hidden">Add</span>
            </button>
            <button
              type="button"
              disabled={soldOut}
              onClick={() => {
                add(product.id, qty)
                navigate({ to: '/checkout' })
              }}
              className="h-12 flex-1 rounded-full bg-brand-500 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:bg-ink/15 disabled:shadow-none"
            >
              Buy now
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl bg-cream p-4 text-sm sm:grid-cols-3">
            <span className="flex items-center gap-2"><Banknote className="h-5 w-5 text-brand-600" /> Cash on Delivery</span>
            <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-brand-600" /> 2–5 day delivery</span>
            <span className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-brand-600" /> 7-day returns</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
