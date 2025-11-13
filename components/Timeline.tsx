type Item = {
  role: string
  org: string
  time: string
  bullets: string[]
}

export default function Timeline({ items }:{ items: Item[] }){
  return (
    <ol className="relative border-l border-black/10 pl-4">
      {items.map((it, idx) => (
        <li key={idx} className="mb-10 ml-4 text-[#111111]">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand.accent/10 ring-2 ring-brand.accent/50">
            <span className="h-2.5 w-2.5 rounded-full bg-brand.accent/80" />
          </span>
          <h3 className="text-xl font-semibold text-[#111111]">{it.role} · {it.org}</h3>
          <time className="mb-1 block text-sm text-[#555555]">{it.time}</time>
          <ul className="ml-6 list-disc space-y-1 text-[#3f3f3f]">
            {it.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

