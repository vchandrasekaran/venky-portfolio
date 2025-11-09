export default function Hero() {
  return (
    <section className="container-max relative overflow-hidden pt-16 pb-12 text-center">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand.glow/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-brand.accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-brand.subtle">Venkatesh Naidu</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-100 md:text-5xl">
          AI-Augmented Business Intelligence
        </h1>
        <p className="mx-auto mt-4 text-base text-slate-300 md:mt-6 md:text-lg">
          Orchestrating Snowflake, dbt, and real-time telemetry so revenue teams get answers in milliseconds. I layer
          conversational AI on governed metrics so leaders can interrogate their data with confidence.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            className="inline-flex w-full items-center justify-center rounded-full bg-brand.accent px-6 py-3 font-medium text-slate-900 shadow-glow transition hover:-translate-y-0.5 sm:w-auto"
            href="/experience"
          >
            Work Experience
            <span className="ml-2 text-slate-900/80">-&gt;</span>
          </a>
          <a
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 text-slate-200 transition hover:border-brand.glow/60 hover:text-brand.accent sm:w-auto"
            href="/contact"
          >
            Schedule a Signal Sync
          </a>
        </div>
      </div>
    </section>
  )
}

