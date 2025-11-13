import fs from "fs";
import path from "path";

type RagDoc = {
  id: string;
  source: string;
  text: string;
  embedding: number[];
};

type RagIndex = {
  docs: RagDoc[];
};

function loadIndex(): RagIndex {
  const p = path.join(process.cwd(), "public", "rag-index.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

export async function getTopKContext(question: string, k = 5): Promise<string> {
  const index = loadIndex();

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY missing");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: {
          parts: [{ text: question }],
        },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Query embedding failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  const qvec: number[] = data.embedding.values;

  const scored = index.docs
    .map((d) => ({
      ...d,
      score: cosine(d.embedding, qvec),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored
    .map((d) => `[${d.source} | ${d.id}]\n${d.text}`)
    .join("\n\n");
}
