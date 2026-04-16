'use client'

import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  TrendingUp, TrendingDown, Minus, Download, Globe,
  ChevronDown, ChevronUp, BarChart3, Users, Shield,
  Zap, Rocket, Info
} from 'lucide-react'
import {
  COUNTRY_DATA,
  ADDITIONAL_COUNTRIES,
  REPORT_INSIGHTS,
  INDEX_YEAR,
  INDEX_QUARTER,
  TOTAL_COUNTRIES,
  DIMENSION_DESCRIPTIONS,
  type CountryData,
} from '@/lib/benchmarkData'

type SortKey = 'rank' | 'digitalInfraScore' | 'talentScore' | 'policyScore' | 'adoptionScore' | 'startupScore'

const DIMENSIONS: { key: SortKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'rank', label: 'Overall', icon: Globe, color: 'text-brand-500' },
  { key: 'digitalInfraScore', label: 'Infrastructure', icon: Zap, color: 'text-blue-400' },
  { key: 'talentScore', label: 'Talent', icon: Users, color: 'text-purple-400' },
  { key: 'policyScore', label: 'Policy', icon: Shield, color: 'text-yellow-400' },
  { key: 'adoptionScore', label: 'Adoption', icon: BarChart3, color: 'text-forest-400' },
  { key: 'startupScore', label: 'Startups', icon: Rocket, color: 'text-pink-400' },
]

const REGIONS = ['All Regions', 'West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Central Africa']

function ScoreBar({ score, color = 'bg-brand-500' }: { score: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="w-7 text-right text-xs tabular-nums text-white/60">{score}</span>
    </div>
  )
}

function RankChange({ current, prev }: { current: number; prev: number }) {
  const diff = prev - current
  if (diff > 0) return <span className="flex items-center gap-0.5 text-xs text-forest-500"><TrendingUp className="h-3 w-3" />+{diff}</span>
  if (diff < 0) return <span className="flex items-center gap-0.5 text-xs text-red-400"><TrendingDown className="h-3 w-3" />{diff}</span>
  return <span className="flex items-center gap-0.5 text-xs text-white/30"><Minus className="h-3 w-3" /></span>
}

function CountryCard({ c, expanded, onToggle }: {
  c: CountryData
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className={`rounded-2xl border transition-all ${
      c.rank <= 3 ? 'border-brand-500/30 bg-brand-500/5' : 'border-white/10 bg-white/5'
    }`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        {/* Rank */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
          c.rank === 1 ? 'bg-yellow-500/20 text-yellow-400'
          : c.rank === 2 ? 'bg-gray-400/20 text-gray-300'
          : c.rank === 3 ? 'bg-orange-700/20 text-orange-400'
          : 'bg-white/10 text-white/60'
        }`}>
          #{c.rank}
        </div>

        {/* Flag + name */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-2xl">{c.flag}</span>
          <div>
            <div className="font-semibold text-white">{c.country}</div>
            <div className="text-xs text-white/40">{c.region}</div>
          </div>
        </div>

        {/* Rank change */}
        <div className="hidden sm:block">
          <RankChange current={c.rank} prev={c.prevRank} />
        </div>

        {/* Score */}
        <div className="ml-auto flex flex-col items-end gap-1">
          <div className="font-display text-xl font-bold text-white">{c.overallScore}</div>
          <div className="text-xs text-white/30">/ 100</div>
        </div>

        {/* Mini bar chart */}
        <div className="hidden w-24 lg:block">
          <ScoreBar score={c.overallScore} />
        </div>

        <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-white/10 px-5 pb-5 pt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Dimension breakdown */}
            <div>
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">Scores by Dimension</h4>
              <div className="space-y-2.5">
                {DIMENSIONS.filter((d) => d.key !== 'rank').map((dim) => (
                  <div key={dim.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <dim.icon className={`h-3.5 w-3.5 ${dim.color}`} />
                      {dim.label}
                    </div>
                    <ScoreBar score={c[dim.key as keyof CountryData] as number} />
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights + risks */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-forest-500">Highlights</h4>
                <ul className="space-y-1">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-0.5 text-forest-500">→</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-red-400">Risks</h4>
                <ul className="space-y-1">
                  {c.risks.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-0.5 text-red-400">!</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Key stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-4">
            {c.keyStats.map((s) => (
              <div key={s.label} className="rounded-lg bg-white/5 p-3">
                <div className="text-xs text-white/40">{s.label}</div>
                <div className="mt-0.5 text-sm font-semibold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BenchmarkClient() {
  const [sortBy, setSortBy] = useState<SortKey>('rank')
  const [region, setRegion] = useState('All Regions')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [gateForm, setGateForm] = useState({ email: '', name: '', company: '' })
  const [gateLoading, setGateLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')

  const sorted = useMemo(() => {
    let data = [...COUNTRY_DATA]
    if (region !== 'All Regions') data = data.filter((c) => c.region === region)
    if (sortBy === 'rank') return data.sort((a, b) => a.rank - b.rank)
    return data.sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
  }, [sortBy, region])

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault()
    if (!gateForm.email) { toast.error('Email required'); return }
    setGateLoading(true)
    try {
      const res = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gateForm),
      })
      const data = await res.json()
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl)
        toast.success('🎉 Report access granted! Check your email.')
        setShowGate(false)
      }
    } catch {
      toast.error('Failed to process request')
    } finally {
      setGateLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-earth-950">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-950/0 via-earth-950/50 to-earth-950" />

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <span className="section-tag mb-6">
            African AI Adoption Index · {INDEX_QUARTER} {INDEX_YEAR}
          </span>
          <h1 className="font-display text-5xl font-bold text-white lg:text-7xl">
            Africa&apos;s{' '}
            <span className="gradient-text">AI Benchmark</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70">
            The definitive ranking of {TOTAL_COUNTRIES} African nations by AI readiness —
            covering talent, policy, infrastructure, adoption, and startup ecosystems.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setShowGate(true)}
              className="btn-primary flex items-center gap-2 text-lg"
            >
              <Download className="h-5 w-5" />
              Download Full Report (PDF)
            </button>
            <a href="#rankings" className="btn-secondary text-lg">
              View Rankings →
            </a>
          </div>
        </div>
      </section>

      {/* ── HEADLINE INSIGHTS ── */}
      <section className="border-y border-white/10 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-white/40">
            Key Findings — {INDEX_QUARTER} {INDEX_YEAR}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REPORT_INSIGHTS.map((insight) => (
              <div key={insight} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <p className="text-sm text-white/70">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP 3 PODIUM ── */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <span className="section-tag mb-4">Top Performers</span>
            <h2 className="font-display text-3xl font-bold text-white">The Podium</h2>
          </div>

          <div className="mt-10 flex flex-col items-end justify-center gap-4 sm:flex-row">
            {/* 2nd */}
            <div className="order-1 w-full text-center sm:w-48 sm:pb-0">
              <div className="rounded-2xl border border-gray-400/20 bg-gray-400/10 p-6 sm:rounded-b-none sm:rounded-t-2xl" style={{ height: '180px' }}>
                <div className="text-4xl">{COUNTRY_DATA[1].flag}</div>
                <div className="mt-2 font-bold text-white">{COUNTRY_DATA[1].country}</div>
                <div className="font-display text-2xl font-bold text-gray-300">{COUNTRY_DATA[1].overallScore}</div>
                <div className="text-xs text-white/40">Silver</div>
              </div>
            </div>
            {/* 1st */}
            <div className="order-first w-full text-center sm:order-2 sm:w-56">
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 sm:rounded-b-none sm:rounded-t-2xl" style={{ height: '220px' }}>
                <div className="text-5xl">{COUNTRY_DATA[0].flag}</div>
                <div className="mt-2 font-bold text-white">{COUNTRY_DATA[0].country}</div>
                <div className="font-display text-3xl font-bold text-yellow-400">{COUNTRY_DATA[0].overallScore}</div>
                <div className="text-xs text-white/40">🥇 Gold</div>
              </div>
            </div>
            {/* 3rd */}
            <div className="order-3 w-full text-center sm:w-48">
              <div className="rounded-2xl border border-orange-700/20 bg-orange-700/10 p-6 sm:rounded-b-none sm:rounded-t-2xl" style={{ height: '160px' }}>
                <div className="text-4xl">{COUNTRY_DATA[2].flag}</div>
                <div className="mt-2 font-bold text-white">{COUNTRY_DATA[2].country}</div>
                <div className="font-display text-2xl font-bold text-orange-400">{COUNTRY_DATA[2].overallScore}</div>
                <div className="text-xs text-white/40">Bronze</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL RANKINGS TABLE ── */}
      <section id="rankings" className="py-10">
        <div className="mx-auto max-w-5xl px-4">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-white">Full Rankings</h2>
            <div className="flex flex-wrap gap-3">
              {/* Region filter */}
              <select
                className="input-field py-2 text-sm"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>

              {/* Sort */}
              <select
                className="input-field py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                {DIMENSIONS.map((d) => (
                  <option key={d.key} value={d.key}>Sort: {d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dimension legend */}
          <div className="mb-4 flex flex-wrap gap-3">
            {DIMENSIONS.filter((d) => d.key !== 'rank').map((dim) => (
              <button
                key={dim.key}
                onClick={() => setSortBy(dim.key)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                  sortBy === dim.key ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-white/10 text-white/40 hover:text-white'
                }`}
                title={DIMENSION_DESCRIPTIONS[dim.key]}
              >
                <dim.icon className={`h-3 w-3 ${dim.color}`} />
                {dim.label}
              </button>
            ))}
          </div>

          {/* Country cards */}
          <div className="space-y-3">
            {sorted.map((c) => (
              <CountryCard
                key={c.code}
                c={c}
                expanded={expanded === c.code}
                onToggle={() => setExpanded(expanded === c.code ? null : c.code)}
              />
            ))}
          </div>

          {/* Locked additional countries */}
          <div className="mt-4 rounded-2xl border border-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                Countries #{COUNTRY_DATA.length + 1}–{TOTAL_COUNTRIES}
              </h3>
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs text-brand-400">
                Full Report
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ADDITIONAL_COUNTRIES.map((c) => (
                <div key={c.country} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-sm text-white/70">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">#{c.rank}</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full bg-white/20" style={{ width: `${c.overallScore}%` }} />
                    </div>
                    <span className="text-xs text-white/40">{c.overallScore}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGate(true)}
              className="btn-primary mt-5 flex w-full items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Full 22-Country Report (Free PDF)
            </button>
          </div>
        </div>
      </section>

      {/* ── GATED PDF DOWNLOAD MODAL ── */}
      {showGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-earth-950 p-8 shadow-2xl">
            {downloadUrl ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-500/20">
                  <Download className="h-8 w-8 text-forest-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">Access Granted!</h3>
                <p className="mt-2 text-white/60">Your full report is ready.</p>
                <a
                  href={downloadUrl}
                  className="btn-primary mt-6 inline-block"
                  onClick={() => setShowGate(false)}
                >
                  Download Report PDF
                </a>
              </div>
            ) : (
              <>
                <h3 className="mb-1 font-display text-2xl font-bold text-white">
                  Get the Full Report
                </h3>
                <p className="mb-6 text-sm text-white/50">
                  22 country profiles, 50+ data points, policy analysis & investment map.
                  Free — no credit card.
                </p>
                <form onSubmit={handleDownload} className="space-y-4">
                  <input
                    className="input-field w-full"
                    type="email"
                    placeholder="Work email *"
                    value={gateForm.email}
                    onChange={(e) => setGateForm({ ...gateForm, email: e.target.value })}
                    required
                  />
                  <input
                    className="input-field w-full"
                    placeholder="Your name"
                    value={gateForm.name}
                    onChange={(e) => setGateForm({ ...gateForm, name: e.target.value })}
                  />
                  <input
                    className="input-field w-full"
                    placeholder="Company / Organisation"
                    value={gateForm.company}
                    onChange={(e) => setGateForm({ ...gateForm, company: e.target.value })}
                  />
                  <button type="submit" disabled={gateLoading} className="btn-primary w-full">
                    {gateLoading ? 'Processing…' : 'Get Free Report →'}
                  </button>
                </form>
                <button
                  onClick={() => setShowGate(false)}
                  className="mt-3 w-full text-center text-sm text-white/30 hover:text-white"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
