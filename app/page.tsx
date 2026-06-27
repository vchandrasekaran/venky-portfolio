import Hero from '@/components/Hero'
import AutomationFeatures from '@/components/home/AutomationFeatures'
import SmoothReveal from '@/components/home/SmoothReveal'
import AdkChat from '@/components/AdkChat'

export default function HomePage() {
  const siteBlocks = [
    {
      title: 'Analytics engineering',
      body: 'Snowflake, DBT, ELT, certified datasets, cost controls, and metric layers that stay usable after launch.'
    },
    {
      title: 'Business intelligence',
      body: 'Executive dashboards, revenue reporting, operational scorecards, and BI governance across Domo, Tableau, and Power BI.'
    },
    {
      title: 'AI workflow prototypes',
      body: 'Natural-language analytics, ingredient-aware planning, voice flows, and assistant interfaces grounded in controlled data.'
    },
    {
      title: 'Sports-tech storytelling',
      body: 'Cricket analysis, pickleball sensing ideas, media work, and personal projects presented as product case studies.'
    }
  ]

  return (
    <main className="pb-8">
      <Hero />

      <SmoothReveal as="section" className="container-max py-6" delay={0.05}>
        <div className="grid gap-6 lg:grid-cols-[0.92fr,1.08fr] lg:items-start">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              A portfolio for data products, not just screenshots.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This site is organized around how the work gets shipped: the data platform, the business problem, the
              interface people use, and the measurable outcome.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {siteBlocks.map((block) => (
              <article key={block.title} className="card p-5">
                <h3 className="text-lg font-semibold text-slate-950">{block.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{block.body}</p>
              </article>
            ))}
          </div>
        </div>
      </SmoothReveal>

      <SmoothReveal id="workflow" className="block scroll-mt-24" delay={0.06}>
        <AutomationFeatures />
      </SmoothReveal>

      <SmoothReveal id="assistant" className="block scroll-mt-24" delay={0.08}>
        <AdkChat />
      </SmoothReveal>
    </main>
  )
}
