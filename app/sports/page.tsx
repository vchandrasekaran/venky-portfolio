import Image from 'next/image'

const orderedPhotos = [
  '/sports/IMG_1145.PNG',
  '/sports/IMG_1146.PNG',
  '/sports/IMG_1147.PNG',
  '/sports/IMG_1148.PNG',
  '/sports/IMG_1149.PNG',
  '/sports/IMG_1150.PNG',
  '/sports/IMG_1151.PNG',
  '/sports/IMG_1152.PNG',
  '/sports/IMG_1153.PNG',
  '/sports/IMG_1154.PNG',
  '/sports/IMG_1155.PNG',
  '/sports/IMG_1156.PNG',
  '/sports/IMG_1157.PNG',
  '/sports/IMG_1158.PNG',
  '/sports/IMG_1159.PNG',
  '/sports/IMG_1161.PNG',
  '/sports/IMG_1162.PNG',
  '/sports/IMG_1163.PNG',
  '/sports/IMG_1164.PNG',
  '/sports/IMG_1165.PNG',
  '/sports/IMG_1166.PNG',
  '/sports/IMG_1167.PNG',
  '/sports/IMG_1168.PNG',
  '/sports/IMG_1169.PNG',
  '/sports/IMG_1170.PNG',
  '/sports/IMG_1171.PNG',
  '/sports/IMG_1172.PNG',
  '/sports/IMG_1173.PNG',
  '/sports/IMG_1174.PNG',
  '/sports/IMG_1175.PNG',
  '/sports/IMG_1176.PNG',
  '/sports/IMG_1177.PNG',
  '/sports/IMG_1178.PNG',
  '/sports/IMG_1179.PNG',
  '/sports/IMG_1180.PNG',
  '/sports/IMG_1181.PNG',
  '/sports/IMG_1182.PNG',
  '/sports/IMG_1183.PNG',
  '/sports/IMG_1184.PNG',
  '/sports/IMG_1185.PNG',
  '/sports/IMG_1186.PNG',
  '/sports/IMG_1187.PNG',
  '/sports/IMG_1188.PNG',
  '/sports/IMG_1189.PNG',
  '/sports/IMG_1190.PNG',
  '/sports/IMG_1191.PNG'
]

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-')

// Move cricket photos 1, 2, 3, 8, and 5 into soccer while keeping folder order.
const soccerIndexes = [
  ...Array.from({ length: 15 }, (_, idx) => idx), // first 15 photos
  15, // cricket #1
  16, // cricket #2
  17, // cricket #3
  22, // cricket #8 (0-based within cricket slice)
  23 // cricket #5 (0-based within cricket slice)
]

const soccerPhotos = soccerIndexes.map((idx) => orderedPhotos[idx])

const baseCricketIndexes = Array.from({ length: 15 }, (_, idx) => idx + 15).filter((idx) => !soccerIndexes.includes(idx))

// Move first 10 pickleball photos into cricket.
const movedFromPickleballIndexes = Array.from({ length: 10 }, (_, idx) => idx + 30)

const cricketPhotos = [
  ...baseCricketIndexes.map((idx) => orderedPhotos[idx]),
  ...movedFromPickleballIndexes.map((idx) => orderedPhotos[idx])
]

const pickleballPhotos = orderedPhotos.filter((_, idx) => idx >= 30 && !movedFromPickleballIndexes.includes(idx))

const sportsSections = [
  {
    title: 'Pickleball',
    subtitle: 'PPA Milwaukee, Minor League Nationals, and DUPR coaching.',
    photos: pickleballPhotos.slice().reverse()
  },
  {
    title: 'Cricket',
    subtitle: 'Community, content, and Mars Cricket partnership.',
    photos: cricketPhotos.slice().reverse()
  },
  {
    title: 'Soccer',
    subtitle: 'Early competitive runs and training blocks.',
    photos: soccerPhotos.slice().reverse()
  }
]

const highlightReel = orderedPhotos.slice().reverse().slice(0, 6)

type SectionBlockProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  id?: string
}

function SectionBlock({ title, subtitle, children, id }: SectionBlockProps) {
  return (
    <section className="container-max py-16 text-white" id={id}>
      <header className="relative mb-10 max-w-3xl">
        <span
          className="pointer-events-none absolute -left-6 top-1 hidden h-12 w-px bg-gradient-to-b from-[#38bdf8] via-[#c084fc] to-transparent md:block"
          aria-hidden="true"
        />
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-3 text-lg text-white/70">{subtitle}</p> : null}
      </header>
      <div className="grid gap-6 lg:gap-8">{children}</div>
    </section>
  )
}

export default function SportsPage() {
  return (
    <main className="space-y-16 pb-20">
      <SectionBlock
        title="Sports & Media"
        subtitle="Soccer roots, cricket community, and pickleball podiums — told through a visual log."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Three-sport arc</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Match play, travel, and media</h3>
              </div>
              <span className="rounded-full border border-brand.glow/40 bg-brand.glow/10 px-3 py-1 text-xs text-brand.glow">
                Ongoing
              </span>
            </div>
            <p className="mt-4 text-white/75">
              Soccer foundations, cricket community work with Mars Cricket, and pickleball podiums (PPA Milwaukee Open
              Gold/Silver, Minor League Nationals invite, DUPR coaching). Photos are grouped by sport, newest at the end
              of each stack.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/80">
              {['Pickleball', 'Cricket', 'Soccer'].map((chip) => (
                <a
                  key={chip}
                  href={`#${slugify(chip)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:border-brand.accent/70 hover:text-brand.accent"
                >
                  {chip}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {highlightReel.map((src, idx) => (
              <div
                key={src}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <Image
                  src={src}
                  alt={`Sports highlight ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  priority={idx < 2}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock
        title="By Sport"
        subtitle="Ordered by how they landed in the folder — oldest to newest inside each lane."
      >
        <div className="grid gap-10">
          {sportsSections.map((sport) => (
            <article
              key={sport.title}
              id={slugify(sport.title)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Gallery</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{sport.title}</h3>
                  <p className="text-white/70">{sport.subtitle}</p>
                </div>
                <div className="rounded-full border border-brand.accent/40 bg-brand.accent/10 px-4 py-1.5 text-xs font-semibold text-brand.accent">
                  {`${sport.photos.length} photos`}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sport.photos.map((src, photoIdx) => (
                  <div
                    key={src}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <Image
                      src={src}
                      alt={`${sport.title} photo ${photoIdx + 1}`}
                      fill
                      sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>
    </main>
  )
}
