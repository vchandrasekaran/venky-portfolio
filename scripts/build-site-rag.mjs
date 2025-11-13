import "dotenv/config";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_GLOBS = [
  "content/**/*.md",
  "data/**/*.ts",
  "app/**/*.tsx",
];

function chunk(text, max = 1200) {
  const lines = text.split(/\r?\n/);
  const chunks = [];
  let buf = [], len = 0;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (len + t.length > max) {
      chunks.push(buf.join("\n"));
      buf = [t];
      len = t.length;
    } else {
      buf.push(t);
      len += t.length;
    }
  }
  if (buf.length) chunks.push(buf.join("\n"));
  return chunks;
}

async function embedText(text) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY missing in .env");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: {
          parts: [{ text }],
        },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Embedding failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.embedding.values;
}

async function main() {
  const cwd = path.resolve(__dirname, "..");
  const files = (
    await Promise.all(SOURCE_GLOBS.map((g) => glob(g, { cwd })))
  ).flat();

  const docs = [];

  for (const rel of files) {
    const abs = path.join(cwd, rel);
    const raw = fs.readFileSync(abs, "utf8");
    let content = raw;

    if (rel.endsWith(".md")) {
      content = matter(raw).content;
    }

    const parts = chunk(content);
    parts.forEach((text, i) => {
      docs.push({ id: `${rel}#${i}`, source: rel, text });
    });
  }

  console.log(`Indexing ${docs.length} chunks…`);

  for (let i = 0; i < docs.length; i++) {
    docs[i].embedding = await embedText(docs[i].text);
    process.stdout.write(`Embedded ${i + 1}/${docs.length}\r`);
  }

  const outDir = path.join(cwd, "public");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "rag-index.json");
  fs.writeFileSync(outPath, JSON.stringify({ docs }, null, 2));

  console.log(`\n✅ Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
