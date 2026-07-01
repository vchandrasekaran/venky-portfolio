import Section from '@/components/Section'

export const metadata = {
  title: 'Contact',
  description: 'Contact Venkatesh Naidu for BI roles, analytics consulting, sports-tech ideas, and project conversations.'
}

const contactLinks = [
  {
    name: 'Email',
    href: 'mailto:venkateshkishan11@gmail.com',
    label: 'venkateshkishan11@gmail.com',
    note: 'Best for direct outreach and project conversations.'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/venkateshnaidu/',
    label: 'linkedin.com/in/venkateshnaidu',
    note: 'A good starting point for professional networking.'
  },
  {
    name: 'GitHub',
    href: 'https://github.com/vchandrasekaran',
    label: 'github.com/vchandrasekaran',
    note: 'Code, project work, and technical experiments.'
  },
  {
    name: 'DUPR',
    href: 'https://dashboard.dupr.com/dashboard/player/4836686050',
    label: 'dashboard.dupr.com/player/4836686050',
    note: 'Pickleball profile, results, and public ranking context.'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/venky_6',
    label: '@venky_6',
    note: 'A lighter stream of sports and personal updates.'
  }
]

export default function ContactPage() {
  return (
    <main className="pb-10">
      <Section title="Contact" eyebrow="Get in touch" subtitle="Reach out for BI roles, analytics consulting, sports-tech ideas, or project conversations.">
        <div className="grid items-start gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="section-shell p-6 md:p-8">
            <p className="eyebrow">Availability</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Open to thoughtful conversations.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              The cleanest way to start is email or LinkedIn. If you are referencing something you saw on this site,
              mention the page or project so I can respond with the right context.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="card p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Focus areas</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Snowflake, DBT, dashboard strategy, automation design, analytics product thinking, and sports-tech innovation.
                </p>
              </div>
              <div className="card p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Best outreach</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keep the first message short. A role, problem statement, or project link is enough to start.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {contactLinks.map((link) => (
              <a
                key={link.name}
                className="card p-5"
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{link.name}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{link.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{link.note}</p>
                  </div>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-500">Open</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>
    </main>
  )
}
