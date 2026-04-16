import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Lab — AfriFlow AI | Hands-On AI Projects',
  description: 'Build real AI projects: WhatsApp bots, content generators, business dashboards. Practice with guided hands-on labs.',
  openGraph: {
    title: 'AI Lab — AfriFlow AI',
    description: 'Hands-on AI projects designed for African business contexts. Build, test, and deploy.',
  },
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children
}
