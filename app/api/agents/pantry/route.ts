export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { normalizeIngredient, searchRecipesByIngredients } from "@/lib/recipes/search";
import type { PantryRecipe, PantryStep } from "@/lib/agents/pantry/types";

const PANTRY_AGENT_URL = process.env.ADK_PANTRY_URL ?? "http://127.0.0.1:8787/pantry";

type PantryMode = "plan" | "guide";

type PantryAgentEntry = {
  id: string;
  reason?: string;
  additionalNeeded?: string[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode: PantryMode = body?.mode === "guide" ? "guide" : "plan";

    if (mode === "plan") {
      const ingredients = Array.isArray(body?.ingredients)
        ? body.ingredients.map((i: string) => String(i || "").trim()).filter(Boolean)
        : [];

      if (!ingredients.length) {
        return NextResponse.json({ error: "Add at least one ingredient." }, { status: 400 });
      }

      const data = await planWithPantryAgent(ingredients);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Guide mode is not implemented yet." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

async function planWithPantryAgent(ingredients: string[]) {
  const normalizedUser = ingredients.map(normalizeIngredient).filter(Boolean);
  const userSet = new Set(normalizedUser);
  const matches = searchRecipesByIngredients(ingredients, 10);
  if (!matches.length) {
    return { exactMatches: [], alternatives: [] };
  }

  const candidateMeta = matches.map((match) => {
    const normalizedRecipeIngredients = match.recipe.ingredients.map(normalizeIngredient);
    const missingNormalized = normalizedRecipeIngredients.filter((norm) => !userSet.has(norm));
    const limitedInstructions = match.recipe.instructions.slice(0, 6);
    const limitedIngredients = match.recipe.ingredients.slice(0, 15);

    return {
      id: match.recipe.id,
      match,
      normalizedRecipeIngredients,
      missingNormalized,
      contextPayload: {
        id: match.recipe.id,
        title: match.recipe.title,
        matchedIngredients: match.matchedIngredients,
        missingIngredients: missingNormalized,
        matchScore: Number(match.score.toFixed(4)),
        ingredients: limitedIngredients,
        instructions: limitedInstructions,
      },
    };
  });

  const contextPayload = {
    userIngredients: normalizedUser,
    candidates: candidateMeta.map((meta) => meta.contextPayload),
  };

  const response = await fetch(PANTRY_AGENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients: normalizedUser,
      context: JSON.stringify(contextPayload),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.detail || data?.error || "Pantry agent error.");
  }

  const metaMap = new Map(candidateMeta.map((meta) => [meta.id, meta]));

  const toRecipe = (entry: PantryAgentEntry, bucket: "exact" | "alternative"): PantryRecipe | null => {
    if (!entry?.id) return null;
    const meta = metaMap.get(entry.id);
    if (!meta) return null;

    const { match, missingNormalized, normalizedRecipeIngredients } = meta;
    const { recipe } = match;

    const steps: PantryStep[] = recipe.instructions.map((instruction, index) => ({
      index,
      instruction,
    }));

    const usesIngredients = recipe.ingredients.filter((ing) => userSet.has(normalizeIngredient(ing)));
    const missingIngredients = recipe.ingredients.filter((ing, idx) => {
      const norm = normalizedRecipeIngredients[idx];
      return missingNormalized.includes(norm);
    });

    const extraNeeded = entry.additionalNeeded?.filter(Boolean) ?? missingIngredients;

    return {
      id: recipe.id,
      title: recipe.title,
      timeMinutes: 30,
      difficulty: "easy",
      servings: 2,
      usesIngredients,
      missingButOptional: missingIngredients,
      steps,
      note: entry.reason,
      extraNeeded,
    };
  };

  const exactMatches: PantryRecipe[] = (data?.exactMatches || [])
    .map((entry: PantryAgentEntry) => toRecipe(entry, "exact"))
    .filter(Boolean) as PantryRecipe[];

  const alternatives: PantryRecipe[] = (data?.alternativeMatches || [])
    .map((entry: PantryAgentEntry) => toRecipe(entry, "alternative"))
    .filter(Boolean) as PantryRecipe[];

  return { exactMatches, alternatives };
}
