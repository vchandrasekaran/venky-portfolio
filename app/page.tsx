import Hero from '@/components/Hero'
import AutomationFeatures from '@/components/home/AutomationFeatures'
import ToolsBoard from '@/components/home/ToolsBoard'
import SmoothReveal from '@/components/home/SmoothReveal'
import ProjectsShowcase from '@/components/projects/ProjectsShowcase'
import AdkChat from '@/components/AdkChat'
import { FEATURED_HOME_PROJECTS } from '@/data/projects'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SmoothReveal className="block" delay={0.05}>
        <section className="container-max py-16 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.8em] text-white/50">Venkatesh Naidu</p>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/80 md:text-lg">
            Building natural-language insight layers on top of your data that deliver clear, instant answers for leaders
            and stakeholders. Every dashboard, AI agent, and automation is grounded in governed data and exec-ready
            context.
          </p>
        </section>
      </SmoothReveal>

      <SmoothReveal className="block" delay={0.06}>
        <AutomationFeatures />
      </SmoothReveal>

      <SmoothReveal className="block" delay={0.08}>
        <AdkChat />
      </SmoothReveal>

      <SmoothReveal as="section" className="container-max pb-16 pt-10 text-white" delay={0.1}>
        <header className="mb-6 text-center md:mb-10">
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/60">Active Projects</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            Modules you can explore right now
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70 md:text-base">
            Rotate through the console for highlights, then drill into a card for Tableau links, live demos, or case
            studies.
          </p>
        </header>
        <ProjectsShowcase projects={FEATURED_HOME_PROJECTS} />
      </SmoothReveal>

      <SmoothReveal delay={0.18}>
        <ToolsBoard />
      </SmoothReveal>
    </main>
  )
}
