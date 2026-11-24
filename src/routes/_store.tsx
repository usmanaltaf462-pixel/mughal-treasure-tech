import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Header } from '@/components/Header'

export const Route = createFileRoute('/_store')({
  component: StoreLayout,
})

function StoreLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const first = useRef(true)
  useEffect(() => {
    // Count one page view per page (not for the owner's own phone, see admin login).
    try { if (localStorage.getItem('mt-owner')) return } catch { /* ignore */ }
    const ref = first.current ? document.referrer : ''
    first.current = false
    fetch('/api/hit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ path: pathname, ref }), keepalive: true }).catch(() => {})
  }, [pathname])
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
