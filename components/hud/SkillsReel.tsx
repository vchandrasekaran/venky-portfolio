"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

type Skill = { name: string; category: string; logo: string };

const SKILLS: Skill[] = [
  { name: 'Snowflake', category: 'Data Engineering', logo: '/logos/snowflake-logo.png' },
  { name: 'Amazon Redshift', category: 'Data Warehousing', logo: '/logos/redshift-logo.png' },
  { name: 'dbt', category: 'Modeling', logo: '/logos/dbt-logo.jpg' },
  { name: 'Matillion', category: 'ELT Orchestration', logo: '/logos/matillion-logo.webp' },
  { name: 'AWS', category: 'Cloud Platform', logo: '/logos/aws-logo.png' },
  { name: 'Domo', category: 'Business Intelligence', logo: '/logos/domo-logo.webp' },
  { name: 'Power BI', category: 'Business Intelligence', logo: '/logos/powerbi-logo.png' },
  { name: 'Tableau', category: 'Business Intelligence', logo: '/logos/tableau-logo.png' },
  { name: 'Salesforce', category: 'RevOps', logo: '/logos/salesforce-logo.webp' },
  { name: 'Python', category: 'Automation & ML', logo: '/logos/python-logo.webp' },
  { name: 'TypeScript', category: 'Applications', logo: '/logos/typescript-logo.svg' },
  { name: 'JavaScript', category: 'Applications', logo: '/logos/javascript-logo.webp' },
  { name: 'NumPy', category: 'Analytics', logo: '/logos/numpy-logo.webp' },
  { name: 'GitHub', category: 'Version Control', logo: '/logos/github.svg' },
  { name: 'GitLab', category: 'Version Control', logo: '/logos/gitlab-logo.webp' }
];

export default function SkillsReel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  // Drag to scroll
  useEffect(() => {
    const el = trackRef.current; if (!el) return;
    const down = (e: PointerEvent) => { isDown.current = true; startX.current = e.clientX; startScroll.current = el.scrollLeft; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!isDown.current) return; e.preventDefault(); const dx = e.clientX - startX.current; el.scrollLeft = startScroll.current - dx; };
    const up = (e: PointerEvent) => { isDown.current = false; try { el.releasePointerCapture(e.pointerId); } catch {} };
    el.addEventListener('pointerdown', down, { passive: false });
    el.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    return () => { el.removeEventListener('pointerdown', down as any); el.removeEventListener('pointermove', move as any); window.removeEventListener('pointerup', up as any); };
  }, []);

  // Wheel to horizontal scroll
  useEffect(() => {
    const el = trackRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, []);

  const scrollBy = (dx: number) => { const el = trackRef.current; if (!el) return; el.scrollBy({ left: dx, behavior: 'smooth' }); };

  return (
    <aside className="relative h-[120px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-brand.bg/90 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-brand.bg/90 to-transparent" />

      {/* track */}
      <div ref={trackRef} className="no-scrollbar h-full w-full overflow-x-auto scroll-smooth">
        <div className="flex h-full items-center gap-3 px-3">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <div key={s.name + i} className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 w-16 h-16 flex items-center justify-center hover:border-cyan-400/40 transition">
              <Image src={s.logo} alt={`${s.name} logo`} width={40} height={40} className="h-10 w-10 object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      <button onClick={() => scrollBy(-240)} className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-200 hover:border-cyan-400/40">◀</button>
      <button onClick={() => scrollBy(240)} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-200 hover:border-cyan-400/40">▶</button>
    </aside>
  );
}
