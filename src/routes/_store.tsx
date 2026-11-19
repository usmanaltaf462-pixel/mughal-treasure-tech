import { Outlet, createFileRoute } from '@tanstack/react-router'
import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Header } from '@/components/Header'

export const Route = createFileRoute('/_store')({
  component: StoreLayout,
})

function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  )
}
