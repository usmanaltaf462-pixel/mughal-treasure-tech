/** Format a PKR amount, e.g. 6490 -> "Rs 6,490". */
export function formatPKR(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString('en-PK')}`
}

/** Route an image in /public through the Netlify Image CDN. */
export function img(src: string, w: number, h?: number) {
  void w
  void h
  return src
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
