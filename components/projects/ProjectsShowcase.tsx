"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  title: string;
  desc: string;
  href: string;
  tag?: string;
};

const PROJECTS: Project[] = [
  {
    id: "tableau",
    title: "Interactive Dashboards. Real Metrics",
    desc: "Tableau portfolio with revenue intelligence, ops KPIs, and experiments.",
    href: "https://public.tableau.com/app/profile/venkateshnaidu/vizzes",
    tag: "LIVE"
  },
  {
    id: "ai-talent-pulse",
    title: "AI Talent Pulse",
    desc: "Streaming labor signals to track AI job market shifts.",
    href: "/projects/ai-talent-pulse",
    tag: "PROTOTYPE"
  },
  {
    id: "trucklexa",
    title: "Trucklexa — Alexa Search",
    desc: "Voice-driven search assistant for trucking data (prototype).",
    href: "#",
    tag: "CONCEPT"
  },
  {
    id: "revenue-neuronet",
    title: "Revenue NeuroNet",
    desc: "Attribution brain blending Salesforce, product usage, and CS notes.",
    href: "#",
    tag: "IN FLIGHT"
  },
  {
    id: "sports-intel",
    title: "Sports Intelligence Grid",
    desc: "Sentiment, telemetry, and sponsor ROI models for growth.",
    href: "#",
    tag: "CONCEPT"
  }
];

export default function ProjectsShowcase() {
  const [i, setI] = useState(0);
  const p = useMemo(() => PROJECTS[i], [i]);
  const prev = () => setI((x) => (x - 1 + PROJECTS.length) % PROJECTS.length);
  const next = () => setI((x) => (x + 1) % PROJECTS.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="container-max">
      {/* Main display */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(255,59,0,0.32)] bg-white/5 p-5 md:p-7 shadow-[0_0_0_1px_rgba(255,59,0,0.12),0_24px_60px_rgba(5,6,10,0.7)]">
        {/* decorative rings */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,59,0,0.25),transparent_60%)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 right-6 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,138,0,0.18),transparent_60%)] blur-2xl" />

        <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[rgba(255,59,0,0.42)] bg-[rgba(12,10,14,0.6)] px-3 py-1 text-[10px] tracking-widest text-[rgba(255,200,180,0.9)] uppercase">{p.tag || 'Module'}</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand.subtle">{i+1}/{PROJECTS.length}</span>
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-100">{p.title}</h2>
            <p className="mt-2 text-slate-300 max-w-2xl">{p.desc}</p>
            <div className="mt-4 flex gap-3">
              <Link href={p.href} className="rounded-full border border-[rgba(255,59,0,0.45)] bg-[rgba(255,59,0,0.12)] px-4 py-2 text-sm text-[rgba(255,200,180,0.95)] hover:bg-[rgba(255,59,0,0.18)]" target={p.href.startsWith('http') ? '_blank' : undefined} rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}>Open</Link>
              <button onClick={next} className="rounded-full border border-[rgba(255,138,0,0.45)] bg-[rgba(255,138,0,0.12)] px-4 py-2 text-sm text-[rgba(255,220,180,0.95)] hover:bg-[rgba(255,138,0,0.18)]">Next</button>
            </div>
          </div>

          {/* stage graphic placeholder */}
          <div className="relative h-48 md:h-56">
            <div className="absolute inset-0 rounded-2xl border border-[rgba(255,59,0,0.35)] bg-[radial-gradient(ellipse_at_center,rgba(255,59,0,0.22),transparent_60%)]" />
            <div className="absolute inset-6 rounded-2xl border border-[rgba(255,138,0,0.35)] bg-[linear-gradient(135deg,rgba(12,14,20,0.8),rgba(8,10,16,0.6))]" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(255,138,0,0.6)] shadow-[0_0_40px_rgba(255,59,0,0.35)]" />
            <div className="absolute left-1/2 top-[60%] h-2 w-40 -translate-x-1/2 rounded-full bg-[rgba(255,59,0,0.35)] blur-md" />
          </div>
        </div>

        {/* controls */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,59,0,0.35)] bg-[rgba(22,12,12,0.6)] px-3 py-1 text-[rgba(255,200,180,0.95)]">◀</button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,59,0,0.35)] bg-[rgba(22,12,12,0.6)] px-3 py-1 text-[rgba(255,200,180,0.95)]">▶</button>
      </div>

      {/* Selection tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {PROJECTS.map((x, idx) => (
          <button key={x.id} onClick={() => setI(idx)} className={`group relative rounded-2xl border p-3 text-left ${idx===i? 'border-[rgba(255,59,0,0.6)] bg-white/10' : 'border-white/10 bg-white/5 hover:border-[rgba(255,59,0,0.4)]'}`}>
            <div className="text-[10px] uppercase tracking-widest text-brand.subtle">Module</div>
            <div className="mt-1 text-slate-200 font-semibold text-sm leading-snug line-clamp-2">{x.title}</div>
            <span className="hud-sweep" />
          </button>
        ))}
      </div>
    </section>
  );
}

