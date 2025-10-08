export default function ProjectCard({ title, desc, status, href }: { title: string; desc: string; status?: string; href?: string }) {
  return (
    <a
      href={href || '#'}
      className="card group block p-6 transition duration-300 hover:-translate-y-1 hover:border-brand.accent/60"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        {status ? (
          <span className="rounded-full border border-brand.accent/40 bg-brand.accent/15 px-3 py-1 text-xs uppercase tracking-wide text-brand.accent">
            {status}
          </span>
        ) : null}
      </div>
      <p className="text-slate-300">{desc}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-brand.subtle">
        <span className="flex items-center gap-2 text-brand.accent">
          Dive In
          <span className="transition-transform duration-300 group-hover:translate-x-1">-></span>
        </span>
        <span className="hidden uppercase tracking-widest text-xs sm:inline-flex">AI Ready</span>
      </div>
    </a>
  )
}

