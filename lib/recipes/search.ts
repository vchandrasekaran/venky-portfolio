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
  const userProteins = normalizedUser.filter(isProtein);

  const scored: SearchResult[] = [];

  const matchesIngredient = (ingNorm: string) => {
    for (const userTerm of normalizedUser) {
      const short = userTerm.length < 3;
      if (!userTerm) continue;
      if (ingNorm === userTerm) return userTerm;
      if (!short && (ingNorm.includes(userTerm) || userTerm.includes(ingNorm))) return userTerm;
    }
    return null;
  };

  for (const rec of recipes) {
    const matched: string[] = [];
    const recipeProteins: string[] = [];

    for (const ing of rec.ingredients) {
      const ingNorm = normalizeIngredient(ing);
      const hit = matchesIngredient(ingNorm);
      if (hit) {
        matched.push(hit);
      }
      const prot = isProtein(ingNorm);
      if (prot) recipeProteins.push(prot);
    }

    if (!matched.length) continue;
    const matchedSet = new Set(matched);

    // Score by how much of the user's list we cover first, then by match depth,
    // then lightly by recipe length (favor concise ingredient lists).
    const matchedUserCount = matchedSet.size;
    const coverage = matchedUserCount / Math.max(normalizedUser.length, 1);
    const depth = matched.length;
    const conciseness = matched.length / Math.max(rec.ingredients.length, 1);

    // Protein awareness: prefer recipes whose primary protein matches the user's,
    // penalize if the primary protein is different.
    const titleProtein = isProtein(normalizeIngredient(rec.title));
    const recipeProteinSet = new Set(recipeProteins);
    const primaryRecipeProtein = titleProtein || recipeProteins[0] || null;
    const primaryUserProtein = userProteins[0] || null;

    const proteinMatchesUser =
      (primaryRecipeProtein && primaryUserProtein && primaryRecipeProtein === primaryUserProtein) ||
      (primaryUserProtein ? recipeProteinSet.has(primaryUserProtein) : false);
    const proteinConflicts =
      primaryUserProtein && primaryRecipeProtein && primaryRecipeProtein !== primaryUserProtein && recipeProteinSet.size > 0;

    let score = coverage * 3 + depth * 0.75 + conciseness * 0.5;
    if (proteinMatchesUser) score += 2.5;
    if (proteinConflicts) score -= 3;

    scored.push({ recipe: rec, score, matchedIngredients: matched });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

const proteinKeywords = [
  "chicken",
  "beef",
  "pork",
  "lamb",
  "turkey",
  "duck",
  "ham",
  "bacon",
  "sausage",
  "fish",
  "salmon",
  "tuna",
  "cod",
  "tilapia",
  "mahi",
  "snapper",
  "shrimp",
  "prawn",
  "lobster",
  "crab",
  "scallop",
  "mussel",
  "clam"
];

function isProtein(text: string): string | null {
  for (const key of proteinKeywords) {
    if (text.includes(key)) return key;
  }
  return null;
}
