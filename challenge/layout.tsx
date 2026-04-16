import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '30-Day AI Challenge — AfriFlow AI | Master AI in 30 Days',
  description:
    'Join Africa\'s #1 AI challenge. Complete one AI task per day for 30 days, earn XP, climb the leaderboard, and get your AfriFlow Verified certificate.',
  openGraph: {
    title: '30-Day AI Challenge — AfriFlow AI',
    description: 'One AI task a day. 30 days. Transform your skills and your income.',
    images: [{ url: '/og-challenge.png', width: 1200, height: 630 }],
  },
}

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
