"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBlip from "./useBlip";

type Project = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  status: "Prototype" | "In Flight" | "Concept" | "Live";
  href: string;
};

const tableauProfile = 'https://public.tableau.com/app/profile/venkateshnaidu/vizzes';

const PROJECTS: Project[] = [
  {
    id: 'tableau-portfolio',
    title: 'Interactive Tableau Portfolio',
    tag: 'Executive Vizzes',
    desc: 'Production-grade dashboards for revenue intelligence, operations, and experiments.',
    status: 'Live',
    href: tableauProfile,
  },
  {
    id: 'revenue-neuronet',
    title: 'Revenue NeuroNet',
    tag: 'Attribution Brain',
    desc: 'Blends Salesforce, product usage, and CS notes into next-best automations with explainability.',
    status: 'In Flight',
    href: '/projects',
  },
];

export default function ProjectsLoadout(){
  const [active, setActive] = useState<Project>(PROJECTS[0]);
  const blip = useBlip();
  const statusColor = (s: Project['status']) => s === 'Live' ? 'text-emerald-300' : s === 'In Flight' ? 'text-amber-300' : s === 'Prototype' ? 'text-cyan-300' : 'text-slate-300';

  return (
    <section id="projects" className="container-max py-12">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand.subtle">Operations Deck</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-100">Select Project</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-white/5 px-2 py-1">
          <span className="text-[10px] uppercase tracking-widest text-brand.subtle">Status</span>
          <span className="chip">Live</span>
          <span className="chip">In Flight</span>
          <span className="chip">Prototype</span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => { blip(); setActive(p); }}
              className={`group relative h-28 rounded-2xl border p-3 text-left transition ${
                active.id === p.id ? 'border-cyan-400/60 bg-white/10 shadow-[0_0_0_1px_rgba(61,229,196,0.18)]' : 'border-white/10 bg-white/5 hover:border-cyan-400/35'
              }`}
            >
              <div className="text-[10px] uppercase tracking-widest text-brand.subtle">{p.tag}</div>
              <div className="mt-1 text-slate-200 font-semibold text-sm leading-snug line-clamp-2">{p.title}</div>
              <div className={`mt-1 text-[10px] ${statusColor(p.status)} uppercase tracking-widest`}>{p.status}</div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                background:
                  "linear-gradient(90deg, rgba(61,229,196,.35), rgba(61,229,196,0)) 0 0/24px 2px no-repeat, " +
                  "linear-gradient(180deg, rgba(61,229,196,.35), rgba(61,229,196,0)) 0 0/2px 24px no-repeat, " +
                  "linear-gradient(270deg, rgba(255,109,174,.35), rgba(255,109,174,0)) 100% 100%/24px 2px no-repeat, " +
                  "linear-gradient(0deg, rgba(255,109,174,.35), rgba(255,109,174,0)) 100% 100%/2px 24px no-repeat",
              }} />
              {active.id === p.id ? <span key={p.id + '-sweep'} className="hud-sweep" /> : null}
            </button>
          ))}
        </div>

        <div className="card p-5 md:p-6 min-h-[220px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-brand.subtle">Brief</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-100">{active.title}</h3>
            </div>
            <a
              href={active.href}
              target={active.href.startsWith('http') ? '_blank' : undefined}
              rel={active.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/20"
            >
              Open
            </a>
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
            <Stat label="Stage" value={active.status} />
            <Stat label="Owner" value="Venkatesh" />
            <Stat label="Scope" value={active.tag} />
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
