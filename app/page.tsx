import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Scene from '@/components/3d/Scene'
import SkillsGrid from '@/components/SkillsGrid'
import ProjectCard from '@/components/ProjectCard'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container-max py-10">
        <Scene />
      </div>
      <SkillsGrid />

      <Section
        title="Featured Intelligence"
        subtitle="Deployable building blocks for AI-augmented analytics, observability, and decision automation."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-widest text-brand.subtle">Conversational Analytics</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-100">Cortex NL -> SQL Copilot</h3>
            <p className="mt-3 text-slate-300">
              Prompt-tuned agents translate exec questions into governed metrics with explainable SQL and visualizations in under two seconds.
            </p>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-widest text-brand.subtle">Revenue Command Center</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-100">Signal Mesh for GTM</h3>
            <p className="mt-3 text-slate-300">
              Stitching product, pipeline, and customer telemetry into one intelligence mesh so CROs can balance growth and efficiency with AI forecasts.
            </p>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-widest text-brand.subtle">Explainable Automation</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-100">Guardrailed Decision Loops</h3>
            <p className="mt-3 text-slate-300">
              Human-in-the-loop workflows combine feature stores, anomaly detection, and AI copilots to auto-resolve issues before humans page in.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Projects" subtitle="Futuristic pilots and analytics systems ready for launch.">
        <div className="grid gap-6 md:grid-cols-3">
          <ProjectCard
            title="AI Talent Pulse"
            status="Prototype"
            desc="Streaming labor data, skill embeddings, and compensation signals to predict where AI disruption hits next."
            href="/projects"
          />
          <ProjectCard
            title="Revenue NeuroNet"
            status="In Flight"
            desc="Blends Salesforce, product usage, and CS notes into an attribution brain that prescribes next-best automations."
            href="/projects"
          />
          <ProjectCard
            title="Sports Intelligence Grid"
            status="Concept"
            desc="Hyperlocal sentiment, player telemetry, and sponsor ROI models to grow emerging sports ecosystems."
            href="/projects"
          />
        </div>
      </Section>
    </main>
  )
}



