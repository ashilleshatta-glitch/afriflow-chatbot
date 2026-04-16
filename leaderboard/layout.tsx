import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard — AfriFlow AI',
  description: 'See the top AI learners in Africa. Compete, learn, and rise through the ranks on AfriFlow AI\'s global leaderboard.',
  openGraph: {
    title: 'Leaderboard — AfriFlow AI',
    description: 'See the top AI learners in Africa. Compete, learn, and rise through the ranks.',
  },
}

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
