// @ts-nocheck
import Image from "next/image";

const STAGES = [
  {
    title: "Ingest",
    desc: "Apps, events, APIs",
    tools: [
      { name: "Fivetran", logo: "/logos/fivetran-logo.svg" },
      { name: "Kafka", logo: "/logos/kafka-logo.svg" },
      { name: "Snowpipe", logo: "/logos/snowflake-logo.png" },
      { name: "Matillion", logo: "/logos/matillion-logo.webp" },
    ],
  },
  {
    title: "Store",
    desc: "Object store & warehouse",
    tools: [
      { name: "S3", logo: "/logos/s3-logo.svg" },
      { name: "Azure", logo: "/logos/azure-logo.svg" },
      { name: "Snowflake", logo: "/logos/snowflake-logo.png" },
      { name: "Iceberg", logo: "/logos/iceberg-logo.png" },
    ],
  },
  {
    title: "Transform",
    desc: "Models, tests, orchestration",
    tools: [
      { name: "dbt", logo: "/logos/dbt-logo.jpg" },
      { name: "Spark", logo: "/logos/spark-logo.svg" },
      { name: "Airflow", logo: "/logos/airflow-logo.png" },
      { name: "Matillion", logo: "/logos/matillion-logo.webp" },
      { name: "Python", logo: "/logos/python-logo.webp" },
    ],
  },
  {
    title: "Serve + Activate",
    desc: "BI, APIs, alerts, apps",
    tools: [
      { name: "Tableau", logo: "/logos/tableau-logo.png" },
      { name: "Power BI", logo: "/logos/powerbi-logo.png" },
      { name: "Looker", logo: "/logos/looker-logo.png" },
      { name: "ClickHouse", logo: "/logos/clickhouse-logo.png" },
      { name: "Atlan", logo: "/logos/atlan-logo.png" },
    ],
  },
];

export default function PipelineBoardPseudo3D() {
  return (
    <section className="container-max pb-16 text-white">
      <header className="mb-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-white/60">Concept</p>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">3D board — pipeline lanes</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70 md:text-base">
          Pseudo-3D board inspired by n8n: tilt, glow, and hover states, using the real tool logos we track above.
        </p>
      </header>

      <div
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050712] p-6 shadow-[0_45px_90px_rgba(0,0,0,0.55)]"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative rounded-[28px] border border-white/8 bg-gradient-to-br from-white/6 via-white/2 to-transparent p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          style={{
            transform: "rotateX(9deg) rotateY(-12deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <BackgroundGlow />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((stage, idx) => (
              <StageCard key={stage.title} stage={stage} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  const tilt = index % 2 === 0 ? "rotateX(2deg)" : "rotateX(-2deg)";
  return (
    <div
      className="relative h-full rounded-2xl border border-white/12 bg-white/5 p-4 shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition duration-400 hover:-translate-y-1 hover:border-brand.accent/60 hover:shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
      style={{ transform: tilt }}
    >
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">{stage.title}</p>
      <h3 className="mt-2 text-lg font-semibold">{stage.desc}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {stage.tools.map((tool) => (
          <span
            key={`${stage.title}-${tool.name}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur"
          >
            {tool.logo ? (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <Image src={tool.logo} alt={tool.name} width={18} height={18} className="h-4 w-4 object-contain" />
              </span>
            ) : (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[10px]">
                {tool.name.slice(0, 2)}
              </span>
            )}
            {tool.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand.glow/10 via-brand.accent/10 to-brand.primary/5 blur-2xl" />
      <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand.glow/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-brand.accent/25 blur-3xl" />
    </>
  );
}
