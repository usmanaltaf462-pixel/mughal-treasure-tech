import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/PageShell'

export const Route = createFileRoute('/_store/about')({ component: About })

function About() {
  return (
    <PageShell title="About Us" ur="ہمارے بارے میں">
      <p>Mughal Treasure Tech brings useful electronics and fun kids items to your doorstep — from earbuds, neckbands and chargers to toys and school essentials.</p>
      <p>We choose every product carefully, test it before it ships, and keep prices fair. Our aim is simple: genuine products and a shopping experience you can trust.</p>
      <h2>Why shop with us</h2>
      <ul>
        <li>Cash on Delivery all over Pakistan</li>
        <li>7-day easy returns &amp; exchanges</li>
        <li>Quick help on WhatsApp</li>
      </ul>
    </PageShell>
  )
}
