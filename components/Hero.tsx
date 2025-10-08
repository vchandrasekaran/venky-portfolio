export default function Hero() {
  return (
    <section className="container-max relative overflow-hidden pt-24 pb-16">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand.glow/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-brand.accent/10 blur-3xl" aria-hidden="true" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr,1fr]">
        <div className="relative z-10">
          <span className="chip bg-brand.accent/15 text-brand.accent">Business Intelligence Data Analyst</span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="block text-slate-300">Venkatesh Naidu</span>
            <span className="neon-text">AI-Augmented Business Intelligence</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
            Orchestrating Snowflake, dbt, and real-time telemetry so revenue teams get answers in milliseconds.
            I layer conversational AI on governed metrics so leaders can interrogate their data with confidence.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a className="inline-flex items-center justify-center rounded-full bg-brand.accent px-6 py-3 text-slate-900 font-medium shadow-glow transition hover:-translate-y-0.5" href="/experience">
              Explore Playbooks
              <span className="ml-2 text-slate-900/80">-></span>
            </a>
            <a className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-slate-200 transition hover:border-brand.glow/60 hover:text-brand.accent" href="/contact">
              Schedule a Signal Sync
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-brand.subtle">Signal Chain</p>
              <p className="mt-2 text-lg text-slate-200">Snowflake -> dbt -> Feature Store -> GPT Coach</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-brand.subtle">Speed to Insight</p>
              <p className="mt-2 text-lg text-slate-200">Latency under 1.2s with human-in-the-loop guardrails</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="card p-6 lg:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-brand.subtle">Live Telemetry</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-100">Unified Intelligence Mesh</h2>
            <p className="mt-3 text-sm text-slate-300">Streaming signals stitched into one trusted decision layer with explainable AI copilots.</p>
            <div className="mt-6 grid gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand.subtle">NL -> SQL Accuracy</p>
                  <p className="text-lg font-semibold text-slate-100">97.4%</p>
                </div>
                <span className="rounded-full bg-brand.accent/15 px-3 py-1 text-xs text-brand.accent">Continuous QA</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand.subtle">Executive Adoption</p>
                  <p className="text-lg font-semibold text-slate-100">+38% MoM</p>
                </div>
                <span className="rounded-full bg-brand.glow/20 px-3 py-1 text-xs text-brand.glow">Boost Mode</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand.subtle">Trusted Metrics Pack</p>
                  <p className="text-lg font-semibold text-slate-100">42 Active Signals</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Auto QA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

