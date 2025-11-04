import fs from 'node:fs/promises';
import path from 'node:path';

const CANDIDATES = [
  // Official demo mirrors
  'https://raw.githubusercontent.com/vrm-c/vrm.dev/main/packages/vrm/examples/models/vrm/AliciaSolid.vrm',
  'https://raw.githubusercontent.com/pixiv/three-vrm/v3.4.3/packages/three-vrm/examples/models/vrm/AliciaSolid.vrm',
  'https://raw.githubusercontent.com/pixiv/three-vrm/master/packages/three-vrm/examples/models/vrm/AliciaSolid.vrm',
  'https://pixiv.github.io/three-vrm/examples/models/vrm/AliciaSolid.vrm',
  'https://cdn.jsdelivr.net/gh/pixiv/three-vrm@master/packages/three-vrm/examples/models/vrm/AliciaSolid.vrm',
  'https://raw.githubusercontent.com/vrm-c/UniVRM/master/Assets/VRM/Examples/Models/Alicia/AliciaSolid.vrm',
  // Unpkg often succeeds behind stricter proxies
  'https://unpkg.com/@pixiv/three-vrm@3.4.3/examples/models/vrm/AliciaSolid.vrm'
];

async function tryFetch(url){
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) throw new Error('too small');
    return buf;
  } catch (e) { return null; }
}

async function main(){
  const base = process.cwd();
  const outDir = path.join(base, 'public', 'models');
  await fs.mkdir(outDir, { recursive: true });
  let buf = null, used = null;
  for (const u of CANDIDATES){
    buf = await tryFetch(u);
    if (buf) { used = u; break; }
  }
  if (!buf) {
    console.error('Failed to fetch AliciaSolid.vrm from known mirrors.');
    console.error('Please download manually and place at public/models/avatar.vrm');
    console.error('Mirror 1: https://pixiv.github.io/three-vrm/examples/models/vrm/AliciaSolid.vrm');
    process.exit(1);
  }
  const out = path.join(outDir, 'avatar.vrm');
  await fs.writeFile(out, buf);
  console.log(`Saved VRM to ${out}`);
  console.log(`Source: ${used}`);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
