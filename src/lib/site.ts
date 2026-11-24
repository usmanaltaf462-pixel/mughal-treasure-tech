// Change these in ONE place — used by header, footer, WhatsApp button and Contact page.
export const SITE = {
  url: 'https://mughal-treasure-tech.usmanaltaf462.workers.dev', // change this if the web address changes
  name: 'Mughal Treasure Tech',
  whatsapp: '923078867068', // 92 + number without leading 0
  phoneDisplay: '0307 8867068',
  email: 'mughaltreasuretechofficial@gmail.com',
  city: 'Lahore, Pakistan',
  hours: 'Mon–Sat, 10am – 8pm',
}
export const waLink = (text = 'Assalam o Alaikum! I have a question about Mughal Treasure Tech.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

import type { PlacedOrder } from '@/lib/orders-local'
export function orderWaLink(o: PlacedOrder) {
  const c = o.customer
  const lines = o.items.map((i) => `• ${i.name} x${i.qty} — Rs ${(i.unitPrice * i.qty).toLocaleString('en-PK')}`)
  const msg = [
    `🛍️ *New Order ${o.id}*`, '', ...lines, '',
    `Subtotal: Rs ${o.subtotal.toLocaleString('en-PK')}`,
    `Delivery: Rs ${o.delivery.toLocaleString('en-PK')}`,
    `*Total (COD): Rs ${o.total.toLocaleString('en-PK')}*`, '',
    `Name: ${c.name}`, `Phone: ${c.phone}`,
    `Address: ${c.address}, ${c.city}, ${c.province}${c.postalCode ? ' ' + c.postalCode : ''}`,
    c.notes ? `Notes: ${c.notes}` : '',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n')
  return waLink(msg)
}
