'use client'

import { useEffect, useState, useRef } from 'react'
import { BookOpen, Zap, TrendingUp, Globe, Award, Users } from 'lucide-react'

interface FloatingCard {
  id: number
  title: string
  school: string
  emoji: string
  color: string
  x: number  // percentage 0-100
  delay: number
  duration: number
}

const CARDS: FloatingCard[] = [
  { id: 1, title: 'AI for Beginners', school: 'Foundations', emoji: '🧠', color: 'border-blue-500/30', x: 5, delay: 0, duration: 18 },
  { id: 2, title: 'WhatsApp Automation', school: 'Automation', emoji: '⚡', color: 'border-brand-500/30', x: 78, delay: 3, duration: 22 },
  { id: 3, title: 'Sell AI Services', school: 'Creator', emoji: '💰', color: 'border-purple-500/30', x: 20, delay: 7, duration: 20 },
  { id: 4, title: 'AI for SMEs', school: 'Business', emoji: '🏢', color: 'border-forest-500/30', x: 65, delay: 10, duration: 24 },
  { id: 5, title: 'Python for AI', school: 'Builder', emoji: '🔧', color: 'border-red-500/30', x: 42, delay: 5, duration: 19 },
  { id: 6, title: 'No-Code Zapier', school: 'Automation', emoji: '⚡', color: 'border-brand-500/30', x: 88, delay: 12, duration: 21 },
]

const ICONS = [BookOpen, Zap, TrendingUp, Globe, Award, Users]

export default function FloatingCards() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      setMounted(true)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {CARDS.map((card) => {
        const Icon = ICONS[card.id % ICONS.length]
        return (
          <div
            key={card.id}
            className={`absolute bottom-0 animate-float-up opacity-0`}
            style={{
              left: `${card.x}%`,
              animationDelay: `${card.delay}s`,
              animationDuration: `${card.duration}s`,
            }}
          >
            <div className={`bg-earth-900/80 backdrop-blur-sm border ${card.color} rounded-xl px-4 py-3 shadow-lg w-48`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{card.emoji}</span>
                <span className="text-[10px] text-earth-500 font-medium uppercase tracking-wider">{card.school}</span>
              </div>
              <p className="text-white text-xs font-medium leading-snug">{card.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((a) => (
                    <div key={a} className="w-4 h-4 bg-earth-700 rounded-full border border-earth-900" />
                  ))}
                </div>
                <span className="text-earth-600 text-[10px]">2.4k enrolled</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
