'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import { Trophy, Flame, Star, Crown, Medal, Search, Globe, TrendingUp, ChevronDown, Zap } from 'lucide-react'
import { leaderboardApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const RARITY_COLORS: Record<string, string> = {
  'AI Curious': 'text-earth-400',
  'AI Aware': 'text-earth-300',
  'AI Explorer': 'text-blue-400',
  'AI Learner': 'text-cyan-400',
  'AI Practitioner': 'text-forest-400',
  'AI Specialist': 'text-purple-400',
  'AI Builder': 'text-brand-400',
  'AI Expert': 'text-amber-400',
  'AI Leader': 'text-red-400',
  'AI Master': 'text-yellow-300',
}

const RANK_ICONS = ['👑', '🥈', '🥉']

const COUNTRY_FLAGS: Record<string, string> = {
  'Ghana': '🇬🇭', 'Nigeria': '🇳🇬', 'Kenya': '🇰🇪', 'South Africa': '🇿🇦',
  'Rwanda': '🇷🇼', 'Ethiopia': '🇪🇹', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬',
  'Senegal': '🇸🇳', 'Cameroon': '🇨🇲', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦',
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedCountry])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const res = await leaderboardApi.get(
        selectedCountry !== 'all' ? selectedCountry : undefined,
        50
      )
      setLeaderboard(res.data.leaderboard)
      if (res.data.countries) setCountries(res.data.countries)
    } catch {
      // Use mock data if API fails
      setLeaderboard(MOCK_LEADERBOARD)
    }
    setIsLoading(false)
  }

  const filteredBoard = searchQuery
    ? leaderboard.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : leaderboard

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="relative bg-earth-900 border-b border-earth-800 py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 glow-orb bg-amber-500/10 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Trophy size={14} /> Global Rankings
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              AfriFlow <span className="gradient-text">Leaderboard</span>
            </h1>
            <p className="text-earth-400 text-lg max-w-2xl mx-auto">
              See who&apos;s leading the AI revolution across Africa. Climb the ranks by completing courses, earning XP, and building your streak.
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500" />
              <input
                type="text"
                placeholder="Search learners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            {/* Country filter */}
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="input-field pl-10 pr-10 appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="all">All Countries</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-500 pointer-events-none" />
            </div>
          </div>

          {/* Top 3 Podium */}
          {filteredBoard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[filteredBoard[1], filteredBoard[0], filteredBoard[2]].map((u, idx) => {
                const order = [2, 1, 3][idx]
                const isFirst = order === 1
                return (
                  <div
                    key={u.rank}
                    className={`relative bg-earth-900 border rounded-2xl p-6 text-center transition-all hover:scale-[1.02] ${
                      isFirst
                        ? 'border-amber-500/40 shadow-lg shadow-amber-500/10 -mt-4'
                        : 'border-earth-800'
                    }`}
                  >
                    <div className="text-3xl mb-3">{RANK_ICONS[order - 1]}</div>
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-3 ${
                      isFirst
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white'
                        : 'bg-earth-800 text-earth-300'
                    }`}>
                      {u.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1 truncate">{u.name}</h3>
                    <p className="text-earth-500 text-xs mb-2">
                      {COUNTRY_FLAGS[u.country] || '🌍'} {u.country}
                    </p>
                    <div className={`text-xs font-medium mb-2 ${RARITY_COLORS[u.level?.title] || 'text-earth-400'}`}>
                      {u.level?.title}
                    </div>
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={12} fill="currentColor" /> {u.xp?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        <Flame size={12} /> {u.streak}d
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full leaderboard table */}
          <div className="bg-earth-900 border border-earth-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_100px_80px_100px] gap-4 px-6 py-3 border-b border-earth-800 text-xs text-earth-500 font-medium uppercase tracking-wider">
              <span>Rank</span>
              <span>Learner</span>
              <span className="text-right">XP</span>
              <span className="text-right">Streak</span>
              <span className="text-right">Level</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-earth-500 text-sm">Loading leaderboard...</p>
              </div>
            ) : filteredBoard.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-earth-500">No learners found</p>
              </div>
            ) : (
              filteredBoard.map((entry) => {
                const isCurrentUser = user?.name === entry.name
                return (
                  <div
                    key={entry.rank}
                    className={`grid grid-cols-[60px_1fr_100px_80px_100px] gap-4 px-6 py-4 items-center border-b border-earth-800/50 hover:bg-earth-800/30 transition-colors ${
                      isCurrentUser ? 'bg-brand-500/5 border-l-2 border-l-brand-500' : ''
                    }`}
                  >
                    <span className={`font-bold text-sm ${
                      entry.rank <= 3 ? 'text-amber-400' : 'text-earth-500'
                    }`}>
                      {entry.rank <= 3 ? RANK_ICONS[entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-gradient-to-br from-earth-700 to-earth-800 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {entry.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {entry.name}
                          {isCurrentUser && <span className="text-brand-400 text-xs ml-2">(You)</span>}
                        </p>
                        <p className="text-earth-600 text-xs">
                          {COUNTRY_FLAGS[entry.country] || '🌍'} {entry.country}
                        </p>
                      </div>
                    </div>
                    <span className="text-right text-amber-400 font-semibold text-sm">
                      {entry.xp?.toLocaleString()}
                    </span>
                    <span className="text-right text-orange-400 text-sm flex items-center justify-end gap-1">
                      <Flame size={12} /> {entry.streak}
                    </span>
                    <span className={`text-right text-xs font-medium ${RARITY_COLORS[entry.level?.title] || 'text-earth-400'}`}>
                      {entry.level?.title}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}

// Fallback mock data
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Kwame Asante', country: 'Ghana', xp: 4850, streak: 45, level: { title: 'AI Expert' } },
  { rank: 2, name: 'Chioma Okafor', country: 'Nigeria', xp: 4200, streak: 38, level: { title: 'AI Expert' } },
  { rank: 3, name: 'Aisha Kamara', country: 'Kenya', xp: 3800, streak: 31, level: { title: 'AI Builder' } },
  { rank: 4, name: 'Samuel Mensah', country: 'Ghana', xp: 3200, streak: 25, level: { title: 'AI Builder' } },
  { rank: 5, name: 'Fatima Hassan', country: 'Nigeria', xp: 2900, streak: 22, level: { title: 'AI Builder' } },
  { rank: 6, name: 'David Osei', country: 'Ghana', xp: 2600, streak: 19, level: { title: 'AI Specialist' } },
  { rank: 7, name: 'Grace Wanjiku', country: 'Kenya', xp: 2400, streak: 17, level: { title: 'AI Specialist' } },
  { rank: 8, name: 'Ibrahim Diallo', country: 'Senegal', xp: 2100, streak: 15, level: { title: 'AI Specialist' } },
  { rank: 9, name: 'Nana Ama', country: 'Ghana', xp: 1800, streak: 12, level: { title: 'AI Specialist' } },
  { rank: 10, name: 'Thandi Ndlovu', country: 'South Africa', xp: 1500, streak: 10, level: { title: 'AI Practitioner' } },
  { rank: 11, name: 'Emmanuel Kofi', country: 'Ghana', xp: 1300, streak: 9, level: { title: 'AI Practitioner' } },
  { rank: 12, name: 'Amina Bello', country: 'Nigeria', xp: 1100, streak: 8, level: { title: 'AI Practitioner' } },
]
