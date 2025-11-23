"use client";

import { useState } from "react";
import type { PantryRecipe } from "@/lib/agents/pantry/types";

function parseList(text: string) {
  return text
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PantryCoachPage() {
  const [baseInputs, setBaseInputs] = useState<string[]>(["chicken", "onion", "garlic", "lemon", "rice"]);
  const [additionalInput, setAdditionalInput] = useState("");
  const [exactMatches, setExactMatches] = useState<PantryRecipe[]>([]);
  const [alternatives, setAlternatives] = useState<PantryRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    const primary = baseInputs.map((item) => item.trim()).filter(Boolean);
    const extras = parseList(additionalInput);
    const ingredients = [...primary, ...extras];

    if (!ingredients.length) {
      setError("Add at least one ingredient.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agents/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "plan", ingredients }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Unable to plan recipes right now.");
        setExactMatches([]);
        setAlternatives([]);
      } else {
        const exact = data.exactMatches || [];
        const alt = data.alternatives || [];
        setExactMatches(exact);
        setAlternatives(alt);
        const firstId = exact[0]?.id || alt[0]?.id || null;
        setExpandedId(firstId);
      }
    } catch (err: any) {
      setError(err?.message || String(err));
      setExactMatches([]);
      setAlternatives([]);
      setExpandedId(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-12 space-y-8 text-white">
      <header>
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Live Project</p>
        <h1 className="mt-2 text-3xl font-semibold">Pantry Coach · Recipe Planner</h1>
        <p className="mt-3 text-white/70">
          Enter the ingredients you have on hand. Pantry Coach searches 20,000+ Epicurious recipes locally, enforces
          ingredient constraints with Gemini, and returns exact matches plus clearly-labeled alternatives.
        </p>
      </header>

      <form onSubmit={handlePlan} className="rounded-2xl border border-white/10 bg-[#0b0d18] p-6 shadow-sm space-y-4">
        <div>
          <p className="text-sm font-medium text-white/80">Primary ingredients</p>
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            {baseInputs.map((value, index) => (
              <input
                key={index}
                value={value}
                onChange={(e) => {
                  const next = [...baseInputs];
                  next[index] = e.target.value;
                  setBaseInputs(next);
                }}
                placeholder={`Ingredient ${index + 1}`}
                className="rounded-xl border border-white/20 bg-[#090b17] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
              />
            ))}
          </div>
        </div>

        <label className="block text-sm font-medium text-white/80">
          Extra ingredients (optional)
          <textarea
            value={additionalInput}
            onChange={(e) => setAdditionalInput(e.target.value)}
            rows={3}
            placeholder="comma or newline separated ingredients"
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#090b17] p-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50 md:w-auto"
        >
          {loading ? "Planning..." : "Find recipes"}
        </button>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <RecipeSection
          title="Exact matches"
          description="These recipes stay within your ingredients (plus pantry staples)."
          recipes={exactMatches}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />

        <RecipeSection
          title="Alternative suggestions"
          description="These require a few extra ingredients but still align with your pantry."
          recipes={alternatives}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />

        {!exactMatches.length && !alternatives.length && !error && !loading && (
          <div className="text-sm text-white/60">
            Enter a few pantry ingredients above to get a curated set of Epicurious recipes.
          </div>
        )}
      </div>
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  recipes: PantryRecipe[];
  expandedId: string | null;
  setExpandedId: (val: string | null) => void;
};

function RecipeSection({ title, description, recipes, expandedId, setExpandedId }: SectionProps) {
  if (!recipes.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-white/60">{description}</p>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="rounded-2xl border border-white/10 bg-[#0f1325] shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-xs text-white/60">
                  Matches: {recipe.usesIngredients.join(", ") || "n/a"} · Serves {recipe.servings} · ~{recipe.timeMinutes}{" "}
                  min
                </p>
                {recipe.note && <p className="mt-1 text-xs text-white/70">{recipe.note}</p>}
              </div>
              <span className="text-xs uppercase tracking-wide text-white/60">
                {expandedId === recipe.id ? "Hide details" : "View details"}
              </span>
            </button>

            {expandedId === recipe.id && (
              <div className="border-t border-white/10 px-5 py-4 space-y-4">
                {recipe.extraNeeded && recipe.extraNeeded.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-white/60">Needs extra</h4>
                    <p className="text-sm text-white/70">{recipe.extraNeeded.join(", ")}</p>
                  </section>
                )}

                <section>
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Steps</h4>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/80">
                    {recipe.steps.map((step) => (
                      <li key={step.index}>{step.instruction}</li>
                    ))}
                  </ol>
                </section>

                {recipe.missingButOptional.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-white/60">Optional extras</h4>
                    <p className="text-sm text-white/70">
                      {recipe.missingButOptional.slice(0, 6).join(", ")}
                      {recipe.missingButOptional.length > 6 && " …"}
                    </p>
                  </section>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
