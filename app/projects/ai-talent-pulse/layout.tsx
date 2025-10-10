export const metadata = {
  title: 'AI Talent Pulse',
  description: 'Streaming labor-market signals',
}

export default function AITalentPulseLayout({ children }: { children: React.ReactNode }) {
  // Use root layout for html/body; only wrap segment content here if needed
  return <>{children}</>;
}
