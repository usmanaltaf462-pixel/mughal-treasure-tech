import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { BarChart3, ExternalLink, Info, LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'
import { Logo } from '@/components/Logo'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — Mughal Treasure Tech' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: AdminLayout,
})

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
] as const

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#faf7f4] pb-20 lg:pb-0 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-ink/5 bg-white p-5 lg:flex">
        <Link to="/admin"><Logo /></Link>
        <p className="mt-1 pl-12 text-[11px] font-bold uppercase tracking-wider text-brand-600">Admin</p>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: 'exact' in n }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/60 hover:bg-brand-50 hover:text-brand-700"
              activeProps={{ className: '!bg-brand-500 !text-white shadow-md shadow-brand-500/30' }}
            >
              <n.icon className="h-4.5 w-4.5" /> {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/50 hover:bg-ink/5">
          <ExternalLink className="h-4 w-4" /> View store
        </Link>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/5 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/admin"><Logo /></Link>
        <Link to="/" className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
          <ExternalLink className="h-3.5 w-3.5" /> Store
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <b>Preview mode.</b> These screens show sample data so you can review the layout. Secure admin sign-in and live store data are the next items on the roadmap.
          </p>
        </div>
        <Outlet />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-ink/5 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: 'exact' in n }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-ink/50"
            activeProps={{ className: '!text-brand-600' }}
          >
            <n.icon className="h-5 w-5" /> {n.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
