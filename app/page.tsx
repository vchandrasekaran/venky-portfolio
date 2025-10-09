import Hero from '@/components/Hero'
import Section from '@/components/Section'
import SkillsGrid from '@/components/SkillsGrid'
import Loadout from '@/components/hud/Loadout'
import ProjectCard from '@/components/ProjectCard'

export default function HomePage() {
  return (
    <main>
      <Hero />
      
      <SkillsGrid />
      <Loadout />

      

      <Section title="Projects" subtitle="Futuristic pilots and analytics systems ready for launch.">
        <div className="grid gap-6 md:grid-cols-3">
          <ProjectCard
            title="AI Talent Pulse"
            status="Prototype"
            desc="Streaming labor data, skill embeddings, and compensation signals to predict where AI disruption hits next."
            href="/projects"
          />
          <ProjectCard
            title="Revenue NeuroNet"
            status="In Flight"
            desc="Blends Salesforce, product usage, and CS notes into an attribution brain that prescribes next-best automations."
            href="/projects"
          />
          <ProjectCard
            title="Sports Intelligence Grid"
            status="Concept"
            desc="Hyperlocal sentiment, player telemetry, and sponsor ROI models to grow emerging sports ecosystems."
            href="/projects"
          />
        </div>
      </Section>
    </main>
  )
}



