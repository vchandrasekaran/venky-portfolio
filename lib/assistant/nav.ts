export type NavSuggestion = { path: string; hash?: string; label: string } | null;

const KEY = (s: string) => s.toLowerCase();

export function suggestNav(question: string): NavSuggestion {
  const q = KEY(question);
  const has = (w: string) => q.includes(KEY(w));

  if (has('home') || has('start') || has('landing')) return { path: '/', label: 'Home' };
  if (has('project') || has('case study') || has('portfolio')) return { path: '/projects', label: 'Projects' };
  if (has('experience') || has('resume') || has('work history')) return { path: '/experience', label: 'Experience' };
  if (has('contact') || has('email') || has('linkedin')) return { path: '/contact', label: 'Contact' };
  if (has('sports')) return { path: '/sports', label: 'Sports' };
  if (has('skills') || has('stack') || has('tools') || has('workflow')) return { path: '/', hash: '#workflow', label: 'Workflow' };
  if (has('assistant') || has('chat') || has('guide')) return { path: '/', hash: '#assistant', label: 'Website Guide' };
  return null;
}
