"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PROJECTS, type ProjectSummary } from "@/data/projects";

export type ShowcaseProject = ProjectSummary;

type ProjectsShowcaseProps = {
  projects?: ShowcaseProject[];
};

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const items = useMemo(
    () => (projects && projects.length ? projects : PROJECTS),
    [projects]
  );
  const [index, setIndex] = useState(0);
  const active = items[index] ?? items[0];

  const prev = useCallback(() => {
    setIndex((x) => (x - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setIndex((x) => (x + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  if (!active) return null;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(255,109,174,0.32)] bg-white/5 p-5 md:p-7 shadow-[0_0_0_1px_rgba(255,109,174,0.12),0_24px_60px_rgba(5,6,10,0.7)]">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,109,174,0.25),transparent_60%)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 right-6 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(127,93,255,0.18),transparent_60%)] blur-2xl" />

        <div className="relative z-10 grid items-start gap-6 md:grid-cols-[1.15fr,0.85fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[rgba(255,109,174,0.42)] bg-[rgba(12,10,14,0.6)] px-3 py-1 text-[10px] uppercase tracking-widest text-[rgba(255,235,243,0.9)]">
                {active.tag || "Module"}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand.subtle">
                {index + 1}/{items.length}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100 md:text-3xl">{active.title}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">{active.desc}</p>
            <div className="mt-4 flex gap-3">
              <Link
                href={active.href}
                className="rounded-full border border-[rgba(255,109,174,0.45)] bg-[rgba(255,109,174,0.12)] px-4 py-2 text-sm text-[rgba(255,235,243,0.95)] hover:bg-[rgba(255,109,174,0.18)]"
                target={active.href.startsWith("http") ? "_blank" : undefined}
                rel={active.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                Open
              </Link>
              <button
                onClick={next}
                className="rounded-full border border-[rgba(127,93,255,0.45)] bg-[rgba(127,93,255,0.12)] px-4 py-2 text-sm text-[rgba(255,220,180,0.95)] hover:bg-[rgba(127,93,255,0.18)]"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-[rgba(127,93,255,0.35)] bg-[linear-gradient(145deg,rgba(10,12,18,0.9),rgba(8,10,16,0.65))] p-5 shadow-[0_0_30px_rgba(255,109,174,0.18)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-brand.subtle">Mission Console</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-100">What you&apos;ll see</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {(active.highlights ?? []).map((highlight, idx) => (
                  <li key={`${active.id}-highlight-${idx}`} className="flex gap-3">
                    <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand.accent" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          aria-label="Previous module"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,109,174,0.35)] bg-[rgba(22,12,12,0.6)] px-3 py-1 text-[rgba(255,235,243,0.95)]"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <button
          onClick={next}
          aria-label="Next module"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,109,174,0.35)] bg-[rgba(22,12,12,0.6)] px-3 py-1 text-[rgba(255,235,243,0.95)]"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((project, idx) => (
          <button
            key={project.id}
            onClick={() => setIndex(idx)}
            className={`group relative rounded-2xl border p-3 text-left ${
              idx === index
                ? "border-[rgba(255,109,174,0.6)] bg-white/10"
                : "border-white/10 bg-white/5 hover:border-[rgba(255,109,174,0.4)]"
            }`}
          >
            <div className="text-[10px] uppercase tracking-widest text-brand.subtle">{project.tag || "Module"}</div>
            <div className="mt-1 text-sm font-semibold leading-snug text-slate-200 line-clamp-2">{project.title}</div>
            <span className="hud-sweep" />
          </button>
        ))}
      </div>
    </div>
  );
}
