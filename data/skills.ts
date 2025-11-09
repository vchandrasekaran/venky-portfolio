export type Tool = { name: string; logo: string }

export type SkillBlock = {
  id: string
  title: string
  tag: string
  desc: string
  tools: Tool[]
}

export const SKILL_CATEGORIES: SkillBlock[] = [
  {
    id: 'data-eng',
    title: 'Data Engineering Core',
    tag: 'Pipelines',
    desc: 'Warehouse-first pipelines with governed lineage and cost-aware refresh design.',
    tools: [
      { name: 'Snowflake', logo: '/logos/snowflake-logo.png' },
      { name: 'Redshift', logo: '/logos/redshift-logo.png' },
      { name: 'dbt', logo: '/logos/dbt-logo.jpg' },
      { name: 'Matillion', logo: '/logos/matillion-logo.webp' },
      { name: 'AWS', logo: '/logos/aws-logo.png' },
      { name: 'Python', logo: '/logos/python-logo.webp' }
    ]
  },
  {
    id: 'bi',
    title: 'Business Intelligence',
    tag: 'Dashboards',
    desc: 'Executive-ready vizzes with certified datasets, metric layers, and usage telemetry.',
    tools: [
      { name: 'Domo', logo: '/logos/domo-logo.webp' },
      { name: 'Power BI', logo: '/logos/powerbi-logo.png' },
      { name: 'Tableau', logo: '/logos/tableau-logo.png' },
      { name: 'Salesforce', logo: '/logos/salesforce-logo.webp' }
    ]
  },
  {
    id: 'apps',
    title: 'Applications & Tooling',
    tag: 'Apps',
    desc: 'TypeScript apps, APIs and automation that productize analytics and AI copilots.',
    tools: [
      { name: 'TypeScript', logo: '/logos/typescript-logo.svg' },
      { name: 'JavaScript', logo: '/logos/javascript-logo.webp' },
      { name: 'NumPy', logo: '/logos/numpy-logo.webp' },
      { name: 'GitHub', logo: '/logos/github.svg' },
      { name: 'GitLab', logo: '/logos/gitlab-logo.webp' }
    ]
  }
]
