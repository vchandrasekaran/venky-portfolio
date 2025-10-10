import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { suggestNav } from '@/lib/assistant/nav'
import { searchNav } from '@/lib/assistant/navSearch'

export const runtime = 'nodejs'

type Chunk = { id: string; source: string; chunkIndex: number; text: string }

// simple keyword scoring
function scoreChunk(q: string, text: string) {
  const qWords = q.toLowerCase().split(/\W+/).filter(Boolean)
  const t = text.toLowerCase()
  let hits = 0
  for (const w of qWords) if (t.includes(w)) hits++
  return hits * 100 - Math.round(Math.min(text.length, 1800) / 300)
}

// chunking like the indexer
function chunk(md: string, size = 900) {
  const parts = md.split(/\n(?=# |\*\*|## |- |\d+\. )/)
  const chunks: string[] = []
  let buf = ''
  for (const p of parts) {
    if ((buf + "\n" + p).length > size) { if (buf) chunks.push(buf.trim()); buf = p } else { buf += "\n" + p }
  }
  if (buf) chunks.push(buf.trim())
  return chunks.filter(Boolean)
}

function systemPrompt() {
  return (
    'You are Venkatesh\'s BI assistant. Answer clearly and concisely. ' +
    'Use the provided context verbatim where relevant. Cite sources by file name at the end. ' +
    'If unsure, say you do not have that in the docs yet.'
  )
}

async function loadIndex(base: string) {
  try {
    const p = path.join(base, 'data', 'index.json')
    const txt = await fs.readFile(p, 'utf-8')
    const j = JSON.parse(txt) as { chunks: Chunk[] }
    return j.chunks
  } catch {
    return null
  }
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

async function naiveDocs(base: string) {
  // Include all markdown-like content under content/ plus key app pages
  const contentDir = path.join(base, 'content')
  const mdFiles = (await walk(contentDir)).filter(f => /\.(md|mdx|txt)$/i.test(f))
  const appPages = [
    path.join(base, 'app', 'page.tsx'),
    path.join(base, 'app', 'experience', 'page.tsx'),
    path.join(base, 'app', 'projects', 'page.tsx'),
    path.join(base, 'app', 'sports', 'page.tsx'),
    path.join(base, 'app', 'contact', 'page.tsx'),
  ]
  const files = [...mdFiles, ...appPages]
  const out: { source: string; text: string }[] = []
  for (const f of files) {
    try { out.push({ source: path.relative(base, f), text: await fs.readFile(f, 'utf-8') }) } catch {}
  }
  return out
}

export async function POST(req: Request) {
  const { question } = await req.json().catch(() => ({ question: '' }))
  if (!question || question.trim().length < 3) {
    return NextResponse.json({ error: 'question_too_short' }, { status: 400 })
  }
  const groqKey = process.env.GROQ_API_KEY || ''
  if (!groqKey) {
    return NextResponse.json({ error: 'missing_groq_key' }, { status: 400 })
  }
  const base = process.cwd()
  const preChunks = await loadIndex(base)
  let context = ''
  let sources: { source: string }[] = []

  if (preChunks && preChunks.length) {
    const scored = preChunks.map(c => ({ c, score: scoreChunk(question, c.text) })).sort((a,b)=> b.score - a.score)
    const top = scored.slice(0,3).map(s => s.c)
    context = top.map(c => `Source: ${c.source}\n${c.text}`).join('\n\n')
    sources = top.map(c => ({ source: c.source }))
  } else {
    // Fallback: naive keyword search
    const docs = await naiveDocs(base)
    const cands: { source: string; text: string; score: number }[] = []
    for (const d of docs) for (const c of chunk(d.text)) cands.push({ source: d.source, text: c, score: scoreChunk(question, c) })
    cands.sort((a,b)=> b.score - a.score)
    const top = cands.slice(0,3)
    context = top.map(t=>`Source: ${t.source}\n${t.text}`).join('\n\n')
    sources = top.map(t=>({ source: t.source }))
  }

  const prompt = systemPrompt() + `\n\nContext:\n${context}\n\nUser question: ${question}`

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Navigation suggestions (rules + fuzzy search over site map)
      const rule = suggestNav(question)
      const fuzzy = searchNav(question, 3)
      controller.enqueue(encoder.encode(`META ${JSON.stringify({ sources, nav: rule, navList: fuzzy })}\n`))
      try {
        const url = 'https://api.groq.com/openai/v1/chat/completions'
        const auth = groqKey
        const model = 'llama-3.1-70b-versatile'
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth}` },
          body: JSON.stringify({
            model,
            messages: [ { role: 'system', content: systemPrompt() }, { role: 'user', content: prompt } ],
            temperature: 0.2,
            stream: true,
          })
        })
        if (!r.ok || !r.body) throw new Error('openai_failed')
        const reader = r.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffered = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffered += decoder.decode(value, { stream: true })
          const lines = buffered.split('\n')
          buffered = lines.pop() || ''
          for (const line of lines) {
            const s = line.trim()
            if (!s.startsWith('data:')) continue
            const data = s.replace(/^data:\s*/, '')
            if (data === '[DONE]') break
            try {
              const j = JSON.parse(data)
              const delta = j.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {}
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode('\n(Assistant encountered a network error)'))
      } finally {
        controller.close()
      }
    }
  })

  return new NextResponse(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
