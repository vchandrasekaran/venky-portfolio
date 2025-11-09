export type ProjectSummary = {
  id: string
  title: string
  desc: string
  href: string
  tag: string
  status: 'Live' | 'Prototype' | 'Concept' | 'In Flight'
  highlights: string[]
}

export const PROJECTS: ProjectSummary[] = [
  {
    id: 'tableau',
    title: 'Interactive Dashboards. Real Metrics',
    desc: 'Tableau portfolio with revenue intelligence, ops KPIs, and experiments.',
    href: 'https://public.tableau.com/app/profile/venkateshnaidu/vizzes',
    tag: 'LIVE',
    status: 'Live',
    highlights: [
      'Revenue + GTM cockpit adopted by CRO and RevOps',
      'Experiment tracker w/ uplift + guardrails',
      'Executive KPI suite with drillable decks'
    ]
  },
  {
    id: 'ai-talent-pulse',
    title: 'AI Talent Pulse',
    desc: 'Streaming labor signals to track AI job market shifts.',
    href: '/projects/ai-talent-pulse',
    tag: 'PROTOTYPE',
    status: 'Prototype',
    highlights: [
      'Snowflake + Streamlit embed with filters',
      'Skills heatmap for emerging AI roles',
      'Phase 2: dbt metric layer + voice copilot'
    ]
  },
  {
    id: 'sports-intel',
    title: 'Sports Intelligence Grid',
    desc: 'Sentiment, telemetry, and sponsor ROI models for growth.',
    href: '#',
    tag: 'CONCEPT',
    status: 'Concept',
    highlights: [
      'Wearables + DUPR telemetry for coaching cues',
      'Brand lift attribution for sponsors',
      'Fan sentiment insights for content planning'
    ]
  }
];

export const FEATURED_HOME_PROJECTS = PROJECTS.slice(0, 4);
