"use client";

import { useState } from "react";

const SAMPLE_HIGHLIGHTS = [
  "Ball-by-ball shot tagging with computer vision models (cover drive, sweep, yorker, etc.)",
  "Pickleball rally segmentation that measures serve consistency, NVZ violations, and speedups",
  "Coach console that turns footage into action items and shares them with players in Slack",
];

const MODES = [
  { id: "cricket", label: "Cricket" },
  { id: "pickleball", label: "Pickleball" },
  { id: "coaching", label: "Coach Console" },
];

export default function AIAnalystPage() {
  const [activeMode, setActiveMode] = useState("cricket");

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-16 pt-10 text-white">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">In Development</p>
        <h1 className="text-3xl font-semibold md:text-4xl">AI Assisted Cricket & Pickleball Analyst</h1>
        <p className="text-white/70">
          Live video streams feed a Gemini + CV stack that understands swing mechanics, rally tempo, and coach intent.
          It surfaces instant action items during matches and shares full reports after.
        </p>
      </header>

      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#050712] via-[#080c1a] to-[#040411] p-6 shadow-[0_45px_90px_rgba(0,0,0,0.55)] space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeMode === mode.id ? "bg-white text-black" : "border border-white/15 text-white/70"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          {activeMode === "cricket" && (
            <p>
              CV nodes detect shot type, pitch zone, and batter footwork. The system tags pressure overs, sends field
              placement suggestions, and clips highlight reels automatically.
            </p>
          )}
          {activeMode === "pickleball" && (
            <p>
              Rally engine tracks serve consistency, NVZ violations, and dink-to-speedup transitions. Coaches receive
              instant prompts for stacking, coverage, and tempo.
            </p>
          )}
          {activeMode === "coaching" && (
            <p>
              A unified console merges cricket + pickleball feeds, summarizing action items into Slack or Notion. Players
              see exactly what to change without scrubbing through footage.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Highlights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SAMPLE_HIGHLIGHTS.map((highlight) => (
            <div key={highlight} className="rounded-3xl border border-white/10 bg-[#050713] p-5">
              {highlight}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
