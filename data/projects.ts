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
    desc: 'Tableau dashboards: revenue/GTM cockpit, experiment hub with uplift guardrails, and exec KPI decks.',
    href: 'https://public.tableau.com/app/profile/venkateshnaidu/vizzes',
    tag: 'LIVE',
    status: 'Live',
    highlights: [
      'Tableau Public gallery: pipeline and bookings vs targets, win/loss breakdowns, cohort health',
      'Experiment and ops boards: uplift vs control, guardrail monitors, rollout readiness checks',
      'Executive KPI decks: drillable dashboards for GTM, ops, and finance with interactive filters'
    ]
  },
  {
    id: 'trucklexa',
    title: 'Trucklexa Alexa Skill',
    desc: 'Voice-enabled load booking assistant built with Node.js, Python, and AWS Lambda.',
    href: '/projects/trucklexa',
    tag: 'POC COMPLETED',
    status: 'Prototype',
    highlights: [
      'Hands-free brokerage workflow that reduces booking steps dramatically',
      'Alexa + Lambda workflow pipes requests into Truckstop APIs securely',
      'Showcases conversational BI concepts Venky is applying to freight data'
    ]
  },
  {
    id: 'cricket-analyst-raiders',
    title: 'Cricket Performance Analytics Platform',
    desc: 'Python and Streamlit platform that scrapes and structures ball-by-ball data into a custom dataset for real-time insights and broadcast-ready metrics.',
    href: '/projects/cricket-analyst-raiders',
    tag: 'MATCH DAY APP',
    status: 'Prototype',
    highlights: [
      'Scraped and structured ball-by-ball data into a custom cricket dataset',
      'Generated real-time insights and broadcast-ready metrics for match strategy',
      'Supported match planning and a top-4 finish'
    ]
  },
  {
    id: 'ai-analyst',
    title: 'Patent Pending - Smart Paddle Sensing',
    desc: 'Telemetry platform for pickleball paddles (external or embedded) with analytics, multi-device fusion, and an AI agent for coaching and broadcast.',
    href: '/projects/ai-analyst',
    tag: 'PATENT PENDING',
    status: 'Concept',
    highlights: [
      'Inventor on "Smart Sensor System for Pickleball Paddles and Analytics Ecosystem," USPTO Application No. 63/934,339, filed 2025',
      'Sensing via stickers, edge or handle clips, or embedded meshes detects impact, spin cues, and sweet-spot accuracy',
      'Signal processing and AI derive location, force, twist, shot class, and contact quality for rallies and matches',
      'Ecosystem streams to phones, hubs, or cloud; fuses with cameras and wearables; LLM agent delivers voice and chat guidance'
    ]
  }
]

export const FEATURED_HOME_PROJECTS = PROJECTS.slice(0, PROJECTS.length)
