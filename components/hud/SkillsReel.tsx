"use client";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";

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

const ITEM_H = 72; // px height per item
const VISIBLE = 7; // render window count (odd preferred)

function mod(n: number, m: number) { return ((n % m) + m) % m; }

export default function SkillsReel() {
  const [index, setIndex] = useState(0);

  const step = useCallback((delta: number) => {
    setIndex((i) => mod(i + delta, SKILLS.length));
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // natural scroll: down -> next
    if (Math.abs(e.deltaY) < 2) return;
    step(e.deltaY > 0 ? 1 : -1);
  }, [step]);

  const dragHandlers = {
    drag: "y" as const,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: 0.2,
    onDragEnd: (_: any, info: { offset: { y: number }, velocity: { y: number } }) => {
      const travel = info.offset.y + info.velocity.y * 0.2; // momentum-ish
      const steps = Math.round(-travel / (ITEM_H * 0.9));
      if (steps !== 0) step(steps);
    }
  };

  const windowed = useMemo(() => {
    const half = Math.floor(VISIBLE / 2);
    const items: { skill: Skill; pos: number }[] = [];
    for (let o = -half; o <= half; o++) {
      const idx = mod(index + o, SKILLS.length);
      items.push({ skill: SKILLS[idx], pos: o });
    }
    return items;
  }, [index]);

  return (
    <aside className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand.bg/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand.bg/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0" onWheel={onWheel}>
        <motion.div {...dragHandlers} className="relative h-full touch-pan-y cursor-grab active:cursor-grabbing">
          {windowed.map(({ skill, pos }) => (
            <motion.div
              key={skill.name}
              layout
              style={{ top: '50%', translateY: pos * ITEM_H - (ITEM_H / 2), position: 'absolute', left: 12, right: 12 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${pos === 0 ? 'border-cyan-400/60 bg-white/10 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]' : 'border-white/10 bg-white/5'}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: pos === 0 ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              onClick={() => step(-pos)}
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-white/5 p-1">
                <Image src={skill.logo} alt={`${skill.name} logo`} width={40} height={40} className="h-full w-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-100">{skill.name}</div>
                <div className="text-[11px] uppercase tracking-widest text-brand.subtle">{skill.category}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </aside>
  );
}

