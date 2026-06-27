"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/sports', label: 'Sports' },
  { href: '/contact', label: 'Contact' }
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="site-header sticky top-0 z-[1000]">
      <div className="container-max flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="group min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Portfolio</span>
          <span className="block text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-blue-700">
            Venkatesh Naidu
          </span>
        </Link>

        <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:overflow-visible lg:pb-0" aria-label="Main navigation">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href))
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-md px-2 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${
                  active
                    ? 'bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 lg:inline-flex"
        >
          Contact
        </Link>
      </div>
    </header>
  )
}
