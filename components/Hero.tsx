export default function Hero() {
  return (
    <section className="container-max relative overflow-hidden pt-24 pb-16">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand.glow/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-brand.accent/10 blur-3xl" aria-hidden="true" />

      <div className="grid items-start gap-12">
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
              Work Experience
              <span className="ml-2 text-slate-900/80">-&gt;</span>
            </a>
            <a className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-slate-200 transition hover:border-brand.glow/60 hover:text-brand.accent" href="/contact">
              Schedule a Signal Sync
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-brand.subtle">Signal Chain</p>
              <p className="mt-2 text-lg text-slate-200">Snowflake -&gt; DBT -&gt; Business Intelligence -&gt; Data Intelligence</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-brand.subtle">Speed to Insight</p>
              <p className="mt-2 text-lg text-slate-200">Latency under 1.2s with human-in-the-loop guardrails</p>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  )
}

