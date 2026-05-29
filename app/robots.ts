import type { MetadataRoute } from 'next'

function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'

  return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/']
    },
    sitemap: `${base}/sitemap.xml`
  }
}
