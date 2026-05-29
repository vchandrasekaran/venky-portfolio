export type NavItem = { path: string; label: string; keywords?: string[]; hash?: string };

export function siteMap(): NavItem[] {
  return [
    { path: '/', label: 'Home', keywords: ['home','start','landing'] },
    { path: '/', hash: '#workflow', label: 'Workflow', keywords: ['workflow','stack','tools','capability'] },
    { path: '/', hash: '#assistant', label: 'Website Guide', keywords: ['assistant','chat','voice','guide'] },
    { path: '/', hash: '#projects', label: 'Featured Work', keywords: ['projects','portfolio','case studies','featured work'] },
    { path: '/projects', label: 'Projects Index', keywords: ['projects page','portfolio projects'] },
    { path: '/experience', label: 'Experience', keywords: ['experience','resume','work history','roles'] },
    { path: '/contact', label: 'Contact', keywords: ['contact','email','linkedin','message'] },
    { path: '/sports', label: 'Sports', keywords: ['sports','media','dupr'] },
  ];
}
