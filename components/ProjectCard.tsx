'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type ProjectCardProps = {
  title: string
  desc: string
  href?: string
  highlights?: string[]
}

export default function ProjectCard({ title, desc, href, highlights = [] }: ProjectCardProps) {
  const visibleHighlights = highlights.slice(0, 3)

  const base = (
    <motion.article
      whileHover={{ y: -6, scale: 1.005 }}
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="card group flex h-full min-h-[330px] flex-col p-6"
    >
      <div className="relative z-10 flex h-full flex-col">
        <h3 className="text-xl font-semibold leading-tight text-slate-950">{title}</h3>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{desc}</p>

        {visibleHighlights.length ? (
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">What you&apos;ll see</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
              {visibleHighlights.map((highlight, index) => (
                <li key={`${title}-${index}`} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
