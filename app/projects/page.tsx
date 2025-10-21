import Section from '@/components/Section'
import ProjectsShowcase from '@/components/projects/ProjectsShowcase'

const projects = [
  {
    id: 'tableau',
    title: 'Interactive Dashboards. Real Metrics',
    desc: 'Tableau portfolio with revenue intelligence, ops KPIs, and experiments.',
    href: 'https://public.tableau.com/app/profile/venkateshnaidu/vizzes'
  },
  {
    id: 'ai-talent-pulse',
    title: 'AI Talent Pulse',
    desc: 'Streaming labor signals to track AI job market shifts.',
    href: '/projects/ai-talent-pulse'
  },
  {
    id: 'trucklexa',
    title: 'Trucklexa — Alexa Search',
    desc: 'Voice-driven search assistant for trucking data (prototype).',
    href: '#'
  },
  {
    id: 'revenue-neuronet',
    title: 'Revenue NeuroNet',
    desc: 'Attribution brain blending Salesforce, product usage, and CS notes.',
    href: '#'
  },
  {
    id: 'sports-intel',
    title: 'Sports Intelligence Grid',
    desc: 'Sentiment, telemetry, and sponsor ROI models for growth.',
    href: '#'
  }
]

export default function ProjectsPage() {
  return (
    <main>
      <Section title="Projects" subtitle="Pick a module below — details render in the Ares console above.">`r`n        <ProjectsShowcase />`r`n      </Section>
    </main>
  )
}




