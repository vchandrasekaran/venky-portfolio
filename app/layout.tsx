import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import AIOrbAssistant from '@/components/AIOrbAssistant'
import Header from '@/components/Header'
import PointerAura from '@/components/hud/PointerAura'
import HashScroller from '@/components/util/HashScroller'
import PointerHighlight from '@/components/assistant/PointerOverlay'

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
    <html lang="en">
      <body className={`${spaceGrotesk.className} bg-brand-bg text-[#111111] antialiased`}>
        <Header />
        <main>{children}</main>
        <AIOrbAssistant />
        <PointerAura />
        <HashScroller />
        <PointerHighlight />
      </body>
    </html>
  )
}
