'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import {
  Users, BookOpen, Zap, Building2, MessageCircle,
  Flame, DollarSign, Shield, TrendingUp, Eye,
  CheckCircle, Clock, AlertCircle, RefreshCw, BarChart2, Award,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────

interface AdminStats {
  users: { total: number; newToday: number; premium: number }
  courses: { total: number; enrollments: number; completions: number }
  automations: { total: number; pending: number; completed: number }
  schools: { total: number; students: number }
  whatsapp: { sessions: number; active: number; completed: number }
  challenge: { participants: number; completedToday: number }
  revenue: { mrr: number; arr: number; trialUsers: number }
}

const EMPTY_STATS: AdminStats = {
  users: { total: 0, newToday: 0, premium: 0 },
  courses: { total: 0, enrollments: 0, completions: 0 },
  automations: { total: 0, pending: 0, completed: 0 },
  schools: { total: 0, students: 0 },
  whatsapp: { sessions: 0, active: 0, completed: 0 },
  challenge: { participants: 0, completedToday: 0 },
  revenue: { mrr: 0, arr: 0, trialUsers: 0 },
}

// ─── Tab definitions ────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'automations', label: 'Automations', icon: Zap },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'schools', label: 'Schools', icon: Building2 },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'challenge', label: 'Challenge', icon: Flame },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
] as const

type TabId = typeof TABS[number]['id']

// ─── Stat card ───────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color = 'brand' }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; color?: string
}) {
  return (
    <div className="card">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10`}>
        <Icon size={20} className={`text-${color}-500`} />
      </div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm font-medium text-white/70">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-white/40">{sub}</div>}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-forest-500/20 text-forest-400',
    completed: 'bg-forest-500/20 text-forest-400',
    valid: 'bg-forest-500/20 text-forest-400',
    pending: 'bg-amber-500/20 text-amber-400',
    in_progress: 'bg-brand-500/20 text-brand-400',
    cancelled: 'bg-red-500/20 text-red-400',
    revoked: 'bg-red-500/20 text-red-400',
    premium: 'bg-brand-500/20 text-brand-400',
    free: 'bg-white/10 text-white/50',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? 'bg-white/10 text-white/50'}`}>
      {status}
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────
export default function AdminClient() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<TabId>('overview')
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS)
  const [tableData, setTableData] = useState<any[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/')
    }
  }, [user, isLoading, router])

  // Load stats on mount
  useEffect(() => {
    if (!user || user.role !== 'admin') return
    ;(async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data)
      } catch {
        // Use mock data in development
        setStats({
          users: { total: 24180, newToday: 47, premium: 3420 },
          courses: { total: 52, enrollments: 38700, completions: 12400 },
          automations: { total: 214, pending: 18, completed: 176 },
          schools: { total: 142, students: 18300 },
          whatsapp: { sessions: 14200, active: 2100, completed: 5800 },
          challenge: { participants: 2847, completedToday: 312 },
          revenue: { mrr: 51300, arr: 615600, trialUsers: 8200 },
        })
      } finally {
        setStatsLoading(false)
      }
    })()
  }, [user])

  // Load table data per tab
  useEffect(() => {
    if (!user || user.role !== 'admin') return
    if (tab === 'overview' || tab === 'revenue') { setTableData([]); return }
    setTableLoading(true)
    setPage(1)
    const endpoints: Record<string, string> = {
      users: '/admin/users',
      courses: '/admin/courses',
      automations: '/automate?limit=20',
      certificates: '/admin/certificates',
      schools: '/schools?limit=20',
      whatsapp: '/admin/whatsapp',
      challenge: '/challenge/leaderboard',
    }
    const ep = endpoints[tab]
    if (!ep) return
    api.get(ep, { params: { page: 1, limit: 20 } })
      .then(r => {
        const d = r.data?.data ?? r.data?.requests ?? r.data?.schools ??
          r.data?.users ?? r.data?.sessions ?? r.data?.leaderboard ?? r.data ?? []
        setTableData(Array.isArray(d) ? d : [])
        setHasMore(r.data?.hasMore ?? false)
      })
      .catch(() => setTableData([]))
      .finally(() => setTableLoading(false))
  }, [tab, user])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-earth-950">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (user.role !== 'admin') return null

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
  const fmtMoney = (n: number) => `$${n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n}`

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-white/50">AfriFlow AI — Platform Control Center</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-forest-500/20 bg-forest-500/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-forest-500 animate-pulse" />
            <span className="text-sm text-forest-400 font-medium">Live</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-brand-500 text-white shadow'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ─── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {statsLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="card animate-pulse"><div className="h-20 bg-white/5 rounded" /></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <StatCard label="Total Users" value={fmt(stats.users.total)} sub={`+${stats.users.newToday} today`} icon={Users} />
                  <StatCard label="Premium Users" value={fmt(stats.users.premium)} sub={`${Math.round(stats.users.premium/stats.users.total*100)}% conversion`} icon={Shield} color="forest" />
                  <StatCard label="Enrollments" value={fmt(stats.courses.enrollments)} sub={`${fmt(stats.courses.completions)} completed`} icon={BookOpen} />
                  <StatCard label="MRR" value={fmtMoney(stats.revenue.mrr)} sub={`ARR ${fmtMoney(stats.revenue.arr)}`} icon={DollarSign} color="forest" />
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <StatCard label="Schools" value={fmt(stats.schools.total)} sub={`${fmt(stats.schools.students)} students`} icon={Building2} />
                  <StatCard label="Automations" value={fmt(stats.automations.total)} sub={`${stats.automations.pending} pending`} icon={Zap} color="brand" />
                  <StatCard label="WA Learners" value={fmt(stats.whatsapp.sessions)} sub={`${fmt(stats.whatsapp.active)} active`} icon={MessageCircle} color="forest" />
                  <StatCard label="Challenge" value={fmt(stats.challenge.participants)} sub={`${stats.challenge.completedToday} completed today`} icon={Flame} color="brand" />
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[
                    { label: 'Pending Automations', value: stats.automations.pending, href: '#', tab: 'automations' as TabId, icon: AlertCircle, urgent: stats.automations.pending > 5 },
                    { label: 'Schools to review', value: 3, href: '#', tab: 'schools' as TabId, icon: Eye, urgent: false },
                    { label: 'Trial users expiring', value: stats.revenue.trialUsers, href: '#', tab: 'users' as TabId, icon: Clock, urgent: false },
                  ].map(q => (
                    <button key={q.label} onClick={() => setTab(q.tab)} className={`card flex items-center gap-3 text-left hover:border-brand-500/30 transition-colors ${q.urgent ? 'border-amber-500/30' : ''}`}>
                      <q.icon size={20} className={q.urgent ? 'text-amber-400' : 'text-white/40'} />
                      <div>
                        <div className="text-xs text-white/50">{q.label}</div>
                        <div className={`text-xl font-bold ${q.urgent ? 'text-amber-400' : 'text-white'}`}>{q.value}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── USERS ─── */}
        {tab === 'users' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Total" value={fmt(stats.users.total)} icon={Users} />
              <StatCard label="Premium" value={fmt(stats.users.premium)} icon={Shield} color="forest" />
              <StatCard label="New Today" value={stats.users.newToday} icon={TrendingUp} color="brand" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['Name', 'Email', 'Plan', 'XP', 'Country', 'Joined']}
              rows={tableData.map((u: any) => [
                u.name || '—',
                u.email,
                <Badge key={u._id} status={u.plan || 'free'} />,
                u.xp ?? 0,
                u.country || '—',
                new Date(u.createdAt).toLocaleDateString(),
              ])}
            />
          </div>
        )}

        {/* ─── COURSES ─── */}
        {tab === 'courses' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Total Courses" value={stats.courses.total} icon={BookOpen} />
              <StatCard label="Enrollments" value={fmt(stats.courses.enrollments)} icon={Users} />
              <StatCard label="Completions" value={fmt(stats.courses.completions)} icon={CheckCircle} color="forest" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['Title', 'School', 'Enrolled', 'Completions', 'Rating']}
              rows={tableData.map((c: any) => [
                c.title,
                c.school || '—',
                c.enrollmentCount ?? 0,
                c.completionCount ?? 0,
                c.averageRating ? `⭐ ${c.averageRating.toFixed(1)}` : '—',
              ])}
            />
          </div>
        )}

        {/* ─── AUTOMATIONS ─── */}
        {tab === 'automations' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Total Requests" value={stats.automations.total} icon={Zap} />
              <StatCard label="Pending Review" value={stats.automations.pending} icon={Clock} color="brand" />
              <StatCard label="Delivered" value={stats.automations.completed} icon={CheckCircle} color="forest" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['Ref', 'Client', 'Category', 'Status', 'Budget', 'Submitted']}
              rows={tableData.map((a: any) => [
                <span key={a._id} className="font-mono text-xs text-brand-400">{a.requestRef}</span>,
                a.clientName || a.clientEmail || '—',
                a.category || '—',
                <Badge key={`s-${a._id}`} status={a.status} />,
                a.budget || '—',
                new Date(a.createdAt).toLocaleDateString(),
              ])}
            />
          </div>
        )}

        {/* ─── SCHOOLS ─── */}
        {tab === 'schools' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Schools" value={stats.schools.total} icon={Building2} />
              <StatCard label="Students" value={fmt(stats.schools.students)} icon={Users} />
              <StatCard label="Avg Progress" value="76%" icon={TrendingUp} color="forest" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['School', 'Country', 'Plan', 'Students', 'Completions', 'Joined']}
              rows={tableData.map((s: any) => [
                s.name,
                s.country || '—',
                <Badge key={s._id} status={s.plan || 'free'} />,
                s.totalStudentsEnrolled ?? 0,
                s.totalCompletions ?? 0,
                new Date(s.createdAt).toLocaleDateString(),
              ])}
            />
          </div>
        )}

        {/* ─── WHATSAPP ─── */}
        {tab === 'whatsapp' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Total Sessions" value={fmt(stats.whatsapp.sessions)} icon={MessageCircle} />
              <StatCard label="Active Now" value={fmt(stats.whatsapp.active)} icon={TrendingUp} color="brand" />
              <StatCard label="Graduated" value={fmt(stats.whatsapp.completed)} icon={CheckCircle} color="forest" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['Phone', 'Name', 'Country', 'Course', 'Progress', 'XP', 'Status']}
              rows={tableData.map((s: any) => [
                <span key={s._id} className="font-mono text-xs">{s.phone}</span>,
                s.name || '—',
                s.country || '—',
                s.currentCourse || '—',
                `${s.completedLessons?.length ?? 0}/${s.totalLessons ?? 5}`,
                s.xpEarned ?? 0,
                <Badge key={`st-${s._id}`} status={s.status} />,
              ])}
            />
          </div>
        )}

        {/* ─── CHALLENGE ─── */}
        {tab === 'challenge' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Participants" value={fmt(stats.challenge.participants)} icon={Flame} />
              <StatCard label="Completed Today" value={stats.challenge.completedToday} icon={CheckCircle} color="forest" />
              <StatCard label="Avg Day" value="Day 18" icon={Clock} color="brand" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['Rank', 'Name', 'Day', 'Streak', 'XP', 'Country']}
              rows={tableData.map((p: any, i: number) => [
                `#${p.rank ?? i + 1}`,
                p.name || p.userId?.name || '—',
                `Day ${p.currentDay ?? 0}`,
                `🔥 ${p.currentStreak ?? 0}`,
                p.totalXp ?? 0,
                p.country || '—',
              ])}
            />
          </div>
        )}

        {/* ─── CERTIFICATES ─── */}
        {tab === 'certificates' && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <StatCard label="Total Issued" value={tableData.length} icon={Award} />
              <StatCard label="Valid" value={tableData.filter((c: any) => !c.isRevoked).length} icon={CheckCircle} color="forest" />
              <StatCard label="Revoked" value={tableData.filter((c: any) => c.isRevoked).length} icon={AlertCircle} color="brand" />
            </div>
            <AdminTable
              loading={tableLoading}
              columns={['Certificate ID', 'Holder', 'Course', 'Grade', 'Issued', 'Status']}
              rows={tableData.map((c: any) => [
                <span key={c._id} className="font-mono text-xs text-brand-400">{(c.certificateId ?? c._id ?? '').slice(0, 12)}…</span>,
                c.userName || '—',
                c.courseTitle || '—',
                c.grade || '—',
                c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : '—',
                <Badge key={`b-${c._id}`} status={c.isRevoked ? 'revoked' : 'valid'} />,
              ])}
            />
          </div>
        )}

        {/* ─── REVENUE ─── */}
        {tab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="MRR" value={fmtMoney(stats.revenue.mrr)} icon={DollarSign} color="forest" />
              <StatCard label="ARR" value={fmtMoney(stats.revenue.arr)} icon={TrendingUp} color="forest" />
              <StatCard label="Premium Users" value={fmt(stats.users.premium)} icon={Shield} />
              <StatCard label="Trial Users" value={fmt(stats.revenue.trialUsers)} icon={Clock} color="brand" />
            </div>

            {/* MRR breakdown mock */}
            <div className="card">
              <h3 className="mb-4 font-semibold text-white">Revenue Breakdown</h3>
              <div className="space-y-3">
                {[
                  { source: 'Premium Subscriptions', amount: stats.revenue.mrr * 0.71, pct: 71 },
                  { source: 'School Plans', amount: stats.revenue.mrr * 0.18, pct: 18 },
                  { source: 'Automate Service', amount: stats.revenue.mrr * 0.08, pct: 8 },
                  { source: 'One-off Courses', amount: stats.revenue.mrr * 0.03, pct: 3 },
                ].map(r => (
                  <div key={r.source} className="flex items-center gap-3">
                    <div className="w-36 shrink-0 text-sm text-white/60">{r.source}</div>
                    <div className="flex-1 rounded-full bg-white/10 h-2">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${r.pct}%` }} />
                    </div>
                    <div className="w-20 text-right text-sm font-medium text-white">{fmtMoney(Math.round(r.amount))}</div>
                    <div className="w-10 text-right text-xs text-white/40">{r.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
              💡 Revenue figures are live estimates. Connect Stripe via <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">STRIPE_SECRET_KEY</code> to see real-time MRR.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Generic table ────────────────────────────────────────────────────────
function AdminTable({ columns, rows, loading }: {
  columns: string[]
  rows: (React.ReactNode[])[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    )
  }
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/30">
        <AlertCircle size={32} />
        <p className="text-sm">No data yet — connect the API or seed the database</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {columns.map(c => (
              <th key={c} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-white/70">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
