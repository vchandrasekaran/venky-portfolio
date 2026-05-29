import Link from 'next/link'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/sports', label: 'Sports' },
  { href: '/contact', label: 'Contact' }
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70">
      <div className="container-max flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Venkatesh Naidu</p>
          <p className="mt-1 text-sm text-slate-500">BI, data platforms, analytics UX, and sports-tech projects.</p>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Footer navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
