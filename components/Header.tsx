import Link from 'next/link'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/sports', label: 'Sports' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="site-header sticky top-0 z-[1000]">
      <div className="container-max flex h-14 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide text-slate-200">
          Venky BI
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

