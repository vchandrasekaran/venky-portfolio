import Section from '@/components/Section'

const ICONS = {
  email: (
    <svg className="h-5 w-5 text-brand.accent" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.14l9 5.4 9-5.4V7H3Zm18 10V9.62l-9 5.4-9-5.4V17h18Z"
      />
    </svg>
  ),
  linkedin: (
    <svg className="h-5 w-5 text-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.225 0H1.771C.792 0 0 .77 0 1.723v20.555C0 23.23.792 24 1.771 24h20.454C23.2 24 24 23.23 24 22.278V1.723C24 .77 23.2 0 22.225 0ZM7.08 20.452H3.586V9h3.494v11.452ZM5.332 7.433a2.02 2.02 0 1 1 0-4.04 2.02 2.02 0 0 1 0 4.04Zm15.12 13.02h-3.49v-5.574c0-1.33-.027-3.044-1.857-3.044-1.858 0-2.143 1.45-2.143 2.95v5.668H9.47V9h3.35v1.563h.047c.467-.885 1.606-1.818 3.305-1.818 3.536 0 4.193 2.327 4.193 5.355v6.352Z"
      />
    </svg>
  ),
  dupr: (
    <svg className="h-5 w-5 text-[#00AEEF]" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="currentColor" opacity="0.15" />
      <path
        fill="currentColor"
        d="M6.5 6.75h4c2.6 0 4.75 2.05 4.75 4.75s-2.15 4.75-4.75 4.75h-4V6.75Zm3.9 7.38c1.4 0 2.45-1.07 2.45-2.63 0-1.57-1.05-2.63-2.45-2.63h-1.4v5.26h1.4ZM16.7 6.75h1.9c1.89 0 3.35 1.46 3.35 3.35 0 1.9-1.46 3.35-3.35 3.35h-.5v3.85H16.7V6.75Zm1.85 4.74c1 0 1.72-.74 1.72-1.69 0-.94-.72-1.68-1.72-1.68h-.55v3.37h.55Z"
      />
    </svg>
  ),
  instagram: (
    <svg className="h-5 w-5 text-[#E1306C]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm6.35-3.45a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"
      />
    </svg>
  ),
} as const

type ContactLink = {
  name: string
  href: string
  label: string
  icon: keyof typeof ICONS
}

const contactLinks: ContactLink[] = [
  {
    name: 'Email',
    href: 'mailto:venkateshkishan11@gmail.com',
    label: 'venkateshkishan11@gmail.com',
    icon: 'email'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/venkateshnaidu/',
    label: 'linkedin.com/in/venkateshnaidu',
    icon: 'linkedin'
  },
  {
    name: 'DUPR',
    href: 'https://dashboard.dupr.com/dashboard/player/0/profile',
    label: 'dashboard.dupr.com/player/0/profile',
    icon: 'dupr'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/venky_6',
    label: '@venky_6',
    icon: 'instagram'
  }
]

export default function ContactPage(){
  return (
    <main>
      <Section title="Contact" subtitle="Let's talk BI - Snowflake, dbt, Power BI, Domo, and more.">
        <div className="card p-6">
          <p className="text-white/70">Prefer LinkedIn? Great - add me and mention this site.</p>
          <ul className="mt-4 space-y-3">
            {contactLinks.map((link) => (
              <li key={link.name}>
                <a
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition hover:border-white/30 hover:bg-white/5"
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    {ICONS[link.icon]}
                  </span>
                  <div>
                    <span className="block text-xs uppercase tracking-wide text-white/50">{link.name}</span>
                    <span className="text-white">{link.label}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  )
}
