import Image from 'next/image'

export const metadata = {
  title: 'Sports Snapshot',
  description: 'A sports broadcast style portfolio intro for Venkatesh Naidu.'
}

const headlineStats = [
  { label: 'Seasons in analytics', value: '7+', note: 'BI, data platforms, reporting systems' },
  { label: 'Broadcast reliability', value: '98.8%', note: 'Sports broadcast KPI reporting' },
  { label: 'Dashboards consolidated', value: '200+', note: 'Governed Domo apps and certified datasets' },
  { label: 'Snowflake cost reduction', value: '22%', note: 'Warehouse profiling and right-sizing' }
]

const quickSplits = [
  { label: 'Manual hours saved', value: '20+/mo' },
  { label: 'Dataset reuse lift', value: '50%+' },
  { label: 'Risk accuracy', value: '99.36%' },
  { label: 'Sports partnership', value: '5+ yrs' }
]

const ratings = [
  { label: 'Snowflake + DBT', value: 96 },
  { label: 'Domo / Power BI / Tableau', value: 94 },
  { label: 'Executive reporting', value: 93 },
  { label: 'AI workflows', value: 88 },
  { label: 'Sports-tech storytelling', value: 90 }
]

const careerLog = [
  { season: '2026-Present', team: 'NBCUniversal', role: 'Data Analytics Engineer, sports broadcast reliability' },
  { season: '2019-2025', team: 'Truckstop.com', role: 'BI Analyst III / II / I, SDET II/III' },
  { season: '2017-2019', team: 'Illinois Tech', role: 'M.S. Information Technology & Management' },
  { season: '2015-2016', team: 'Amazon', role: 'Risk Analyst, fraud detection' },
  { season: 'Sports', team: 'Pickleball + Cricket', role: 'DUPR coach, PPA medalist, Mars Cricket partner' }
]

export default function SnapshotPage() {
  return (
    <main className="bg-[#0b0d10] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_50%,#8b5cf6_100%)]" />
        <div className="container-max grid min-h-[calc(100vh-96px)] gap-6 py-6 lg:grid-cols-[0.92fr,1.08fr] lg:items-center lg:py-8">
          <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/15 bg-[#12161d] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between border-b border-white/10 bg-black/60 px-5 py-4 backdrop-blur">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#06b6d4]">Snapshot intro</p>
                <p className="mt-1 text-sm font-semibold text-white/75">Portfolio broadcast</p>
              </div>
              <div className="rounded-md border border-white/20 px-3 py-2 text-right font-mono text-xs text-white/80">
                HOU
                <span className="ml-2 text-[#38bdf8]">DATA</span>
              </div>
            </div>

            <Image
              src="/headshot.jpg"
              alt="Venkatesh Naidu"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-x-0 bottom-0 z-10 bg-[linear-gradient(180deg,rgba(11,13,16,0)_0%,rgba(11,13,16,0.92)_44%,#0b0d10_100%)] px-6 pb-6 pt-28">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#38bdf8]">BI / Analytics Engineering</p>
              <h1 className="mt-3 text-5xl font-black uppercase leading-none tracking-normal text-white sm:text-6xl">
                Venkatesh
                <span className="block text-[#06b6d4]">Naidu</span>
              </h1>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-xs uppercase tracking-[0.16em]">
                <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2">Snowflake</div>
                <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2">DBT</div>
                <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2">Governance</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-y border-white/15 py-4">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-white/70">
                <span className="rounded-sm bg-[#2563eb] px-2 py-1 text-white">Focus: Analytics systems</span>
                <span>Track: Data products</span>
                <span>Scope: BI + sports-tech</span>
              </div>
              <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.98] tracking-normal text-white sm:text-5xl lg:text-6xl">
                Warehouse data into boardroom-ready plays.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/68">
                Analytics engineer and BI operator with a track record across Snowflake, DBT, Domo, Power BI,
                Tableau, AI-assisted workflows, and sports-tech innovation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {headlineStats.map((stat) => (
                <article key={stat.label} className="rounded-lg border border-white/12 bg-white/[0.06] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">{stat.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-normal text-white">{stat.value}</p>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-white/58">{stat.note}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {quickSplits.map((split) => (
                <div key={split.label} className="rounded-md border border-white/12 bg-[#151a21] p-4">
                  <p className="text-2xl font-black text-[#8b5cf6]">{split.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/48">{split.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-max grid gap-6 py-10 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-lg border border-white/12 bg-[#11161c] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#06b6d4]">Ratings board</p>
          <div className="mt-6 space-y-5">
            {ratings.map((rating) => (
              <div key={rating.label}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white">{rating.label}</p>
                  <p className="font-mono text-sm text-white/62">{rating.value}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb,#06b6d4,#8b5cf6)]"
                    style={{ width: `${rating.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/12 bg-[#11161c] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#38bdf8]">Career splits</p>
          <div className="mt-6 divide-y divide-white/10">
            {careerLog.map((item) => (
              <div key={`${item.season}-${item.team}`} className="grid gap-3 py-4 sm:grid-cols-[110px,1fr]">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/42">{item.season}</p>
                <div>
                  <h3 className="text-lg font-bold text-white">{item.team}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/58">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
