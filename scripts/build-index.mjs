import fs from 'node:fs/promises';
import path from 'node:path';

// No external embeddings. We precompute chunks for fast keyword retrieval.

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

// (legacy embedding code removed)

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function readIfExists(file) {
  try { return await fs.readFile(file, 'utf-8'); } catch { return null }
}

async function main() {
  const base = process.cwd();
  // 1) Ingest all markdown-like content under content/
  const contentDir = path.join(base, 'content');
  const all = (await walk(contentDir)).filter(f => /\.(md|mdx|txt)$/i.test(f));
  // 2) Add selected app pages that contain portfolio narrative text
  const extraFiles = [
    path.join(base, 'app', 'page.tsx'),
    path.join(base, 'app', 'experience', 'page.tsx'),
    path.join(base, 'app', 'projects', 'page.tsx'),
    path.join(base, 'app', 'sports', 'page.tsx'),
    path.join(base, 'app', 'contact', 'page.tsx'),
  ];
  const files = [...all, ...extraFiles];

  const docs = [];
  for (const f of files) {
    const txt = await readIfExists(f);
    if (!txt) continue;
    docs.push({ source: path.relative(base, f), text: txt });
  }
  if (!docs.length) {
    console.error('No docs found in content/.');
    process.exit(1);
  }

  const chunks = [];
  for (const d of docs) {
    const parts = chunk(d.text);
    let i = 0;
    for (const c of parts) {
      chunks.push({ id: `${d.source}#${i}`, source: d.source, chunkIndex: i, text: c });
      i++;
    }
  }

  const outDir = path.join(base, 'data');
  await fs.mkdir(outDir, { recursive: true });
  const out = { createdAt: new Date().toISOString(), model: 'local-chunks', chunks };
  await fs.writeFile(path.join(outDir, 'index.json'), JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Indexed ${chunks.length} chunks -> data/index.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
