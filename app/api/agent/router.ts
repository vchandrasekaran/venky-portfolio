export type AgentMode = "about" | "talent-pulse" | "web";
export interface AgentResponse {
  mode: AgentMode;
  answer: string;
  kpis?: { label: string; value: number | string }[];
  charts?: { type: "vegaLite"; spec: any; dataName: string; data: any[] }[];
  sql?: string;
  sources?: { title?: string; url?: string }[];
}
export function detectMode(q: string): AgentMode {
  const s = q.toLowerCase();
  if (s.includes("job") || s.includes("ai talent") || s.includes("hiring") || s.includes("layoff")) return "talent-pulse";
  if (s.includes("who are you") || s.includes("experience") || s.includes("resume") || s.includes("venkatesh")) return "about";
  return "web";
}

