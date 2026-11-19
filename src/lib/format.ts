/** Format a PKR amount, e.g. 6490 -> "Rs 6,490". */
export function formatPKR(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString('en-PK')}`
}

/** Route an image in /public through the Netlify Image CDN. */
export function img(src: string, w: number, h?: number) {
  const params = new URLSearchParams({ url: src, w: String(w), fm: 'webp', q: '78' })
  if (h) {
    params.set('h', String(h))
    params.set('fit', 'cover')
  }
  return `/.netlify/images?${params.toString()}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Karachi',
  })
}
