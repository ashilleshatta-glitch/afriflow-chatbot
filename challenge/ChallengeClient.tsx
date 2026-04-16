'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Flame, Trophy, CheckCircle2, Circle, Lock, Zap, Users,
  Share2, ChevronRight, Star, Calendar, ArrowRight, Award,
  Twitter, Linkedin, MessageCircle, Copy, Check, Loader2,
  BookOpen, Wrench, Briefcase, Palette, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  CHALLENGE_DAYS, CHALLENGE_ID, CHALLENGE_TOTAL_XP,
  CATEGORY_COLORS, type ChallengeDay,
} from '@/lib/challengeData'

// ─── Countdown Timer ─────────────────────────────────────
function Countdown() {
  // Next cohort: April 1 2026
  const target = new Date('2026-04-01T00:00:00Z').getTime()
  const [diff, setDiff] = useState(target - Date.now())

  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  if (diff <= 0) return <span className="text-brand-400 font-bold">LIVE NOW</span>

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  return (
    <div className="flex items-center gap-2 font-mono text-white">
      {[{ v: d, l: 'd' }, { v: h, l: 'h' }, { v: m, l: 'm' }, { v: s, l: 's' }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center">
          <span className="text-2xl font-bold text-brand-400">{String(v).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/30 uppercase">{l}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Category icon ─────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  foundations: <BookOpen className="w-3 h-3" />,
  automation:  <Zap className="w-3 h-3" />,
  business:    <Briefcase className="w-3 h-3" />,
  creator:     <Palette className="w-3 h-3" />,
  advanced:    <Wrench className="w-3 h-3" />,
}

// ─── Day Card ─────────────────────────────────────────────
function DayCard({
  day, completed, active, locked, onComplete, loading,
}: {
  day: ChallengeDay
  completed: boolean
  active: boolean
  locked: boolean
  onComplete: (dayNum: number) => void
  loading: number | null
}) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState('')
  const [shared, setShared] = useState(false)

  function shareDay() {
    const url = 'https://afriflowai.com/challenge'
    const text = `${day.sharePrompt}\n\n👉 Join me: ${url}`
    if (navigator.share) {
      navigator.share({ title: 'AfriFlow 30-Day Challenge', text, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
      toast.success('Share text copied!')
    }
  }

  const isLoading = loading === day.day

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        completed
          ? 'border-emerald-500/40 bg-emerald-500/5'
          : active
          ? 'border-brand-500/50 bg-brand-500/5 shadow-lg shadow-brand-500/10'
          : locked
          ? 'border-white/5 bg-white/2 opacity-50'
          : 'border-white/10 bg-white/3'
      }`}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => !locked && setExpanded(!expanded)}
      >
        {/* Day number / status icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
          completed ? 'bg-emerald-500 text-white' : active ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/30'
        }`}>
          {completed ? <CheckCircle2 className="w-5 h-5" /> : locked ? <Lock className="w-4 h-4" /> : day.day}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{day.title}</span>
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[day.category]}`}>
              {CATEGORY_ICONS[day.category]} {day.category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-white/40">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-brand-400" /> +{day.xp} XP</span>
            <span className="flex items-center gap-1">🔧 {day.tool}</span>
          </div>
        </div>

        {!locked && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {active && !completed && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold animate-pulse">TODAY</span>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </div>
        )}
      </div>

      {/* Expanded body */}
      {expanded && !locked && (
        <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
          <p className="text-white/70 text-sm leading-relaxed">{day.task}</p>

          {!completed && (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional: add a note about your experience today…"
                rows={2}
                className="input-field w-full text-sm resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onComplete(day.day)}
                  disabled={isLoading}
                  className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Marking…</>
                    : <><CheckCircle2 className="w-4 h-4" /> Mark Day {day.day} Complete</>
                  }
                </button>
                <button
                  onClick={shareDay}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm transition-colors"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}

          {completed && (
            <button
              onClick={shareDay}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              Share this win
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Leaderboard Row ──────────────────────────────────────
function LeaderRow({ p, rank }: { p: any; rank: number }) {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-7 text-center text-sm">
        {rank <= 3 ? medals[rank - 1] : <span className="text-white/30 font-mono text-xs">#{rank}</span>}
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-forest-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {p.userName?.[0]?.toUpperCase() || 'A'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{p.userName}</div>
        <div className="text-white/40 text-xs">{p.userCountry} · Day {p.completedDays?.length || 0}/30</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-brand-400 font-bold text-sm">{p.totalXpEarned?.toLocaleString()}</div>
        <div className="text-white/30 text-xs">XP</div>
      </div>
      {p.isCompleted && <span className="text-yellow-400 text-base">🏆</span>}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────
export default function ChallengeClient() {
  const { user, isAuthenticated } = useAuth()
  const [participant, setParticipant] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [lbStats, setLbStats] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 })
  const [joining, setJoining] = useState(false)
  const [loadingDay, setLoadingDay] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'challenge' | 'leaderboard'>('challenge')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const completedDays: number[] = participant?.completedDays || []
  const progressPct = Math.round((completedDays.length / 30) * 100)

  // Load participant + leaderboard
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/challenge').then((r) => setParticipant(r.data.participant)).catch(() => {})
    }
    axios.get('/api/challenge/leaderboard?limit=20')
      .then((r) => {
        setLeaderboard(r.data.participants || [])
        setLbStats({ total: r.data.total || 0, completed: r.data.completed || 0 })
      })
      .catch(() => {})
  }, [isAuthenticated])

  const handleJoin = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Sign in first to join the challenge!')
      return
    }
    setJoining(true)
    try {
      const { data } = await axios.post('/api/challenge')
      setParticipant(data.participant)
      toast.success(`🔥 You joined the 30-Day AI Challenge! +${data.xpAwarded} XP`)
    } catch {
      toast.error('Failed to join. Please try again.')
    } finally {
      setJoining(false)
    }
  }, [isAuthenticated])

  const handleCompleteDay = useCallback(async (day: number) => {
    if (!isAuthenticated) { toast.error('Sign in to track progress'); return }
    setLoadingDay(day)
    try {
      const { data } = await axios.post('/api/challenge/complete-day', { day })
      setParticipant(data.participant)
      toast.success(data.message)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to mark day complete')
    } finally {
      setLoadingDay(null)
    }
  }, [isAuthenticated])

  const filteredDays = filterCategory === 'all'
    ? CHALLENGE_DAYS
    : CHALLENGE_DAYS.filter((d) => d.category === filterCategory)

  return (
    <main className="min-h-screen bg-earth-950 pt-20">

      {/* ── Hero ── */}
      <div className="relative py-24 bg-earth-900 border-b border-earth-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-sm font-semibold mb-6">
            <Flame className="w-4 h-4 text-brand-400" /> 30-Day AI Challenge — Cohort Q2 2026
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Master AI in <span className="gradient-text">30 Days</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            One actionable AI task every day. Build real projects, earn XP, compete on the leaderboard, and walk away with a verified AfriFlow certificate.
          </p>

          {/* Countdown */}
          <div className="inline-flex flex-col items-center gap-2 mb-8">
            <span className="text-white/40 text-xs uppercase tracking-widest">Next cohort starts in</span>
            <Countdown />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!participant ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="btn-primary py-3.5 px-8 text-base flex items-center justify-center gap-2"
              >
                {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flame className="w-5 h-5" />}
                {joining ? 'Joining…' : 'Join the Challenge — Free'}
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('challenge')}
                className="btn-primary py-3.5 px-8 text-base flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5" /> Continue Challenge — Day {completedDays.length + 1}
              </button>
            )}
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="btn-secondary py-3.5 px-8 text-base flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" /> View Leaderboard
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-white/40">
            {[
              { icon: <Users className="w-4 h-4" />, label: `${lbStats.total.toLocaleString()} participants` },
              { icon: <Trophy className="w-4 h-4 text-yellow-400" />, label: `${lbStats.completed} completed` },
              { icon: <Zap className="w-4 h-4 text-brand-400" />, label: `${CHALLENGE_TOTAL_XP.toLocaleString()} XP available` },
              { icon: <Award className="w-4 h-4 text-emerald-400" />, label: 'Verified certificate' },
            ].map((s) => (
              <span key={s.label} className="flex items-center gap-1.5">{s.icon} {s.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Progress bar (if joined) ── */}
      {participant && (
        <div className="bg-earth-900/50 border-b border-earth-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-brand-400" />
                <span className="text-white font-semibold">Your Progress</span>
                <span className="text-brand-400 font-bold">{completedDays.length}/30 days</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-orange-400 font-semibold">
                  🔥 {participant.streak} streak
                </span>
                <span className="flex items-center gap-1 text-brand-400 font-semibold">
                  <Zap className="w-4 h-4" /> {participant.totalXpEarned} XP
                </span>
              </div>
            </div>
            <div className="w-full bg-earth-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-brand-500 to-forest-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>Day 1</span>
              <span>{progressPct}% complete</span>
              <span>Day 30 🏆</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="sticky top-16 z-20 bg-earth-950/80 backdrop-blur-md border-b border-earth-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1">
            {(['challenge', 'leaderboard'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-3.5 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === t
                    ? 'border-brand-500 text-brand-400'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                {t === 'challenge' ? '🗓 30-Day Calendar' : '🏆 Leaderboard'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Challenge Calendar ── */}
        {activeTab === 'challenge' && (
          <div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['all', 'foundations', 'automation', 'business', 'creator', 'advanced'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                    filterCategory === cat
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : `border-white/10 text-white/50 hover:text-white ${cat !== 'all' ? CATEGORY_COLORS[cat] || '' : ''}`
                  }`}
                >
                  {cat === 'all' ? '🗂 All Days' : `${cat}`}
                </button>
              ))}
            </div>

            {/* Day cards */}
            <div className="space-y-3">
              {filteredDays.map((day) => {
                const completed = completedDays.includes(day.day)
                const active = participant
                  ? !completed && day.day === Math.min(completedDays.length + 1, 30)
                  : day.day === 1
                const locked = !participant || (!completed && day.day > completedDays.length + 1)

                return (
                  <DayCard
                    key={day.day}
                    day={day}
                    completed={completed}
                    active={active}
                    locked={locked}
                    onComplete={handleCompleteDay}
                    loading={loadingDay}
                  />
                )
              })}
            </div>

            {/* Join CTA if not joined */}
            {!participant && (
              <div className="mt-10 card rounded-2xl p-8 text-center">
                <Flame className="w-12 h-12 text-brand-400 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">Ready to start?</h3>
                <p className="text-white/60 mb-5">Join the challenge to unlock daily tasks, track your progress, and compete for the top spot.</p>
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="btn-primary py-3 px-8 inline-flex items-center gap-2"
                >
                  {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                  {joining ? 'Joining…' : 'Join for Free'}
                </button>
              </div>
            )}

            {/* Completion celebration */}
            {participant?.isCompleted && (
              <div className="mt-10 rounded-2xl border-2 border-yellow-400/40 bg-yellow-400/5 p-8 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="font-display text-2xl font-bold text-yellow-400 mb-2">Challenge Complete!</h3>
                <p className="text-white/70 mb-6">
                  You completed all 30 days and earned <strong className="text-brand-400">{participant.totalXpEarned} XP</strong>!
                  Apply for your verified AfriFlow certificate now.
                </p>
                <Link href="/certificates" className="btn-primary inline-flex items-center gap-2 py-3 px-8">
                  <Award className="w-4 h-4" /> Get Your Certificate
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Leaderboard ── */}
        {activeTab === 'leaderboard' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <Users className="w-5 h-5 text-brand-400" />, value: lbStats.total, label: 'Participants' },
                { icon: <Trophy className="w-5 h-5 text-yellow-400" />, value: lbStats.completed, label: 'Completed' },
                { icon: <Zap className="w-5 h-5 text-brand-400" />, value: `${CHALLENGE_TOTAL_XP}`, label: 'Max XP' },
                { icon: <Calendar className="w-5 h-5 text-sky-400" />, value: '30', label: 'Days' },
              ].map((s) => (
                <div key={s.label} className="card rounded-2xl p-4 text-center">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-xl">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* My rank */}
            {participant && (
              <div className="card rounded-2xl p-5 mb-6 border border-brand-500/20 bg-brand-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-forest-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">You</div>
                    <div className="text-white/50 text-sm">
                      {completedDays.length}/30 days · 🔥 {participant.streak} streak
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-400 font-bold text-lg">{participant.totalXpEarned} XP</div>
                    {participant.isCompleted && <span className="text-yellow-400 text-sm">🏆 Completed</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Rankings */}
            <div className="card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Top Challengers</h3>
              {leaderboard.length > 0 ? (
                leaderboard.map((p, i) => <LeaderRow key={p._id || i} p={p} rank={i + 1} />)
              ) : (
                <div className="text-center py-10 text-white/40">
                  <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Be the first to join and top the leaderboard!</p>
                </div>
              )}
            </div>

            {/* Share banner */}
            <div className="mt-8 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-7 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Spread the word 🔥</h3>
              <p className="text-white/60 text-sm mb-5">Tag a friend to join the challenge. The more the merrier.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just joined the 30-Day #AfriFlowChallenge! One AI task every day for 30 days 🚀 Join me: https://afriflowai.com/challenge #Africa #AI')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DA1F2]/15 border border-[#1DA1F2]/30 text-[#1DA1F2] text-sm font-semibold hover:bg-[#1DA1F2]/25 transition-colors"
                >
                  <Twitter className="w-4 h-4" /> Share on X
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://afriflowai.com/challenge')}&title=${encodeURIComponent('30-Day AI Challenge — AfriFlow AI')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#58a6ff] text-sm font-semibold hover:bg-[#0A66C2]/25 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> Share on LinkedIn
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('🔥 Join me on the 30-Day AI Challenge by AfriFlow AI! One real AI task every day. Free to join 👉 https://afriflowai.com/challenge')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm font-semibold hover:bg-green-500/25 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
