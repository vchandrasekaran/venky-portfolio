export default function AssistantOrbPlaceholder() {
  return (
    <section className="container-max pb-16">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center md:flex-row md:text-left">
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <div
            className="relative h-32 w-32 flex-shrink-0 rounded-full bg-gradient-to-br from-brand.accent/70 via-brand.glow/60 to-brand.accent/20 shadow-[0_0_40px_rgba(255,109,174,0.4)]"
            aria-hidden="true"
          >
            <span className="absolute inset-0 animate-spin-slower rounded-full border border-white/20" />
            <span className="absolute inset-2 rounded-full border border-white/30 opacity-60" />
            <span className="absolute inset-5 rounded-full border border-white/20 opacity-30" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-brand.subtle">AI Copilot</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100">Voice-ready orb coming soon</h3>
            <p className="mt-2 text-sm text-slate-400 md:text-base">
              This placeholder orb will become the chat assistant where you can speak or type to navigate projects,
              ask about metrics, and trigger demos.
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-300">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand.subtle">Coming Feature</p>
            <p className="mt-2 text-base text-slate-100">Tap the orb · Say “Show Tableau work” · Get instant jump links</p>
          </div>
        </div>
      </div>
    </section>
  )
}
