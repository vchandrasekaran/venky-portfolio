"use client";

const HIGHLIGHTS = [
  "Patent-pending sensing for pickleball paddles: external stickers, edge/handle clips, or embedded meshes capture vibration, impact, and orientation.",
  "Analytics pipeline turns raw signals into impact location, force, spin cues, sweet-spot accuracy, mishit/pop-up detection, and rally summaries.",
  "Multi-device ecosystem: paddles, court cameras, wearables, and sensors stream to a hub/cloud for coaching, broadcast overlays, and officiating.",
  "Agentic LLM layer converts paddle telemetry into natural language/voice guidance, strategy prompts, and session reports.",
];

const FLOW = [
  {
    title: "Sense",
    body:
      "Attach or embed: adhesive stickers, thin films, edge clips, handle wraps, or internal meshes. Capture vibration, acceleration, angular rate, acoustic and pressure signatures at impact.",
  },
  {
    title: "Process",
    body:
      "Signal processing + physics models + ML/AI extract impact detection, location, force, paddle angle/twist, spin cues, shot class, sweet-spot accuracy, and contact quality scores.",
  },
  {
    title: "Sync",
    body:
      "Send data to phone, watch, court hub, or cloud over any wired/wireless link. Stream live, near real time, or batch upload; keep full audit trails.",
  },
  {
    title: "Fuse",
    body:
      "Combine paddle telemetry with court cameras, line/net sensors, biometrics, and environment feeds to build complete rally context.",
  },
  {
    title: "Deliver",
    body:
      "Surface insights in mobile apps, coaching dashboards, broadcast overlays, league/tournament systems, and officiating tools.",
  },
  {
    title: "Guide (LLM Agent)",
    body:
      "Agentic LLM consumes paddle analytics to generate chat/voice guidance, strategy recommendations, training plans, and match summaries.",
  },
];

export default function AIAnalystPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-16 pt-10 text-white">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Patent Pending</p>
        <h1 className="text-3xl font-semibold md:text-4xl">Patent Pending · Smart Sensing System for Pickleball Paddles</h1>
        <p className="text-white/70">
          Universal paddle telemetry platform that detects, processes, and analyzes real on-paddle impacts—no passive gear.
          Works with external attachments or embedded builds, streams to an analytics hub, and feeds an AI agent for
          coaching, broadcast, and officiating.
        </p>
      </header>

      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#050712] via-[#080c1a] to-[#040411] p-6 shadow-[0_45px_90px_rgba(0,0,0,0.55)] space-y-6">
        <h2 className="text-2xl font-semibold">Flow</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {FLOW.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">{item.title}</p>
              <p className="mt-2">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Highlights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {HIGHLIGHTS.map((highlight) => (
            <div key={highlight} className="rounded-3xl border border-white/10 bg-[#050713] p-5 text-white/80">
              {highlight}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
