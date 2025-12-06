import Image from "next/image";

type Stage = {
  id: string;
  title: string;
  desc: string;
  tools: { name: string; logo: string }[];
};

const PIPELINE_STAGES: Stage[] = [
  {
    id: "ingest",
    title: "Ingest + Model",
    desc: "Snowflake-first ingestion, dbt models, and governed ELT jobs.",
    tools: [
      { name: "Snowflake", logo: "/logos/snowflake-logo.png" },
      { name: "Redshift", logo: "/logos/redshift-logo.png" },
      { name: "Matillion", logo: "/logos/matillion-logo.webp" },
      { name: "AWS", logo: "/logos/aws-logo.png" },
      { name: "Python", logo: "/logos/python-logo.webp" },
      { name: "dbt", logo: "/logos/dbt-logo.jpg" },
    ],
  },
  {
    id: "govern",
    title: "Orchestrate + Govern",
    desc: "CI/CD, dbt tests, telemetry, and cost controls keep pipelines reliable.",
    tools: [
      { name: "GitHub", logo: "/logos/github.svg" },
      { name: "GitLab", logo: "/logos/gitlab-logo.webp" },
      { name: "dbt tests", logo: "/logos/dbt-logo.jpg" },
      { name: "Snowflake Optimizer", logo: "/logos/snowflake-logo.png" },
      { name: "Matillion schedulers", logo: "/logos/matillion-logo.webp" },
      { name: "Cost monitors", logo: "/logos/aws-logo.png" },
    ],
  },
  {
    id: "serve",
    title: "Serve + Visualize",
    desc: "Certified datasets power executive BI, metrics layers, and alerts.",
    tools: [
      { name: "Domo", logo: "/logos/domo-logo.webp" },
      { name: "Power BI", logo: "/logos/powerbi-logo.png" },
      { name: "Tableau", logo: "/logos/tableau-logo.png" },
      { name: "Salesforce", logo: "/logos/salesforce-logo.webp" },
      { name: "Slack alerts", logo: "/logos/github.svg" },
    ],
  },
  {
    id: "activate",
    title: "Apps + Automation",
    desc: "TypeScript apps, Gemini copilots, and Slack/HTTP nodes activate insight.",
    tools: [
      { name: "TypeScript", logo: "/logos/typescript-logo.svg" },
      { name: "JavaScript", logo: "/logos/javascript-logo.webp" },
      { name: "NumPy", logo: "/logos/numpy-logo.webp" },
      { name: "Gemini", logo: "/logos/github.svg" },
      { name: "Slack bots", logo: "/logos/github.svg" },
      { name: "HTTP nodes", logo: "/logos/github.svg" },
    ],
  },
];

export default function AutomationFeatures() {
  return (
    <section className="bg-gradient-to-b from-[#02030b] via-[#05091c] to-[#02030b] text-white">
      <div className="container-max space-y-10 py-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Think it · build it · extend it</p>
          <h2 className="mt-4 text-3xl font-semibold">Automation patterns Venky ships daily</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Data pipelines first: rapid visuals when experimenting, real code when it counts, and obsessive observability once a workflow hits production.
          </p>
        </header>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a0d1c] via-[#060812] to-[#03040c] p-6 shadow-[0_45px_90px_rgba(0,0,0,0.55)]">
          <BoardHeader />
          <PipelineTrack />
        </div>
      </div>
    </section>
  );
}

function BoardHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0d1024] px-6 py-4 text-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-green-200">
          Active
        </span>
        <p className="text-white/80">Automation command board · &quot;Atlas&quot; view</p>
      </div>
      <div className="flex gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
        <button className="rounded-full bg-white/10 px-4 py-1 text-white">Editor</button>
        <button className="rounded-full px-4 py-1">Executions</button>
        <button className="rounded-full px-4 py-1">Tests</button>
      </div>
    </div>
  );
}

function PipelineTrack() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-4">
      {PIPELINE_STAGES.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}

function StageCard({ stage }: { stage: Stage }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-[#050712] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stage.title}</p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight">{stage.desc}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {stage.tools.map((tool) => (
          <ToolChip key={`${stage.id}-${tool.name}`} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolChip({ tool }: { tool: Stage["tools"][number] }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/10">
        <Image src={tool.logo} alt={tool.name} width={16} height={16} className="h-4 w-4 object-contain" />
      </span>
      {tool.name}
    </div>
  );
}
