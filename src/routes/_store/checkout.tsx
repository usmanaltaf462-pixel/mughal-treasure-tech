import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Banknote, Lock } from 'lucide-react'
import { useState } from 'react'
import { pakistanCities } from '@/data/catalog'
import { useCart } from '@/lib/cart'
import { formatPKR, img } from '@/lib/format'
import { orderWaLink } from '@/lib/site'
import { placeOrder } from '@/lib/orders-local'
import { OrderSummary } from '@/components/OrderSummary'

export const Route = createFileRoute('/_store/checkout')({
  head: () => ({ meta: [{ title: 'Checkout — Mughal Treasure Tech' }] }),
  component: Checkout,
})

const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir']

interface FormState {
  name: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  notes: string
}

const empty: FormState = { name: '', phone: '', email: '', address: '', city: '', province: '', postalCode: '', notes: '' }

/** Accepts 03XXXXXXXXX or +923XXXXXXXXX, ignoring spaces and dashes. */
const PK_MOBILE = /^(?:\+92|0092|0)3\d{9}$/

function validate(f: FormState) {
  const e: Partial<Record<keyof FormState, string>> = {}
  if (f.name.trim().length < 3) e.name = 'Please enter your full name'
  if (!PK_MOBILE.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid mobile number, e.g. 0300 1234567'
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email or leave it blank'
  if (f.address.trim().length < 10) e.address = 'Please enter your complete address (house, street, area)'
  if (!f.city) e.city = 'Select your city'
  if (!f.province) e.province = 'Select your province'
  return e
}

function Checkout() {
  const { items, subtotal, delivery, total, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    setSubmitting(true)
    const order = placeOrder({
      paymentMethod: 'COD',
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim(),
        city: form.city,
        province: form.province,
        postalCode: form.postalCode.trim() || undefined,
        notes: form.notes.trim() || undefined,
      },
      items: items.map((i) => ({ productId: i.productId, name: i.product.name, image: i.product.images[0], qty: i.qty, unitPrice: i.unitPrice })),
      subtotal,
      delivery,
      total,
    })
    fetch('/api/order', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(order), keepalive: true }).catch(() => {})
    window.open(orderWaLink(order), '_blank')
    clear()
    navigate({ to: '/order/$orderId', params: { orderId: order.id } })
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Add a few items before checking out.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Checkout</h1>
      <p className="urdu mb-6 text-brand-600">آرڈر کی تکمیل</p>

      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <fieldset className="rounded-3xl border border-ink/5 bg-white p-5 sm:p-6">
            <legend className="px-1 text-lg font-bold">1. Contact details <span className="urdu mr-1 text-sm font-normal text-ink/50">رابطہ</span></legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" ur="پورا نام" error={errors.name} className="sm:col-span-2">
                <input name="name" autoComplete="name" value={form.name} onChange={update('name')} className={input(errors.name)} placeholder="e.g. Ayesha Khan" />
              </Field>
              <Field label="Mobile number" ur="موبائل نمبر" error={errors.phone}>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} className={input(errors.phone)} placeholder="0300 1234567" />
              </Field>
              <Field label="Email (optional)" ur="ای میل" error={errors.email}>
                <input name="email" type="email" autoComplete="email" value={form.email} onChange={update('email')} className={input(errors.email)} placeholder="you@example.com" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-ink/5 bg-white p-5 sm:p-6">
            <legend className="px-1 text-lg font-bold">2. Delivery address <span className="urdu mr-1 text-sm font-normal text-ink/50">پتہ</span></legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <Field label="Complete address" ur="مکمل پتہ" error={errors.address} className="sm:col-span-2">
                <textarea name="address" autoComplete="street-address" rows={3} value={form.address} onChange={update('address')} className={input(errors.address)} placeholder="House #, Street, Block / Sector, Area, Landmark" />
              </Field>
              <Field label="City" ur="شہر" error={errors.city}>
                <select name="city" autoComplete="address-level2" value={form.city} onChange={update('city')} className={input(errors.city)}>
                  <option value="">Select city</option>
                  {pakistanCities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Province" ur="صوبہ" error={errors.province}>
                <select name="province" autoComplete="address-level1" value={form.province} onChange={update('province')} className={input(errors.province)}>
                  <option value="">Select province</option>
                  {provinces.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Postal code (optional)" ur="پوسٹل کوڈ">
                <input name="postalCode" inputMode="numeric" autoComplete="postal-code" value={form.postalCode} onChange={update('postalCode')} className={input()} placeholder="54000" />
              </Field>
              <Field label="Order notes (optional)" ur="ہدایات">
                <input name="notes" value={form.notes} onChange={update('notes')} className={input()} placeholder="e.g. call before delivery" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-ink/5 bg-white p-5 sm:p-6">
            <legend className="px-1 text-lg font-bold">3. Payment method <span className="urdu mr-1 text-sm font-normal text-ink/50">ادائیگی</span></legend>
            <label className="mt-2 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-brand-500 bg-brand-50 p-4">
              <input type="radio" name="payment" checked readOnly className="h-5 w-5 accent-brand-500" />
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white"><Banknote className="h-5 w-5" /></span>
              <span className="flex-1">
                <span className="block font-bold">Cash on Delivery (COD)</span>
                <span className="block text-sm text-ink/60">Pay {formatPKR(total)} in cash when your parcel arrives.</span>
              </span>
              <span className="urdu hidden text-sm text-brand-700 sm:block">ڈیلیوری پر ادائیگی</span>
            </label>
          </fieldset>
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <OrderSummary>
            <ul className="max-h-60 space-y-3 overflow-y-auto border-t border-ink/10 pt-3">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3 text-sm">
                  <span className="relative shrink-0">
                    <img src={img(i.product.images[0], 112, 112)} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">{i.qty}</span>
                  </span>
                  <span className="line-clamp-2 flex-1">{i.product.name}</span>
                  <span className="font-semibold">{formatPKR(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <button type="submit" disabled={submitting} className="mt-2 w-full rounded-full bg-brand-500 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-60">
              {submitting ? 'Placing order…' : `Place Order · ${formatPKR(total)}`}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50"><Lock className="h-3 w-3" /> No advance payment required</p>
          </OrderSummary>
        </div>
      </form>
    </div>
  )
}

function input(error?: string) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition focus:ring-4 sm:text-sm ${
    error ? 'border-red-400 focus:ring-red-100' : 'border-ink/10 focus:border-brand-400 focus:ring-brand-100'
  }`
}

function Field({ label, ur, error, className = '', children }: { label: string; ur: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold">
        {label} <span className="urdu text-xs font-normal text-ink/40">{ur}</span>
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
