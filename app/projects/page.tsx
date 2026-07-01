import Section from '@/components/Section'
import ProjectCard from '@/components/ProjectCard'
import { PROJECTS } from '@/data/projects'

export const metadata = {
  title: 'Projects',
  description: 'Portfolio projects and case studies across BI, Snowflake, AI workflows, and sports-tech.'
}

export default function ProjectsPage() {
  return (
    <main className="pb-10">
      <Section
        title="Projects"
        eyebrow="Project index"
        subtitle="Portfolio case studies, technical builds, and project pages that show how the work is framed and delivered."
      >
        <div className="grid auto-rows-fr items-stretch gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              desc={project.desc}
              href={project.href}
              highlights={project.highlights}
            />
          ))}
        </div>
      </Section>
    </main>
  )
}
