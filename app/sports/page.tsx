import Image from 'next/image'

export const metadata = {
  title: 'Sports',
  description: 'Sports and media gallery across pickleball, cricket, and soccer.'
}

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

const soccerIndexes = [...Array.from({ length: 15 }, (_, idx) => idx), 15, 16, 17, 22, 23]
const soccerPhotos = soccerIndexes.map((idx) => orderedPhotos[idx])
const baseCricketIndexes = Array.from({ length: 15 }, (_, idx) => idx + 15).filter((idx) => !soccerIndexes.includes(idx))
const movedFromPickleballIndexes = Array.from({ length: 10 }, (_, idx) => idx + 30)

const cricketPhotos = [...baseCricketIndexes.map((idx) => orderedPhotos[idx]), ...movedFromPickleballIndexes.map((idx) => orderedPhotos[idx])]
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

export default function SportsPage() {
  return (
    <main className="container-max space-y-6 pb-12 pt-5">
      <section className="section-shell overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">Sports + media</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              A visual timeline across pickleball, cricket, and soccer.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This page balances the professional portfolio with a more personal record: competition, coaching, community,
              travel, and media work grouped into a cleaner gallery experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {sportsSections.map((sport) => (
                <a key={sport.title} href={`#${slugify(sport.title)}`} className="pill">
                  {sport.title}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {highlightReel.map((src, idx) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <Image
                  src={src}
                  alt={`Sports highlight ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 28vw, 45vw"
                  className="object-cover"
                  priority={idx < 2}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        {sportsSections.map((sport) => (
          <article key={sport.title} id={slugify(sport.title)} className="section-shell p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Gallery</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">{sport.title}</h2>
                <p className="mt-2 text-slate-600">{sport.subtitle}</p>
              </div>
              <span className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
                {sport.photos.length} photos
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sport.photos.map((src, photoIdx) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/70 bg-white shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                  <Image
                    src={src}
                    alt={`${sport.title} photo ${photoIdx + 1}`}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
