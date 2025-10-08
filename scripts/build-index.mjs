import fs from 'node:fs/promises';
import path from 'node:path';

const OPENAI_URL = 'https://api.openai.com/v1/embeddings';
const MODEL = 'text-embedding-3-small';

function chunk(md, size = 900) {
  const parts = md.split(/\n(?=# |\*\*|## |- |\d+\. )/);
  const chunks = [];
  let buf = '';
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

async function embed(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');
  const r = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, input: text }),
  });
  if (!r.ok) throw new Error(`Embedding failed ${r.status}`);
  const j = await r.json();
  return j.data[0].embedding;
}

async function main() {
  const base = process.cwd();
  const files = [
    path.join(base, 'content', 'resume.md'),
    path.join(base, 'content', 'case-studies', 'ai-job-market.md'),
  ];
  const docs = [];
  for (const f of files) {
    try {
      const txt = await fs.readFile(f, 'utf-8');
      docs.push({ source: path.relative(base, f), text: txt });
    } catch {}
  }
  if (!docs.length) {
    console.error('No docs found in content/.');
    process.exit(1);
  }

  const vectors = [];
  for (const d of docs) {
    const parts = chunk(d.text);
    let i = 0;
    for (const c of parts) {
      const emb = await embed(c);
      vectors.push({ id: `${d.source}#${i}`, source: d.source, chunkIndex: i, text: c, embedding: emb });
      i++;
    }
  }

  const outDir = path.join(base, 'data');
  await fs.mkdir(outDir, { recursive: true });
  const out = {
    createdAt: new Date().toISOString(),
    model: MODEL,
    dimensions: vectors[0]?.embedding?.length || 0,
    vectors,
  };
  await fs.writeFile(path.join(outDir, 'index.json'), JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Indexed ${vectors.length} chunks -> data/index.json`);
}

main().catch(err => { console.error(err); process.exit(1); });

