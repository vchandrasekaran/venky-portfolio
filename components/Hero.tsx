"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

const HERO_IMAGE = '/headshot.jpg'
const METRICS = [
  { value: '7+', label: 'years in analytics' },
  { value: '200+', label: 'dashboards consolidated' },
  { value: '22%', label: 'Snowflake cost reduction' }
]
const FOCUS = ['Snowflake + dbt', 'Domo + Tableau + Power BI', 'Executive reporting', 'AI-assisted data apps']
const PROOF_POINTS = [
  'Warehouse-first reporting systems for RevOps, Finance, Product, HR, and Customer Success.',
  'Dashboard consolidation, certified datasets, and performance tuning that reduce BI sprawl.',
  'Portfolio case studies that connect analytics engineering with useful product experiences.'
]

export default function Hero() {
  const [hasImage, setHasImage] = useState(true)

  return (
    <section className="container-max pb-12 pt-8 sm:pt-12">
      <div className="grid gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">BI and data analytics portfolio</span>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Venkatesh Naidu
          </h1>
          <p className="mt-5 max-w-3xl text-balance text-xl leading-8 text-slate-700">
            I build data products for operators and executives: trusted pipelines, clean dashboards, and natural-language
            interfaces that turn warehouse data into answers people can act on.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
            >
              Explore projects
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              View experience
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-slate-200 bg-white/80 p-4">
                <p className="text-3xl font-semibold text-slate-950">{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {FOCUS.map((item) => (
              <span key={item} className="pill bg-white/70">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="section-shell overflow-hidden p-4"
        >
          <div className="grid gap-4 sm:grid-cols-[0.92fr,1.08fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-slate-100">
              {hasImage ? (
                <Image
                  src={HERO_IMAGE}
                  alt="Venkatesh Naidu"
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover object-center"
                  onError={() => setHasImage(false)}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 p-8 text-center text-sm font-medium text-slate-500">
                  Add a headshot at /public/headshot.jpg
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-lg bg-slate-950 p-6 text-white">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">Now building</p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight">
                  BI systems, lighter workflows, and more human interfaces to data.
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-white/70">
                  {PROOF_POINTS.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Primary stack</p>
                  <p className="mt-2 text-sm text-white/80">Snowflake, dbt, Domo, Tableau, Power BI, TypeScript, Python</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Focus</p>
                  <p className="mt-2 text-sm text-white/80">Revenue reporting, decision support, workflow automation, and analytics UX</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
