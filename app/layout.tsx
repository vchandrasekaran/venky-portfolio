import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import AIOrbAssistant from '@/components/AIOrbAssistant'
import AIConsole from '@/components/agent/Console'
import ThemeToggle from '@/components/ThemeToggle'
import Header from '@/components/Header'

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
      <body className={`${spaceGrotesk.className} text-slate-200 antialiased`}>
        <Header />
        {children}
        <AIConsole />
        <AIOrbAssistant />
        <ThemeToggle />
      </body>
    </html>
  )
}
