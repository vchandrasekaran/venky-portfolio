import Section from '@/components/Section'
import Timeline from '@/components/Timeline'

const detailedExperiences = [
  {
    title: 'Business Intelligence Analyst III | Truckstop.com | Chicago, IL | Mar 2024 - Present',
    bullets: [
      'Automated RevOps & Finance reporting by replacing Salesforce/Excel processes with dbt + Snowflake pipelines feeding Domo dashboards. Eliminated ad-hoc spreadsheets and saved Finance/Operations 2+ weeks of manual reporting time monthly.',
      'Standardized KPIs across Product, Marketing, HR and Customer Success creating a trusted single source of truth and North Star metrics adopted company-wide and used in board and leadership meetings with investors.',
      'Consolidated 200+ dashboards into 14 Domo apps, boosting dataset reuse by 50%+, cutting row volume from 25B -> <10B, and reducing storage/compute costs by over 50%. Delivered company-wide adoption through training.',
      'Served as sole Domo administrator, implementing dataset certification, usage tracking, and CI/CD pipelines with GitLab Actions. Reduced spend by 30-50% and improved dashboard performance through optimized refresh schedules and architecture governance.'
    ]
  },
  {
    title: 'Business Intelligence Analyst II | Truckstop.com | Chicago, IL | Jan 2023 - Mar 2024',
    bullets: [
      'Built dbt + Snowflake proof-of-concept for the Factoring project, transforming legacy Power BI logic into modeled pipelines. Improved refresh speeds, efficiency, and stakeholder trust in daily factoring metrics.',
      'Automated SLA monitoring for Integrations, Partner Support, and IT by connecting Jira + SQL directly into Domo. Delivered real-time SLA dashboards, cutting manual reporting effort and speeding resolution visibility.',
      'Built & maintained a Power BI downtime dashboard with external API integrations, providing daily live status + trend analysis. Increased incident response speed and reduced recurring downtime for development teams.',
      'Enabled Marketing Analysts to self-serve campaign performance tracking in Domo & Power BI, reducing turnaround time for requests by ~40% and improving targeting decisions that boosted campaign ROI.'
    ]
  },
  {
    title: 'Business Intelligence Analyst I | Truckstop.com - Chicago, IL | Jan 2021 - Jan 2023',
    bullets: [
      'Designed & deployed a Freight Spot Market dashboard in Domo, visualizing weekly/monthly load & capacity trends. Increased client engagement and supported Sales teams in identifying new revenue opportunities.',
      'Consolidated Salesforce, CSAT, and Pendo signals into Churn Council dashboards that flagged at-risk accounts. Enabled proactive retention strategies that lowered churn rates in target cohorts.',
      'Built Marketing Attribution & NPS dashboards in Domo, integrating Salesforce campaigns and feedback signals. Improved ROI visibility and helped leadership optimize spend allocation.'
    ]
  },
  {
    title: 'Software Development Engineer in Test II & III | Truckstop.com | Chicago, IL | May 2019 - Jan 2021',
    bullets: [
      'Built a REST API automation framework from scratch, reducing manual regression testing by 75% and accelerating CI/CD pipelines.',
      'Introduced Cypress-based UI testing for Angular apps, improving front-end test coverage and release stability.',
      'Mentored junior QA engineers, aligning test strategy with agile delivery and DevOps goals.'
    ]
  },
  {
    title: 'Risk Analyst | Amazon.com | Bangalore, India | Jul 2015 - Jul 2016',
    bullets: [
      'Conducted fraud detection analysis on high-volume financial transactions using ML models, preventing $50K+ in monthly losses.',
      'Detected fraud patterns from real-time signals, improving Amazon\'s global detection infrastructure.',
      'Ranked in the top 1% globally for decision accuracy (99.36%).'
    ]
  },
  {
    title: 'Graduate Research Assistant ITM Department | Illinois Institute of Technology | Chicago, IL | Dec 2017 - Jan 2018',
    bullets: [
      'Revitalized Hadoop cluster performance by 40% via configuration optimization and resource tuning.',
      'Built Grafana and Tableau dashboards to monitor usage and performance, improving lab operations.'
    ]
  }
]

export default function ExperiencePage(){
  const items = [
    {
      role: 'Business Intelligence Analyst III',
      org: 'Truckstop.com',
      time: 'Mar 2024 - Present | Chicago, IL',
      bullets: [
        'Automated RevOps & Finance reporting with Snowflake, dbt, and Domo.',
        'Standardized KPIs and board-ready metrics across GTM functions.',
        'Consolidated 200+ dashboards into 14 governed Domo apps.'
      ]
    },
    {
      role: 'Business Intelligence Analyst II',
      org: 'Truckstop.com',
      time: 'Jan 2023 - Mar 2024 | Chicago, IL',
      bullets: [
        'Modernized factoring analytics with dbt + Snowflake.',
        'Automated SLA monitoring and downtime intelligence in Domo.',
        'Enabled marketing self-serve reporting with AI-ready data models.'
      ]
    },
    {
      role: 'Business Intelligence Analyst I',
      org: 'Truckstop.com',
      time: 'Jan 2021 - Jan 2023 | Chicago, IL',
      bullets: [
        'Launched freight market intelligence dashboards in Domo.',
        'Integrated churn, CSAT, and product signals for retention.',
        'Shipped attribution and NPS scorecards for executive reviews.'
      ]
    },
    {
      role: 'SDET II & III',
      org: 'Truckstop.com',
      time: 'May 2019 - Jan 2021 | Chicago, IL',
      bullets: [
        'Built REST API automation framework for CI/CD acceleration.',
        'Introduced Cypress UI testing for Angular portfolios.',
        'Mentored QA teams on agile and DevOps-aligned strategy.'
      ]
    },
    {
      role: 'Risk Analyst',
      org: 'Amazon.com',
      time: 'Jul 2015 - Jul 2016 | Bangalore, India',
      bullets: [
        'Prevented $50K+ in monthly losses with ML-driven fraud detection.',
        'Improved signal pipelines for Amazon\'s global fraud infrastructure.',
        'Top 1% decision accuracy at 99.36%.'
      ]
    },
    {
      role: 'Graduate Research Assistant',
      org: 'Illinois Institute of Technology',
      time: 'Dec 2017 - Jan 2018 | Chicago, IL',
      bullets: [
        'Optimized Hadoop cluster configuration for 40% performance gain.',
        'Implemented Grafana/Tableau observability for lab operations.'
      ]
    }
  ]

  return (
    <main>
      <Section title="Experience" subtitle="Problem -> Action -> Result. Impact you can measure.">
        <Timeline items={items} />
      </Section>
      <Section title="Detailed Experience" subtitle="Exactly how the work delivered measurable value.">
        <div className="grid gap-6">
          {detailedExperiences.map((exp, idx) => (
            <article key={idx} className="card p-6">
              <h3 className="text-lg font-semibold text-slate-100">{exp.title}</h3>
              <ul className="mt-4 ml-4 list-disc space-y-2 text-slate-300">
                {exp.bullets.map((point, i) => (
                  <li key={i} className="pl-2">{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </main>
  )
}
