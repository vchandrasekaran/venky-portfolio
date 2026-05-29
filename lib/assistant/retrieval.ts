import fs from "node:fs/promises";
import path from "node:path";
import { PROJECTS } from "@/data/projects";

export type KnowledgeChunk = {
  id: string;
  source: string;
  chunkIndex: number;
  text: string;
  score: number;
};

type RawChunk = Omit<KnowledgeChunk, "score">;

let cachedChunks: RawChunk[] | null = null;
let cachedBase = "";
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
  "by",
  "do",
  "for",
  "from",
  "get",
  "has",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "so",
  "that",
  "the",
  "tell",
  "to",
  "us",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "you",
  "your"
]);

const SITE_GUIDE_DOCS: RawChunk[] = [
  {
    id: "site/home",
    source: "site/home",
    chunkIndex: 0,
    text:
      "The home page presents Venkatesh Naidu as a business intelligence and data analytics professional focused on trusted pipelines, clean dashboards, decision support, automation, and sports-tech ideas."
  },
  {
    id: "site/navigation",
    source: "site/navigation",
    chunkIndex: 0,
    text:
      "Main routes on the website are Home, Projects, Experience, Sports, and Contact. Project detail pages include Trucklexa, Pantry Coach, Team Analyst Raiders, Smart Paddle Sensing, and Text to SQL with Snowflake and Cortex."
  },
  {
    id: "site/experience",
    source: "site/experience",
    chunkIndex: 0,
    text:
      "The experience page summarizes roles at Truckstop.com across BI Analyst and SDET positions, earlier work at Amazon.com, education at Illinois Institute of Technology and New Horizon College of Engineering, plus sports and media milestones."
  },
  {
    id: "site/sports",
    source: "site/sports",
    chunkIndex: 0,
    text:
      "The sports page is a visual gallery across pickleball, cricket, and soccer. It highlights competition, coaching, travel, community work, and media content."
  },
  {
    id: "site/contact",
    source: "site/contact",
    chunkIndex: 0,
    text:
      "The contact page lists direct ways to reach Venky and Venkatesh Naidu, including email at venkateshkishan11@gmail.com, LinkedIn at linkedin.com/in/venkateshnaidu, a DUPR profile, and Instagram at @venky_6. It invites outreach for BI roles, analytics consulting, sports-tech ideas, and project discussions."
  }
];

function scoreChunk(question: string, text: string) {
  const qWords = question
    .toLowerCase()
    .split(/[^a-z0-9+./-]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  if (!qWords.length) return 0;

  const qText = question.trim().toLowerCase();
  const t = text.toLowerCase();
  let hits = 0;
  for (const w of qWords) if (t.includes(w)) hits += w.length >= 6 ? 2 : 1;

  const phraseBonus = qText.length >= 8 && t.includes(qText) ? 140 : 0;
  return hits * 90 + phraseBonus - Math.round(Math.min(text.length, 2200) / 320);
}

function chunk(md: string, size = 900) {
  const parts = md.split(/\n(?=# |\*\*|## |- |\d+\. )/);
  const chunks: string[] = [];
  let buf = "";
  for (const p of parts) {
    if ((buf + "\n" + p).length > size) {
      if (buf) chunks.push(buf.trim());
      buf = p;
    } else {
      buf += "\n" + p;
    }
  }
  if (buf) chunks.push(buf.trim());
  return chunks.filter(Boolean);
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function buildProjectDocs() {
  return PROJECTS.map((project, index) => ({
    id: `project:${project.id}`,
    source: `projects/${project.id}`,
    chunkIndex: index,
    text: `${project.title}. ${project.desc} Status: ${project.status}. Tag: ${project.tag}. Highlights: ${project.highlights.join(
      " "
    )}`
  }));
}

async function loadContentDocs(baseDir: string) {
  if (cachedChunks && cachedBase === baseDir) return cachedChunks;
  const contentDir = path.join(baseDir, "content");
  const mdFiles = (await walk(contentDir)).filter((f) => /\.(md|mdx|txt)$/i.test(f));
  const files = [...mdFiles];
  const docs: RawChunk[] = [];
  for (const file of files) {
    try {
      const text = await fs.readFile(file, "utf-8");
      const rel = path.relative(baseDir, file);
      const parts = chunk(text);
      parts.forEach((part, idx) => {
        docs.push({ id: `${rel}#${idx}`, source: rel, chunkIndex: idx, text: part });
      });
    } catch {
      // ignore missing files
    }
  }
  cachedChunks = [...SITE_GUIDE_DOCS, ...buildProjectDocs(), ...docs];
  cachedBase = baseDir;
  return cachedChunks;
}

export async function retrieveKnowledge(question: string, baseDir = process.cwd(), limit = 3) {
  const q = question.trim();
  if (!q) return { chunks: [] as KnowledgeChunk[], context: "", sources: [] as { source: string }[] };

  const docs = await loadContentDocs(baseDir);
  let candidates: KnowledgeChunk[] = docs.map((c) => ({ ...c, score: scoreChunk(q, c.text) }));

  candidates = candidates.filter((candidate) => candidate.score > 0);
  candidates.sort((a, b) => b.score - a.score);
  const bestScore = candidates[0]?.score ?? 0;
  const minScore = Math.max(100, Math.round(bestScore * 0.7));
  const top = candidates.filter((candidate) => candidate.score >= minScore).slice(0, limit);
  const context = top.map((c) => `Source: ${c.source}\n${c.text}`).join("\n\n");
  const sources = top.map((c) => ({ source: c.source }));
  return { chunks: top, context, sources };
}

function pickSnippet(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const snippet = sentences.slice(0, 2).join(" ");
  const trimmed = snippet || clean.slice(0, 180);
  return trimmed.length > 320 ? `${trimmed.slice(0, 317)}...` : trimmed;
}

export function summarizeChunks(question: string, chunks: KnowledgeChunk[]) {
  if (!chunks.length) {
    return 'I can only answer from content published on this website. I could not find that in the portfolio pages or written case studies yet. Try asking about projects, experience, sports, contact details, or say "help" for suggestions.';
  }
  const topic = question.trim() ? `"${question.trim()}"` : "this topic";
  const lines = chunks.map((chunk) => {
    const snippet = pickSnippet(chunk.text);
    const sentence = snippet.endsWith(".") ? snippet : `${snippet}.`;
    return `- ${sentence} (Source: ${chunk.source})`;
  });
  return `I can only answer from content published on this website. Here's what I found for ${topic}:\n\n${lines.join(
    "\n"
  )}\n\nNeed something else? Ask a follow-up about the portfolio, or say "help" to see example questions.`;
}

export function helpResponse() {
  return [
    "I can answer only from the content on this website.",
    "",
    "Try questions like:",
    "- What projects are featured on the site?",
    "- What was Venky's role at Truckstop.com?",
    "- How can I contact Venky?",
    "- What sports are covered in the gallery?",
    "- Tell me about Team Analyst Raiders.",
    "- What does the Text to SQL project do?"
  ].join("\n");
}
