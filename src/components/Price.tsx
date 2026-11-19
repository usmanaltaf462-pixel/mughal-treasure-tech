import { discountPercent, effectivePrice } from '@/data/catalog'
import type { Product } from '@/data/catalog'
import { formatPKR } from '@/lib/format'

export function Price({ product, size = 'md' }: { product: Pick<Product, 'price' | 'salePrice'>; size?: 'md' | 'lg' }) {
  const off = discountPercent(product)
  const big = size === 'lg'
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-bold text-ink ${big ? 'text-3xl' : 'text-lg'}`}>{formatPKR(effectivePrice(product))}</span>
      {off > 0 && (
        <>
          <span className={`text-ink/40 line-through ${big ? 'text-lg' : 'text-sm'}`}>{formatPKR(product.price)}</span>
          <span className={`rounded-md bg-green-50 font-semibold text-green-700 ${big ? 'px-2 py-0.5 text-sm' : 'px-1.5 text-xs'}`}>
            {off}% OFF
          </span>
        </>
      )}
    </div>
  )
}
