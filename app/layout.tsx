import './globals.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Manrope } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HashScroller from '@/components/util/HashScroller'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500']
})

function resolveMetadataBase() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'

  const normalized = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`

  try {
    return new URL(normalized)
  } catch {
    return new URL('http://localhost:3000')
  }
}

export const metadata: Metadata = {
  title: {
    default: 'Venkatesh Naidu | BI and Data Analytics',
    template: '%s | Venkatesh Naidu'
  },
  description: 'Portfolio for BI, analytics engineering, Snowflake, DBT, dashboards, AI-assisted data workflows, and sports-tech projects.',
  applicationName: 'Venkatesh Naidu Portfolio',
  authors: [{ name: 'Venkatesh Naidu' }],
  creator: 'Venkatesh Naidu',
  publisher: 'Venkatesh Naidu',
  keywords: ['business intelligence', 'data analytics', 'Snowflake', 'DBT', 'Power BI', 'Domo', 'Tableau', 'analytics engineering'],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    title: 'Venkatesh Naidu | BI and Data Analytics',
    description: 'Analytics portfolio covering Snowflake, DBT, dashboards, AI-assisted workflows, and sports-tech projects.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Venkatesh Naidu BI and data analytics portfolio thumbnail'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venkatesh Naidu | BI and Data Analytics',
    description: 'Analytics portfolio covering Snowflake, DBT, dashboards, AI-assisted workflows, and sports-tech projects.',
    images: ['/og-image.png']
  },
  metadataBase: resolveMetadataBase()
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable} theme-broadcast min-h-screen antialiased`}>
        <Header />
        {children}
        <Footer />
        <HashScroller />
      </body>
    </html>
  )
}
