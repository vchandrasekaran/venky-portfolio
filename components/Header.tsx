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
        <Link href="/" className="text-sm font-semibold tracking-wide text-[#111111]">
          Venky BI
        </Link>
        <nav className="hidden gap-6 text-sm text-[#111111] md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-[#111111]">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
