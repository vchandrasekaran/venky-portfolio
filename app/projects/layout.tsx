export const metadata = {
  title: 'Projects',
  description: 'Portfolio projects',
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  // Defer html/body to the root layout so shared UI wrappers stay mounted
  return <>{children}</>;
}
