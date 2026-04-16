import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started — AfriFlow AI',
  description: 'Personalize your AI learning journey. Tell us your goals and experience level to get tailored course recommendations.',
  openGraph: {
    title: 'Get Started — AfriFlow AI',
    description: 'Personalize your AI learning journey with tailored course recommendations.',
  },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
