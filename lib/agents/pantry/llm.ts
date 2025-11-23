import {
  PantryPlanRequest,
  PantryGuideRequest,
  PantryRecipe,
  PantryStep,
} from "./types";
import { searchRecipesByIngredients } from "@/lib/recipes/search";

export async function callPantryLLM(
  mode: "plan" | "guide",
  payload: PantryPlanRequest | PantryGuideRequest
) {
  if (mode === "plan") {
    return planFromDataset(payload as PantryPlanRequest);
  }

  if (mode === "guide") {
    return guideMock(payload as PantryGuideRequest);
  }

  throw new Error(`Unsupported pantry mode: ${mode}`);
}

async function planFromDataset(req: PantryPlanRequest): Promise<PantryRecipe[]> {
  const matches = searchRecipesByIngredients(req.ingredients, 3);
  if (!matches.length) return [];

  return matches.map((match) => {
    const base = match.recipe;

    const steps: PantryStep[] = base.instructions.map((instruction, index) => ({
      index,
      instruction,
    }));

    return {
      id: base.id,
      title: base.title,
      timeMinutes: 30,
      difficulty: "easy",
      servings: 2,
      usesIngredients: match.matchedIngredients,
      missingButOptional: base.ingredients.filter(
        (ingredient) => !match.matchedIngredients.includes(ingredient)
      ),
      steps,
    };
  });
}

async function guideMock(req: PantryGuideRequest) {
  const nextIndex = Math.min(req.currentStepIndex, req.recipe.steps.length - 1);
  const step = req.recipe.steps[nextIndex];

  return {
    currentStepIndex: nextIndex,
    step,
    modifiedRecipe: null,
  };
}
