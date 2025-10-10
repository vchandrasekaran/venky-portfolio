import Link from 'next/link'
import Section from '@/components/Section'

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
        subtitle="Click a module to open its project. Each tile mirrors the HUD loadout style for quick scanning."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map(p => (
            <Link key={p.id} href={p.href} className="group">
              <div className="relative h-32 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/45">
                <div className="text-[10px] uppercase tracking-widest text-brand.subtle">Project</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-100">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{p.desc}</p>
                <span className="absolute right-4 top-4 text-cyan-300 opacity-0 transition group-hover:opacity-100">-></span>
                <span className="hud-sweep" />
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  )
}
