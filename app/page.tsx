import Hero from '@/components/Hero'
import Section from '@/components/Section'
import SkillsGrid from '@/components/SkillsGrid'
import Loadout from '@/components/hud/Loadout'
import ProjectCard from '@/components/ProjectCard'
import ProjectsLoadout from '@/components/hud/ProjectsLoadout'

export default function HomePage() {
  return (
    <main>
      <Hero />
      
      <SkillsGrid />
      <Loadout />

      
      <ProjectsLoadout />
    </main>
  )
}



