"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES, type SkillBlock } from "@/data/skills";
import useBlip from "./useBlip";

export default function SkillsLoadout(){
  const [active, setActive] = useState<SkillBlock>(SKILL_CATEGORIES[0]);
  const blip = useBlip();

  return (
    <section id="skills" className="container-max py-10">
      <header className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand.subtle">Skills Core</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-100">Select Capability</h2>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        {/* Left: selection tiles */}
        <div className="grid gap-4 sm:grid-cols-3">
          {SKILL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { blip(); setActive(c); }}
              className={`group relative h-28 rounded-2xl border p-3 text-left transition ${
                active.id === c.id ? 'border-cyan-400/60 bg-white/10 shadow-[0_0_0_1px_rgba(61,229,196,0.18)]' : 'border-white/10 bg-white/5 hover:border-cyan-400/35'
              }`}
            >
              <div className="text-[10px] uppercase tracking-widest text-brand.subtle">{c.tag}</div>
              <div className="mt-1 text-slate-200 font-semibold text-sm leading-snug line-clamp-2">{c.title}</div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                background:
                  "linear-gradient(90deg, rgba(61,229,196,.35), rgba(61,229,196,0)) 0 0/24px 2px no-repeat, " +
                  "linear-gradient(180deg, rgba(61,229,196,.35), rgba(61,229,196,0)) 0 0/2px 24px no-repeat, " +
                  "linear-gradient(270deg, rgba(255,109,174,.35), rgba(255,109,174,0)) 100% 100%/24px 2px no-repeat, " +
                  "linear-gradient(0deg, rgba(255,109,174,.35), rgba(255,109,174,0)) 100% 100%/2px 24px no-repeat",
              }} />
              {active.id === c.id ? <span key={c.id + '-sweep'} className="hud-sweep" /> : null}
            </button>
          ))}
        </div>

        {/* Right: details with tool icons */}
        <div className="card p-5 md:p-6 min-h-[220px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-brand.subtle">Brief</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-100">{active.title}</h3>
            </div>
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

          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {active.tools.map(t => (
              <div key={t.name} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-2">
                <div className="relative h-7 w-7 overflow-hidden rounded-md border border-white/10 bg-white/5 p-1">
                  <Image src={t.logo} alt={`${t.name} logo`} width={28} height={28} className="h-full w-full object-contain" />
                </div>
                <div className="text-xs font-medium text-slate-200">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
