import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/PageShell'

export const Route = createFileRoute('/_store/about')({ component: About })

function About() {
  return (
    <PageShell title="About Us" ur="ہمارے بارے میں">
      <p>Mughal Treasure brings the best of Pakistani craftsmanship to your doorstep — from embroidered lawn and khussas to kundan jewellery, blue pottery and handmade décor.</p>
      <p>We work directly with artisans and trusted makers across Pakistan, hand-pick every item, and check quality before it ships. Our aim is simple: authentic products, fair prices, and a shopping experience you can trust.</p>
      <h2>Why shop with us</h2>
      <ul>
        <li>Cash on Delivery all over Pakistan</li>
        <li>7-day easy returns &amp; exchanges</li>
        <li>Quick help on WhatsApp</li>
      </ul>
    </PageShell>
  )
}
