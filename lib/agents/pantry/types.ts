export type PantryDifficulty = "easy" | "medium" | "hard";

export type PantryStep = {
  index: number;
  instruction: string;
};

export type PantryRecipe = {
  id: string;
  title: string;
  timeMinutes: number;
  difficulty: PantryDifficulty;
  servings: number;
  usesIngredients: string[];
  missingButOptional: string[];
  steps: PantryStep[];
  note?: string;
  extraNeeded?: string[];
};

export type PantryPlanRequest = {
  ingredients: string[];
};

export type PantryGuideRequest = {
  recipe: PantryRecipe;
  currentStepIndex: number;
};
