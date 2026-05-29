import Section from '@/components/Section'

export const metadata = {
  title: 'Experience',
  description: 'Career timeline, education, and sports milestones for Venkatesh Naidu.'
}

type Item = {
  role: string
  org: string
  timeLabel: string
}

const workItems: Item[] = [
  { role: 'Business Intelligence Analyst III', org: 'Truckstop.com', timeLabel: 'Mar 2024 - Nov 2025 | Chicago, IL' },
  { role: 'Business Intelligence Analyst II', org: 'Truckstop.com', timeLabel: 'Jan 2023 - Mar 2024 | Chicago, IL' },
  { role: 'Business Intelligence Analyst I', org: 'Truckstop.com', timeLabel: 'Jan 2021 - Jan 2023 | Chicago, IL' },
  { role: 'Software Development Engineer in Test II/III', org: 'Truckstop.com', timeLabel: 'May 2019 - Jan 2021 | Chicago, IL' },
  { role: 'Risk Analyst', org: 'Amazon.com', timeLabel: 'Jul 2015 - Jul 2016 | Bangalore, India' },
  { role: 'Graduate Research Assistant', org: 'Illinois Institute of Technology', timeLabel: 'Dec 2017 - Jan 2018 | Chicago, IL' }
]

const educationItems: Item[] = [
  { role: 'M.S., Information Technology & Management', org: 'Illinois Institute of Technology', timeLabel: 'Jan 2017 - Jan 2019' },
  { role: 'B.E., Engineering', org: 'New Horizon College of Engineering', timeLabel: 'Apr 2011 - Apr 2015' }
]

const sportsItems: Item[] = [
  { role: 'DUPR Coach & Media', org: 'Coaching, travel, broadcast features', timeLabel: '2024 - Ongoing' },
  { role: 'PPA Milwaukee Open', org: "Gold (Men's Doubles), Silver (Men's Singles)", timeLabel: '2024 | Milwaukee, WI' },
  { role: 'Minor League Nationals', org: 'Invite + Lake Geneva golds', timeLabel: '2024 | Lake Geneva, WI' },
  { role: 'Brand Partner', org: 'Mars Cricket', timeLabel: '2019 - Present' }
]

const strengths = ['Snowflake + dbt pipelines', 'Domo, Tableau, Power BI', 'Revenue and GTM reporting', 'Automation and AI workflow prototyping']

export default function ExperiencePage() {
  return (
    <main className="pb-16">
      <Section title="Experience" eyebrow="Career timeline" subtitle="A cleaner view of the work history, education path, and sports/media milestones behind the portfolio.">
        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="section-shell p-8 md:p-10">
            <p className="eyebrow">Career path</p>
            <div className="mt-6 space-y-4">
              {workItems.map((item) => (
                <article key={`${item.role}-${item.timeLabel}`} className="card p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.timeLabel}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.role}</h3>
                  <p className="mt-1 text-slate-600">{item.org}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow">Strengths</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {strengths.map((strength) => (
                  <li key={strength} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <p className="eyebrow">Education</p>
              <div className="mt-4 space-y-4">
                {educationItems.map((item) => (
                  <article key={`${item.role}-${item.timeLabel}`} className="rounded-lg border border-slate-200 bg-white/70 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.timeLabel}</p>
                    <h3 className="mt-2 font-semibold text-slate-950">{item.role}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.org}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <p className="eyebrow">Sport + media</p>
              <div className="mt-4 space-y-4">
                {sportsItems.map((item) => (
                  <article key={`${item.role}-${item.timeLabel}`} className="rounded-lg border border-slate-200 bg-white/70 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.timeLabel}</p>
                    <h3 className="mt-2 font-semibold text-slate-950">{item.role}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.org}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  )
}
