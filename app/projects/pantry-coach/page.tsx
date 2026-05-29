"use client"

import { useState } from 'react'
import type { PantryRecipe } from '@/lib/agents/pantry/types'

function parseList(text: string) {
  return text
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function PantryCoachPage() {
  const liveDemosEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_DEMOS === 'true'
  const [baseInputs, setBaseInputs] = useState<string[]>(['chicken', 'onion', 'garlic', 'lemon', 'rice'])
  const [additionalInput, setAdditionalInput] = useState('')
  const [exactMatches, setExactMatches] = useState<PantryRecipe[]>([])
  const [alternatives, setAlternatives] = useState<PantryRecipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'matches' | 'alternatives'>('matches')
  const [altVisibleCount, setAltVisibleCount] = useState<number>(5)

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault()
    const primary = baseInputs.map((item) => item.trim()).filter(Boolean)
    const extras = parseList(additionalInput)
    const ingredients = [...primary, ...extras]

    if (!ingredients.length) {
      setError('Add at least one ingredient.')
      return
    }

    setLoading(true)
    setError(null)
    setAltVisibleCount(5)

    try {
      const res = await fetch('/api/agents/pantry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'plan', ingredients })
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Unable to plan recipes right now.')
        setExactMatches([])
        setAlternatives([])
      } else {
        const exact = data.exactMatches || []
        const alt = data.alternatives || []
        setExactMatches(exact)
        setAlternatives(alt)
        const firstId = exact[0]?.id || alt[0]?.id || null
        setExpandedId(firstId)
        setActiveTab(exact.length ? 'matches' : 'alternatives')
      }
    } catch (err: any) {
      setError(err?.message || String(err))
      setExactMatches([])
      setAlternatives([])
      setExpandedId(null)
    } finally {
      setLoading(false)
    }
  }

  const topMatches = exactMatches.slice(0, 5)
  const topIds = new Set(topMatches.map((r) => r.id))
  const altFiltered = alternatives.filter((r) => !topIds.has(r.id))
  const altSlice = altFiltered.slice(0, altVisibleCount)
  const showMoreAlt = altFiltered.length > altVisibleCount

  return (
    <div className="container-max space-y-8 pb-16 pt-6">
      <section className="section-shell p-8 md:p-10">
        <p className="eyebrow">{liveDemosEnabled ? 'Live demo' : 'Case study'}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Pantry Coach - recipe planner
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Enter what is already in the kitchen. Pantry Coach searches a local Epicurious index, ranks the best matches,
          and returns exact-fit recipes plus realistic alternatives.
        </p>

        {!liveDemosEnabled ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white/80 p-5">
            <p className="eyebrow">Public deployment note</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The public site exposes this as a portfolio case study only. The live planner is disabled so the website
              does not expose paid AI-backed services on the public internet.
            </p>
          </div>
        ) : null}
      </section>

      {liveDemosEnabled ? (
        <>
          <section className="card p-6 md:p-8">
            <form onSubmit={handlePlan} className="space-y-5">
              <div>
                <p className="eyebrow">Primary ingredients</p>
                <div className="mt-3 grid gap-3 md:grid-cols-5">
                  {baseInputs.map((value, index) => (
                    <input
                      key={index}
                      value={value}
                      onChange={(e) => {
                        const next = [...baseInputs]
                        next[index] = e.target.value
                        setBaseInputs(next)
                      }}
                      placeholder={`Ingredient ${index + 1}`}
                      className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300"
                    />
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="eyebrow">Extra ingredients or style</span>
                <textarea
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                  rows={4}
                  placeholder="Comma or newline separated extras, or a direction like soup, pasta, curry, tacos..."
                  className="mt-3 w-full rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none transition focus:border-blue-300"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Planning...' : 'Find recipes'}
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : null}
          </section>

          <section className="section-shell p-6 md:p-8">
            <div className="flex flex-wrap gap-3">
              <TabButton label={`Top matches (${topMatches.length})`} active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} />
              <TabButton
                label={`Alternatives (${Math.min(altFiltered.length, 5)})`}
                active={activeTab === 'alternatives'}
                onClick={() => setActiveTab('alternatives')}
              />
            </div>

            <div className="mt-6">
              {activeTab === 'matches' ? (
                <RecipeSection
                  title="Top matches"
                  description="Best-fit recipes using what you already have, plus pantry basics."
                  recipes={topMatches}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
              ) : (
                <>
                  <RecipeSection
                    title="Alternatives"
                    description="Close fits that need a few extra ingredients."
                    recipes={altSlice}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                  />
                  {showMoreAlt ? (
                    <div className="mt-5 flex justify-start">
                      <button
                        type="button"
                        onClick={() => setAltVisibleCount((c) => c + 5)}
                        className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        Show 5 more
                      </button>
                    </div>
                  ) : null}
                </>
              )}

              {!exactMatches.length && !alternatives.length && !error && !loading ? (
                <p className="text-sm text-slate-500">Enter a few ingredients to get a curated set of local recipe matches.</p>
              ) : null}
            </div>
          </section>
        </>
      ) : (
        <section className="section-shell p-6 md:p-8">
          <p className="eyebrow">How the workflow works</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">Input</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Users enter what they already have at home and optionally add a meal direction like curry, soup, or pasta.
              </p>
            </article>
            <article className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">Matching</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A local Epicurious recipe index ranks exact-fit options first, then expands into realistic alternatives.
              </p>
            </article>
            <article className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">Response</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The result includes matching ingredients, extra items needed, and step-by-step instructions for quick planning.
              </p>
            </article>
          </div>
        </section>
      )}
    </div>
  )
}

type SectionProps = {
  title: string
  description: string
  recipes: PantryRecipe[]
  expandedId: string | null
  setExpandedId: (val: string | null) => void
}

function RecipeSection({ title, description, recipes, expandedId, setExpandedId }: SectionProps) {
  if (!recipes.length) return null

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="card p-0">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{recipe.title}</h3>
                <p className="mt-2 text-xs text-slate-500">
                  Score: {recipe.matchScore ?? '-'} | Matches: {recipe.usesIngredients.join(', ') || 'n/a'} | Serves{' '}
                  {recipe.servings} | ~{recipe.timeMinutes} min
                </p>
                {recipe.note ? <p className="mt-2 text-sm text-slate-600">{recipe.note}</p> : null}
              </div>
              <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                {expandedId === recipe.id ? 'Hide' : 'Open'}
              </span>
            </button>

            {expandedId === recipe.id ? (
              <div className="border-t border-slate-200 px-5 py-5">
                {recipe.extraNeeded && recipe.extraNeeded.length > 0 ? (
                  <section className="mb-5">
                    <p className="eyebrow">Needs extra</p>
                    <p className="mt-2 text-sm text-slate-600">{recipe.extraNeeded.join(', ')}</p>
                  </section>
                ) : null}

                <section>
                  <p className="eyebrow">Steps</p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    {recipe.steps.map((step) => (
                      <li key={step.index}>{step.instruction}</li>
                    ))}
                  </ol>
                </section>

                {recipe.missingButOptional.length > 0 ? (
                  <section className="mt-5">
                    <p className="eyebrow">Optional extras</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {recipe.missingButOptional.slice(0, 6).join(', ')}
                      {recipe.missingButOptional.length > 6 ? ' ...' : ''}
                    </p>
                  </section>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  )
}
