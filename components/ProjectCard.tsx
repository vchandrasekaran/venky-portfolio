'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type ProjectCardProps = {
  title: string
  desc: string
  status?: string
  href?: string
}

export default function ProjectCard({ title, desc, status, href }: ProjectCardProps) {
  const base = (
    <motion.article
      whileHover={{ y: -6, scale: 1.005 }}
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="card group block p-6"
    >
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
          {status ? (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-600">
              {status}
            </span>
          ) : null}
        </div>

        <p className="text-slate-600">{desc}</p>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-2 font-medium text-slate-950">
            Explore
            <motion.span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              -&gt;
            </motion.span>
          </span>
          <span className="hidden text-xs uppercase tracking-[0.16em] text-slate-400 sm:inline-flex">Detail</span>
        </div>
      </div>
    </motion.article>
  )

  if (!href) return base

  const external = href.startsWith('http')
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {base}
    </a>
  ) : (
    <Link href={href}>{base}</Link>
  )
}
