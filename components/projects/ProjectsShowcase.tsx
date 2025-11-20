"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useState } from "react"

import { PROJECTS, type ProjectSummary } from "@/data/projects"

export type ShowcaseProject = ProjectSummary

type ProjectsShowcaseProps = {
  projects?: ShowcaseProject[]
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const items = useMemo(() => (projects && projects.length ? projects : PROJECTS), [projects])
  const [index, setIndex] = useState(0)
  const active = items[index] ?? items[0]

  const setPrev = useCallback(() => {
    setIndex((x) => (x - 1 + items.length) % items.length)
  }, [items.length])

  const setNext = useCallback(() => {
    setIndex((x) => (x + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    setIndex(0)
  }, [items])

  if (!active) return null

  return (
    <div className="w-full mt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1b1b1b] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.45)] min-h-[480px]"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,109,174,0.3),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(127,93,255,0.22),transparent_60%)] blur-3xl" />

        <div className="relative z-10 grid items-stretch gap-8 md:grid-cols-[1.1fr,0.9fr]">
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#aaaaaa]">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white">{active.tag || "Module"}</span>
              <span>{index + 1}/{items.length}</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{active.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-300">{active.desc}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={active.href}
                className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-[#111111] shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
                target={active.href.startsWith("http") ? "_blank" : undefined}
                rel={active.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                Open console
                <span className="ml-2">↗</span>
              </Link>
              <button
                onClick={setPrev}
                className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white"
              >
                Previous
              </button>
              <button
                onClick={setNext}
                className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex min-h-[240px] flex-col rounded-[28px] border border-white/10 bg-[#151515] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b0b0b0]">Mission Console</p>
              <h3 className="mt-2 text-xl font-semibold text-white">What you&apos;ll see</h3>
              <ul className="mt-5 flex-1 space-y-3 text-sm text-slate-300">
                {(active.highlights ?? []).map((highlight, idx) => (
                  <li key={`${active.id}-highlight-${idx}`} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-white" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((project, idx) => {
            const isActive = idx === index
            return (
              <motion.button
                key={project.id}
                onClick={() => setIndex(idx)}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`group relative rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-white bg-[#1c1c1c] shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
                    : "border-white/10 bg-[#1a1a1a] hover:border-white/30"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#b0b0b0]">{project.tag || "Module"}</p>
                <p className="mt-2 text-sm font-semibold leading-snug text-white line-clamp-2">{project.title}</p>
                {isActive ? <span className="hud-sweep" aria-hidden /> : null}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
