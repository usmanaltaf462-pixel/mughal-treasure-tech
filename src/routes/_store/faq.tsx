import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/PageShell'
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/data/catalog'
import { SITE } from '@/lib/site'

export const Route = createFileRoute('/_store/faq')({
  head: () => ({ meta: [{ title: 'How to Order & FAQ — Mughal Treasure Tech' }] }),
  component: Faq,
})

const steps = [
  'Pasand ka product chunein aur "Add to cart" ya "Buy now" dabayein.',
  'Cart mein ja kar "Checkout" dabayein.',
  'Apna naam, phone number, mukammal address aur shehar likhein.',
  '"Place Order" dabayein. WhatsApp khulega jis mein aap ke order ki tafseel pehle se likhi hogi, bas Send dabayein.',
  'Hum aap se call ya WhatsApp par order confirm karenge, phir parcel PostEx se bheja jayega.',
  'Parcel milne par rider ko payment dein (Cash on Delivery).',
]

const faqs = [
  ['Payment kaise karni hai?', 'Sirf Cash on Delivery hai. Parcel apne darwaze par milne par rider ko cash dein. Card ya advance payment ki zaroorat nahi.'],
  ['Delivery mein kitna waqt lagta hai?', 'Poore Pakistan mein 2 se 5 working days.'],
  ['Delivery charges kitne hain?', `Delivery charges Rs ${DELIVERY_FEE} hain. Rs ${FREE_DELIVERY_THRESHOLD.toLocaleString()} se zyada ke order par delivery free hai.`],
  ['Apna order kaise track karun?', 'Menu ya footer mein "Track Order" kholen, apna Order ID aur order mein likha hua phone number likhein. Wahan aap ko order ki halat (confirm, pack, dispatch) aur PostEx ka tracking number nazar aayega.'],
  ['Return ya exchange kaise hota hai?', 'Parcel milne ke 7 din ke andar hum se rabta karein. Product istemal nahi hua aur asli packing mein hona chahiye. Galat ya kharab product bina extra kharch ke badal diya jata hai.'],
  ['Order cancel karna ho to?', 'Jaldi se hum se WhatsApp par rabta karein. Parcel dispatch hone se pehle order cancel ho sakta hai.'],
  ['Kisi sawal ke liye kahan rabta karun?', `WhatsApp par ${SITE.phoneDisplay} par message karein, ya Contact Us page dekhein. Sab se tez jawab WhatsApp par milta hai.`],
]

function Faq() {
  return (
    <PageShell title="How to Order & FAQ" ur="آرڈر کیسے کریں">
      <h2>Order kaise karein</h2>
      <ol className="list-decimal space-y-2 pl-5">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h2>Aksar pooche jane wale sawal</h2>
      <div className="space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-black/10 bg-white p-4">
            <summary className="cursor-pointer list-none font-semibold text-ink">{q}</summary>
            <p className="mt-2">{a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  )
}
