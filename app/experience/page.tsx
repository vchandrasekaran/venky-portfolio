import Section from '@/components/Section'
import Timeline from '@/components/Timeline'

const detailedExperiences = [
  {
    title: 'Business Intelligence Analyst III · Truckstop.com · Chicago, IL · Mar 2024 – Nov 2025',
    bullets: [
      'Automated RevOps & Finance reporting by replacing Salesforce/Excel processes with dbt + Snowflake pipelines feeding Domo dashboards; eliminated 30+ ad-hoc spreadsheets and saved Finance/Operations 20+ hours monthly.',
      'Standardized KPIs across Product, Marketing, HR, and Customer Success to create trusted North Star metrics used in board and leadership meetings.',
      'Consolidated 200+ dashboards into 14 Domo apps, boosting dataset reuse by 50%+, cutting row volume from 25B to 10B, and reducing storage/compute costs by more than 50%.',
      'Served as sole Domo administrator, implementing dataset certification, usage tracking, and GitLab CI/CD pipelines that halved spend and improved refresh performance.',
      'Optimized Snowflake query costs by 22% through warehouse right-sizing and query profiling.'
    ]
  },
  {
    title: 'Business Intelligence Analyst II · Truckstop.com · Chicago, IL · Jan 2023 – Mar 2024',
    bullets: [
      'Built dbt + Snowflake proof-of-concept for payments pipelines, modernizing legacy Power BI logic and increasing daily metric trust with executives.',
      'Automated SLA monitoring for Integrations, Partner Support, and IT by piping Jira + SQL into Domo, enabling real-time SLA dashboards and faster resolution visibility.',
      'Built and maintained a Power BI services downtime dashboard with external APIs to improve incident response speed and reduce recurring outages.',
      'Enabled Marketing Analysts to self-serve campaign performance tracking in Domo & Power BI, reducing request turnaround time by ~40% and improving campaign ROI.'
    ]
  },
  {
    title: 'Business Intelligence Analyst I · Truckstop.com · Chicago, IL · Jan 2021 – Jan 2023',
    bullets: [
      'Designed and launched a Freight Spot Market dashboard in Domo to visualize weekly/monthly load & capacity trends, increasing client engagement and sales opportunities.',
      'Consolidated Salesforce, CSAT, and Pendo signals into churn dashboards that flagged at-risk accounts and lowered churn rates by 20% within target cohorts.',
      'Built Marketing Attribution & NPS dashboards in Domo, integrating Salesforce campaigns and feedback signals for better ROI visibility.'
    ]
  },
  {
    title: 'Software Development Engineer in Test II & III · Truckstop.com · Chicago, IL · May 2019 – Jan 2021',
    bullets: [
      'Built a REST API automation framework from scratch, reducing manual regression testing by 75% and accelerating CI/CD pipelines.',
      'Introduced Cypress-based UI testing for Angular apps, improving front-end test coverage and release stability.',
      'Mentored junior QA engineers to align test strategy with agile delivery and DevOps goals.'
    ]
  },
  {
    title: 'Risk Analyst · Amazon.com · Bangalore, India · Jul 2015 – Jul 2016',
    bullets: [
      'Conducted fraud detection analysis on high-volume financial transactions using ML models, preventing $50K+ in monthly losses.',
      'Detected fraud patterns from real-time signals, strengthening Amazon’s global detection infrastructure.',
      'Ranked in the top 1% of risk analysts globally for decision accuracy (99.36%).'
    ]
  },
  {
    title: 'Graduate Research Assistant · Illinois Institute of Technology · Chicago, IL · Dec 2017 – Jan 2018',
    bullets: [
      'Improved Hadoop cluster performance 40% via configuration optimization and resource tuning.',
      'Built Grafana/Tableau dashboards to monitor cluster usage and performance, improving lab operations.'
    ]
  }
]

export default function ExperiencePage(){
  const items = [
    {
      role: 'Business Intelligence Analyst III',
      org: 'Truckstop.com',
      time: 'Mar 2024 – Nov 2025 · Chicago, IL',
      bullets: [
        'Replaced Salesforce/Excel reporting with dbt + Snowflake pipelines into Domo, cutting 20+ manual hours each month.',
        'Standardized KPIs across GTM, HR, and Product for investor-ready dashboards.',
        'Consolidated 200+ dashboards into 14 governed apps and optimized Snowflake cost by 22%.'
      ]
    },
    {
      role: 'Business Intelligence Analyst II',
      org: 'Truckstop.com',
      time: 'Jan 2023 – Mar 2024 · Chicago, IL',
      bullets: [
        'Modernized payments analytics with dbt + Snowflake POCs.',
        'Automated SLA monitoring + downtime telemetry in Domo.',
        'Built Power BI status dashboards and marketing self-serve scorecards.'
      ]
    },
    {
      role: 'Business Intelligence Analyst I',
      org: 'Truckstop.com',
      time: 'Jan 2021 – Jan 2023 · Chicago, IL',
      bullets: [
        'Launched freight spot market dashboards to guide GTM plays.',
        'Integrated churn, CSAT, and product signals for retention.',
        'Built attribution and NPS analytics for exec reviews.'
      ]
    },
    {
      role: 'Software Development Engineer in Test II/III',
      org: 'Truckstop.com',
      time: 'May 2019 – Jan 2021 · Chicago, IL',
      bullets: [
        'Built REST API automation and Cypress UI suites for CI/CD.',
        'Cut manual regression 75% and mentored QA teams on DevOps practices.'
      ]
    },
    {
      role: 'Risk Analyst',
      org: 'Amazon.com',
      time: 'Jul 2015 – Jul 2016 · Bangalore, India',
      bullets: [
        'Applied ML fraud detection to prevent $50K+ losses monthly.',
        'Top 1% global accuracy (99.36%) in risk decisions.'
      ]
    },
    {
      role: 'Graduate Research Assistant',
      org: 'Illinois Institute of Technology',
      time: 'Dec 2017 – Jan 2018 · Chicago, IL',
      bullets: [
        'Improved Hadoop cluster performance 40% and built Grafana/Tableau ops dashboards.'
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
              <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
              <ul className="mt-4 ml-4 list-disc space-y-2 text-white/70">
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
