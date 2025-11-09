'use client'

import { motion } from 'framer-motion'

type ProjectCardProps = {
  title: string
  desc: string
  status?: string
  href?: string
}

export default function ProjectCard({ title, desc, status, href }: ProjectCardProps) {
  const base = (
    <motion.div
      whileHover={{ y: -6, scale: 1.005 }}
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-[#181818] p-6 shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-brand.accent/18 via-brand.glow/10 to-brand.secondary/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_60%)] opacity-70 mix-blend-screen" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {status ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-white">
              {status}
            </span>
          ) : null}
        </div>
        <p className="text-slate-300">{desc}</p>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="flex items-center gap-2 text-white">
            Dive In
            <motion.span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              ↗
            </motion.span>
          </span>
          <span className="hidden uppercase tracking-widest text-xs text-[#999999] sm:inline-flex">AI Ready</span>
        </div>
      </div>
    </motion.div>
  )

  if (!href) return base

  const external = href.startsWith('http')
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {base}
    </a>
  ) : (
    <a href={href}>{base}</a>
  )
}
