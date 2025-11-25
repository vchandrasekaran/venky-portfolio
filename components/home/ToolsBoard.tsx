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

export default function ToolsBoard() {
  return (
    <section className="bg-[#03030c] py-16 text-white">
      <div className="container-max space-y-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Full pipeline atlas</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Exactly where each skill lives in orchestration</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-white/70">
            Modeled after the n8n orchestration UI: every stage sits inside a dark module, tools live in neon trays, and
            directed arrows show the flow from ingestion to activation.
          </p>
        </header>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#090c1e] via-[#060812] to-[#03040c] p-6 shadow-[0_45px_90px_rgba(0,0,0,0.55)]">
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
        <span className="rounded-full bg-green-500/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-green-200">
          Active
        </span>
        <p className="text-white/80">Automation command board · “Atlas” view</p>
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
    <div className="mt-6 space-y-8">
      <div className="relative mx-auto flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
        {PIPELINE_STAGES.map((stage, idx) => (
          <StageCard key={stage.id} stage={stage} index={idx} />
        ))}
      </div>
    </div>
  );
}

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const isLast = index === PIPELINE_STAGES.length - 1;
  return (
    <div className="relative flex-1">
      <div className="rounded-[28px] border border-white/12 bg-[#050712] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">{stage.title}</p>
        <h3 className="mt-2 text-2xl font-semibold">{stage.desc}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {stage.tools.map((tool) => (
            <ToolChip key={`${stage.id}-${tool.name}`} tool={tool} />
          ))}
        </div>
      </div>
      {!isLast ? <ArrowOverlay /> : null}
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

function ArrowOverlay() {
  return (
    <div className="pointer-events-none absolute inset-y-1/2 right-[-8%] hidden h-px translate-y-[-50%] bg-gradient-to-r from-white/5 via-white/70 to-transparent lg:block">
      <div className="absolute right-0 -translate-y-1/2 translate-x-full rotate-45 border border-transparent border-t-white/80 border-r-white/80 p-1" />
      <div className="absolute left-8 top-[-10px] h-8 w-8 rounded-full border border-white/10 bg-white/5 blur-md" />
    </div>
  );
}
