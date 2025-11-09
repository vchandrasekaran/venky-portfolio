"use client"

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

const HERO_IMAGE = '/headshot.jpg'

export default function Hero() {
  const [hasImage, setHasImage] = useState(true)
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })
  const marqueeShift = useTransform(scrollYProgress, [0, 1], ['-60%', '0%'])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[#f4f2ee]">
      <div className="relative h-screen w-full overflow-hidden">
        {hasImage ? (
          <Image
            src={HERO_IMAGE}
            alt="Venkatesh Naidu"
            fill
            priority
            className="object-cover object-[center_20%]"
            onError={() => setHasImage(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand.glow/30 via-brand.primary/60 to-brand.accent/20 text-center text-base font-semibold text-[#444444]">
            Add your photo at /public/headshot.jpg
          </div>
        )}
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-[5] w-[220vw] -translate-x-1/2 overflow-hidden text-[clamp(2.5rem,16vw,12rem)] font-semibold uppercase tracking-[0.4em] text-[#d0d0d0] drop-shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
        style={{ x: marqueeShift }}
        aria-hidden
      >
        <div className="hero-marquee">
          {Array.from({ length: 4 }, (_, idx) => (
            <span key={idx} className="mr-12 whitespace-nowrap">
              VENKATESH NAIDU
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
