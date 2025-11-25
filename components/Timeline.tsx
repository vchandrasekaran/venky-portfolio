type Item = {
  role: string
  org: string
  time: string
  bullets: string[]
}

export default function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="relative border-l border-white/15 pl-4">
      {items.map((it, idx) => (
        <li key={idx} className="mb-10 ml-4 text-white">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-2 ring-[#a855f7]/60">
            <span className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" />
          </span>
          <h3 className="text-xl font-semibold">
            {it.role} · {it.org}
          </h3>
          <time className="mb-1 block text-sm text-white/60">{it.time}</time>
          <ul className="ml-6 list-disc space-y-1 text-white/70">
            {it.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
