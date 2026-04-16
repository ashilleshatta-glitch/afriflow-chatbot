'use client'

import dynamic from 'next/dynamic'

const AfriAICoach = dynamic(() => import('@/components/AfriAICoach'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-forest-500 rounded-2xl shadow-lg animate-pulse" />
    </div>
  ),
})

export default AfriAICoach
