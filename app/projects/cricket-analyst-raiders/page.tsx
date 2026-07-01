import Image from 'next/image'

const STACK = [
  'Streamlit',
  'Python',
  'pandas',
  'Plotly',
  'BeautifulSoup',
  'openpyxl',
  'requests',
  'Power BI'
]

const MODULES = [
  {
    title: 'Ball-by-ball dataset',
    body: 'Scraped and structured ball-by-ball data into a custom dataset that supports repeatable cricket analysis.'
  },
  {
    title: 'Real-time insights',
    body: 'Generated current-form views and matchup signals that helped translate raw cricket data into match strategy.'
  },
  {
    title: 'Broadcast-ready metrics',
    body: 'Packaged player and team metrics for cleaner storytelling, review sessions, and broadcast-style analysis.'
  },
  {
    title: 'Match strategy',
    body: 'Supported match planning and a top-4 finish by giving the team structured evidence before and during competition.'
  }
]

const PIPELINE = [
  {
    title: 'Scrape',
    body: 'Collectors pull ball-by-ball cricket data from tournament sources into a repeatable custom dataset.'
  },
  {
    title: 'Structure',
    body: 'Python and pandas normalize match, player, team, and innings-level views for analysis.'
  },
  {
    title: 'Analyze',
    body: 'Streamlit views generate real-time insights, matchup context, and performance metrics.'
  },
  {
    title: 'Deliver',
    body: 'Outputs become broadcast-ready metrics and strategy support for match planning.'
  }
]

const ARTIFACTS = [
  'raiders_streamlit_app.py: main Streamlit application and page routing',
  'raiders_current_matchup_page.py: current fixture and broadcast-focused matchup pack',
  'pvcc_analytics_master.xlsx: consolidated analytics workbook',
  'pvcc_analytics_master.balls.pkl: cached ball-by-ball base for faster reloads',
  'Ground Analysis Raiders.pdf: print-friendly venue breakdown',
  'Report_Houston_Open.pbix: Power BI companion report'
]

const IMPACT = [
  'Scraped and structured ball-by-ball data into a custom dataset.',
  'Generated real-time insights and broadcast-ready metrics that supported match strategy.',
  'Supported a top-4 finish by packaging analytics into a format the team could use.'
]

export default function CricketAnalystRaidersPage() {
  return (
    <div className="container-max space-y-6 pb-10 pt-5">
      <section className="grid items-start gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <div className="section-shell p-6 md:p-8">
          <p className="eyebrow">Cricket analytics app</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Cricket Performance Analytics Platform
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            A Python and Streamlit platform that scraped and structured ball-by-ball data into a custom dataset,
            generating real-time insights and broadcast-ready metrics that supported match strategy and a top-4 finish.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white/80 p-5">
            <p className="eyebrow">Deployment shape</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The app runs locally with <code>streamlit run raiders_streamlit_app.py</code> and is already structured
              for Streamlit Community Cloud deployment with <code>requirements.txt</code> and{' '}
              <code>.streamlit/config.toml</code>.
            </p>
          </div>
        </div>

        <div className="card flex items-center justify-center p-8">
          <div className="relative h-64 w-full max-w-sm">
            <Image
              src="/projects/cricket-analyst-raiders/prime-raider-logo-watermark.png"
              alt="Cricket Performance Analytics Platform logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="eyebrow">Core modules</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {MODULES.map((item) => (
            <article key={item.title} className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="eyebrow">Pipeline</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PIPELINE.map((item) => (
            <article key={item.title} className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="card p-6">
          <p className="eyebrow">Project artifacts</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {ARTIFACTS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <p className="eyebrow">Why it matters</p>
          <div className="mt-4 space-y-4">
            {IMPACT.map((item) => (
              <p key={item} className="text-sm leading-7 text-slate-600">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
