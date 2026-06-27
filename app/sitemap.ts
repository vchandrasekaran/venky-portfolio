import type { MetadataRoute } from 'next'

const routes = [
  '',
  '/projects',
  '/projects/trucklexa',
  '/projects/cricket-analyst-raiders',
  '/projects/ai-analyst',
  '/experience',
  '/sports',
  '/contact'
]

function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'

  return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().replace(/\/$/, '')
  const now = new Date()

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7
  }))
}
