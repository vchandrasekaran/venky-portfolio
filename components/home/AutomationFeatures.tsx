import Image from 'next/image'

type Stage = {
  id: string
  title: string
  desc: string
  tools: { name: string; logo?: string }[]
  outputs?: string[]
}

const PIPELINE_STAGES: Stage[] = [
  {
    id: 'ingest',
    title: 'Ingest',
    desc: 'Collect from applications, event streams, files, and APIs.',
    tools: [
      { name: 'Fivetran', logo: '/logos/fivetran-logo.svg' },
      { name: 'Kafka', logo: '/logos/kafka-logo.svg' },
      { name: 'Snowpipe', logo: '/logos/snowflake-logo.png' },
      { name: 'Matillion', logo: '/logos/matillion-logo.webp' }
    ],
    outputs: ['Raw events', 'Batch loads']
  },
  {
    id: 'store',
    title: 'Store',
    desc: 'Land and organize data in warehouses and object stores.',
    tools: [
      { name: 'Snowflake', logo: '/logos/snowflake-logo.png' },
      { name: 'S3', logo: '/logos/s3-logo.svg' },
      { name: 'Azure Data Lake', logo: '/logos/azure-logo.svg' },
      { name: 'Iceberg', logo: '/logos/iceberg-logo.png' }
    ],
    outputs: ['Staging', 'Modeled tables']
  },
  {
    id: 'transform',
    title: 'Transform',
    desc: 'Validate, model, enrich, and govern business metrics.',
    tools: [
      { name: 'DBT', logo: '/logos/dbt-logo.jpg' },
      { name: 'Spark', logo: '/logos/spark-logo.svg' },
      { name: 'Airflow', logo: '/logos/airflow-logo.png' },
      { name: 'Python', logo: '/logos/python-logo.webp' }
    ],
    outputs: ['Trusted marts', 'Metric layers']
  },
  {
    id: 'serve',
    title: 'Serve',
    desc: 'Deliver insights into dashboards, apps, alerts, and AI workflows.',
    tools: [
      { name: 'Tableau', logo: '/logos/tableau-logo.png' },
      { name: 'Power BI', logo: '/logos/powerbi-logo.png' },
      { name: 'Domo', logo: '/logos/domo-logo.webp' },
      { name: 'TypeScript', logo: '/logos/typescript-logo.svg' }
    ],
    outputs: ['Dashboards', 'Apps', 'Alerts', 'AI layers']
  }
]

export default function AutomationFeatures() {
  return (
    <section className="container-max py-6">
      <div className="section-shell space-y-7 p-6 md:p-8">
        <header className="max-w-3xl">
          <p className="eyebrow">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">How the work gets shipped</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Clean data products start with reliable ingest and end with dashboards, APIs, alerts, and lightweight AI
            layers that make the warehouse easier to use.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 md:p-5">
          <div className="mt-2 flex flex-col items-start gap-6 lg:flex-row lg:gap-4">
            {PIPELINE_STAGES.map((stage, idx) => (
              <div key={stage.id} className="flex flex-1 flex-col lg:flex-row lg:items-center">
                <StageCard stage={stage} />
                {idx !== PIPELINE_STAGES.length - 1 ? <Connector /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StageCard({ stage }: { stage: Stage }) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">{stage.title}</p>
      <h3 className="mt-3 text-xl font-semibold leading-tight text-slate-950">{stage.desc}</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {stage.tools.map((tool) => (
          <ToolChip key={`${stage.id}-${tool.name}`} tool={tool} />
        ))}
      </div>

      {stage.outputs ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {stage.outputs.map((item) => (
            <span
              key={`${stage.id}-${item}`}
              className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-blue-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ToolChip({ tool }: { tool: Stage['tools'][number] }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
      {tool.logo ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white">
          <Image src={tool.logo} alt={tool.name} width={16} height={16} className="h-4 w-4 object-contain" />
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px]">
          {tool.name.slice(0, 2)}
        </span>
      )}
      {tool.name}
    </div>
  )
}

function Connector() {
  return (
    <div className="relative my-4 hidden h-10 w-10 shrink-0 items-center justify-center lg:flex">
      <div className="h-px w-full bg-gradient-to-r from-slate-200 via-blue-300 to-transparent" />
      <div className="absolute right-0 h-3 w-3 rotate-45 border border-transparent border-r-blue-400 border-t-blue-400" />
    </div>
  )
}
