import Image from "next/image";

import { SKILL_CATEGORIES } from "@/data/skills";

const TABS = ["1. Visual building", "2. Powerful Debugging", "3. Secure Deployments"];
const TOOLBAR_ICONS = ["+", "{}", "AI", "DEV", "QA", "BI"];

export default function SkillsCoreCompact() {
  const columns = 3;
  const layout = SKILL_CATEGORIES.map((category, idx) => {
    const column = idx % columns;
    const row = Math.floor(idx / columns);
    return {
      category,
      x: 90 + column * 160,
      y: 120 + row * 90,
    };
  });
  const boardHeight = 140 + Math.ceil(SKILL_CATEGORIES.length / columns) * 90;

  return (
    <section className="bg-gradient-to-b from-[#0a0414] via-[#050a18] to-[#02030b] py-16 text-white">
      <div className="container-max space-y-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Skills Core</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Automation battlestation</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-white/70">
            Built to mirror the n8n workflow board, but populated with Venky&apos;s BI, AI, and ops toolchain.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {TABS.map((tab, idx) => (
            <span
              key={tab}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                idx === 0 ? "bg-white text-black" : "border border-white/20 bg-white/5 text-white/70"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="relative rounded-[36px] border border-white/10 bg-[#05080f] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between rounded-2xl bg-[#080c16] px-5 py-3 text-sm text-white/70">
            <span className="font-semibold text-white">Battlecard bot · marketing</span>
            <div className="flex gap-2 text-xs uppercase tracking-[0.4em] text-white/50">
              <button className="rounded-full bg-white/10 px-4 py-1 text-white">Editor</button>
              <button className="rounded-full px-4 py-1">Executions</button>
              <button className="rounded-full px-4 py-1">Tests</button>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <aside className="flex w-16 flex-col items-center rounded-2xl border border-white/10 bg-[#0b0f1f] py-6 text-white/70">
              {TOOLBAR_ICONS.map((icon) => (
                <button key={icon} className="mb-4 h-10 w-10 rounded-xl bg-white/5 text-sm font-semibold transition hover:bg-white/15">
                  {icon}
                </button>
              ))}
            </aside>

            <WorkflowBoard layout={layout} boardHeight={boardHeight} />
          </div>

          <WorkflowConsole />
        </div>
      </div>
    </section>
  );
}

type NodeLayout = {
  category: (typeof SKILL_CATEGORIES)[number];
  x: number;
  y: number;
};

function WorkflowBoard({ layout, boardHeight }: { layout: NodeLayout[]; boardHeight: number }) {
  return (
    <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#030511]">
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff0f 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <svg className="absolute inset-0" viewBox={`0 0 600 ${boardHeight}`}>
        <defs>
          <linearGradient id="wire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        {layout.slice(0, -1).map((node, idx) => {
          const next = layout[idx + 1];
          const midX = (node.x + next.x) / 2;
          return (
            <path
              key={`${node.category.id}-${next.category.id}`}
              d={`M${node.x} ${node.y} C${midX} ${node.y}, ${midX} ${next.y}, ${next.x} ${next.y}`}
              fill="none"
              stroke="url(#wire)"
              strokeWidth={2}
              strokeDasharray="6 6"
              opacity={0.5}
            />
          );
        })}
        {layout.map((node) => (
          <SkillNode key={node.category.id} layout={node} />
        ))}
      </svg>
    </div>
  );
}

function SkillNode({ layout }: { layout: NodeLayout }) {
  const { category, x, y } = layout;
  const primary = category.tools[0];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="150" height="90" rx="18" fill="rgba(20,24,40,0.95)" stroke="rgba(255,255,255,0.15)" />
      <text x="16" y="24" fill="#8b8daa" fontSize="10">
        {category.tag}
      </text>
      <text x="16" y="42" fill="#ffffff" fontSize="16">
        {category.title}
      </text>
      {category.tools.slice(0, 2).map((tool, index) => (
        <text key={tool.name} x="16" y={60 + index * 14} fill="#c7c9d8" fontSize="11">
          - {tool.name}
        </text>
      ))}
      {primary ? (
        <foreignObject x="108" y="12" width="30" height="30">
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/10">
            <Image
              src={primary.logo}
              alt={primary.name}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </div>
        </foreignObject>
      ) : null}
    </g>
  );
}

function WorkflowConsole() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#06090f] p-4 text-sm text-white/70">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
        <span>Chat</span>
        <span>Latest logs</span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-white/80">Integration capabilities</p>
          <p className="mt-2 text-xs text-white/60">
            400+ native nodes plus HTTP/LLM scaffolding. Mirrors Venky&apos;s real stack across Snowflake, Slack, Cortex, and
            Gemini copilots.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-white/80">Latest logs</p>
          <pre className="mt-2 overflow-auto text-xs text-white/70">{"{ \"query\": \"n8n\", \"k\": 25 }"}</pre>
        </div>
      </div>
    </div>
  );
}
