const nodes = [
  { id: "sources", label: "Sources", items: ["Snowflake", "Salesforce", "APIs"], x: 15, y: 22 },
  { id: "logic", label: "Orchestrator", items: ["dbt tests", "LLM checks"], x: 55, y: 20 },
  { id: "ai", label: "AI Assist", items: ["Gemini plan", "Guardrails"], x: 70, y: 55 },
  { id: "alerts", label: "Telemetry", items: ["Slack", "Status Page"], x: 25, y: 68 },
  { id: "apps", label: "Apps", items: ["Tableau", "Pantry Coach"], x: 70, y: 82 },
];

const connections: [string, string][] = [
  ["sources", "logic"],
  ["logic", "ai"],
  ["logic", "alerts"],
  ["ai", "apps"],
  ["logic", "apps"],
];

export default function OrchestrationWhiteboard() {
  return (
    <section className="bg-[#02030b] py-16 text-white">
      <div className="container-max flex flex-col gap-10 lg:flex-row">
        <div className="space-y-4 lg:w-1/3">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Orchestration map</p>
          <h2 className="text-3xl font-semibold">Whiteboard for automation architecture</h2>
          <p className="text-sm text-white/70">
            A high-level look at how Venky wires ingestion, governance, AI agents, and alerting. Inspired by n8n’s
            orchestration canvas, but tailored to BI + AI data copilots.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• Nodes glow when hovered, mirroring live workflow health.</li>
            <li>• Connectors illustrate lineage from source to app.</li>
            <li>• Use this to explain new automation engagements in seconds.</li>
          </ul>
        </div>

        <Whiteboard />
      </div>
    </section>
  );
}

function Whiteboard() {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-gradient-to-br from-[#05091d] via-[#090f27] to-[#05091d] p-6 shadow-[0_35px_80px_rgba(2,3,11,0.65)] lg:w-2/3">
      <div className="relative h-[360px] overflow-hidden rounded-2xl bg-[#060a1b]">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff22 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wire" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {connections.map(([fromId, toId]) => {
            const from = nodeMap[fromId];
            const to = nodeMap[toId];
            if (!from || !to) return null;
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#wire)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity={0.5}
              />
            );
          })}
        </svg>
        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
      </div>
    </div>
  );
}

type NodeProps = {
  id: string;
  label: string;
  items: string[];
  x: number;
  y: number;
};

function Node({ id, label, items, x, y }: NodeProps) {
  return (
    <div
      id={`node-${id}`}
      className="group absolute w-40 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur transition hover:border-white/40"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
      <ul className="mt-2 space-y-1 text-sm text-white/80">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
