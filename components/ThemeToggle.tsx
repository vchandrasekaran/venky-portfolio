"use client";
import { useEffect, useState } from "react";

type Theme = "default" | "aurora" | "hud";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && (localStorage.getItem("theme") as Theme)) || "default";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  const toggle = () => {
    const order: Theme[] = ["default", "aurora", "hud"];
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };

  const label = theme === "aurora" ? "Aurora Neon" : theme === "hud" ? "HUD Ops" : "Default";

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-[2147483646] rounded-full border border-white/15 bg-white/8 backdrop-blur px-3 py-1.5 text-xs text-slate-200 hover:border-brand.accent/50 hover:text-white transition"
      aria-label="Toggle theme"
      title="Click to cycle themes"
    >
      {label}
    </button>
  );
}
