'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/AfriAICoach'
import api from '@/lib/api'
import {
  Search, Shield, Award, Wifi, MapPin, Star, Users, ChevronRight,
  RefreshCw, Briefcase, Zap, Globe, CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Candidate {
  publicId: string
  userId: string
  name: string
  email: string
  headline?: string
  country?: string
  verificationScore: number
  xp: number
  preferredWorkType?: string
  skills: { name: string; level: string }[]
  verifiedCerts: number
}

const SCORE_COLOR = (s: number) =>
  s >= 80 ? 'text-forest-400' : s >= 50 ? 'text-brand-400' : 'text-amber-400'

const SCORE_BAR = (s: number) =>
  s >= 80 ? 'bg-forest-500' : s >= 50 ? 'bg-brand-500' : 'bg-amber-500'

const STATS = [
  { value: '12,000+', label: 'Verified AI professionals' },
  { value: '54', label: 'African countries represented' },
  { value: '94%', label: 'Placement satisfaction rate' },
  { value: '3× faster', label: 'Hiring vs traditional CVs' },
]

export default function EmployersPage() {
  const [searchParams, setSearchParams] = useState({
    skill: '', country: '', cert: '', minScore: '', workType: '',
  })
  const [results, setResults] = useState<Candidate[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const params = Object.fromEntries(Object.entries(searchParams).filter(([, v]) => v.trim()))
      const res = await api.get('/work/employers/search', { params })
      setResults(res.data.data ?? [])
    } catch {
      toast.error('Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-earth-950 via-earth-900 to-brand-950 pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm text-brand-300">
            <Shield size={13} /> Africa&apos;s AI Talent Network
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Hire pre-verified <span className="gradient-text">AI talent</span>
            <br />across Africa
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/50">
            Every candidate has a verified AfriFlow ID — skills scored, certifications on-chain,
            no CVs to screen. Hire in days, not months.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/work/post" className="btn-primary px-8 py-3 text-base gap-2">
              <Briefcase size={16} /> Post a Job
            </Link>
            <a href="#search" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3 text-base text-white/70 hover:text-white hover:border-white/20 transition-colors">
              Search Candidates
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/2 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AfriFlow */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-white">
            Why hire AfriFlow graduates?
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Shield, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20',
                title: 'Every skill is verified',
                desc: 'Candidates earn their AfriFlow ID through assessments, projects, and peer reviews — not just self-reported skills.',
              },
              {
                icon: Award, color: 'text-forest-400', bg: 'bg-forest-500/10 border-forest-500/20',
                title: 'AI-native training',
                desc: 'Our curriculum is built for African market realities — LLMs, computer vision, data pipelines, and more.',
              },
              {
                icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20',
                title: '54 countries, one platform',
                desc: 'Build distributed teams across the continent. Pan-African contracts and payments supported.',
              },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className={`rounded-2xl border p-6 ${bg}`}>
                <Icon size={22} className={color} />
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidate search */}
      <section id="search" className="py-16 bg-white/2 border-y border-white/5 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 font-display text-2xl font-bold text-white">Search Candidates</h2>
          <p className="mb-8 text-sm text-white/40">Find professionals who have opted-in to job opportunities.</p>

          {/* Search form */}
          <div className="card mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="label text-xs">Skill</label>
                <input value={searchParams.skill} onChange={e => setSearchParams(p => ({ ...p, skill: e.target.value }))}
                  className="input w-full text-sm" placeholder="e.g. Python, NLP" />
              </div>
              <div>
                <label className="label text-xs">Country</label>
                <input value={searchParams.country} onChange={e => setSearchParams(p => ({ ...p, country: e.target.value }))}
                  className="input w-full text-sm" placeholder="e.g. Nigeria" />
              </div>
              <div>
                <label className="label text-xs">Certification</label>
                <input value={searchParams.cert} onChange={e => setSearchParams(p => ({ ...p, cert: e.target.value }))}
                  className="input w-full text-sm" placeholder="e.g. Machine Learning" />
              </div>
              <div>
                <label className="label text-xs">Min Score</label>
                <input type="number" min={0} max={100} value={searchParams.minScore}
                  onChange={e => setSearchParams(p => ({ ...p, minScore: e.target.value }))}
                  className="input w-full text-sm" placeholder="0–100" />
              </div>
              <div>
                <label className="label text-xs">Work Type</label>
                <select value={searchParams.workType} onChange={e => setSearchParams(p => ({ ...p, workType: e.target.value }))} className="input w-full text-sm">
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handleSearch} disabled={loading} className="btn-primary gap-2 px-8 py-2.5 disabled:opacity-60">
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Search candidates
              </button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div>
              {loading ? (
                <div className="flex justify-center py-16 text-white/30">
                  <RefreshCw size={24} className="animate-spin" />
                </div>
              ) : results.length === 0 ? (
                <div className="py-16 text-center">
                  <Users size={32} className="mx-auto mb-3 text-white/10" />
                  <p className="text-white/30">No candidates found. Try broadening your search.</p>
                </div>
              ) : (
                <>
                  <p className="mb-5 text-sm text-white/30">{results.length} candidate{results.length !== 1 ? 's' : ''} found</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map(c => (
                      <div key={c.publicId} className="card hover:border-white/20 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-xs text-brand-400 font-mono mt-0.5">{c.publicId}</p>
                            {c.headline && <p className="text-xs text-white/50 mt-1">{c.headline}</p>}
                          </div>
                          <div className={`text-right text-sm font-bold ${SCORE_COLOR(c.verificationScore)}`}>
                            {c.verificationScore}
                            <p className="text-[10px] font-normal text-white/20">/ 100</p>
                          </div>
                        </div>

                        {/* Score bar */}
                        <div className="mt-3 h-1 w-full rounded-full bg-white/10">
                          <div className={`h-1 rounded-full ${SCORE_BAR(c.verificationScore)} transition-all`} style={{ width: `${c.verificationScore}%` }} />
                        </div>

                        {/* Meta */}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/40">
                          {c.country && <span className="flex items-center gap-1"><MapPin size={10} />{c.country}</span>}
                          {c.preferredWorkType && <span className="flex items-center gap-1"><Wifi size={10} /> {c.preferredWorkType}</span>}
                          <span className="flex items-center gap-1"><Zap size={10} />{c.xp.toLocaleString()} XP</span>
                          {c.verifiedCerts > 0 && <span className="flex items-center gap-1"><Award size={10} />{c.verifiedCerts} cert{c.verifiedCerts !== 1 ? 's' : ''}</span>}
                        </div>

                        {/* Top skills */}
                        {c.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {c.skills.slice(0, 4).map(s => (
                              <span key={s.name} className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] text-white/50">{s.name}</span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <Link href={`/id/${c.publicId}`} target="_blank"
                            className="flex-1 rounded-xl border border-white/10 py-2 text-center text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors">
                            View ID
                          </Link>
                          <Link href={`/work/post?preselect=${encodeURIComponent(c.publicId)}`}
                            className="flex-1 btn-primary py-2 text-xs justify-center gap-1">
                            <Star size={11} /> Shortlist
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Post a job CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-forest-500/5 p-10">
            <CheckCircle size={32} className="mx-auto mb-4 text-brand-400" />
            <h2 className="font-display text-2xl font-bold text-white">Ready to hire Africa&apos;s best AI talent?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/50 text-sm">Post your job in minutes. Candidates apply with one click using their verified AfriFlow ID.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/work/post" className="btn-primary px-8 py-3 gap-2">
                <Briefcase size={16} /> Post a Job Free
              </Link>
              <Link href="/work" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3 text-sm text-white/60 hover:text-white transition-colors">
                Browse all jobs <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AfriAICoach />
    </div>
  )
}
