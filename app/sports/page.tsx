import Section from '@/components/Section'

export default function SportsPage(){
  return (
    <main>
      <Section title="Sports & Media" subtitle="Competitive results, coaching, and brand work.">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">PPA Milwaukee Open</h3>
            <p className="text-slate-300 mt-2">Gold (Men's Doubles), Silver (Men's Singles).</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Minor League Nationals</h3>
            <p className="text-slate-300 mt-2">Invite; multiple golds in Lake Geneva; DUPR Coach.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Brand: Mars Cricket</h3>
            <p className="text-slate-300 mt-2">5+ years of consistent promotion and content.</p>
          </div>
        </div>
      </Section>
    </main>
  )
}

