import json
import os
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.adk.agents import Agent
from google.adk.models.google_llm import Gemini
from google.adk.runners import InMemoryRunner
from google.genai import types
from google.adk.tools import google_search
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
    description="Conversational assistant for Venky and general questions.",
    instruction=(
        "You are a helpful, conversational assistant for Venky's portfolio website. "
        "You are given optional context chunks from the website. "
        "1) ALWAYS prefer answering directly from that context if it clearly contains the answer. "
        "2) If the context does not contain the answer and the question is about general knowledge, current events, "
        "or anything unrelated to Venky, you MUST invoke the Google Search tool and answer using those results. "
        "3) Only say 'I don't have that knowledge yet based on this website's content, but I'll soon be able to help.' "
        "when both the site context and Google Search fail to provide a clear answer. "
        "Keep answers concise and friendly."
    ),
    tools=[google_search],
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
app = FastAPI()


class ChatMessage(BaseModel):
    role: str
    content: str


class AskIn(BaseModel):
    messages: list[ChatMessage]
    context: str | None = None


class PantryAsk(BaseModel):
    ingredients: list[str]
    context: str


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
        resp = await runner.run_debug(prompt)
        answer = getattr(resp, "final_response", None) or str(resp)
        return {"answer": answer}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/pantry")
async def pantry(payload: PantryAsk):
    try:
        prompt = build_pantry_prompt(payload)
        resp = await pantry_runner.run_debug(prompt)
        answer = getattr(resp, "final_response", None) or str(resp)
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
