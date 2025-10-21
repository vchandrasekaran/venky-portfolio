import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import AIOrbAssistant from '@/components/AIOrbAssistant'
import Header from '@/components/Header'
import PointerAura from '@/components/hud/PointerAura'
import HashScroller from '@/components/util/HashScroller'
import HUDShell from '@/components/hud/HUDShell'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300','400','500','600','700'] })

export const metadata: Metadata = {
  title: 'Venkatesh Naidu — BI & Data Analytics',
  description: 'BI portfolio — Snowflake, dbt, Power BI, Domo, SQL',
  openGraph: {
    title: 'Ask my data anything — Venkatesh Naidu',
    description: 'Interactive BI portfolio with Snowflake & AI copilots',
    images: ['/og.png']
  },
  metadataBase: new URL('https://example.com') // replace when deployed
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="hud">
      <body className={`${spaceGrotesk.className} text-slate-200 antialiased`}>
        <Header />
        <HUDShell>
          {children}
        </HUDShell>
        <AIOrbAssistant />
        <PointerAura />
        <HashScroller />
      </body>
    </html>
  )
}
