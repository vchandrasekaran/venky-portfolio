import fs from "node:fs/promises";
import path from "node:path";

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

function scoreChunk(question: string, text: string) {
  const qWords = question.toLowerCase().split(/\W+/).filter(Boolean);
  const t = text.toLowerCase();
  let hits = 0;
  for (const w of qWords) if (t.includes(w)) hits++;
  return hits * 120 - Math.round(Math.min(text.length, 2000) / 280);
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

async function loadIndex(baseDir: string) {
  if (cachedChunks && cachedBase === baseDir) return cachedChunks;
  try {
    const file = await fs.readFile(path.join(baseDir, "data", "index.json"), "utf-8");
    const parsed = JSON.parse(file) as { chunks?: RawChunk[] };
    cachedChunks = Array.isArray(parsed.chunks) ? parsed.chunks : null;
    cachedBase = baseDir;
  } catch {
    cachedChunks = null;
  }
  return cachedChunks;
}

async function naiveDocs(baseDir: string) {
  const contentDir = path.join(baseDir, "content");
  const mdFiles = (await walk(contentDir)).filter((f) => /\.(md|mdx|txt)$/i.test(f));
  const appPages = [
    path.join(baseDir, "app", "page.tsx"),
    path.join(baseDir, "app", "experience", "page.tsx"),
    path.join(baseDir, "app", "projects", "page.tsx"),
    path.join(baseDir, "app", "sports", "page.tsx"),
    path.join(baseDir, "app", "contact", "page.tsx"),
  ];
  const files = [...mdFiles, ...appPages];
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
  return docs;
}

export async function retrieveKnowledge(question: string, baseDir = process.cwd(), limit = 3) {
  const q = question.trim();
  if (!q) return { chunks: [] as KnowledgeChunk[], context: "", sources: [] as { source: string }[] };

  const index = await loadIndex(baseDir);
  let candidates: KnowledgeChunk[] = [];
  if (index && index.length) {
    candidates = index.map((c) => ({ ...c, score: scoreChunk(q, c.text) }));
  } else {
    const docs = await naiveDocs(baseDir);
    candidates = docs.map((c) => ({ ...c, score: scoreChunk(q, c.text) }));
  }

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, limit);
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
    return "I looked through the portfolio docs but could not find that yet. Try asking about projects, experience, skills, or say \"help\" for suggestions.";
  }
  const topic = question.trim() ? `"${question.trim()}"` : "this topic";
  const lines = chunks.map((chunk) => {
    const snippet = pickSnippet(chunk.text);
    const sentence = snippet.endsWith(".") ? snippet : `${snippet}.`;
    return `- ${sentence} (Source: ${chunk.source})`; 
  });
  return `Here's what I found for ${topic}:\n\n${lines.join("\n")}\n\nNeed something else? Ask a follow-up or say \"help\" to see navigation options.`;
}
