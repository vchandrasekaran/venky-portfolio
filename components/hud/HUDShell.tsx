"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function HUDShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = useMemo(() => {
    if (pathname === "/") return "Command Console";
    if (pathname?.startsWith("/projects/ai-talent-pulse")) return "AI Talent Pulse";
    if (pathname?.startsWith("/projects")) return "Projects Deck";
    if (pathname?.startsWith("/experience")) return "Experience Log";
    if (pathname?.startsWith("/contact")) return "Comms";
    if (pathname?.startsWith("/sports")) return "Sports Grid";
    return "Console";
  }, [pathname]);

  const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute:'2-digit' }).format(new Date());

  return (
    <div className="relative">
      {/* Top HUD rail */}
      <div className="sticky top-0 z-[900] h-14 w-full bg-[rgba(10,12,16,0.7)] backdrop-blur border-b border-[rgba(255,109,174,0.32)] shadow-[0_0_0_1px_rgba(255,109,174,0.12)]">
        <div className="container-max flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[rgba(255,109,174,0.9)] shadow-[0_0_12px_rgba(255,109,174,0.9)]" />
            <span className="text-sm font-semibold text-slate-100 tracking-widest uppercase">{title}</span>
            <span className="ml-3 text-[10px] uppercase tracking-[0.25em] text-brand.subtle hidden sm:block">{pathname}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="hidden md:inline">SYS OK</span>
            <span className="opacity-60">{clock}</span>
          </div>
        </div>
        {/* animated rail */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[rgba(255,109,174,0.6)] to-transparent animate-[rail_3s_linear_infinite]" />
      </div>

      <div>{children}</div>
    </div>
  );
}

