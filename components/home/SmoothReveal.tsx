"use client"

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SmoothRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section'
}

export default function SmoothReveal({ children, className = '', delay = 0, as = 'div' }: SmoothRevealProps) {
  const MotionTag = as === 'section' ? motion.section : motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
