"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBlip from "./useBlip";

type Item = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  cta?: { label: string; href: string };
};

const ITEMS: Item[] = [
  {
    id: "conversational",
    title: "Cortex NL → SQL Copilot",
    tag: "Conversational Analytics",
    desc:
      "Prompt-tuned agents translate exec questions into governed metrics with explainable SQL and visuals in under two seconds.",
    cta: { label: "View Projects", href: "/projects" },
  },
  {
    id: "signal-mesh",
    title: "Signal Mesh for GTM",
    tag: "Revenue Command Center",
    desc:
      "Stitch product, pipeline, and customer telemetry into one intelligence mesh so CROs can balance growth and efficiency.",
    cta: { label: "View Projects", href: "/projects" },
  },
  {
    id: "guardrails",
    title: "Guardrailed Decision Loops",
    tag: "Explainable Automation",
    desc:
      "Human-in-the-loop workflows combine feature stores, anomaly detection, and AI copilots to auto-resolve issues before escalation.",
    cta: { label: "View Projects", href: "/projects" },
  },
];

export default function Loadout() {
  const [active, setActive] = useState<Item>(ITEMS[0]);
  const blip = useBlip();

  return (
    <section id="ops" className="container-max py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand.subtle">Ops Loadout</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-100">Select Module</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-white/5 px-2 py-1">
          <span className="text-[10px] uppercase tracking-widest text-brand.subtle">Mode</span>
          <span className="chip">Ops</span>
          <span className="chip">Viz</span>
          <span className="chip">Automation</span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          {ITEMS.map((it) => (
            <button
              key={it.id}
              onClick={() => { blip(); setActive(it); }}
              className={`group relative h-28 rounded-2xl border p-3 text-left transition ${
                active.id === it.id
                  ? "border-cyan-400/60 bg-white/10 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]"
                  : "border-white/10 bg-white/5 hover:border-cyan-400/35"
              }`}
            >
              <div className="text-[10px] uppercase tracking-widest text-brand.subtle">{it.tag}</div>
              <div className="mt-1 text-slate-200 font-semibold text-sm leading-snug line-clamp-2">
                {it.title}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                background:
                  "linear-gradient(90deg, rgba(34,211,238,.35), rgba(34,211,238,0)) 0 0/24px 2px no-repeat, " +
                  "linear-gradient(180deg, rgba(34,211,238,.35), rgba(34,211,238,0)) 0 0/2px 24px no-repeat, " +
                  "linear-gradient(270deg, rgba(163,230,53,.35), rgba(163,230,53,0)) 100% 100%/24px 2px no-repeat, " +
                  "linear-gradient(0deg, rgba(163,230,53,.35), rgba(163,230,53,0)) 100% 100%/2px 24px no-repeat",
              }} />
              {active.id === it.id ? <span key={it.id + '-sweep'} className="hud-sweep" /> : null}
            </button>
          ))}
        </div>

        <div className="card p-5 md:p-6 min-h-[220px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-brand.subtle">Brief</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-100">{active.title}</h3>
            </div>
            {active.cta ? (
              <a
                href={active.cta.href}
                className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/20"
              >
                {active.cta.label}
              </a>
            ) : null}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-3 text-slate-300"
            >
              {active.desc}
            </motion.p>
          </AnimatePresence>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Latency" value="~1.2s" />
            <Stat label="Adoption" value="38% MoM" />
            <Stat label="Signals" value="42 active" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-brand.subtle">{label}</div>
      <div className="mt-1 text-slate-100 font-semibold">{value}</div>
    </div>
  );
}
