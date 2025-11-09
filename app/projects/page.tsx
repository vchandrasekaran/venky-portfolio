import Section from '@/components/Section'
import ProjectCard from '@/components/ProjectCard'
import ProjectsShowcase from '@/components/projects/ProjectsShowcase'
import { PROJECTS } from '@/data/projects'

export default function ProjectsPage() {
  return (
    <main>
      <Section
        title="Projects"
        subtitle="Pick a module below — details render in the command console, and cards give you fast context."
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
