const FEATURES = [
  {
    eyebrow: "Visual building",
    title: "See automations come alive",
    body: "Drag nodes, wire data sources, and preview payloads in real-time. No need to publish before you see if the flow works.",
    pills: ["Live previews", "400+ node library", "AI copilots"],
    gradient: "from-[#4f46e5] via-[#7c3aed] to-[#a855f7]",
  },
  {
    eyebrow: "No boilerplate",
    title: "Skip repetitive glue code",
    body: "Ship faster with authenticated HTTP nodes, curl imports, and secrets that follow you between environments.",
    pills: ["HTTP node", "Reusable creds", "cURL import"],
    gradient: "from-[#0ea5e9] via-[#14b8a6] to-[#22d3ee]",
  },
  {
    eyebrow: "Fast iteration",
    title: "Test every step instantly",
    body: "Replay inputs, execute only the node you're tweaking, and inspect responses inline without redeploys.",
    pills: ["Replay data", "Step execution", "Inline logs"],
    gradient: "from-[#f97316] via-[#fb7185] to-[#f472b6]",
  },
];

export default function AutomationFeatures() {
  return (
    <section className="bg-gradient-to-b from-[#02030b] via-[#05091c] to-[#02030b] text-white">
      <div className="container-max space-y-10 py-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Think it · build it · extend it</p>
          <h2 className="mt-4 text-3xl font-semibold">Automation patterns Venky ships daily</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Data pipelines first: rapid visuals when experimenting, real code when it counts, and obsessive observability once a workflow hits production.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(2,3,11,0.45)]"
            >
              <div className={`absolute inset-0 opacity-20 blur-3xl bg-gradient-to-r ${feature.gradient}`} />
              <div className="relative space-y-4">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">{feature.eyebrow}</p>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.body}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
