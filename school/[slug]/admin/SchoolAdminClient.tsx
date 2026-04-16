'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Users, BarChart3, Award, Copy, CheckCircle,
  TrendingUp, BookOpen, Download, RefreshCw,
  AlertCircle, Shield, ChevronLeft, Trash2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { schoolsApi } from '@/lib/api'

interface Student {
  userId: string
  name: string
  country: string
  xp: number
  enrolledCourses: number
  completedCourses: number
  avgProgress: number
}
interface SchoolStats {
  totalStudents: number
  totalEnrollments: number
  completedEnrollments: number
  completionRate: number
  avgProgress: number
}
interface PortalData {
  _id: string
  name: string
  slug: string
  inviteCode: string
  plan: string
  planSeats: number
  students: string[]
  courseAssignments: Array<{ courseSlug: string; mandatory: boolean; dueDate?: string }>
  adminUser: { _id: string }
}

export default function SchoolAdminClient({ slug }: { slug: string }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [school, setSchool] = useState<PortalData | null>(null)
  const [stats, setStats] = useState<SchoolStats | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'students' | 'courses' | 'settings'>('students')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) router.replace(`/auth/login?redirect=/school/${slug}/admin`)
  }, [user, isLoading, router, slug])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([
      schoolsApi.get(slug),
      schoolsApi.progress(slug, ''),
    ]).then(([schoolRes, progRes]) => {
      setSchool(schoolRes.data.school ?? schoolRes.data)
      setStats(progRes.data.stats)
      setStudents(progRes.data.students ?? [])
    }).catch(() => toast.error('Failed to load school data'))
      .finally(() => setLoading(false))
  }, [user, slug])

  function copyInviteLink() {
    if (!school) return
    const link = `${window.location.origin}/school/${slug}?invite=${school.inviteCode}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Invite link copied!')
    })
  }

  function exportCSV() {
    if (!students.length) return
    const headers = ['Name', 'Country', 'XP', 'Enrolled Courses', 'Completed', 'Avg Progress %']
    const rows = students.map(s => [s.name, s.country, s.xp, s.enrolledCourses, s.completedCourses, s.avgProgress])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}-students.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-earth-950">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!school) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-earth-950 text-white">
        <AlertCircle size={40} className="text-red-400" />
        <p>School not found or access denied.</p>
        <Link href="/schools" className="btn-secondary">Back to Schools</Link>
      </div>
    )
  }

  // Access control: only the school's admin user
  if (user && school.adminUser._id !== user.id && user.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-earth-950 text-white">
        <Shield size={40} className="text-red-400" />
        <p>You don&apos;t have admin access to this school.</p>
        <Link href={`/school/${slug}`} className="btn-secondary">Back to School Portal</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-950">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-earth-900">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link href={`/school/${slug}`} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-white">{school.name} — Admin Dashboard</h1>
            <p className="text-xs text-white/40">Plan: {school.plan} · {school.planSeats} seats</p>
          </div>
          <button onClick={copyInviteLink} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
            {copied ? <CheckCircle size={14} className="text-forest-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Invite Link'}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Users, label: 'Students', value: stats.totalStudents },
              { icon: BookOpen, label: 'Enrollments', value: stats.totalEnrollments },
              { icon: CheckCircle, label: 'Completions', value: stats.completedEnrollments, color: 'forest' },
              { icon: TrendingUp, label: 'Avg Progress', value: `${stats.avgProgress}%`, color: 'brand' },
            ].map(s => (
              <div key={s.label} className="card text-center">
                <s.icon size={20} className={`mx-auto mb-2 text-${s.color ?? 'white'}/60`} />
                <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 w-fit">
          {(['students', 'courses', 'settings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Students tab */}
        {tab === 'students' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">{students.length} Students</h2>
              <button onClick={exportCSV} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
                <Download size={14} /> Export CSV
              </button>
            </div>

            {students.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-white/30">
                <Users size={40} />
                <p className="text-sm">No students yet — share your invite link</p>
                <button onClick={copyInviteLink} className="btn-primary mt-2 text-sm">
                  <Copy size={14} className="mr-1.5" /> Copy Invite Link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      {['Student', 'Country', 'XP', 'Enrolled', 'Completed', 'Progress'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.userId} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                        <td className="px-4 py-3 text-white/60">{s.country || '—'}</td>
                        <td className="px-4 py-3 text-brand-400 font-medium">🏅 {s.xp}</td>
                        <td className="px-4 py-3 text-white/60">{s.enrolledCourses}</td>
                        <td className="px-4 py-3 text-forest-400">{s.completedCourses}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-full bg-white/10 h-1.5 min-w-16">
                              <div
                                className="h-1.5 rounded-full bg-brand-500"
                                style={{ width: `${s.avgProgress}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/40 w-8">{s.avgProgress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Courses tab */}
        {tab === 'courses' && (
          <div>
            <h2 className="mb-4 font-semibold text-white">Assigned Courses ({school.courseAssignments.length})</h2>
            {school.courseAssignments.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-white/30">
                <BookOpen size={40} />
                <p className="text-sm">No courses assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {school.courseAssignments.map(c => (
                  <div key={c.courseSlug} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex-1">
                      <div className="font-medium text-white">{c.courseSlug}</div>
                      {c.dueDate && (
                        <div className="text-xs text-white/40">Due: {new Date(c.dueDate).toLocaleDateString()}</div>
                      )}
                    </div>
                    {c.mandatory && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                        Mandatory
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <div className="max-w-lg space-y-6">
            <div className="card">
              <h3 className="mb-3 font-semibold text-white">Invite Code</h3>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <span className="font-mono text-lg font-bold text-brand-400 flex-1 tracking-widest">
                  {school.inviteCode}
                </span>
                <button onClick={copyInviteLink} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  {copied ? <CheckCircle size={16} className="text-forest-400" /> : <Copy size={16} className="text-white/50" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-white/40">
                Share this code or link with your students to auto-enrol them in your school.
              </p>
            </div>

            <div className="card">
              <h3 className="mb-3 font-semibold text-white">Subscription</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white capitalize">{school.plan} Plan</div>
                  <div className="text-sm text-white/50">{school.planSeats} student seats</div>
                </div>
                <Link href="/pricing" className="btn-primary text-sm py-2">Upgrade Plan</Link>
              </div>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 size={16} className="text-red-400" />
                <h3 className="font-semibold text-red-400">Danger Zone</h3>
              </div>
              <p className="text-xs text-white/50 mb-3">
                Contact support to transfer ownership or delete this school portal.
              </p>
              <a href="mailto:support@afriflowai.com" className="text-xs text-red-400 hover:underline">
                support@afriflowai.com
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
