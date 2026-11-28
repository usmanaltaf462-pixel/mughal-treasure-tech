import { useEffect, useState } from 'react'

export function Countdown({ to, className = '', onEnd }: { to: string; className?: string; onEnd?: () => void }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const ms = Math.max(0, new Date(to).getTime() - now)
  useEffect(() => {
    if (ms === 0) onEnd?.()
  }, [ms === 0])
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const pad = (n: number) => String(n).padStart(2, '0')
  return <span className={className}>{d > 0 ? `${d}d ` : ''}{pad(Math.floor((s % 86400) / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}</span>
}
