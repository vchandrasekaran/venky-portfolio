export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { helpResponse, retrieveKnowledge, summarizeChunks } from "@/lib/assistant/retrieval";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages (array) is required" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
    const question = lastUser?.content?.trim() ?? "";
    if (!question) {
      return NextResponse.json({ error: "A user question is required." }, { status: 400 });
    }

    const normalized = question.toLowerCase();
    if (["help", "what can you answer", "what can you do"].includes(normalized)) {
      return NextResponse.json({ answer: helpResponse() });
    }

    const { chunks, sources } = await retrieveKnowledge(question, process.cwd(), 4);
    const answer = summarizeChunks(question, chunks);
    return NextResponse.json({ answer, sources });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
