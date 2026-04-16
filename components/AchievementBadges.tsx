'use client'

import { useState, useEffect } from 'react'
import { Trophy, Sparkles, Lock, Star, Flame, BookOpen, Users, Zap } from 'lucide-react'
import { achievementsApi } from '@/lib/api'

interface Achievement {
  _id: string
  badgeId: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  category: string
  unlockedAt: string
}

const RARITY_COLORS = {
  common: 'from-earth-600 to-earth-500 border-earth-500/30',
  uncommon: 'from-forest-600 to-forest-400 border-forest-400/30',
  rare: 'from-blue-600 to-blue-400 border-blue-400/30',
  epic: 'from-purple-600 to-purple-400 border-purple-400/30',
  legendary: 'from-amber-600 to-amber-400 border-amber-400/30',
}

const RARITY_GLOW = {
  common: '',
  uncommon: 'shadow-forest-500/20',
  rare: 'shadow-blue-500/20',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-amber-500/40 animate-pulse-slow',
}

const RARITY_LABELS = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
}

// All badge definitions for locked display
const ALL_BADGES = [
  { badgeId: 'first_enrollment', title: 'First Step', icon: '📚', rarity: 'common', category: 'learning' },
  { badgeId: 'course_complete_1', title: 'Graduate', icon: '🎓', rarity: 'uncommon', category: 'learning' },
  { badgeId: 'course_complete_5', title: 'Scholar', icon: '📜', rarity: 'rare', category: 'learning' },
  { badgeId: 'course_complete_10', title: 'Professor', icon: '👨‍🏫', rarity: 'epic', category: 'learning' },
  { badgeId: 'streak_3', title: '3-Day Fire', icon: '🔥', rarity: 'common', category: 'streak' },
  { badgeId: 'streak_7', title: 'Week Warrior', icon: '⚡', rarity: 'uncommon', category: 'streak' },
  { badgeId: 'streak_14', title: 'Fortnight Force', icon: '💪', rarity: 'rare', category: 'streak' },
  { badgeId: 'streak_30', title: 'Monthly Master', icon: '🏆', rarity: 'epic', category: 'streak' },
  { badgeId: 'streak_100', title: 'Centurion', icon: '👑', rarity: 'legendary', category: 'streak' },
  { badgeId: 'first_review', title: 'Voice Heard', icon: '💬', rarity: 'common', category: 'social' },
  { badgeId: 'helpful_reviewer', title: 'Helpful Guru', icon: '🌟', rarity: 'rare', category: 'social' },
  { badgeId: 'xp_100', title: 'Century Club', icon: '💯', rarity: 'common', category: 'mastery' },
  { badgeId: 'xp_500', title: 'Half K Hero', icon: '🚀', rarity: 'uncommon', category: 'mastery' },
  { badgeId: 'xp_1000', title: 'XP Thousandaire', icon: '💎', rarity: 'rare', category: 'mastery' },
  { badgeId: 'xp_5000', title: 'XP Legend', icon: '🌍', rarity: 'legendary', category: 'mastery' },
  { badgeId: 'early_adopter', title: 'Early Adopter', icon: '🌱', rarity: 'rare', category: 'special' },
  { badgeId: 'african_pioneer', title: 'African Pioneer', icon: '🌍', rarity: 'epic', category: 'special' },
  { badgeId: 'night_owl', title: 'Night Owl', icon: '🦉', rarity: 'uncommon', category: 'special' },
  { badgeId: 'speed_learner', title: 'Speed Learner', icon: '⚡', rarity: 'rare', category: 'special' },
] as const

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'streak', label: 'Streak', icon: Flame },
  { id: 'mastery', label: 'Mastery', icon: Star },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'special', label: 'Special', icon: Zap },
]

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await achievementsApi.list()
        setAchievements(res.data.achievements || [])
      } catch {
        // User not authenticated or error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const unlockedIds = new Set(achievements.map(a => a.badgeId))

  const filteredBadges = ALL_BADGES.filter(
    b => activeCategory === 'all' || b.category === activeCategory
  )

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-amber-400" />
          <h3 className="text-white font-semibold">Achievements</h3>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-earth-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" />
          <h3 className="text-white font-semibold">Achievements</h3>
          <span className="text-xs text-earth-500">
            {achievements.length}/{ALL_BADGES.length} unlocked
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-500/10 text-brand-400 font-medium'
                  : 'text-earth-500 hover:text-earth-300 hover:bg-earth-800'
              }`}
            >
              <Icon size={12} />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
        {filteredBadges.map(badge => {
          const isUnlocked = unlockedIds.has(badge.badgeId)
          const achievement = achievements.find(a => a.badgeId === badge.badgeId)
          const isSelected = selectedBadge === badge.badgeId
          const rarity = badge.rarity as keyof typeof RARITY_COLORS

          return (
            <button
              key={badge.badgeId}
              onClick={() => setSelectedBadge(isSelected ? null : badge.badgeId)}
              className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                isUnlocked
                  ? `bg-gradient-to-br ${RARITY_COLORS[rarity]} shadow-lg ${RARITY_GLOW[rarity]} hover:scale-105`
                  : 'bg-earth-800/50 border-earth-700/50 opacity-50 hover:opacity-70'
              } ${isSelected ? 'ring-2 ring-brand-400 ring-offset-1 ring-offset-earth-950' : ''}`}
              title={badge.title}
            >
              <span className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                {badge.icon}
              </span>
              {!isUnlocked && (
                <Lock size={10} className="absolute top-1.5 right-1.5 text-earth-600" />
              )}
              {isUnlocked && rarity === 'legendary' && (
                <Sparkles size={10} className="absolute top-1.5 right-1.5 text-amber-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected badge detail */}
      {selectedBadge && (() => {
        const badge = ALL_BADGES.find(b => b.badgeId === selectedBadge)
        const achievement = achievements.find(a => a.badgeId === selectedBadge)
        if (!badge) return null
        const isUnlocked = !!achievement
        const rarity = badge.rarity as keyof typeof RARITY_LABELS

        return (
          <div className="mt-4 p-4 bg-earth-800/50 rounded-xl border border-earth-700">
            <div className="flex items-center gap-3">
              <span className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>{badge.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-semibold text-sm">{badge.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    rarity === 'legendary' ? 'bg-amber-400/10 text-amber-400' :
                    rarity === 'epic' ? 'bg-purple-400/10 text-purple-400' :
                    rarity === 'rare' ? 'bg-blue-400/10 text-blue-400' :
                    rarity === 'uncommon' ? 'bg-forest-400/10 text-forest-400' :
                    'bg-earth-700 text-earth-400'
                  }`}>
                    {RARITY_LABELS[rarity]}
                  </span>
                </div>
                <p className="text-earth-500 text-xs mt-0.5">
                  {isUnlocked
                    ? `Unlocked ${new Date(achievement!.unlockedAt).toLocaleDateString()}`
                    : 'Not yet unlocked'
                  }
                </p>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
