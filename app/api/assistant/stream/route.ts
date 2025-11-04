import { NextResponse } from 'next/server'
import { suggestNav } from '@/lib/assistant/nav'
import { searchNav } from '@/lib/assistant/navSearch'
import { siteMap } from '@/lib/assistant/sitemap'
import { retrieveKnowledge, summarizeChunks } from '@/lib/assistant/retrieval'

export const runtime = 'nodejs'

function systemPrompt() {
  return [
    'You are Venkatesh\'s conversational portfolio guide and BI copilot.',
    'Tone: warm, concise, helpful. Keep replies under ~120 words unless asked for detail.',
    'Knowledge: Use ONLY the provided Context and the known site routes. Do not invent facts.',
    'Citations: When you quote or summarize from Context, add (Source: filename) at the end.',
    'Navigation: If the user intent implies going somewhere, mention the likely destination in one short line like "Navigation: Projects" — UI chips will also appear.',
    'If unsure, say you don\'t have that in the docs yet and suggest a nearby topic.'
  ].join(' ')
}

export async function POST(req: Request) {
  const { question } = await req.json().catch(() => ({ question: '' }))
  if (!question || question.trim().length < 3) {
    return NextResponse.json({ error: 'question_too_short' }, { status: 400 })
  }
  const groqKey = process.env.GROQ_API_KEY || ''
  const base = process.cwd()
  const { chunks, context, sources } = await retrieveKnowledge(question, base, 4)
  const fallbackAnswer = summarizeChunks(question, chunks)

  const routes = siteMap().map(r => `- ${r.label} -> ${r.path}${r.hash ?? ''}`).join('\n')
  const prompt = systemPrompt() + `\n\nAvailable Routes (for navigation hints):\n${routes}\n\nContext:\n${context}\n\nUser question: ${question}`

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Navigation suggestions (rules + fuzzy search over site map)
      const rule = suggestNav(question)
      const fuzzy = searchNav(question, 3)
      controller.enqueue(encoder.encode(`META ${JSON.stringify({ sources, nav: rule, navList: fuzzy })}\n`))
      const streamFallback = () => {
        if (fallbackAnswer) controller.enqueue(encoder.encode(fallbackAnswer))
      }
      if (!groqKey) {
        streamFallback()
        controller.close()
        return
      }
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
        let emitted = false
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
              if (delta) {
                controller.enqueue(encoder.encode(delta))
                emitted = true
              }
            } catch {}
          }
        }
        if (!emitted) streamFallback()
      } catch (e) {
        streamFallback()
      } finally {
        controller.close()
      }
    }
  })

  return new NextResponse(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
