import Hero from '@/components/Hero'
import AssistantOrbPlaceholder from '@/components/home/AssistantOrbPlaceholder'
import SkillsCoreCompact from '@/components/home/SkillsCoreCompact'
import ProjectsShowcase from '@/components/projects/ProjectsShowcase'
import { FEATURED_HOME_PROJECTS } from '@/data/projects'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AssistantOrbPlaceholder />

      <section className="container-max pb-16">
        <header className="mb-6 text-center md:mb-10">
          <p className="text-[10px] uppercase tracking-[0.45em] text-brand.subtle">Active Projects</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100 md:text-3xl">
            Modules you can explore right now
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400 md:text-base">
            Rotate through the console for highlights, then drill into a card for Tableau links, live demos, or case
            studies.
          </p>
        </header>
        <ProjectsShowcase projects={FEATURED_HOME_PROJECTS} />
      </section>

      <SkillsCoreCompact />
    </main>
  )
}
