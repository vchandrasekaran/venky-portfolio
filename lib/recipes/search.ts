import * as fs from "fs";
import * as path from "path";
import { RecipeRecord } from "./types";

let cachedRecipes: RecipeRecord[] | null = null;

function loadRecipes(): RecipeRecord[] {
  if (cachedRecipes) return cachedRecipes;

  const filePath = path.join(process.cwd(), "data", "recipes_index.json");
  const raw = fs.readFileSync(filePath, "utf8");
  cachedRecipes = JSON.parse(raw) as RecipeRecord[];
  return cachedRecipes;
}

export function normalizeIngredient(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type SearchResult = {
  recipe: RecipeRecord;
  score: number;
  matchedIngredients: string[];
};

export function searchRecipesByIngredients(
  userIngredients: string[],
  limit: number = 5
): SearchResult[] {
  const recipes = loadRecipes();

  const normalizedUser = userIngredients.map(normalizeIngredient).filter(Boolean);
  const userSet = new Set(normalizedUser);

  const scored: SearchResult[] = [];

  for (const rec of recipes) {
    const matched: string[] = [];

    for (const ing of rec.ingredients) {
      const ingNorm = normalizeIngredient(ing);
      if (userSet.has(ingNorm)) {
        matched.push(ingNorm);
      }
    }

    if (!matched.length) continue;

    const score = matched.length / Math.max(rec.ingredients.length, 1);
    scored.push({ recipe: rec, score, matchedIngredients: matched });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
