import { SITE } from '@/lib/site'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { CartProvider } from '@/lib/cart'

import '../styles.css'

const siteName = 'Mughal Treasure Tech — Electronics & Kids Items in Pakistan'
const siteDescription =
  'Shop earbuds, neckbands, chargers, smart watches and kids items. Cash on Delivery all over Pakistan.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#f47b20' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${SITE.url}/img/og-image.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'Mughal Treasure Tech' },
      { property: 'og:url', content: SITE.url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'apple-touch-icon', href: '/favicon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Noto+Nastaliq+Urdu:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
        <Scripts />
      </body>
    </html>
  )
}
