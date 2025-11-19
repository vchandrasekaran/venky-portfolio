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
    id: 'text-to-sql-cortex',
    title: 'Text → SQL (Snowflake + Cortex)',
    desc: 'Natural-language queries against Tasty Bytes with live Snowflake results.',
    href: '/projects/text-to-sql-cortex',
    tag: 'LIVE',
    status: 'Live',
    highlights: [
      'Cortex Analyst turns questions into vetted SQL for MENU data',
      'Snowflake stored procedure TEXT_TO_SQL_MENU executes safely',
      'UI streams generated/executed SQL plus result rows'
    ]
  }
];

export const FEATURED_HOME_PROJECTS = PROJECTS.slice(0, PROJECTS.length);
