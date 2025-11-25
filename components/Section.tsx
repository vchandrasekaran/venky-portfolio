import { ReactNode } from 'react'
import SmoothReveal from '@/components/home/SmoothReveal'

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function Section({ title, subtitle, children }: SectionProps) {
  return (
    <SmoothReveal as="section" className="container-max py-16 text-white">
      <header className="relative mb-10 max-w-3xl">
        <span
          className="pointer-events-none absolute -left-6 top-1 hidden h-12 w-px bg-gradient-to-b from-[#38bdf8] via-[#c084fc] to-transparent md:block"
          aria-hidden="true"
        />
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-3 text-lg text-white/70">{subtitle}</p> : null}
      </header>
      <div className="grid gap-6 lg:gap-8">{children}</div>
    </SmoothReveal>
  )
}
