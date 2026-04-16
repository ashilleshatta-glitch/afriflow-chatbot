import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In — AfriFlow AI',
  description: 'Sign in or create your AfriFlow AI account. Start learning AI, automation, and digital skills today.',
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-earth-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-earth-900 border-r border-earth-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 glow-orb bg-brand-500/20" />
        
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-forest-500 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              AfriFlow<span className="text-brand-400"> AI</span>
            </span>
          </Link>
        </div>

        <div className="relative">
          <blockquote className="mb-8">
            <p className="font-display text-3xl text-white leading-snug font-bold mb-4">
              &ldquo;From AI-curious to AI-earning in 60 days.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-forest-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                KA
              </div>
              <div>
                <p className="text-white font-medium">Kwame Asante</p>
                <p className="text-earth-500 text-sm">AI Consultant, 🇬🇭 Ghana</p>
              </div>
            </div>
          </blockquote>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '24K+', label: 'Learners' },
              { value: '50+', label: 'Courses' },
              { value: '12+', label: 'Countries' },
            ].map((stat) => (
              <div key={stat.label} className="bg-earth-800/60 rounded-xl p-4 text-center border border-earth-700">
                <div className="text-white font-bold text-xl font-display">{stat.value}</div>
                <div className="text-earth-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                AfriFlow<span className="text-brand-400"> AI</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
