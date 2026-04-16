'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/AfriAICoach'
import api from '@/lib/api'
import {
  Search, MapPin, Briefcase, Clock, Star, Filter,
  Wifi, DollarSign, ChevronRight, RefreshCw, Shield, Zap, X,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Job {
  _id: string
  companyName: string
  companyLogoUrl?: string
  companyCountry: string
  title: string
  requiredSkills: string[]
  requiredCertifications: string[]
  type: string
  remote: boolean
  location: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  salaryPeriod: string
  applicationCount: number
  isFeatured: boolean
  isVerifiedEmployer: boolean
  minimumVerificationScore: number
  createdAt: string
}

const JOB_TYPES = ['fulltime', 'parttime', 'freelance', 'internship', 'contract']
const TYPE_LABELS: Record<string, string> = {
  fulltime: 'Full-time', parttime: 'Part-time',
  freelance: 'Freelance', internship: 'Internship', contract: 'Contract',
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function salaryStr(job: Job) {
  if (!job.salaryMin && !job.salaryMax) return null
  const period = job.salaryPeriod === 'monthly' ? '/mo' : job.salaryPeriod === 'annual' ? '/yr' : '/project'
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)
  if (job.salaryMin && job.salaryMax)
    return `${job.currency} ${fmt(job.salaryMin)}–${fmt(job.salaryMax)}${period}`
  if (job.salaryMin) return `From ${job.currency} ${fmt(job.salaryMin)}${period}`
  return `Up to ${job.currency} ${fmt(job.salaryMax!)}${period}`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── Job Card ───────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const salary = salaryStr(job)
  return (
    <Link
      href={`/work/${job._id}`}
      className={`card group block hover:border-brand-500/30 transition-all ${job.isFeatured ? 'border-brand-500/40 bg-brand-500/5' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl font-bold text-white/40">
          {job.companyLogoUrl
            ? <img src={job.companyLogoUrl} alt={job.companyName} className="h-10 w-10 rounded-lg object-contain" />
            : job.companyName[0]
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {job.isFeatured && (
              <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-400 uppercase tracking-wide">
                Featured
              </span>
            )}
            {job.isVerifiedEmployer && (
              <span className="flex items-center gap-1 rounded-full bg-forest-500/20 px-2 py-0.5 text-[10px] font-semibold text-forest-400">
                <Shield size={9} /> Verified Employer
              </span>
            )}
          </div>

          <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-white/50">{job.companyName} · {job.companyCountry}</p>

          {/* Skills */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.requiredSkills.slice(0, 4).map(s => (
              <span key={s} className="rounded-md bg-white/8 px-2 py-0.5 text-xs text-white/60">{s}</span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="rounded-md bg-white/8 px-2 py-0.5 text-xs text-white/40">+{job.requiredSkills.length - 4}</span>
            )}
          </div>

          {/* Cert badge */}
          {job.requiredCertifications.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <Zap size={11} className="text-brand-400" />
              <span className="text-xs text-brand-300">AfriFlow certified preferred</span>
            </div>
          )}
        </div>

        {/* Right meta */}
        <div className="hidden sm:flex shrink-0 flex-col items-end gap-1.5 text-right">
          {salary && <span className="text-sm font-semibold text-forest-400">{salary}</span>}
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            {job.remote && <><Wifi size={11} className="text-forest-400" /><span className="text-forest-400">Remote</span></>}
            {!job.remote && <><MapPin size={11} /><span>{job.location}</span></>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Briefcase size={10} /> {TYPE_LABELS[job.type] ?? job.type}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Clock size={10} /> {timeAgo(job.createdAt)}
          </div>
          {job.applicationCount > 0 && (
            <span className="text-xs text-white/30">{job.applicationCount} applicants</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function WorkPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [featured, setFeatured] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    type: '', remote: '', country: '', skill: '', salaryMin: '',
  })

  const fetchJobs = useCallback(async (pg = 1, append = false) => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(pg), limit: '20' }
      if (search)         params.search    = search
      if (filters.type)   params.type      = filters.type
      if (filters.remote === 'true') params.remote = 'true'
      if (filters.country) params.country  = filters.country
      if (filters.skill)   params.skill    = filters.skill
      if (filters.salaryMin) params.salaryMin = filters.salaryMin

      const res = await api.get('/work/jobs', { params })
      const d = res.data
      setJobs(prev => append ? [...prev, ...d.data] : d.data)
      if (!append) setFeatured(d.featured ?? [])
      setTotal(d.total)
      setHasMore(d.hasMore)
      setPage(pg)
    } catch {
      // Fallback to mock data when no DB
      if (!append) setJobs(MOCK_JOBS)
    } finally {
      setLoading(false)
    }
  }, [search, filters])

  useEffect(() => { fetchJobs(1) }, [fetchJobs])

  const clearFilters = () => {
    setFilters({ type: '', remote: '', country: '', skill: '', salaryMin: '' })
    setSearch('')
  }

  const hasActiveFilters = Object.values(filters).some(Boolean) || search

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-white/10 pt-24 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400">
              <Briefcase size={12} /> AfriFlow Work — AI Talent Marketplace
            </div>
            <h1 className="font-display text-4xl font-bold text-white">
              Find AI Jobs in Africa
            </h1>
            <p className="mt-2 text-lg text-white/50">
              Pre-verified AI talent. Apply with your AfriFlow ID — no CV needed.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchJobs(1)}
                placeholder="Job title, skill, company..."
                className="input w-full pl-9 py-3"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                  : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <Filter size={14} />
              Filters
              {hasActiveFilters && <span className="ml-1 rounded-full bg-brand-500 text-white text-[10px] px-1.5 py-0.5">ON</span>}
            </button>
            <Link
              href="/work/post"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-400 hover:bg-brand-500/20 transition-colors"
            >
              Post a job
            </Link>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-5">
              <select
                value={filters.type}
                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                className="input text-sm"
              >
                <option value="">All types</option>
                {JOB_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>

              <select
                value={filters.remote}
                onChange={e => setFilters(f => ({ ...f, remote: e.target.value }))}
                className="input text-sm"
              >
                <option value="">Remote & Onsite</option>
                <option value="true">Remote only</option>
              </select>

              <input
                type="text"
                value={filters.country}
                onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
                placeholder="Country..."
                className="input text-sm"
              />

              <input
                type="text"
                value={filters.skill}
                onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
                placeholder="Required skill..."
                className="input text-sm"
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={e => setFilters(f => ({ ...f, salaryMin: e.target.value }))}
                  placeholder="Min salary"
                  className="input text-sm flex-1"
                />
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="rounded-lg p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Featured jobs */}
            {featured.length > 0 && (
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <Star size={14} className="text-brand-400" />
                  <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Featured Jobs</h2>
                </div>
                <div className="space-y-3">
                  {featured.map(job => <JobCard key={job._id} job={job} />)}
                </div>
                <div className="mt-4 border-t border-white/10" />
              </div>
            )}

            {/* Job count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/40">
                {loading ? 'Loading…' : `${total.toLocaleString()} job${total !== 1 ? 's' : ''} found`}
              </p>
              <button onClick={() => fetchJobs(1)} className="text-xs text-white/30 hover:text-white flex items-center gap-1 transition-colors">
                <RefreshCw size={11} /> Refresh
              </button>
            </div>

            {/* Job list */}
            {loading && jobs.length === 0 ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-white/5" />
                        <div className="h-3 w-1/2 rounded bg-white/5" />
                        <div className="flex gap-2">
                          {[1, 2, 3].map(i => <div key={i} className="h-5 w-16 rounded bg-white/5" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/30">
                <Briefcase size={40} className="mb-3" />
                <p className="font-medium text-white/50">No jobs match your filters</p>
                <p className="text-sm mt-1">Try broadening your search or <button onClick={clearFilters} className="text-brand-400 underline">clear filters</button></p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <button
                onClick={() => fetchJobs(page + 1, true)}
                disabled={loading}
                className="mt-6 w-full rounded-xl border border-white/10 py-3 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                Load more jobs
              </button>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-4">

              {/* Post a job CTA */}
              <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-b from-brand-500/10 to-transparent p-5">
                <h3 className="font-semibold text-white mb-1">Hiring AI talent?</h3>
                <p className="text-sm text-white/50 mb-4">Post a job and reach 24,000+ verified AfriFlow graduates.</p>
                <Link href="/work/post" className="btn-primary w-full justify-center text-sm py-2.5">
                  Post a job →
                </Link>
                <Link href="/work/employers" className="mt-2 block text-center text-xs text-white/40 hover:text-white/60 transition-colors">
                  Search candidates instead
                </Link>
              </div>

              {/* Employer search CTA */}
              <div className="rounded-2xl border border-forest-500/20 bg-forest-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-forest-400" />
                  <h3 className="text-sm font-semibold text-white">AfriFlow Verified</h3>
                </div>
                <p className="text-xs text-white/50 mb-3">
                  Every applicant carries a verified skill profile and verification score. No fake CVs.
                </p>
                <Link href="/work/employers" className="text-xs text-forest-400 hover:text-forest-300 flex items-center gap-1 transition-colors">
                  How verification works <ChevronRight size={12} />
                </Link>
              </div>

              {/* Stats */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                {[
                  { label: 'Verified graduates', value: '24,000+' },
                  { label: 'Jobs posted', value: `${total || 0}` },
                  { label: 'Average time-to-hire', value: '12 days' },
                  { label: 'Countries hiring', value: '32' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-white/40">{s.label}</span>
                    <span className="font-semibold text-white">{s.value}</span>
                  </div>
                ))}
              </div>

            </div>
          </aside>
        </div>
      </div>

      <Footer />
      <AfriAICoach />
    </div>
  )
}

// ─── Mock data (shown when DB is offline during dev) ──────────────────────
const MOCK_JOBS: Job[] = [
  {
    _id: 'mock-1', companyName: 'Flutterwave', companyCountry: 'Nigeria',
    title: 'AI Automation Engineer', requiredSkills: ['Zapier', 'Make', 'Python', 'GPT-4'],
    requiredCertifications: ['No-Code Automation'], type: 'fulltime', remote: true,
    location: 'Lagos / Remote', salaryMin: 3000, salaryMax: 6000, currency: 'USD',
    salaryPeriod: 'monthly', applicationCount: 47, isFeatured: true,
    isVerifiedEmployer: true, minimumVerificationScore: 60, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'mock-2', companyName: 'Andela', companyCountry: 'Kenya',
    title: 'AI Product Consultant', requiredSkills: ['ChatGPT', 'Claude', 'Notion AI', 'Airtable'],
    requiredCertifications: [], type: 'contract', remote: true,
    location: 'Nairobi / Remote', salaryMin: 2000, salaryMax: 4500, currency: 'USD',
    salaryPeriod: 'monthly', applicationCount: 23, isFeatured: false,
    isVerifiedEmployer: true, minimumVerificationScore: 40, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: 'mock-3', companyName: 'TechCabal Media', companyCountry: 'Ghana',
    title: 'AI Content Strategist', requiredSkills: ['ChatGPT', 'Midjourney', 'Notion AI'],
    requiredCertifications: ['AI for Business'], type: 'parttime', remote: false,
    location: 'Accra', salaryMin: 800, salaryMax: 1500, currency: 'USD',
    salaryPeriod: 'monthly', applicationCount: 12, isFeatured: false,
    isVerifiedEmployer: false, minimumVerificationScore: 0, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'mock-4', companyName: 'Paystack', companyCountry: 'Nigeria',
    title: 'AI Integration Developer', requiredSkills: ['n8n', 'Zapier', 'REST APIs', 'JavaScript'],
    requiredCertifications: ['AI Builder'], type: 'fulltime', remote: false,
    location: 'Lagos', salaryMin: 4000, salaryMax: 8000, currency: 'USD',
    salaryPeriod: 'monthly', applicationCount: 61, isFeatured: true,
    isVerifiedEmployer: true, minimumVerificationScore: 70, createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'mock-5', companyName: 'BRCK Education', companyCountry: 'Kenya',
    title: 'AI Learning Designer (Internship)', requiredSkills: ['ChatGPT', 'Canva AI', 'Notion'],
    requiredCertifications: [], type: 'internship', remote: true,
    location: 'Remote', salaryMin: 300, salaryMax: 600, currency: 'USD',
    salaryPeriod: 'monthly', applicationCount: 8, isFeatured: false,
    isVerifiedEmployer: false, minimumVerificationScore: 0, createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
]
