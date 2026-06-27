import json
import os
import re
import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.adk.agents import Agent
from google.adk.models.google_llm import Gemini
from google.adk.runners import InMemoryRunner
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
assert GOOGLE_API_KEY, "GOOGLE_API_KEY not set in environment/.env"

retry_config = types.HttpRetryOptions(
    attempts=5,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)

root_agent = Agent(
    name="site_helper",
    model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
    description="Conversational assistant for Venky's portfolio website.",
    instruction=(
        "You are the conversational website guide for Venkatesh Naidu's portfolio. "
        "Answer only from the provided website context and the current conversation. "
        "Be direct, accurate, and conversational, like a strong portfolio walkthrough. "
        "When answering about a role, project, patent, or skill, include the specific outcomes, metrics, tools, "
        "and page details that are present in the website context. "
        "If the context includes bullet points for the relevant topic, use the strongest 2 or 3 bullets in your answer. "
        "Do not mention retrieval, context chunks, source files, ADK, Gemini, or implementation details. "
        "Do not use outside knowledge, search the web, or invent missing facts. "
        "If the website context does not contain the answer, say that plainly and offer the closest related website detail. "
        "Keep most answers to 2-5 sentences. Use bullets only when the user asks for a list or comparison."
    ),
)

pantry_agent = Agent(
    name="pantry_coach",
    model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
    description="Ingredient-constrained recipe planner for Pantry Coach.",
    instruction=(
        "You are the Pantry Coach agent. You receive JSON context with `userIngredients` and `candidates`. "
        "Each candidate contains: id, title, matchedIngredients, missingIngredients, ingredients, instructions, and matchScore. "
        "Strictly obey these rules:\n"
        "1) Return JSON ONLY, with keys `exactMatches` and `alternativeMatches`.\n"
        "2) An exact match MUST require only the user ingredients plus pantry staples (salt, pepper, oil, water). "
        "If extra ingredients are needed, classify it as an alternative.\n"
        "3) Alternatives should list the additional ingredients required.\n"
        "4) Each entry must include: `id`, `reason`, and `additionalNeeded` (array). "
        "Never invent recipe IDs or content beyond the provided candidates."
    ),
)

runner = InMemoryRunner(agent=root_agent)
pantry_runner = InMemoryRunner(agent=pantry_agent)
app = FastAPI(title="Venky Portfolio Agent Service")


class ChatMessage(BaseModel):
    role: str
    content: str


class AskIn(BaseModel):
    messages: list[ChatMessage]
    context: str | None = None


class PantryAsk(BaseModel):
    ingredients: list[str]
    context: str


@app.get("/")
async def root():
    return {
        "service": "venky-portfolio-agent",
        "status": "ok",
        "endpoints": ["/healthz", "/ask", "/pantry"],
    }


@app.get("/healthz")
async def healthz():
    return {
        "status": "ok",
        "google_api_key_configured": bool(GOOGLE_API_KEY),
    }


def build_prompt(messages: list[ChatMessage], context: str | None) -> str:
    parts = []
    if context:
        parts.append("Website context:\n" + context + "\n")

    parts.append("Conversation so far:")
    for m in messages:
        role = m.role.lower()
        prefix = "User" if role == "user" else "Assistant"
        parts.append(f"{prefix}: {m.content}")
    parts.append("Assistant:")
    return "\n".join(parts)


def build_pantry_prompt(payload: PantryAsk) -> str:
    return (
        "You are Pantry Coach.\n"
        f"User ingredients (normalized): {', '.join(payload.ingredients) or 'none'}\n"
        "Candidate recipes JSON:\n"
        f"{payload.context}\n"
        "Remember to obey the rules and respond with valid JSON."
    )


def extract_agent_answer(events) -> str:
    for event in reversed(events or []):
        error_message = getattr(event, "error_message", None)
        if error_message:
            raise RuntimeError(error_message)

        content = getattr(event, "content", None)
        parts = getattr(content, "parts", None) or []
        texts = [getattr(part, "text", "") for part in parts if getattr(part, "text", "")]
        if texts:
            return "\n".join(texts).strip()

    return ""


async def run_agent_prompt(active_runner: InMemoryRunner, prompt: str, session_prefix: str) -> str:
    session_id = f"{session_prefix}_{uuid.uuid4().hex}"
    events = await active_runner.run_debug(
        prompt,
        user_id="site_user",
        session_id=session_id,
        quiet=True,
    )
    return extract_agent_answer(events) or str(events)


def parse_agent_json(answer: str) -> dict:
    """Attempt to recover a JSON object from the agent response, even if it was wrapped in markdown."""

    def _try_load(candidate: str) -> dict:
        data = json.loads(candidate)
        if not isinstance(data, dict):
            raise ValueError("Pantry agent response is not a JSON object.")
        return data

    # Happy path: already valid JSON
    try:
        return _try_load(answer)
    except Exception:
        pass

    # Look for fenced code blocks like ```json {...}```
    fenced_blocks = re.findall(r"```(?:json)?\s*({.*?})\s*```", answer, flags=re.DOTALL)
    for block in fenced_blocks:
        try:
            return _try_load(block)
        except Exception:
            continue

    # As a last resort, grab the first {...} span
    start = answer.find("{")
    end = answer.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return _try_load(answer[start : end + 1])
        except Exception:
            pass

    raise json.JSONDecodeError("Could not parse JSON from agent response.", answer, 0)


@app.post("/ask")
async def ask(payload: AskIn):
    try:
        prompt = build_prompt(payload.messages, payload.context)
        answer = await run_agent_prompt(runner, prompt, "site")
        return {"answer": answer}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/pantry")
async def pantry(payload: PantryAsk):
    try:
        prompt = build_pantry_prompt(payload)
        answer = await run_agent_prompt(pantry_runner, prompt, "pantry")
        data = parse_agent_json(answer)
        return {
            "exactMatches": data.get("exactMatches", []),
            "alternativeMatches": data.get("alternativeMatches", []),
        }
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Pantry agent returned invalid JSON: {answer}",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
