import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/PageShell'

export const Route = createFileRoute('/_store/shipping-returns')({ component: Page })

function Page() {
  return (
    <PageShell title="Shipping & Returns" ur="ڈیلیوری اور واپسی">
      <h2>Delivery</h2>
      <ul>
        <li>Nationwide delivery in 2–5 working days</li>
        <li>Free delivery on orders over Rs 5,000</li>
        <li>Cash on Delivery available everywhere in Pakistan</li>
      </ul>
      <h2>Returns &amp; exchanges</h2>
      <ul>
        <li>Report any issue within 7 days of receiving your parcel</li>
        <li>Items must be unused and in original packaging</li>
        <li>Wrong or damaged items are replaced at no extra cost</li>
      </ul>
    </PageShell>
  )
}
