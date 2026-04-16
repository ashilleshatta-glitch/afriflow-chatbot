import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses — AfriFlow AI | Learn AI, Automation & Digital Skills',
  description: 'Browse 50+ courses in AI, automation, no-code tools, and digital business. From beginner to advanced, learn skills that earn across Africa.',
  openGraph: {
    title: 'Courses — AfriFlow AI',
    description: 'Browse 50+ courses in AI, automation, no-code tools, and digital business tailored for African professionals.',
  },
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children
}
