import json
from pathlib import Path

IN_PATH = Path("data/full_format_recipes.json")
OUT_PATH = Path("data/recipes_index.json")


def normalize_ingredient(text: str) -> str:
    return (
        text.lower()
        .replace(",", " ")
        .replace("(", " ")
        .replace(")", " ")
        .replace("/", " ")
        .replace("-", " ")
        .replace(".", " ")
        .replace("  ", " ")
        .strip()
    )


def main():
    if not IN_PATH.exists():
        raise FileNotFoundError(
            f"Missing {IN_PATH}. Please unzip full_format_recipes.json.zip into the data directory."
        )

    with IN_PATH.open("r", encoding="utf-8") as f:
        raw = json.load(f)

    out = []
    for idx, recipe in enumerate(raw):
        title = recipe.get("title")
        ingredients = recipe.get("ingredients")
        directions = recipe.get("directions")

        if not title or not ingredients or not directions:
            continue

        ing_norm = [
            normalize_ingredient(str(item))
            for item in ingredients
            if str(item).strip()
        ]

        instr_norm = [
            str(step).strip()
            for step in directions
            if str(step).strip()
        ]

        if not ing_norm or not instr_norm:
            continue

        out.append(
            {
                "id": f"epicurious-{idx}",
                "title": str(title).strip(),
                "ingredients": ing_norm,
                "instructions": instr_norm,
                "source": "epicurious",
            }
        )

    OUT_PATH.write_text(json.dumps(out), encoding="utf-8")
    print(f"Wrote {len(out)} recipes to {OUT_PATH}")


if __name__ == "__main__":
    main()
