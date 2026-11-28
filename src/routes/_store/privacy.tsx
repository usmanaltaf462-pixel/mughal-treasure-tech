import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/PageShell'

export const Route = createFileRoute('/_store/privacy')({ component: Page })

function Page() {
  return (
    <PageShell title="Privacy Policy">
      <p>We collect only what is needed to deliver your order: name, phone number, address and city. We never sell your data, and we use it only to process and deliver orders and to contact you about them.</p>
      <p>To ask for your data to be deleted, message us on WhatsApp or email us from the Contact page.</p>
          <p>Jhoote orders se bachne ke liye order ke waqt aap ke internet ka ek mehfooz (hashed) nishan rakha jata hai, jis se aap ki pehchan ya location maloom nahi hoti. Hum aap se aap ki location nahi mangte.</p>
    </PageShell>
  )
}
