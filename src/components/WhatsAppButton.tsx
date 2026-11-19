import { MessageCircle } from 'lucide-react'
import { waLink } from '@/lib/site'

export function WhatsAppButton() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
