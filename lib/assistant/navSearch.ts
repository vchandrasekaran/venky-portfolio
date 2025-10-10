import Fuse from 'fuse.js'
import { NavItem, siteMap } from './sitemap'

const fuse = new Fuse(siteMap(), {
  keys: [ 'label', 'keywords' ],
  threshold: 0.35,
  includeScore: true,
})

export function searchNav(q: string, limit = 3): NavItem[] {
  const res = fuse.search(q).slice(0, limit)
  return res.map(r => r.item)
}

