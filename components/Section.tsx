import { ReactNode } from 'react'

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="container-max py-16">
      <header className="relative mb-10 max-w-3xl">
        <span className="pointer-events-none absolute -left-6 top-1 hidden h-12 w-px bg-gradient-to-b from-brand.accent via-brand.glow/60 to-transparent md:block" aria-hidden="true" />
        <h2 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-3 text-lg text-slate-300">{subtitle}</p> : null}
      </header>
      <div className="grid gap-6 lg:gap-8">
        {children}
      </div>
    </section>
  )
}
