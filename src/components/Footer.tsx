import { Link } from '@tanstack/react-router'
import { Banknote, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { categories } from '@/data/catalog'
import { SITE, waLink } from '@/lib/site'
import { Logo } from './Logo'

const perks = [
  { icon: Banknote, title: 'Cash on Delivery', ur: 'ڈیلیوری پر ادائیگی', text: 'Pay when your parcel arrives' },
  { icon: Truck, title: 'Nationwide Delivery', ur: 'پورے پاکستان میں', text: '2–5 working days' },
  { icon: RotateCcw, title: '7-Day Easy Returns', ur: 'آسان واپسی', text: 'Hassle-free exchanges' },
  { icon: ShieldCheck, title: 'Quality Assured', ur: 'معیار کی ضمانت', text: 'Genuine, tested products' },
]

const PERK_COLORS: Array<[string, string]> = [
  ['#f97316', '#fbbf24'],
  ['#2563eb', '#22d3ee'],
  ['#059669', '#2dd4bf'],
  ['#c026d3', '#fb7185'],
]

export function Perks() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 lg:grid-cols-4">
      {perks.map((p, i) => (
        <div
          key={p.title}
          className="group relative overflow-hidden rounded-3xl p-4 text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5"
          style={{ background: `linear-gradient(135deg, ${PERK_COLORS[i % 4][0]}, ${PERK_COLORS[i % 4][1]})` }}
        >
          <p.icon className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rotate-12 text-white/15 transition duration-300 group-hover:rotate-0 sm:h-28 sm:w-28" />
          <span className="pointer-events-none absolute -left-7 -top-7 h-20 w-20 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute right-6 top-4 h-2 w-2 rounded-full bg-white/50" />
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/40 backdrop-blur">
            <p.icon className="h-6 w-6" />
          </span>
          <p className="relative mt-3 text-[15px] font-extrabold leading-tight sm:text-base">{p.title}</p>
          <p className="relative mt-1 text-xs leading-snug text-white/90 sm:text-sm">{p.text}</p>
        </div>
      ))}
    </section>
  )
}

export function Footer() {
  return (
    <footer
      className="mt-20 bg-[length:100%_auto] bg-bottom bg-no-repeat text-white/80 sm:bg-cover"
      style={{ backgroundColor: '#0c0a09', backgroundImage: "url('/img/footer-bg.webp')" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">
            Electronics and kids items you can trust — delivered to your doorstep all over Pakistan with Cash on Delivery.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Shop</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to="/shop" search={{ category: c.slug }} className="hover:text-brand-400">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/track" className="hover:text-brand-400">Track Order</Link></li>
            <li><Link to="/about" className="hover:text-brand-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-400">Contact Us</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-brand-400">Shipping &amp; Returns</Link></li>
            <li><Link to="/privacy" className="hover:text-brand-400">Privacy Policy</Link></li>
            <li><Link to="/cart" className="hover:text-brand-400">Shopping Cart</Link></li>
            <li><Link to="/checkout" className="hover:text-brand-400">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-brand-400" /> <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">{SITE.phoneDisplay} (WhatsApp)</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-brand-400" /> {SITE.email}</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-brand-400" /> {SITE.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Mughal Treasure Tech. All prices in PKR.</p>
          <p className="urdu text-sm">الیکٹرانکس اور بچوں کا سامان</p>
        </div>
      </div>
    </footer>
  )
}
