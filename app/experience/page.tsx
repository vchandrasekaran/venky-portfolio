import Section from "@/components/Section";

type Item = {
  role: string;
  org: string;
  year: number;
  timeLabel: string;
};

export default function ExperiencePage() {
  const workItems: Item[] = [
    { role: "Business Intelligence Analyst III", org: "Truckstop.com", year: 2024, timeLabel: "Mar 2024 - Nov 2025 · Chicago, IL" },
    { role: "Business Intelligence Analyst II", org: "Truckstop.com", year: 2023, timeLabel: "Jan 2023 - Mar 2024 · Chicago, IL" },
    { role: "Business Intelligence Analyst I", org: "Truckstop.com", year: 2021, timeLabel: "Jan 2021 - Jan 2023 · Chicago, IL" },
    { role: "Software Development Engineer in Test II/III", org: "Truckstop.com", year: 2019, timeLabel: "May 2019 - Jan 2021 · Chicago, IL" },
    { role: "Graduate Research Assistant", org: "Illinois Institute of Technology", year: 2017, timeLabel: "Dec 2017 - Jan 2018 · Chicago, IL" },
    { role: "Risk Analyst", org: "Amazon.com", year: 2015, timeLabel: "Jul 2015 - Jul 2016 · Bangalore, India" },
    { role: "B.E., Engineering", org: "New Horizon College of Engineering", year: 2011, timeLabel: "Apr 2011 - Apr 2015 · Bangalore, India" },
    { role: "Born", org: "Jan 6, 1993", year: 1993, timeLabel: "Bangalore, India" },
  ];

  const sportsItems: Item[] = [
    { role: "DUPR Coach & Media", org: "Coaching, travel, broadcast features", year: 2024, timeLabel: "2024 - Ongoing" },
    { role: "PPA Milwaukee Open", org: "Gold (Men's Doubles), Silver (Men's Singles)", year: 2024, timeLabel: "2024 · Milwaukee, WI" },
    { role: "Minor League Nationals", org: "Invite + Lake Geneva golds", year: 2024, timeLabel: "2024 · Lake Geneva, WI" },
    { role: "Brand Partner", org: "Mars Cricket", year: 2019, timeLabel: "2019 - Present" },
  ];

  const years = Array.from(new Set([...workItems, ...sportsItems].map((i) => i.year)))
    .filter((y) => y > 0)
    .sort((a, b) => b - a); // most recent at top

  return (
    <main>
      <Section title="Experience" subtitle="Single timeline of work, education, and sports — most recent at the top.">
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/15" aria-hidden="true" />
          <div className="space-y-10">
            {years.map((year) => {
              const workForYear = workItems.filter((w) => w.year === year);
              const sportsForYear = sportsItems.filter((s) => s.year === year);
              return (
                <div key={year} className="grid grid-cols-3 items-center gap-4">
                  <div className="flex flex-col items-end gap-3">
                    {workForYear.length ? (
                      workForYear.map((item) => (
                        <div key={item.role} className="flex items-center gap-3">
                          <ItemCard item={item} align="right" />
                          <span className="h-px w-8 bg-[#8a7cff]/70" aria-hidden />
                          <span className="h-3 w-3 rounded-full border border-white/40 bg-[#8a7cff]" aria-hidden />
                        </div>
                      ))
                    ) : (
                      <div className="h-6" />
                    )}
                  </div>

                  <div className="relative flex flex-col items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/30">
                      <span className="h-3 w-3 rounded-full bg-white/70" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">{year}</span>
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    {sportsForYear.length ? (
                      sportsForYear.map((item) => (
                        <div key={item.role} className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full border border-white/40 bg-[#ff7a9e]" aria-hidden />
                          <span className="h-px w-8 bg-[#ff7a9e]/70" aria-hidden />
                          <ItemCard item={item} align="left" />
                        </div>
                      ))
                    ) : (
                      <div className="h-6" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </main>
  );
}

function ItemCard({ item, align }: { item: Item; align: "left" | "right" }) {
  const textAlign = align === "right" ? "text-right" : "text-left";
  return (
    <div
      className={`max-w-xs rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.25)] ${textAlign}`}
    >
      <p className="text-base font-semibold text-white">{item.role}</p>
      <p>{item.org}</p>
      <p className="text-white/60">{item.timeLabel}</p>
    </div>
  );
}
