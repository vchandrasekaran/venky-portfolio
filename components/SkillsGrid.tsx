import Image from 'next/image'

type Skill = {
  name: string
  category: string
  logo: string
}

const skills: Skill[] = [
  { name: 'Snowflake', category: 'Data Engineering', logo: '/logos/snowflake-logo.png' },
  { name: 'Amazon Redshift', category: 'Data Warehousing', logo: '/logos/redshift-logo.png' },
  { name: 'dbt', category: 'Modeling', logo: '/logos/dbt-logo.jpg' },
  { name: 'Matillion', category: 'ELT Orchestration', logo: '/logos/matillion-logo.webp' },
  { name: 'AWS', category: 'Cloud Platform', logo: '/logos/aws-logo.png' },
  { name: 'Domo', category: 'Business Intelligence', logo: '/logos/domo-logo.webp' },
  { name: 'Power BI', category: 'Business Intelligence', logo: '/logos/powerbi-logo.png' },
  { name: 'Tableau', category: 'Business Intelligence', logo: '/logos/tableau-logo.png' },
  { name: 'Salesforce', category: 'RevOps', logo: '/logos/salesforce-logo.webp' },
  { name: 'Python', category: 'Automation & ML', logo: '/logos/python-logo.webp' },
  { name: 'TypeScript', category: 'Applications', logo: '/logos/typescript-logo.svg' },
  { name: 'JavaScript', category: 'Applications', logo: '/logos/javascript-logo.webp' },
  { name: 'NumPy', category: 'Analytics', logo: '/logos/numpy-logo.webp' },
  { name: 'GitHub', category: 'Version Control', logo: '/logos/github.svg' },
  { name: 'GitLab', category: 'Version Control', logo: '/logos/gitlab-logo.webp' }
]

export default function SkillsGrid() {
  return (
    <section className="container-max py-12">
      <div className="text-center">
        <span className="chip bg-brand.accent/15 text-brand.accent">Core Stack</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">Skills Mesh</h2>
        <p className="mt-2 text-sm text-slate-400 md:text-base">
          The platforms I partner with to ship governed analytics, AI copilots, and revenue intelligence.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {skills.map((skill) => (
          <article key={skill.name} className="card flex items-center gap-4 p-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
              <Image src={skill.logo} alt={`${skill.name} logo`} width={48} height={48} className="h-full w-full object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">{skill.name}</h3>
              <p className="text-xs uppercase tracking-wide text-brand.subtle">{skill.category}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
