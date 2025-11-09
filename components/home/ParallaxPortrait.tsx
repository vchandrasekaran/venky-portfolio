"use client"

import Image from 'next/image'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useState } from 'react'

type ParallaxPortraitProps = {
  src?: string
  alt?: string
  className?: string
}

export default function ParallaxPortrait({
  src = '/headshot.jpg',
  alt = 'Venkatesh Naidu portrait',
  className = ''
}: ParallaxPortraitProps) {
  const [loaded, setLoaded] = useState(true)
  const rotateX = useSpring(0, { stiffness: 120, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 120, damping: 20 })
  const opacity = useSpring(0.95, { stiffness: 120, damping: 20 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const deltaX = offsetX - centerX
    const deltaY = offsetY - centerY
    const rotateAmountX = (deltaY / centerY) * -6
    const rotateAmountY = (deltaX / centerX) * 6
    rotateX.set(rotateAmountX)
    rotateY.set(rotateAmountY)
    x.set(deltaX)
    y.set(deltaY)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
    x.set(0)
    y.set(0)
  }

  const baseClass =
    'group relative mx-auto flex h-[460px] w-[340px] items-center justify-center rounded-[36px] border border-white/10 bg-gradient-to-br from-brand.primary/60 via-brand.surface/40 to-brand.glow/20 p-4 backdrop-blur xl:h-[560px] xl:w-[400px]'

  return (
    <motion.div
      className={`${baseClass} ${className}`}
      style={{ rotateX, rotateY, opacity }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerUp={resetTilt}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-r from-brand.accent/35 via-brand.glow/20 to-brand.secondary/25 blur-3xl"
        animate={{ opacity: [0.6, 0.95, 0.6], rotate: [-4, 4, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/10"
        animate={{ opacity: [0.4, 0.9, 0.5], scale: [1, 1.02, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-br from-brand.glow/30 via-transparent to-brand.accent/20">
        {loaded ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority
            className="object-cover"
            onError={() => setLoaded(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand.glow/30 via-brand.primary/60 to-brand.accent/20 text-center text-base font-semibold text-slate-200">
            Add your photo<br />public/headshot.jpg
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand.primary/65 via-transparent to-transparent" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -bottom-16 h-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(127,93,255,0.4), transparent 60%)' }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.95] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-left text-sm text-slate-100 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.35em] text-brand.subtle">BI + AI</p>
          <p className="text-lg font-semibold">Signal Architect</p>
          <p className="text-xs text-slate-300">Snowflake · dbt · Tableau · Copilots</p>
        </div>
      </div>
    </motion.div>
  )
}
