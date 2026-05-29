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
    title: 'Player Stats',
    body: 'Tabbed player analysis with overview, form, batting, bowling, and an ask-style view for grounded questions about the selected player.'
  },
  {
    title: 'Team Comparison',
    body: 'Side-by-side batting and bowling comparison across squads so match prep starts with strengths, weaknesses, and matchup edges.'
  },
  {
    title: 'Grounds',
    body: 'Ground analysis with innings, phase, month, and time-bucket filters plus win-signal views that show what usually converts to wins.'
  },
  {
    title: 'Matchup Report',
    body: 'Print-oriented team plan for a fixture with current form, player plans, key threats, ground context, strengths, weaknesses, and broadcast notes.'
  }
]

const PIPELINE = [
  {
    title: 'Scrape',
    body: 'Collectors pull team, player, series, and ball-by-ball data from CricClubs and tournament sources into repeatable local datasets.'
  },
  {
    title: 'Consolidate',
    body: 'Workbook builders merge history, profiles, recent form, and live tournament sheets into a single analytics base plus a cached balls pickle.'
  },
  {
    title: 'Model',
    body: 'Derived metrics break performance down by innings, phase, pace vs spin, batting position, wickets, extras, and matchup behavior.'
  },
  {
    title: 'Deliver',
    body: 'Outputs land in a Streamlit app, print-style reports, a ground-analysis PDF, and a Power BI pack for tournament review.'
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
  'Turns scattered cricket data into something usable for selection, prep, and on-the-day planning.',
  'Keeps historical depth while layering in current tournament form, which is exactly how actual match decisions get made.',
  'Bridges analytics and communication by packaging outputs for coaching, team review, and broadcast-style storytelling.'
]

export default function CricketAnalystRaidersPage() {
  return (
    <div className="container-max space-y-8 pb-16 pt-6">
      <section className="grid gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <div className="section-shell p-8 md:p-10">
          <p className="eyebrow">Prototype sports analytics app</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Team Analyst Raiders
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            A Streamlit cricket intelligence workspace built around squad prep, opponent scouting, ground context,
            current form, and print-ready matchup planning for the Prime Raider Gladiators workflow.
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
              alt="Team Analyst Raiders logo"
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

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
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
