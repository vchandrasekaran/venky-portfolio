export const metadata = {
  title: 'Projects',
  description: 'Portfolio projects',
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  // Defer html/body to the root layout so global UI (orb assistant) stays mounted
  return <>{children}</>;
}
