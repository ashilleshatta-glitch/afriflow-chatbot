'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Building2, Users, BarChart3, Award, BookOpen, Copy,
  CheckCircle, TrendingUp, ChevronRight, Settings, ClipboardList,
  LogIn
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { schoolsApi } from '@/lib/api'

interface SchoolData {
  _id: string
  name: string
  slug: string
  country: string
  city?: string
  type: string
  adminUser: { _id: string; name: string; email: string }
  logoUrl?: string
  primaryColor: string
  description?: string
  plan: string
  planSeats: number
  students: string[]
  courseAssignments: Array<{
    courseSlug: string
    assignedAt: string
    dueDate?: string
    mandatory: boolean
  }>
  inviteCode: string
  totalStudentsEnrolled: number
  avgProgressPct: number
}

interface ProgressData {
  stats: {
    totalStudents: number
    totalEnrollments: number
    completedEnrollments: number
    completionRate: number
    avgProgress: number
  }
  students: Array<{
    userId: string
    name: string
    country: string
    xp: number
    enrolledCourses: number
    completedCourses: number
    avgProgress: number
  }>
  assignedCourses: Array<{
    courseSlug: string
    mandatory: boolean
    dueDate?: string
  }>
}

type Tab = 'overview' | 'students' | 'courses' | 'settings'

export default function SchoolPortalClient({ slug }: { slug: string }) {
  const { user, token } = useAuth()
  const [school, setSchool] = useState<SchoolData | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')
  const [inviteCode, setInviteCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [copied, setCopied] = useState(false)

  const isAdmin = school && user && school.adminUser._id === user.id

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await schoolsApi.get(slug)
      setSchool(res.data.school)
    } catch {
      toast.error('School not found')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const loadProgress = useCallback(async () => {
    if (!token) return
    try {
      const res = await schoolsApi.progress(slug, token)
      setProgress(res.data)
    } catch {
      // not admin, silent
    }
  }, [slug, token])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (school && token) loadProgress()
  }, [school, token, loadProgress])

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!token) { toast.error('Please log in'); return }
    setJoining(true)
    try {
      await schoolsApi.join(slug, inviteCode, token)
      toast.success('🎓 Joined school successfully!')
      load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to join'
      toast.error(msg)
    } finally {
      setJoining(false)
    }
  }

  function copyInviteLink() {
    if (!school) return
    const link = `${window.location.origin}/school/${school.slug}?code=${school.inviteCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('Invite link copied!')
    setTimeout(() => setCopied(false), 3000)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-earth-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </main>
    )
  }

  if (!school) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-earth-950 text-white">
        <Building2 className="h-16 w-16 text-white/20" />
        <h1 className="text-2xl font-bold">School not found</h1>
        <Link href="/schools" className="btn-primary">Browse Schools</Link>
      </main>
    )
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: `Students (${school.students.length})`, icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    ...(isAdmin ? [{ id: 'settings' as Tab, label: 'Settings', icon: Settings }] : []),
  ]

  return (
    <main className="min-h-screen bg-earth-950">
      {/* ── HERO HEADER ── */}
      <section
        className="border-b border-white/10 py-12"
        style={{ background: `linear-gradient(135deg, ${school.primaryColor}15 0%, transparent 60%)` }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white"
                style={{ background: school.primaryColor }}
              >
                {school.logoUrl ? (
                  <img src={school.logoUrl} alt={school.name} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  school.name[0]
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-white">{school.name}</h1>
                <div className="mt-1 flex items-center gap-3 text-sm text-white/50">
                  <span>{school.city ? `${school.city}, ` : ''}{school.country}</span>
                  <span>·</span>
                  <span className="capitalize">{school.type}</span>
                  <span>·</span>
                  <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-xs capitalize text-brand-400">
                    {school.plan} Plan
                  </span>
                </div>
                {school.description && (
                  <p className="mt-2 max-w-xl text-sm text-white/60">{school.description}</p>
                )}
              </div>
            </div>

            {/* ADMIN: copy invite / JOIN button */}
            {isAdmin ? (
              <button
                onClick={copyInviteLink}
                className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/5"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-forest-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Invite Link'}
              </button>
            ) : (
              <form onSubmit={handleJoin} className="flex items-center gap-2">
                <input
                  className="input-field w-36 text-sm"
                  placeholder="Invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  maxLength={8}
                />
                <button type="submit" disabled={joining} className="btn-primary py-2.5 text-sm">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  {joining ? 'Joining…' : 'Join School'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── STAT PILLS ── */}
      <section className="border-b border-white/10 py-5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Users, label: 'Students', value: school.students.length },
              { icon: ClipboardList, label: 'Courses Assigned', value: school.courseAssignments.length },
              { icon: TrendingUp, label: 'Avg Progress', value: `${progress?.stats.avgProgress ?? school.avgProgressPct}%` },
              { icon: Award, label: 'Completions', value: progress?.stats.completedEnrollments ?? 0 },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <s.icon className="h-4 w-4 text-brand-500" />
                <span className="text-white/50">{s.label}:</span>
                <span className="font-semibold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <div className="sticky top-16 z-30 border-b border-white/10 bg-earth-950/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition ${
                  tab === t.id
                    ? 'border-brand-500 text-brand-500'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Total Students', value: school.students.length,
                sub: `of ${school.planSeats} seats`, icon: Users, color: 'text-blue-400',
              },
              {
                title: 'Courses Assigned', value: school.courseAssignments.length,
                sub: 'active assignments', icon: BookOpen, color: 'text-brand-500',
              },
              {
                title: 'Avg Progress', value: `${progress?.stats.avgProgress ?? 0}%`,
                sub: 'across all students', icon: TrendingUp, color: 'text-forest-500',
              },
              {
                title: 'Completion Rate', value: `${progress?.stats.completionRate ?? 0}%`,
                sub: `${progress?.stats.completedEnrollments ?? 0} completed`, icon: Award, color: 'text-yellow-400',
              },
            ].map((card) => (
              <div key={card.title} className="card p-6">
                <card.icon className={`mb-3 h-6 w-6 ${card.color}`} />
                <div className="font-display text-3xl font-bold text-white">{card.value}</div>
                <div className="mt-0.5 text-sm font-medium text-white/80">{card.title}</div>
                <div className="mt-1 text-xs text-white/40">{card.sub}</div>
              </div>
            ))}

            {/* Progress bar by course */}
            {school.courseAssignments.length > 0 && (
              <div className="card col-span-full p-6">
                <h3 className="mb-4 font-semibold text-white">Assigned Courses</h3>
                <div className="space-y-4">
                  {school.courseAssignments.map((a) => {
                    const slug = a.courseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                    return (
                      <div key={a.courseSlug} className="flex items-center gap-4">
                        <div className="w-48 truncate text-sm text-white/70">{slug}</div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-brand-500 transition-all"
                            style={{ width: '45%' }}
                          />
                        </div>
                        <div className="w-10 text-right text-xs text-white/50">45%</div>
                        {a.mandatory && (
                          <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-400">Required</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDENTS */}
        {tab === 'students' && (
          <div>
            {!isAdmin ? (
              <div className="rounded-xl border border-white/10 p-8 text-center text-white/40">
                Only the school admin can view student details.
              </div>
            ) : !progress ? (
              <div className="py-10 text-center text-white/40">Loading student data…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-white/40">
                      <th className="pb-3 pr-4">Student</th>
                      <th className="pb-3 pr-4">Country</th>
                      <th className="pb-3 pr-4">XP</th>
                      <th className="pb-3 pr-4">Courses</th>
                      <th className="pb-3 pr-4">Completed</th>
                      <th className="pb-3">Avg Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress.students.map((s, i) => (
                      <tr key={s.userId} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
                              {i + 1}
                            </div>
                            <span className="font-medium text-white">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-white/60">{s.country || '—'}</td>
                        <td className="py-3 pr-4 text-yellow-400">{s.xp.toLocaleString()} XP</td>
                        <td className="py-3 pr-4 text-white/60">{s.enrolledCourses}</td>
                        <td className="py-3 pr-4 text-forest-500">{s.completedCourses}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-1.5 rounded-full bg-brand-500"
                                style={{ width: `${s.avgProgress}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/50">{s.avgProgress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {progress.students.length === 0 && (
                  <p className="py-10 text-center text-white/30">No students enrolled yet. Share the invite link!</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* COURSES */}
        {tab === 'courses' && (
          <div>
            {school.courseAssignments.length === 0 ? (
              <div className="rounded-xl border border-white/10 p-10 text-center text-white/40">
                No courses assigned yet.
                {isAdmin && (
                  <p className="mt-2 text-sm">Head to the <Link href="/courses" className="text-brand-400 underline">Courses</Link> page to browse and assign.</p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {school.courseAssignments.map((a) => {
                  const title = a.courseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                  return (
                    <div key={a.courseSlug} className="card flex items-center justify-between p-5">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-brand-500" />
                        <div>
                          <div className="font-medium text-white">{title}</div>
                          <div className="mt-0.5 text-xs text-white/40">
                            Assigned {new Date(a.assignedAt).toLocaleDateString()}
                            {a.dueDate && ` · Due ${new Date(a.dueDate).toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.mandatory && (
                          <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-400">Required</span>
                        )}
                        <Link href={`/courses/${a.courseSlug}`}>
                          <ChevronRight className="h-5 w-5 text-white/30 hover:text-white" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS (admin only) */}
        {tab === 'settings' && isAdmin && (
          <div className="max-w-lg space-y-6">
            <div className="card p-6">
              <h3 className="mb-4 font-semibold text-white">Invite Students</h3>
              <p className="mb-3 text-sm text-white/50">Share this code with your students to join this school portal.</p>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                <span className="font-mono text-2xl font-bold tracking-widest text-brand-400">
                  {school.inviteCode}
                </span>
                <button onClick={copyInviteLink} className="ml-auto text-white/40 hover:text-white">
                  {copied ? <CheckCircle className="h-5 w-5 text-forest-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-white/30">
                {school.students.length}/{school.planSeats} seats used
              </p>
            </div>

            <div className="card p-6">
              <h3 className="mb-3 font-semibold text-white">Plan Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Current Plan</span>
                  <span className="capitalize text-white">{school.plan}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Student Seats</span>
                  <span className="text-white">{school.planSeats}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Seats Used</span>
                  <span className="text-white">{school.students.length}</span>
                </div>
              </div>
              <a
                href="mailto:schools@afriflow.ai?subject=Upgrade School Plan"
                className="btn-primary mt-4 block w-full text-center text-sm"
              >
                Upgrade Plan →
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
