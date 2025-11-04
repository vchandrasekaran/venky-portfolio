import { NextResponse } from "next/server";
export const runtime = 'nodejs';
import { retrieveKnowledge, summarizeChunks } from "@/lib/assistant/retrieval";

const SIMPLE_REPLIES: { test: RegExp; answer: string }[] = [
  {
    test: /\b(hi|hello|hey|hola|howdy)\b/,
    answer: "Hey there! I'm Venkatesh's portfolio assistant. Ask me about his projects, experience, or the stack he uses."
  },
  {
    test: /\b(who( are| are you| r you| are u| r u)|your name|what are you)\b/,
    answer: "I'm Ares, the AI copilot for Venkatesh Naidu's BI portfolio. I can walk you through his highlights, metrics work, and toolchain."
  },
  {
    test: /\b(thank(s| you)|appreciate|cheers)\b/,
    answer: "Happy to help! If you want to keep exploring, ask about projects, dashboards, or the AI Talent Pulse case study."
  },
  {
    test: /\b(help|what can you do|options|capabilities|commands)\b/,
    answer: "Try questions like: \"Show me his Snowflake work\", \"Summarize AI Talent Pulse\", or \"What tools does Venkatesh use?\" I can also jump you to sections of the site."
  }
];

export async function POST(req: Request) {
  const { question } = await req.json();
  if (!question || question.trim().length < 3) {
    return NextResponse.json({
      answer: "Ask me about my experience, projects, or tools.",
      sources: [],
    });
  }

  const normalized = question.trim().toLowerCase();
  for (const rule of SIMPLE_REPLIES) {
    if (rule.test.test(normalized)) {
      return NextResponse.json({ answer: rule.answer, sources: [] });
    }
  }

  const { chunks } = await retrieveKnowledge(question, process.cwd(), 4);
  const answer = summarizeChunks(question, chunks);

  return NextResponse.json({
    answer,
    sources: chunks.map((c) => ({ source: c.source })),
  });
}
