type Item = {
  role: string
  org: string
  time: string
  bullets: string[]
}

export default function Timeline({ items }:{ items: Item[] }){
  return (
    <ol className="relative container-max border-l border-slate-800">
      {items.map((it, idx) => (
        <li key={idx} className="mb-10 ml-6">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand.accent/20 ring-2 ring-brand.accent/60">
            <span className="h-2.5 w-2.5 rounded-full bg-brand.accent" />
          </span>
          <h3 className="text-xl font-semibold">{it.role} - {it.org}</h3>
          <time className="mb-1 block text-sm text-slate-400">{it.time}</time>
          <ul className="list-disc ml-6 text-slate-300 space-y-1">
            {it.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

