import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Banknote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Perks } from '@/components/Footer'
import { categories, products } from '@/data/catalog'
import { img } from '@/lib/format'

export const Route = createFileRoute('/_store/')({
  component: Home,
})

const banners = [
  {
    image: '/img/hero-main.webp',
    eyebrow: 'New Festive Collection',
    title: 'Treasures of Pakistani craft',
    titleUr: 'پاکستانی ہنر کے خزانے',
    text: 'Embroidered suits, kundan jewellery and handmade décor — delivered with Cash on Delivery.',
    cta: { label: 'Shop the collection', search: {} },
  },
  {
    image: '/img/hero-eid.webp',
    eyebrow: 'Eid Sale · Up to 30% Off',
    title: 'Gifts that feel like home',
    titleUr: 'عید کے تحفے',
    text: 'Curated festive picks for the whole family, at prices made for celebration.',
    cta: { label: 'Shop the sale', search: { sale: true } },
  },
  {
    image: '/img/hero-home.webp',
    eyebrow: 'Home Décor',
    title: 'Rooms with Mughal soul',
    titleUr: 'گھر کی سجاوٹ',
    text: 'Hand-knotted rugs, blue pottery, ajrak and brass — styled for modern Pakistani homes.',
    cta: { label: 'Explore décor', search: { category: 'home-decor' } },
  },
]

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % banners.length), 6000)
    return () => clearInterval(t)
  }, [])
  const go = (d: number) => setI((n) => (n + d + banners.length) % banners.length)

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink">
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          {banners.map((b, idx) => (
            <div key={b.image} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={idx !== i}>
              <img
                src={img(b.image, 1600)}
                srcSet={`${img(b.image, 800)} 800w, ${img(b.image, 1600)} 1600w`}
                sizes="(max-width: 1280px) 100vw, 1280px"
                alt=""
                className="h-full w-full object-cover"
                fetchPriority={idx === 0 ? 'high' : 'auto'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/45 sm:to-transparent" />
              <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12 lg:p-16">
                <div className="max-w-lg text-white">
                  <span className="inline-block rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider">{b.eyebrow}</span>
                  <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">{b.title}</h1>
                  <p className="urdu mt-1 text-xl text-brand-200 sm:text-2xl">{b.titleUr}</p>
                  <p className="mt-3 text-sm text-white/80 sm:text-base">{b.text}</p>
                  <Link to="/shop" search={b.cta.search} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition hover:bg-brand-50">
                    {b.cta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
          <button type="button" onClick={() => go(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30" aria-label="Previous banner">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1.5">
            {banners.map((b, idx) => (
              <button key={b.image} type="button" onClick={() => setI(idx)} className={`h-2 rounded-full transition-all ${idx === i ? 'w-6 bg-brand-400' : 'w-2 bg-white/50'}`} aria-label={`Show banner ${idx + 1}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30" aria-label="Next banner">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function SectionTitle({ title, ur, to }: { title: string; ur: string; to?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="urdu text-sm text-brand-600">{ur}</p>
      </div>
      {to}
    </div>
  )
}

function Home() {
  const featured = products.filter((p) => p.featured)
  const newArrivals = [...products].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const deals = products.filter((p) => p.salePrice).slice(0, 4)

  return (
    <div className="space-y-14 pb-6 md:space-y-20">
      <Hero />
      <Perks />

      <section className="mx-auto max-w-7xl px-4">
        <SectionTitle title="Shop by Category" ur="زمرہ کے مطابق خریداری" to={<Link to="/shop" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>} />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} to="/shop" search={{ category: c.slug }} className="group text-center">
              <div className="aspect-square overflow-hidden rounded-2xl bg-brand-50 ring-1 ring-ink/5 transition group-hover:ring-2 group-hover:ring-brand-400">
                <img src={img(c.image, 320, 320)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <p className="mt-2 text-xs font-semibold sm:text-sm">{c.name}</p>
              <p className="urdu text-[11px] text-ink/50">{c.nameUr}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <SectionTitle title="Featured Treasures" ur="منتخب مصنوعات" to={<Link to="/shop" className="text-sm font-semibold text-brand-600 hover:underline">See more</Link>} />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="mughal-pattern relative overflow-hidden rounded-3xl bg-brand-500 p-6 text-white sm:p-10">
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-100">Limited-time deals</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Up to 30% off festive favourites</h2>
              <p className="urdu mt-1 text-lg text-brand-100">خصوصی رعایت</p>
              <Link to="/shop" search={{ sale: true }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50">
                Shop all deals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-ink sm:grid-cols-4">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <SectionTitle title="New Arrivals" ur="نئی آمد" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-brand-200 bg-cream p-8 text-center sm:flex-row sm:text-left">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white">
            <Banknote className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <h3 className="text-xl font-bold">Pay only when your order arrives</h3>
            <p className="text-sm text-ink/60">Cash on Delivery across Karachi, Lahore, Islamabad and 100+ cities. No card needed.</p>
          </div>
          <p className="urdu text-lg text-brand-700">ڈیلیوری پر نقد ادائیگی</p>
        </div>
      </section>
    </div>
  )
}
