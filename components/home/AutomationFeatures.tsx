import Image from "next/image";

type Stage = {
  id: string;
  title: string;
  desc: string;
  tools: { name: string; logo?: string }[];
  outputs?: string[];
};

const PIPELINE_STAGES: Stage[] = [
  {
    id: "ingest",
    title: "Ingest",
    desc: "Collect from apps, events, files, and APIs.",
    tools: [
      { name: "Fivetran" },
      { name: "Kafka" },
      { name: "Snowpipe" },
    ],
    outputs: ["Raw events", "Batch loads"],
  },
  {
    id: "store",
    title: "Store",
    desc: "Land and organize data in object stores and warehouses.",
    tools: [
      { name: "S3" },
      { name: "Azure Data Lake" },
      { name: "Snowflake", logo: "/logos/snowflake-logo.png" },
      { name: "Iceberg" },
    ],
    outputs: ["Raw tables", "Staging areas"],
  },
  {
    id: "transform",
    title: "Transform",
    desc: "Clean, validate, model, and enrich data for use.",
    tools: [
      { name: "dbt", logo: "/logos/dbt-logo.jpg" },
      { name: "Spark" },
      { name: "Airflow" },
      { name: "Soda" },
    ],
    outputs: ["Validated models", "Metrics layer"],
  },
  {
    id: "serve",
    title: "Serve + Activate",
    desc: "Deliver insights to BI, APIs, alerts, and apps.",
    tools: [
      { name: "Tableau", logo: "/logos/tableau-logo.png" },
      { name: "Power BI", logo: "/logos/powerbi-logo.png" },
      { name: "Looker" },
      { name: "Domo", logo: "/logos/domo-logo.webp" },
      { name: "ClickHouse" },
      { name: "Atlan" },
      { name: "Alerts" },
    ],
    outputs: ["Dashboards", "APIs", "Alerts", "AI + apps"],
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

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a0d1c] via-[#060812] to-[#03040c] p-6 shadow-[0_45px_90px_rgba(0,0,0,0.55)]">
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
  const lastIndex = PIPELINE_STAGES.length - 1;

  return (
    <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-4">
      {PIPELINE_STAGES.map((stage, idx) => (
        <div key={stage.id} className="flex flex-1 flex-col lg:flex-row lg:items-center">
          <StageCard stage={stage} />
          {idx !== lastIndex ? <Connector /> : null}
        </div>
      ))}
    </div>
  );
}

function StageCard({ stage }: { stage: Stage }) {
  return (
    <div className="flex h-full flex-col rounded-[24px] border border-white/12 bg-[#050712] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stage.title}</p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight">{stage.desc}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {stage.tools.map((tool) => (
          <ToolChip key={`${stage.id}-${tool.name}`} tool={tool} />
        ))}
      </div>
      {stage.outputs && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stage.outputs.map((item) => (
            <span
              key={`${stage.id}-${item}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolChip({ tool }: { tool: Stage["tools"][number] }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {tool.logo ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/10">
          <Image src={tool.logo} alt={tool.name} width={16} height={16} className="h-4 w-4 object-contain" />
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[10px]">
          {tool.name.slice(0, 2)}
        </span>
      )}
      {tool.name}
    </div>
  );
}

function Connector() {
  return (
    <div className="relative my-4 hidden h-full w-10 shrink-0 items-center justify-center lg:flex">
      <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/60 to-transparent" />
      <div className="absolute right-0 h-3 w-3 rotate-45 border border-transparent border-t-white/70 border-r-white/70" />
    </div>
  );
}
