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
    id: 'pantry-coach',
    title: 'Pantry Coach - Recipe Planner',
    desc: 'Case study for an ingredient-aware meal planner built around recipe search, pantry matching, and guided cooking flows.',
    href: '/projects/pantry-coach',
    tag: 'CASE STUDY',
    status: 'Prototype',
    highlights: [
      'Indexes 20k+ Epicurious recipes locally for fast ingredient-based planning',
      'Maps pantry input into recipe matches, cooking steps, and ingredient coverage',
      'Architecture is ready for private AI assistance without changing the public case-study experience'
    ]
  },
  {
    id: 'cricket-analyst-raiders',
    title: 'Team Analyst Raiders',
    desc: 'Streamlit cricket intelligence app for player stats, team comparison, grounds, current form, and matchup planning.',
    href: '/projects/cricket-analyst-raiders',
    tag: 'MATCH DAY APP',
    status: 'Prototype',
    highlights: [
      'Blends archived ball-by-ball history, player profiles, recent form tables, and live tournament workbooks',
      'Generates player plans, team comparisons, ground context, and print-oriented matchup reports for match day',
      'Built with Streamlit, pandas, Plotly, scraping pipelines, workbook generation, and a Power BI companion pack'
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
      'Sensing via stickers, edge or handle clips, or embedded meshes detects impact, spin cues, and sweet-spot accuracy',
      'Signal processing and AI derive location, force, twist, shot class, and contact quality for rallies and matches',
      'Ecosystem streams to phones, hubs, or cloud; fuses with cameras and wearables; LLM agent delivers voice and chat guidance'
    ]
  },
  {
    id: 'text-to-sql-cortex',
    title: 'Text to SQL (Snowflake + Cortex)',
    desc: 'Case study for a natural-language analytics workflow designed around Snowflake Cortex and governed SQL generation.',
    href: '/projects/text-to-sql-cortex',
    tag: 'CASE STUDY',
    status: 'Prototype',
    highlights: [
      'Cortex Analyst translates plain-English questions into vetted SQL for MENU data',
      'Execution layer is designed around controlled stored procedures and warehouse-safe access patterns',
      'Public site now presents the workflow as a case study instead of exposing the live query runner'
    ]
  }
]

export const FEATURED_HOME_PROJECTS = PROJECTS.slice(0, PROJECTS.length)
