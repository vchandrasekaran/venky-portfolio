import Hero from '@/components/Hero'
import Section from '@/components/Section'
import SkillsLoadout from '@/components/hud/SkillsLoadout'
import Loadout from '@/components/hud/Loadout'
import ProjectCard from '@/components/ProjectCard'
import ProjectsLoadout from '@/components/hud/ProjectsLoadout'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SkillsLoadout />
      <Loadout />

      <ProjectsLoadout />
    </main>
  )
}



