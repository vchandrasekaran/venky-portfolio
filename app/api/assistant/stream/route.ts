import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Vector = { id: string; source: string; chunkIndex: number; text: string; embedding: number[] }

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { const x=a[i], y=b[i]; dot += x*y; na += x*x; nb += y*y }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8)
}

async function embed(text: string, apiKey: string) {
  const r = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
  })
  if (!r.ok) throw new Error('embedding_failed')
  const j = await r.json()
  return j.data[0].embedding as number[]
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
    const j = JSON.parse(txt) as { vectors: Vector[] }
    return j.vectors
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
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'missing_openai_key' }, { status: 400 })
  }
  const base = process.cwd()
  const vectors = await loadIndex(base)
  let context = ''
  let sources: { source: string }[] = []

  if (vectors && vectors.length) {
    const qEmb = await embed(question, apiKey)
    const scored = vectors.map(v => ({ v, score: cosine(qEmb, v.embedding) }))
      .sort((a,b)=> b.score - a.score)
    const top = scored.slice(0, 6)
    const chosen: Vector[] = []
    const seen = new Set<string>()
    for (const t of top) {
      if (!seen.has(t.v.source)) { chosen.push(t.v); seen.add(t.v.source) }
      if (chosen.length >= 3) break
    }
    context = chosen.map(c => `Source: ${c.source}\n${c.text}`).join('\n\n')
    sources = chosen.map(c => ({ source: c.source }))
  } else {
    // Fallback: naive keyword search
    const docs = await naiveDocs(base)
    const qWords = question.toLowerCase().split(/\W+/).filter(Boolean)
    const scored: { source: string; text: string; score: number }[] = []
    for (const d of docs) {
      const t = d.text.toLowerCase()
      let hits = 0; for (const w of qWords) if (t.includes(w)) hits++
      scored.push({ source: d.source, text: d.text, score: hits })
    }
    scored.sort((a,b)=> b.score - a.score)
    const top = scored.slice(0,2)
    context = top.map(t=>`Source: ${t.source}\n${t.text}`).join('\n\n')
    sources = top.map(t=>({ source: t.source }))
  }

  const prompt = systemPrompt() + `\n\nContext:\n${context}\n\nUser question: ${question}`

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Send META line first
      controller.enqueue(encoder.encode(`META ${JSON.stringify({ sources })}\n`))
      try {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
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
