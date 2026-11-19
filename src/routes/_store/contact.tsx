import { createFileRoute } from '@tanstack/react-router'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { SITE, waLink } from '@/lib/site'

export const Route = createFileRoute('/_store/contact')({ component: Contact })

function Contact() {
  const rows = [
    { icon: Phone, label: SITE.phoneDisplay, href: `tel:+${SITE.whatsapp}` },
    { icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: SITE.city },
    { icon: Clock, label: SITE.hours },
  ]
  return (
    <PageShell title="Contact Us" ur="رابطہ کریں">
      <p>Order, size ya delivery ke baare mein koi sawal ho? Hum se rabta karein — sab se tez jawab WhatsApp par milta hai.</p>
      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white">
        <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
      </a>
      <ul className="!list-none !pl-0 space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3">
            <r.icon className="h-5 w-5 text-brand-500" />
            {r.href ? <a href={r.href} className="hover:text-brand-600">{r.label}</a> : r.label}
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
