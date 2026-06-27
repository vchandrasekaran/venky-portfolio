import { ReactNode } from 'react'
import SmoothReveal from '@/components/home/SmoothReveal'

type SectionProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  id?: string
  children: ReactNode
}

export default function Section({ title, subtitle, eyebrow = 'Portfolio', id, children }: SectionProps) {
  return (
    <SmoothReveal as="section" className="container-max scroll-mt-24 py-9" id={id}>
      <header className="mb-7 max-w-3xl">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">{subtitle}</p> : null}
      </header>
      <div className="grid gap-5 lg:gap-6">{children}</div>
    </SmoothReveal>
  )
}
