import Image from 'next/image'

import { SKILL_CATEGORIES } from '@/data/skills'

export default function SkillsCoreCompact() {
  return (
    <section className="container-max pb-20">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#b3b3b3]">Skills Core</p>
        <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Governed pods across the stack</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
          Pipelines, BI, and application tooling presented in horizontal pods so you can scan the stack at a glance.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {SKILL_CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-5 text-slate-200 shadow-[0_25px_45px_rgba(0,0,0,0.4)] transition hover:border-white/30 md:flex md:items-center md:gap-6"
          >
            <div className="md:w-64">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#b3b3b3]">{category.tag}</p>
              <h4 className="text-lg font-semibold text-white">{category.title}</h4>
              <p className="mt-2 text-sm text-slate-300">{category.desc}</p>
            </div>
            <div className="mt-4 flex-1 md:mt-0">
              <div className="no-scrollbar -mx-1 overflow-x-auto">
                <ul className="mx-1 flex min-w-[320px] gap-3 text-[11px] font-medium text-slate-200">
                  {category.tools.map((tool) => (
                    <li
                      key={`${category.id}-${tool.name}`}
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10 p-1">
                        <Image
                          src={tool.logo}
                          alt={`${tool.name} logo`}
                          width={32}
                          height={32}
                          className="h-full w-full object-contain"
                        />
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-white">{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
