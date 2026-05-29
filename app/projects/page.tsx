import Section from '@/components/Section'
import ProjectCard from '@/components/ProjectCard'
import ProjectsShowcase from '@/components/projects/ProjectsShowcase'
import { PROJECTS } from '@/data/projects'

export const metadata = {
  title: 'Projects',
  description: 'Portfolio projects and case studies across BI, Snowflake, AI workflows, and sports-tech.'
}

export default function ProjectsPage() {
  return (
    <main className="pb-16">
      <Section
        title="Projects"
        eyebrow="Project index"
        subtitle="Portfolio case studies, concepts, and project pages that show how the work is framed and delivered."
      >
        <ProjectsShowcase projects={PROJECTS} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              desc={project.desc}
              status={project.status}
              href={project.href}
            />
          ))}
        </div>
      </Section>
    </main>
  )
}
