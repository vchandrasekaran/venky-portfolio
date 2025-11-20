import Hero from '@/components/Hero'
import SkillsCoreCompact from '@/components/home/SkillsCoreCompact'
import SmoothReveal from '@/components/home/SmoothReveal'
import ProjectsShowcase from '@/components/projects/ProjectsShowcase'
import AdkChat from '@/components/AdkChat'
import { FEATURED_HOME_PROJECTS } from '@/data/projects'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SmoothReveal className="block" delay={0.05}>
        <section className="container-max py-16 text-center text-[#111111]">
          <p className="text-xs font-semibold uppercase tracking-[0.8em] text-[#3f3f3f]">Venkatesh Naidu</p>
          <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg">
            Building immersive data copilots so executives can interrogate Snowflake and telemetry pipelines with a single question.
            Every dashboard, AI agent, and automation is grounded in governed data and exec-ready context.
          </p>
        </section>
      </SmoothReveal>

      <SmoothReveal className="block" delay={0.08}>
        <AdkChat />
      </SmoothReveal>

      <SmoothReveal as="section" className="container-max pb-16 pt-10" delay={0.1}>
        <header className="mb-6 text-center md:mb-10">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[#3f3f3f]">Active Projects</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#111111] md:text-3xl">
            Modules you can explore right now
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#111111] md:text-base">
            Rotate through the console for highlights, then drill into a card for Tableau links, live demos, or case
            studies.
          </p>
        </header>
        <ProjectsShowcase projects={FEATURED_HOME_PROJECTS} />
      </SmoothReveal>

      <SmoothReveal delay={0.15}>
        <SkillsCoreCompact />
      </SmoothReveal>
    </main>
  )
}
