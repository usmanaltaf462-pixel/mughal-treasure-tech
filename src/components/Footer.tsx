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

export function Perks() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 lg:grid-cols-4">
      {perks.map((p) => (
        <div key={p.title} className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-white p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <p.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight">{p.title}</p>
            <p className="text-xs text-ink/50">{p.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/70">
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
          <p className="urdu text-sm">پاکستانی دستکاری کے خزانے</p>
        </div>
      </div>
    </footer>
  )
}
