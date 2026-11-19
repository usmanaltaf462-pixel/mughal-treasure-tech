import type { ReactNode } from 'react'

export function PageShell({ title, ur, children }: { title: string; ur?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      {ur && <p className="urdu mt-1 text-lg text-ink/50">{ur}</p>}
      <div className="mt-6 space-y-4 leading-relaxed text-ink/80 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{children}</div>
    </div>
  )
}
