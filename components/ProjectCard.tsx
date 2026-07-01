'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type ProjectCardProps = {
  title: string
  desc: string
  href?: string
}

export default function ProjectCard({ title, desc, href }: ProjectCardProps) {
  const base = (
    <motion.article
      whileHover={{ y: -6, scale: 1.005 }}
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="card group flex h-full min-h-[220px] flex-col p-6"
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold leading-tight text-slate-950">{title}</h3>
        </div>

        <p className="mt-5 max-w-2xl text-slate-600">{desc}</p>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
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
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {base}
    </a>
  ) : (
    <Link href={href} className="block h-full">
      {base}
    </Link>
  )
}
