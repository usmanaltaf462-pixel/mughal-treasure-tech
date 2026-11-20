export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-md shadow-brand-500/30">
        {/* Mughal arch mark */}
        <svg viewBox="0 0 32 32" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 28V15c0-5 4.5-8 10-11 5.5 3 10 6 10 11v13" />
          <path d="M11 28v-9c0-2.5 2.2-4.2 5-5.8 2.8 1.6 5 3.3 5 5.8v9" />
          <path d="M4 28h24" />
        </svg>
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
