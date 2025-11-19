export type NavItem = { path: string; label: string; keywords?: string[]; hash?: string };

export function siteMap(): NavItem[] {
  return [
    { path: '/', label: 'Home', keywords: ['home','start','landing'] },
    { path: '/', hash: '#skills', label: 'Skills', keywords: ['skills','stack','tools','capability'] },
    { path: '/', hash: '#ops', label: 'Ops Loadout', keywords: ['ops','loadout','modules'] },
    { path: '/', hash: '#projects', label: 'Projects', keywords: ['projects','portfolio','case studies','operations deck'] },
    { path: '/projects', label: 'Projects Index', keywords: ['projects page','portfolio projects'] },
    { path: '/experience', label: 'Experience', keywords: ['experience','resume','work history','roles'] },
    { path: '/contact', label: 'Contact', keywords: ['contact','email','linkedin','message'] },
    { path: '/sports', label: 'Sports', keywords: ['sports','media','dupr'] },
  ];
}
