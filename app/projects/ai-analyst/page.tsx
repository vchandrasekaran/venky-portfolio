"use client"

const HIGHLIGHTS = [
  'Patent-pending sensing for pickleball paddles using external stickers, edge or handle clips, or embedded meshes.',
  'Analytics pipeline derives impact location, force, spin cues, sweet-spot accuracy, mishit detection, and rally summaries.',
  'Multi-device ecosystem combines paddle telemetry with cameras, wearables, and court-side sensors.',
  'An LLM layer converts telemetry into coaching prompts, voice guidance, and post-session summaries.'
]

const FLOW = [
  {
    title: 'Sense',
    body: 'Capture vibration, acceleration, angular rate, acoustic signals, and pressure signatures directly from the paddle.'
  },
  {
    title: 'Process',
    body: 'Use signal processing, physics models, and machine learning to classify impacts and estimate shot quality.'
  },
  {
    title: 'Sync',
    body: 'Stream data to phones, watches, courtside hubs, or cloud services in real time or batch mode.'
  },
  {
    title: 'Fuse',
    body: 'Combine paddle telemetry with video, officiating systems, biometrics, and environmental data.'
  },
  {
    title: 'Deliver',
    body: 'Surface insight through coaching apps, broadcast overlays, officiating tools, and training dashboards.'
  },
  {
    title: 'Guide',
    body: 'Use an LLM agent to explain rallies, suggest drills, summarize sessions, and generate strategy prompts.'
  }
]

export default function AIAnalystPage() {
  return (
    <div className="container-max space-y-8 pb-16 pt-6">
      <section className="section-shell p-8 md:p-10">
        <p className="eyebrow">Patent pending concept</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Smart sensing system for pickleball paddles
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          A universal telemetry platform for paddles that detects impacts, interprets shot quality, and feeds coaching,
          broadcast, and officiating experiences with structured data.
        </p>
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="eyebrow">System flow</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FLOW.map((item) => (
            <article key={item.title} className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {HIGHLIGHTS.map((highlight) => (
          <article key={highlight} className="card p-6">
            <p className="text-sm leading-7 text-slate-600">{highlight}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
