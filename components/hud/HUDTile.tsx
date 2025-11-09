import Link from "next/link";

export default function HUDTile({ title, desc, href, tag }: { title: string; desc: string; href: string; tag?: string }){
  const inner = (
    <div className="relative h-32 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[rgba(255,109,174,0.55)]">
      <div className="text-[10px] uppercase tracking-widest text-brand.subtle">{tag || 'Project'}</div>
      <h3 className="mt-1 text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-300">{desc}</p>
      <span className="absolute right-4 top-4 text-[rgba(127,93,255,0.9)] opacity-0 transition group-hover:opacity-100">-&gt;</span>
      <span className="hud-sweep" />
    </div>
  );
  if (!href || href === '#') return <div className="group">{inner}</div>;
  const isExternal = href.startsWith('http');
  return (
    <Link href={href} className="group" target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
      {inner}
    </Link>
  );
}

