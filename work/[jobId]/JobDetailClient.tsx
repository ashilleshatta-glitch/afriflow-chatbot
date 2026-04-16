'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/AfriAICoach'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import {
  MapPin, Briefcase, Clock, DollarSign, Shield, Zap, ChevronLeft,
  CheckCircle, ExternalLink, Users, Star, RefreshCw, Award, Wifi,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Job {
  _id: string
  companyName: string
  companyLogoUrl?: string
  companySize?: string
  companyCountry: string
  title: string
  description: string
  responsibilities: string[]
  requirements: string[]
  requiredCertifications: string[]
  requiredSkills: string[]
  niceToHaveSkills: string[]
  minimumVerificationScore: number
  type: string
  remote: boolean
  location: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  salaryPeriod: string
  applicationDeadline?: string
  applicationCount: number
  isFeatured: boolean
  isVerifiedEmployer: boolean
  createdAt: string
}

interface SimilarJob {
  _id: string
  title: string
  companyName: string
  companyCountry: string
  type: string
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  currency: string
  isFeatured: boolean
  isVerifiedEmployer: boolean
}

const TYPE_LABELS: Record<string, string> = {
  fulltime: 'Full-time', parttime: 'Part-time',
  freelance: 'Freelance', internship: 'Internship', contract: 'Contract',
}

function salaryStr(job: Job | SimilarJob) {
  if (!job.salaryMin && !job.salaryMax) return null
  const period = (job as Job).salaryPeriod === 'monthly' ? '/mo' : '/yr'
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)
  if (job.salaryMin && job.salaryMax)
    return `${job.currency} ${fmt(job.salaryMin)}–${fmt(job.salaryMax)}${period}`
  if (job.salaryMin) return `From ${job.currency} ${fmt(job.salaryMin)}${period}`
  return null
}

export default function JobDetailClient({ jobId }: { jobId: string }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [similar, setSimilar] = useState<SimilarJob[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
  const [coverNote, setCoverNote] = useState('')
  const [showCoverNote, setShowCoverNote] = useState(false)

  useEffect(() => {
    if (!jobId) return
    Promise.all([
      api.get(`/work/jobs/${jobId}`),
      user ? api.get(`/work/jobs/${jobId}/apply`) : Promise.resolve({ data: { applied: false } }),
    ])
      .then(([jobRes, applyRes]) => {
        setJob(jobRes.data.data)
        setSimilar(jobRes.data.similar ?? [])
        setApplied(applyRes.data.applied)
        setApplicationStatus(applyRes.data.status)
      })
      .catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false))
  }, [jobId, user])

  const handleApply = async () => {
    if (!user) {
      router.push(`/auth/login?next=/work/${jobId}`)
      return
    }
    if (applied) return

    setApplying(true)
    try {
      await api.post(`/work/jobs/${jobId}/apply`, { coverNote })
      setApplied(true)
      setApplicationStatus('applied')
      setShowCoverNote(false)
      toast.success('🎉 Application submitted with your AfriFlow ID!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      if (msg?.includes('verification score')) {
        toast.error(msg)
      } else if (msg?.includes('already applied')) {
        setApplied(true)
        toast('You already applied for this job.')
      } else if (msg?.includes('AfriFlow ID')) {
        toast.error('Set up your AfriFlow ID first to apply.')
        router.push('/dashboard/my-id')
      } else {
        toast.error(msg ?? 'Application failed')
      }
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 text-white/30">
          <Briefcase size={40} className="mb-4" />
          <p className="text-lg font-medium text-white/50">Job not found</p>
          <Link href="/work" className="mt-4 text-brand-400 hover:text-brand-300">← Back to jobs</Link>
        </div>
      </div>
    )
  }

  const salary = salaryStr(job)
  const deadlinePassed = job.applicationDeadline && new Date(job.applicationDeadline) < new Date()

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 pt-24">

        {/* Back */}
        <Link href="/work" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={14} /> All jobs
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* ─── Main column ─── */}
          <div className="flex-1 min-w-0">

            {/* Header card */}
            <div className="card mb-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl font-bold text-white/40">
                  {job.companyLogoUrl
                    ? <img src={job.companyLogoUrl} alt={job.companyName} className="h-14 w-14 rounded-xl object-contain" />
                    : job.companyName[0]
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {job.isFeatured && (
                      <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-400 uppercase tracking-wide">Featured</span>
                    )}
                    {job.isVerifiedEmployer && (
                      <span className="flex items-center gap-1 rounded-full bg-forest-500/20 px-2 py-0.5 text-[10px] font-semibold text-forest-400">
                        <Shield size={9} /> Verified Employer
                      </span>
                    )}
                    {deadlinePassed && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">Deadline passed</span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white leading-tight">{job.title}</h1>
                  <p className="mt-1 text-white/50">{job.companyName} · {job.companyCountry}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} /> {TYPE_LABELS[job.type] ?? job.type}
                </span>
                <span className="flex items-center gap-1.5">
                  {job.remote ? <><Wifi size={13} className="text-forest-400" /><span className="text-forest-300">Remote</span></> : <><MapPin size={13} />{job.location}</>}
                </span>
                {salary && (
                  <span className="flex items-center gap-1.5 font-semibold text-forest-400">
                    <DollarSign size={13} /> {salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users size={13} /> {job.applicationCount} applicants
                </span>
                {job.applicationDeadline && !deadlinePassed && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Apply CTA */}
              <div className="mt-6 space-y-3">
                {applied ? (
                  <div className="flex items-center gap-2 rounded-xl border border-forest-500/30 bg-forest-500/10 px-4 py-3">
                    <CheckCircle size={16} className="text-forest-400" />
                    <div>
                      <p className="text-sm font-medium text-forest-300">Application submitted</p>
                      {applicationStatus && (
                        <p className="text-xs text-white/40 mt-0.5">Status: <span className="capitalize text-white/60">{applicationStatus}</span></p>
                      )}
                    </div>
                    <Link href="/dashboard/applications" className="ml-auto text-xs text-forest-400 hover:text-forest-300 transition-colors">
                      Track application →
                    </Link>
                  </div>
                ) : (
                  <>
                    {!showCoverNote ? (
                      <button
                        onClick={() => user ? setShowCoverNote(true) : router.push(`/auth/login?next=/work/${jobId}`)}
                        disabled={!!deadlinePassed || applying}
                        className="btn-primary w-full py-3 text-base justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Shield size={16} />
                        {user ? 'Apply with AfriFlow ID' : 'Sign in to apply'}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={coverNote}
                          onChange={e => setCoverNote(e.target.value)}
                          placeholder="Add a short cover note (optional, max 500 chars)..."
                          rows={3}
                          maxLength={500}
                          className="input w-full resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleApply}
                            disabled={applying}
                            className="btn-primary flex-1 py-2.5 justify-center gap-2"
                          >
                            {applying ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14} />}
                            Submit Application
                          </button>
                          <button
                            onClick={() => setShowCoverNote(false)}
                            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-xs text-white/30 text-center">
                          Your full AfriFlow ID profile will be shared — no CV needed.
                        </p>
                      </div>
                    )}
                    {!user && (
                      <p className="text-center text-xs text-white/30">
                        Your <Link href="/dashboard/my-id" className="text-brand-400 hover:text-brand-300">AfriFlow ID</Link> is your application. No CV required.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card mb-6">
              <h2 className="mb-4 font-semibold text-white">About this role</h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <div className="card mb-6">
                <h2 className="mb-4 font-semibold text-white">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-forest-400" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="card mb-6">
                <h2 className="mb-4 font-semibold text-white">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Zap size={13} className="mt-0.5 shrink-0 text-brand-400" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required certifications */}
            {job.requiredCertifications.length > 0 && (
              <div className="card mb-6 border-brand-500/20 bg-brand-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={16} className="text-brand-400" />
                  <h2 className="font-semibold text-white">Required AfriFlow Certifications</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requiredCertifications.map(cert => (
                    <span key={cert} className="flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm font-medium text-brand-300">
                      <Award size={12} /> {cert}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/40">
                  Don't have these yet?{' '}
                  <Link href="/courses" className="text-brand-400 hover:text-brand-300">Browse courses to earn them →</Link>
                </p>
                {job.minimumVerificationScore > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50">
                    <Shield size={12} className="text-brand-400" />
                    Minimum verification score required: <span className="font-bold text-brand-400 ml-1">{job.minimumVerificationScore}/100</span>
                  </div>
                )}
              </div>
            )}

            {/* Nice to have */}
            {job.niceToHaveSkills.length > 0 && (
              <div className="card mb-6">
                <h2 className="mb-3 font-semibold text-white">Nice to have</h2>
                <div className="flex flex-wrap gap-2">
                  {job.niceToHaveSkills.map(s => (
                    <span key={s} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/50">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Sidebar ─── */}
          <aside className="lg:w-72 shrink-0 space-y-4">

            {/* Company card */}
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold text-white/70 uppercase tracking-wider">Company</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg font-bold text-white/40">
                  {job.companyLogoUrl ? <img src={job.companyLogoUrl} alt="" className="h-9 w-9 rounded-lg object-contain" /> : job.companyName[0]}
                </div>
                <div>
                  <p className="font-medium text-white">{job.companyName}</p>
                  <p className="text-xs text-white/40">{job.companyCountry}</p>
                </div>
              </div>
              {job.companySize && (
                <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-3">
                  <span>Company size</span><span>{job.companySize}</span>
                </div>
              )}
              {job.isVerifiedEmployer && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-forest-400">
                  <Shield size={11} /> Verified employer
                </div>
              )}
            </div>

            {/* Required skills */}
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold text-white/70 uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(s => (
                  <span key={s} className="rounded-lg bg-white/8 px-2.5 py-1 text-xs text-white/70">{s}</span>
                ))}
              </div>
              {!user && (
                <Link href="/courses" className="mt-3 block text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Learn these skills on AfriFlow →
                </Link>
              )}
            </div>

            {/* AfriFlow ID CTA if not logged in */}
            {!user && !authLoading && (
              <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-brand-400" />
                  <p className="text-sm font-semibold text-white">Apply with AfriFlow ID</p>
                </div>
                <p className="text-xs text-white/50 mb-3">Your verified profile IS your application. No CV. No cover letter required.</p>
                <Link href="/auth/register" className="btn-primary w-full justify-center text-xs py-2">
                  Create free account →
                </Link>
              </div>
            )}

            {/* Similar jobs */}
            {similar.length > 0 && (
              <div className="card">
                <h3 className="mb-3 text-sm font-semibold text-white/70 uppercase tracking-wider">Similar Jobs</h3>
                <div className="space-y-3">
                  {similar.map(j => (
                    <Link key={j._id} href={`/work/${j._id}`} className="group block">
                      <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors leading-tight">{j.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{j.companyName} · {j.companyCountry}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/30">
                        <span>{TYPE_LABELS[j.type] ?? j.type}</span>
                        {j.remote && <span className="text-forest-400">Remote</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>

      <Footer />
      <AfriAICoach />
    </div>
  )
}
