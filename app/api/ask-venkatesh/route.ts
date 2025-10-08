import { NextResponse } from "next/server";
export const runtime = 'nodejs';
import fs from "node:fs/promises";
import path from "node:path";

// quick keyword-based scorer for small docs
function scoreChunk(q: string, text: string) {
  const qWords = q.toLowerCase().split(/\W+/).filter(Boolean);
  const t = text.toLowerCase();
  let hits = 0;
  for (const w of qWords) if (t.includes(w)) hits++;
  // prefer concise chunks when hits are equal
  return hits * 100 - Math.round(text.length / 300);
}

async function loadDocs() {
  const base = process.cwd();
  const files = [
    path.join(base, "content", "resume.md"),
    path.join(base, "content", "case-studies", "ai-job-market.md"),
    // add more files here as you create them
  ];
  const docs: { source: string; text: string }[] = [];
  for (const f of files) {
    try {
      const txt = await fs.readFile(f, "utf-8");
      docs.push({ source: path.relative(base, f), text: txt });
    } catch {}
  }
  return docs;
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

export async function POST(req: Request) {
  const { question } = await req.json();
  if (!question || question.trim().length < 3) {
    return NextResponse.json({
      answer: "Ask me about my experience, projects, or tools.",
      sources: [],
    });
  }

  const docs = await loadDocs();
  let candidates: { source: string; text: string; score: number }[] = [];
  for (const d of docs) for (const c of chunk(d.text))
    candidates.push({ source: d.source, text: c, score: scoreChunk(question, c) });

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, 3);

  const answer = top.length
    ? "Here’s what I found:\n\n" +
      top.map(t => "- " + t.text.split("\n").slice(0, 6).join(" ").slice(0, 350) + "…").join("\n\n")
    : "I couldn’t find that in my docs yet. Try asking about my experience, tools, or the AI Job Market project.";

  return NextResponse.json({
    answer,
    sources: top.map(t => ({ source: t.source })),
  });
}
