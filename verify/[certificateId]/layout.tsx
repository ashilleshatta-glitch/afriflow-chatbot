import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Certificate — AfriFlow AI',
  description: 'Verify the authenticity of an AfriFlow AI certificate instantly.',
}

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
