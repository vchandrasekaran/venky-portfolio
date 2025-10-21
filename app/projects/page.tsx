import Section from '@/components/Section'\nimport HUDTile from '@/components/hud/HUDTile'

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
      <Section
        title="Projects"
        subtitle="Modules from the Ares grid — open a project to view details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map(p => (
            <HUDTile key={p.id} title={p.title} desc={p.desc} href={p.href} />
          ))}
        </div>
      </Section>
    </main>
  )
}

