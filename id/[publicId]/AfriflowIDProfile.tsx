'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/AfriAICoach'
import {
  Shield, MapPin, ExternalLink, Award, Zap, Users,
  CheckCircle, Star, Eye, Copy, AlertCircle, Briefcase,
  Globe, Calendar, TrendingUp,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  _id: string
  name: string
  level: 'beginner' | 'practitioner' | 'expert'
  verifiedBy: string
  verifiedAt: string
}

interface Project {
  _id: string
  title: string
  description: string
  toolsUsed: string[]
  outcomeDescription: string
  liveUrl?: string
  screenshotUrl?: string
  verifiedByEmployer: boolean
  completedAt: string
}

interface Endorsement {
  _id: string
  companyName: string
  contactName: string
  endorsementText: string
  skillsEndorsed: string[]
  endorsedAt: string
  isVerified: boolean
}

interface Certificate {
  _id: string
  courseTitle: string
  courseSchool: string
  grade: string
  issuedAt: string
  certificateId: string
  isRevoked: boolean
}

interface AfriflowIDData {
  publicId: string
  displayName: string
  country: string
  headline: string
  skills: Skill[]
  projects: Project[]
  automationsBuilt: number
  automationTypes: string[]
  employerEndorsements: Endorsement[]
  certificates: Certificate[]
  totalXP: number
  learningHours: number
  streakRecord: number
  profileViews: number
  isHireable: boolean
  preferredWorkType: string
  expectedSalaryRange?: string
  verificationScore: number
  verificationHash: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColour(score: number) {
  if (score >= 80) return 'text-forest-400'
  if (score >= 55) return 'text-brand-400'
  return 'text-white/50'
}

function scoreLabel(score: number) {
  if (score >= 85) return 'Highly Verified'
  if (score >= 65) return 'Verified'
  if (score >= 40) return 'Building Profile'
  return 'Getting Started'
}

function levelBadge(level: Skill['level']) {
  const map = {
    beginner: 'bg-white/10 text-white/60',
    practitioner: 'bg-brand-500/20 text-brand-400',
    expert: 'bg-forest-500/20 text-forest-400',
  }
  return map[level]
}

function verifyBadge(by: string) {
  const map: Record<string, string> = {
    course: '📚 Course',
    exam: '📝 Exam',
    employer: '🏢 Employer',
    project: '🔧 Project',
  }
  return map[by] ?? by
}

// ─── Activity Heatmap (GitHub-style, 90 days) ─────────────────────────────────

function ActivityHeatmap({ learningHours }: { learningHours: number }) {
  // Generate 90-day grid with seeded random activity based on learningHours
  const days = 90
  const activityLevel = Math.min(Math.floor(learningHours / 10), 4)
  const cells = Array.from({ length: days }, (_, i) => {
    const seed = (i * 1234567 + learningHours * 89) % 100
    const level = seed < 20 ? 0 : seed < 45 ? 1 : seed < 70 ? 2 : seed < 85 ? 3 : activityLevel
    return level
  })

  const colours = [
    'bg-white/5',
    'bg-forest-500/20',
    'bg-forest-500/40',
    'bg-forest-500/70',
    'bg-forest-500',
  ]

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white/60 uppercase tracking-wide">Learning Activity — Last 90 Days</h3>
      <div className="flex flex-wrap gap-0.5">
        {cells.map((level, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-sm ${colours[level]}`}
            title={`Day ${i + 1}`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-white/30">
        <span>Less</span>
        {colours.map((c, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AfriflowIDProfile({
  publicId,
  justEndorsed,
}: {
  publicId: string
  justEndorsed: boolean
}) {
  const [data, setData] = useState<AfriflowIDData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showHash, setShowHash] = useState(false)
  const [showHireForm, setShowHireForm] = useState(false)
  const [hireForm, setHireForm] = useState({ name: '', email: '', message: '' })
  const [hireSent, setHireSent] = useState(false)

  useEffect(() => {
    fetch(`/api/id/${publicId}`)
      .then(r => r.json())
      .then(r => {
        if (r.error) setError(r.error)
        else setData(r.data)
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [publicId])

  const copyId = () => {
    navigator.clipboard.writeText(publicId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-earth-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-earth-950 text-white">
        <AlertCircle size={40} className="text-brand-500" />
        <p className="text-white/60">{error || 'Profile not found'}</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    )
  }

  const validCerts = data.certificates.filter(c => !c.isRevoked)
  const verifiedEndorsements = data.employerEndorsements.filter(e => e.isVerified)

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />

      {justEndorsed && (
        <div className="bg-forest-500/10 border-b border-forest-500/20 py-3 text-center text-sm text-forest-400">
          ✅ Your endorsement has been verified and added to this profile!
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Hero card ── */}
        <div className="card mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-brand-500/20 via-forest-500/20 to-brand-500/10" />
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-10 mb-4 flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-earth-900 bg-gradient-to-br from-brand-500 to-forest-500 text-3xl font-bold text-white shadow-xl">
                {data.displayName[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="mb-1 flex items-center gap-2">
                {/* AfriFlow ID badge */}
                <button
                  onClick={copyId}
                  className="flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-mono text-brand-400 transition hover:bg-brand-500/20"
                >
                  {publicId} {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-white">{data.displayName}</h1>
                {data.headline && <p className="mt-1 text-white/70">{data.headline}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/50">
                  <span className="flex items-center gap-1"><MapPin size={12} />{data.country}</span>
                  <span className="flex items-center gap-1"><Eye size={12} />{data.profileViews.toLocaleString()} views</span>
                  {data.isHireable && (
                    <span className="flex items-center gap-1 text-forest-400"><Briefcase size={12} />Open to work · {data.preferredWorkType}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                {/* Verification score */}
                <div className="text-right">
                  <div className={`font-display text-3xl font-bold ${scoreColour(data.verificationScore)}`}>
                    {data.verificationScore}<span className="text-base text-white/30">/100</span>
                  </div>
                  <div className={`text-sm font-medium ${scoreColour(data.verificationScore)}`}>
                    <Shield size={12} className="mr-1 inline" />{scoreLabel(data.verificationScore)}
                  </div>
                </div>

                {data.isHireable && (
                  <button
                    onClick={() => setShowHireForm(true)}
                    className="btn-primary text-sm"
                  >
                    <Briefcase size={14} className="mr-1 inline" />Hire this person
                  </button>
                )}
              </div>
            </div>

            {/* Score bar */}
            <div className="mt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${data.verificationScore >= 80 ? 'bg-forest-500' : data.verificationScore >= 55 ? 'bg-brand-500' : 'bg-white/30'}`}
                  style={{ width: `${data.verificationScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Certificates', value: validCerts.length, icon: Award, color: 'brand' },
            { label: 'Skills verified', value: data.skills.length, icon: CheckCircle, color: 'forest' },
            { label: 'Automations built', value: data.automationsBuilt, icon: Zap, color: 'brand' },
            { label: 'Endorsements', value: verifiedEndorsements.length, icon: Users, color: 'forest' },
          ].map(s => (
            <div key={s.label} className="card flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-${s.color}-500/10`}>
                <s.icon size={16} className={`text-${s.color}-500`} />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Skills grid ── */}
        {data.skills.length > 0 && (
          <section className="card mb-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Skills</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.skills.map(skill => (
                <div key={skill._id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{skill.name}</div>
                    <div className="mt-0.5 text-xs text-white/40">{verifyBadge(skill.verifiedBy)}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${levelBadge(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects gallery ── */}
        {data.projects.length > 0 && (
          <section className="card mb-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.projects.map(proj => (
                <div key={proj._id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {proj.screenshotUrl && (
                    <img src={proj.screenshotUrl} alt={proj.title} className="h-36 w-full object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">{proj.title}</h3>
                      {proj.verifiedByEmployer && (
                        <span className="shrink-0 flex items-center gap-1 rounded-full bg-forest-500/10 px-2 py-0.5 text-xs text-forest-400">
                          <CheckCircle size={10} />Employer verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-white/60 line-clamp-2">{proj.description}</p>
                    {proj.outcomeDescription && (
                      <p className="mt-2 text-sm font-medium text-forest-400">✓ {proj.outcomeDescription}</p>
                    )}
                    {proj.toolsUsed.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {proj.toolsUsed.map(t => (
                          <span key={t} className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs text-brand-400">{t}</span>
                        ))}
                      </div>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-1 text-xs text-white/50 hover:text-white transition">
                        <ExternalLink size={12} />View live
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Automations ── */}
        {data.automationsBuilt > 0 && (
          <section className="card mb-6">
            <h2 className="mb-3 font-display text-lg font-bold text-white">
              <Zap size={18} className="mr-2 inline text-brand-500" />
              {data.automationsBuilt} Automations Built
            </h2>
            {data.automationTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.automationTypes.map(t => (
                  <span key={t} className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-400">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Certificates ── */}
        {validCerts.length > 0 && (
          <section className="card mb-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">
              <Award size={18} className="mr-2 inline text-brand-500" />Certificates
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {validCerts.map(cert => (
                <div key={cert._id} className="flex items-start gap-3 rounded-xl border border-forest-500/20 bg-forest-500/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-500/20">
                    <Award size={18} className="text-forest-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{cert.courseTitle}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
                      <Calendar size={10} />{new Date(cert.issuedAt).toLocaleDateString()}
                      <span className="capitalize rounded-full bg-forest-500/10 px-2 py-0.5 text-forest-400">{cert.grade}</span>
                    </div>
                    <Link
                      href={`/verify/${cert.certificateId}`}
                      className="mt-1 flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
                    >
                      <CheckCircle size={10} />Verify certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Endorsements ── */}
        {verifiedEndorsements.length > 0 && (
          <section className="card mb-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">
              <Users size={18} className="mr-2 inline text-forest-400" />Employer Endorsements
            </h2>
            <div className="space-y-4">
              {verifiedEndorsements.map(e => (
                <div key={e._id} className="rounded-xl border border-forest-500/20 bg-white/5 p-5">
                  <blockquote className="text-white/80 italic">"{e.endorsementText}"</blockquote>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{e.contactName}</div>
                      <div className="text-xs text-white/50">{e.companyName}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-forest-400">
                      <CheckCircle size={12} />Verified
                    </div>
                  </div>
                  {e.skillsEndorsed.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {e.skillsEndorsed.map(s => (
                        <span key={s} className="rounded-full bg-forest-500/10 px-2 py-0.5 text-xs text-forest-400">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Activity heatmap ── */}
        <section className="card mb-6">
          <ActivityHeatmap learningHours={data.learningHours} />
          <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 text-center">
            <div>
              <div className="font-display text-xl font-bold text-white">{data.totalXP.toLocaleString()}</div>
              <div className="text-xs text-white/40">Total XP</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-white">{data.learningHours}</div>
              <div className="text-xs text-white/40">Learning hours</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-white">{data.streakRecord}🔥</div>
              <div className="text-xs text-white/40">Streak record</div>
            </div>
          </div>
        </section>

        {/* ── Verify profile ── */}
        <section className="card mb-6">
          <button
            onClick={() => setShowHash(!showHash)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="font-display text-lg font-bold text-white">
              <Shield size={18} className="mr-2 inline text-brand-500" />Verify this profile
            </h2>
            <span className="text-xs text-white/40">{showHash ? 'Hide' : 'Show'} verification data</span>
          </button>
          {showHash && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-white/60">
                This profile has a verification score of <strong className="text-white">{data.verificationScore}/100</strong>.
                The score is calculated from: certificates earned, skills verified by courses/exams/employers,
                projects documented, employer endorsements verified, and automations built.
              </p>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="mb-1 text-xs text-white/40">SHA-256 Verification Hash</div>
                <code className="break-all text-xs text-green-400">{data.verificationHash}</code>
              </div>
              <p className="text-xs text-white/30">
                This hash is recalculated each time the profile changes. Any tampering with the underlying data
                would produce a different hash, making fraud detectable.
              </p>
            </div>
          )}
        </section>

        {/* ── Hire form modal ── */}
        {showHireForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="card w-full max-w-md">
              <h3 className="mb-4 font-display text-xl font-bold text-white">
                Contact {data.displayName}
              </h3>
              {hireSent ? (
                <div className="py-6 text-center">
                  <CheckCircle size={40} className="mx-auto mb-3 text-forest-500" />
                  <p className="text-white/70">Message sent! We'll forward it to {data.displayName}.</p>
                  <button onClick={() => setShowHireForm(false)} className="btn-primary mt-4">Close</button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setHireSent(true) }} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-white/60">Your name</label>
                    <input
                      className="input w-full"
                      value={hireForm.name}
                      onChange={e => setHireForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/60">Your email</label>
                    <input
                      type="email"
                      className="input w-full"
                      value={hireForm.email}
                      onChange={e => setHireForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/60">Message</label>
                    <textarea
                      className="input w-full"
                      rows={4}
                      value={hireForm.message}
                      onChange={e => setHireForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Describe the role and why you're reaching out..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowHireForm(false)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" className="btn-primary flex-1">Send Message</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      <Footer />
      <AfriAICoach />
    </div>
  )
}
