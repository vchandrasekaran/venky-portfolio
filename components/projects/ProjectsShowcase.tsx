"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PROJECTS, type ProjectSummary } from '@/data/projects'

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
    <div className="mt-5 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="section-shell relative overflow-hidden p-5 md:p-6"
      >
        <div className="relative z-10 grid items-start gap-6 md:grid-cols-[1.1fr,0.9fr]">
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-slate-400">
              <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700">{active.tag || 'Module'}</span>
              {active.status ? (
                <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-blue-700">{active.status}</span>
              ) : null}
              <span>
                {index + 1}/{items.length}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">{active.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{active.desc}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={active.href}
                className="inline-flex items-center rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]"
                target={active.href.startsWith('http') ? '_blank' : undefined}
                rel={active.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Open project
                <span className="ml-2">-&gt;</span>
              </Link>

              <button
                onClick={setPrev}
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Previous
              </button>
              <button
                onClick={setNext}
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Inside the project</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">What you&apos;ll see</h3>
              <ul className="mt-5 flex-1 space-y-3 text-sm text-slate-600">
                {(active.highlights ?? []).map((highlight, idx) => (
                  <li key={`${active.id}-highlight-${idx}`} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((project, idx) => {
            const isActive = idx === index
            return (
              <motion.button
                key={project.id}
                onClick={() => setIndex(idx)}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`group relative rounded-lg border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-blue-200 bg-white shadow-[0_12px_30px_rgba(37,99,235,0.12)]'
                    : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{project.tag || 'Module'}</p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-950">{project.title}</p>
                {isActive ? <span className="hud-sweep" aria-hidden /> : null}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
