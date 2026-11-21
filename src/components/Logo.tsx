export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`grid shrink-0 place-items-center ${light ? 'rounded-xl bg-white p-1' : ''}`}>
        <img src="/logo.webp" alt="Mughal Treasure Tech logo" width={44} height={44} className="h-11 w-11 object-contain" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg sm:text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
          Mughal <span className="text-brand-500">Treasure</span> Tech
        </span>
        <span className={`urdu block text-[11px] leading-[1.6] ${light ? 'text-white/70' : 'text-ink/50'}`}>مغل ٹریژر ٹیک</span>
      </span>
    </span>
  )
}
