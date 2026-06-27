"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

const HERO_IMAGE = '/hero-3d-folded-cutout.png'

const metrics = [
  { value: '7+', label: 'years in analytics' },
  { value: '200+', label: 'dashboards consolidated' },
  { value: '22%', label: 'Snowflake cost reduction' }
]

const attributeGroups = [
  {
    label: 'Data engineering',
    score: 94,
    details: ['Snowflake', 'DBT', 'ELT pipelines']
  },
  {
    label: 'BI delivery',
    score: 95,
    details: ['Domo', 'Power BI', 'Tableau']
  },
  {
    label: 'Governance',
    score: 92,
    details: ['Certified datasets', 'KPI standards', 'Cost controls']
  },
  {
    label: 'Automation',
    score: 89,
    details: ['GitLab CI/CD', 'SLA monitoring', 'API workflows']
  },
  {
    label: 'AI workflows',
    score: 87,
    details: ['Text-to-SQL', 'Site assistant', 'Prototype apps']
  },
  {
    label: 'Sports-tech',
    score: 90,
    details: ['Cricket analytics', 'Pickleball concepts', 'Media work']
  }
]

const proofPoints = [
  'Warehouse-first reporting systems for RevOps, Finance, Product, HR, and Customer Success.',
  'Dashboard consolidation, certified datasets, and performance tuning that reduce BI sprawl.',
  'Portfolio case studies that connect analytics engineering with useful product experiences.'
]

const stack = ['Snowflake', 'DBT', 'Domo', 'Power BI', 'Tableau', 'TypeScript', 'Python']

export default function Hero() {
  const [hasImage, setHasImage] = useState(true)
  const [isEmoting, setIsEmoting] = useState(false)

  const triggerEmote = () => {
    setIsEmoting(true)
    window.setTimeout(() => setIsEmoting(false), 950)
  }

  return (
    <section className="container-max pb-8 pt-6 sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-lg border border-white/15 bg-[#0b0f16] shadow-[0_34px_90px_rgba(0,0,0,0.38)]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ef4444,#f59e0b_34%,#22c55e_66%,#38bdf8)]" />

        <div className="grid gap-0 lg:grid-cols-[0.92fr,1.08fr]">
          <div className="relative min-h-[620px] overflow-hidden border-b border-white/10 bg-[#080b10] lg:h-full lg:min-h-[760px] lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(56,189,248,0.28),transparent_34%),radial-gradient(circle_at_52%_74%,rgba(245,158,11,0.22),transparent_28%),linear-gradient(180deg,#10151d_0%,#080b10_100%)]" />
            <div className="absolute left-1/2 top-16 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.035] shadow-[inset_0_0_70px_rgba(56,189,248,0.16)]" />
            <div className="absolute inset-x-10 bottom-24 h-24 rounded-[50%] bg-[#020617] opacity-75 blur-2xl" />

            {hasImage ? (
              <motion.button
                type="button"
                aria-label="Trigger Venkatesh avatar emote"
                aria-pressed={isEmoting}
                onClick={triggerEmote}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.985 }}
                animate={
                  isEmoting
                    ? { y: [0, -18, 0, -8, 0], scale: [1, 1.05, 1.02, 1.04, 1], rotate: [0, -1.4, 1, 0.4, 0] }
                    : { y: [0, -6, 0] }
                }
                transition={
                  isEmoting
                    ? { duration: 0.9, ease: 'easeOut' }
                    : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute inset-0 z-[1] cursor-pointer bg-transparent p-0"
              >
                {isEmoting && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 0.7, scale: 0.82 }}
                    animate={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#38bdf8]/45 bg-[#38bdf8]/15 blur-sm"
                  />
                )}
                <Image
                  src={HERO_IMAGE}
                  alt="Venkatesh Naidu"
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="z-[1] origin-bottom translate-x-16 translate-y-8 scale-[0.78] object-contain object-top p-2 drop-shadow-[0_34px_44px_rgba(0,0,0,0.65)] sm:translate-x-0 sm:translate-y-24 sm:scale-[0.98]"
                  onError={() => setHasImage(false)}
                />
              </motion.button>
            ) : (
              <div className="relative z-[1] flex h-full items-center justify-center p-8 text-center text-sm font-medium text-white/55">
                Add a 3D avatar at /public/hero-3d-folded-cutout.png
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(8,11,16,0)_0%,rgba(8,11,16,0.08)_44%,rgba(8,11,16,0.76)_72%,#080b10_100%)]" />

            <div className="absolute left-5 top-5 z-10 rounded-md border border-white/15 bg-black/45 px-4 py-3 backdrop-blur">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f59e0b]">Profile snapshot</p>
              <p className="mt-1 text-sm font-semibold text-white">BI and data analytics portfolio</p>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#38bdf8]">
                Business Intelligence & Data Analytics
              </p>
              <h1 aria-label="Venkatesh Naidu" className="mt-3 text-4xl font-black leading-none tracking-normal text-white sm:text-6xl">
                Venkatesh{' '}
                <span className="block text-[#f59e0b]">Naidu</span>
              </h1>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-3xl font-black text-white">{metric.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/58">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_34%),#10151d] p-6 md:p-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#f59e0b]">Analytics details</p>
                  <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[1.02] tracking-normal text-white md:text-5xl">
                    Data products for operators and executives.
                  </h2>
                </div>

                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full p-1"
                  style={{ background: 'conic-gradient(#22c55e 0deg 326deg, rgba(255,255,255,0.1) 326deg 360deg)' }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#07090d]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Impact</span>
                    <span className="text-4xl font-black text-white">91</span>
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                Currently a Data Analytics Engineer at NBCUniversal. I build data products for operators and executives:
                trusted pipelines, clean dashboards, and natural-language interfaces that turn warehouse data into answers
                people can act on.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {attributeGroups.map((group) => (
                  <article key={group.label} className="rounded-lg border border-white/12 bg-white/[0.055] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/48">{group.label}</p>
                      <p className="text-2xl font-black text-[#22c55e]">{group.score}</p>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)]"
                        style={{ width: `${group.score}%` }}
                      />
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-white/62">
                      {group.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-[1fr,0.82fr]">
              <div className="rounded-lg border border-white/12 bg-[#07090d] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">Now building</p>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-white">
                  BI systems, lighter workflows, and more human interfaces to data.
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/64">
                  {proofPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f59e0b]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-white/12 bg-white/[0.055] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">Primary stack</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span key={item} className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/72">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-md bg-[#f8fafc] px-5 py-3 text-sm font-semibold text-[#07090d] transition hover:bg-[#e2e8f0]"
                  >
                    Explore projects
                  </Link>
                  <Link
                    href="/experience"
                    className="inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white"
                  >
                    View experience
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
