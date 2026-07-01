import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const outputPath = resolve(root, 'public', 'og-image.png')
const avatarUrl = pathToFileURL(resolve(root, 'public', 'hero-3d-folded-cutout.png')).href
const tempDir = mkdtempSync(join(tmpdir(), 'portfolio-og-'))
const htmlPath = join(tempDir, 'og.html')
const htmlUrl = pathToFileURL(htmlPath).href

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #07090d;
        font-family: Manrope, Inter, Arial, sans-serif;
      }
      .canvas {
        position: relative;
        width: 1200px;
        height: 630px;
        overflow: hidden;
        color: #f8fafc;
        background:
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
          radial-gradient(circle at 72% 35%, rgba(56,189,248,0.28), transparent 28%),
          radial-gradient(circle at 36% 80%, rgba(139,92,246,0.18), transparent 26%),
          linear-gradient(180deg, #111722 0%, #07090d 100%);
        background-size: 80px 80px, 80px 80px, auto, auto, auto;
      }
      .topbar {
        position: absolute;
        inset: 0 0 auto 0;
        height: 8px;
        background: linear-gradient(90deg, #2563eb, #06b6d4 50%, #8b5cf6);
      }
      .ring {
        position: absolute;
        right: 110px;
        top: 72px;
        width: 620px;
        height: 620px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.11);
        background: rgba(255,255,255,0.035);
        box-shadow: inset 0 0 90px rgba(56,189,248,0.18);
      }
      .card {
        position: absolute;
        inset: 46px;
        border: 2px solid rgba(255,255,255,0.15);
        border-radius: 24px;
        background: linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025));
        box-shadow: 0 34px 90px rgba(0,0,0,0.48);
      }
      .avatar {
        position: absolute;
        right: 66px;
        bottom: -52px;
        width: 455px;
        z-index: 3;
        filter: drop-shadow(0 32px 42px rgba(0,0,0,0.72));
      }
      .tag {
        position: absolute;
        left: 90px;
        top: 82px;
        z-index: 4;
        padding: 17px 22px;
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 12px;
        background: rgba(0,0,0,0.48);
      }
      .tag .eyebrow {
        color: #06b6d4;
        font-family: "IBM Plex Mono", Consolas, monospace;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }
      .tag .label {
        margin-top: 8px;
        font-size: 25px;
        font-weight: 800;
      }
      .content {
        position: absolute;
        left: 90px;
        top: 212px;
        width: 690px;
        z-index: 4;
      }
      .kicker {
        color: #38bdf8;
        font-family: "IBM Plex Mono", Consolas, monospace;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.25em;
        text-transform: uppercase;
      }
      h1 {
        margin: 18px 0 0;
        font-size: 68px;
        line-height: 0.95;
        letter-spacing: -1px;
      }
      h1 span {
        display: block;
        color: #06b6d4;
      }
      .headline {
        margin-top: 16px;
        max-width: 610px;
        color: rgba(248,250,252,0.83);
        font-size: 28px;
        font-weight: 800;
        line-height: 1.16;
      }
      .stats {
        position: absolute;
        left: 90px;
        bottom: 46px;
        z-index: 5;
        display: flex;
        gap: 16px;
      }
      .stat {
        width: 184px;
        min-height: 84px;
        padding: 16px 18px;
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 12px;
        background: rgba(255,255,255,0.11);
        backdrop-filter: blur(12px);
      }
      .stat strong {
        display: block;
        font-size: 32px;
        line-height: 1;
      }
      .stat span {
        display: block;
        margin-top: 9px;
        color: rgba(248,250,252,0.78);
        font-family: "IBM Plex Mono", Consolas, monospace;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .fade {
        position: absolute;
        inset: auto 46px 46px 46px;
        height: 150px;
        z-index: 2;
        border-radius: 0 0 24px 24px;
        background: linear-gradient(180deg, transparent, rgba(7,9,13,0.82));
      }
    </style>
  </head>
  <body>
    <main class="canvas">
      <div class="topbar"></div>
      <div class="card"></div>
      <div class="ring"></div>
      <img class="avatar" src="${avatarUrl}" alt="" />
      <section class="tag">
        <div class="eyebrow">Portfolio</div>
        <div class="label">BI and data analytics portfolio</div>
      </section>
      <section class="content">
        <div class="kicker">Business Intelligence &amp; Data Analytics</div>
        <h1>Venkatesh <span>Naidu</span></h1>
        <div class="headline">Dashboards, Pipelines, and AI workflows that make data usable.</div>
      </section>
      <section class="stats" aria-hidden="true">
        <div class="stat"><strong>7+</strong><span>Years in analytics</span></div>
        <div class="stat"><strong>200+</strong><span>Dashboards consolidated</span></div>
        <div class="stat"><strong>22%</strong><span>Snowflake cost reduction</span></div>
      </section>
      <div class="fade"></div>
    </main>
  </body>
</html>`

writeFileSync(htmlPath, html)

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
]

const chromePath = chromePaths.find((path) => existsSync(path))

if (!chromePath) {
  throw new Error('Chrome was not found. Cannot render OpenGraph image.')
}

const result = spawnSync(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--window-size=1200,630',
  `--screenshot=${outputPath}`,
  htmlUrl
], {
  stdio: 'inherit'
})

rmSync(tempDir, { recursive: true, force: true })

if (result.status !== 0) {
  throw new Error(`Chrome failed to render OpenGraph image with exit code ${result.status}`)
}

console.log(`Rendered ${outputPath}`)
