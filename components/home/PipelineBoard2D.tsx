// @ts-nocheck
import Image from "next/image";

type Node = {
  id: string;
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  kind?: "primary" | "secondary";
  logo?: string;
};

type Edge = {
  from: string;
  to: string;
  dashed?: boolean;
  label?: string;
};

const nodes: Node[] = [
  { id: "webhook", title: "Receive DMs", subtitle: "POST", x: 10, y: 36, logo: "/logos/webhook.svg" },
  { id: "check-bot", title: "Check if Bot", x: 28, y: 36, logo: "/logos/snowflake-logo.png" },
  { id: "noop", title: "No Operation, do nothing", x: 52, y: 18, kind: "secondary", logo: "/logos/java-logo.svg" },
  { id: "ai-agent", title: "AI Agent", subtitle: "Conversational Agent", x: 52, y: 36, kind: "primary", logo: "/logos/atlan-logo.png" },
  { id: "teams", title: "Microsoft Teams", subtitle: "create: chatMessage", x: 74, y: 36, logo: "/logos/looker-logo.png" },
  { id: "openai", title: "OpenAI Chat Model", subtitle: "Model", x: 40, y: 54, kind: "secondary", logo: "/logos/r-logo.svg" },
  { id: "memory", title: "Window Buffer Memory", subtitle: "Memory", x: 52, y: 54, kind: "secondary", logo: "/logos/airflow-logo.png" },
  { id: "onedrive", title: "Microsoft OneDrive", subtitle: "search: folder", x: 64, y: 54, kind: "secondary", logo: "/logos/azure-logo.svg" },
  { id: "sharepoint", title: "Call Sharepoint workflow", subtitle: "Tool", x: 76, y: 60, kind: "secondary", logo: "/logos/powerbi-logo.png" },
  { id: "dynamics", title: "Microsoft Dynamics", x: 64, y: 64, kind: "secondary", logo: "/logos/clickhouse-logo.png" },
];

const edges: Edge[] = [
  { from: "webhook", to: "check-bot" },
  { from: "check-bot", to: "noop", label: "true" },
  { from: "check-bot", to: "ai-agent", label: "false" },
  { from: "ai-agent", to: "teams" },
  { from: "ai-agent", to: "openai", dashed: true, label: "Chat Model" },
  { from: "ai-agent", to: "memory", dashed: true, label: "Memory" },
  { from: "ai-agent", to: "onedrive", dashed: true, label: "Tool" },
  { from: "ai-agent", to: "sharepoint", dashed: true, label: "Tool" },
  { from: "onedrive", to: "dynamics", dashed: true },
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

function pathForEdge(edge: Edge) {
  const from = getNode(edge.from);
  const to = getNode(edge.to);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const controlY = midY + (edge.dashed ? 4 : 2);
  return `M ${from.x} ${from.y} Q ${midX} ${controlY}, ${to.x} ${to.y}`;
}

export default function PipelineBoard2D() {
  return (
    <section className="container-max pb-16 text-white">
      <header className="mb-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-white/60">Workflow</p>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">2D board — n8n-style lane</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70 md:text-base">
          Flat board with stitched connections and hover glow, inspired by the n8n hero layout.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0f1e] p-4 shadow-[0_45px_90px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,252,210,0.06),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(142,224,255,0.06),transparent_50%)]" />
        <div className="relative h-[640px] w-full rounded-3xl border border-white/10 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:18px_18px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet">
            {edges.map((edge) => (
              <path
                key={`${edge.from}-${edge.to}`}
                d={pathForEdge(edge)}
                fill="none"
                stroke="rgba(126,252,210,0.65)"
                strokeWidth={edge.dashed ? 1.2 : 1.6}
                strokeDasharray={edge.dashed ? "4 4" : "0"}
              />
            ))}
          </svg>

          {edges.map((edge) => {
            if (!edge.label) return null;
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 + (edge.dashed ? 2 : 0);
            return (
              <div
                key={`label-${edge.from}-${edge.to}`}
                className="absolute rounded-full border border-white/10 bg-black/60 px-2 py-[2px] text-[10px] text-white/70"
                style={{ left: `${midX}%`, top: `${midY}%`, transform: "translate(-50%, -50%)" }}
              >
                {edge.label}
              </div>
            );
          })}

          {nodes.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NodeCard({ node }: { node: Node }) {
  const primary = node.kind !== "secondary";
  return (
    <div
      className={`absolute flex min-w-[160px] max-w-[220px] flex-col gap-2 rounded-2xl border px-4 py-3 text-sm shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-[2px] hover:border-brand.accent/70`}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        borderColor: primary ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.1)",
        background: primary ? "linear-gradient(135deg, rgba(40,50,90,0.7), rgba(25,30,50,0.9))" : "rgba(16,18,30,0.85)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/30">
          {node.logo ? (
            <Image src={node.logo} alt={node.title} width={18} height={18} className="h-5 w-5 object-contain" />
          ) : (
            <span className="text-[11px]">{node.title.slice(0, 2)}</span>
          )}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">{node.title}</span>
          {node.subtitle ? <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">{node.subtitle}</span> : null}
        </div>
      </div>
    </div>
  );
}
