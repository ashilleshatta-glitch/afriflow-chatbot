'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Analytics {
  orgName: string
  plan: string
  seatLimit: number
  usedSeats: number
  seatUtilisationPct: number
  totalLearners: number
  activeLearners: number
  topCountries: Array<{ country: string; count: number }>
  curriculumSummary: Array<{ title: string; slug: string; enrollments: number }>
  annualFeeUSD: number
  paymentStatus: string
  contractEndDate?: string
  daysToExpiry: number | null
  isActive: boolean
}

interface Learner {
  _id: string
  name: string
  email: string
  country?: string
}

export default function OrgDashboardPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [learners, setLearners] = useState<Learner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteUrl, setInviteUrl] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addMsg, setAddMsg] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/enterprise/${slug}/analytics`).then((r) => r.json()),
      fetch(`/api/enterprise/${slug}/learners`).then((r) => r.json()),
    ])
      .then(([aJson, lJson]) => {
        if (aJson.error) {
          if (aJson.error === 'Unauthorized' || aJson.error === 'Forbidden') router.push('/auth/login')
          else setError(aJson.error)
        } else {
          setAnalytics(aJson.data)
          setLearners(lJson.data?.learners ?? [])
        }
      })
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [slug, router])

  async function generateInvite() {
    setInviteLoading(true)
    const res = await fetch(`/api/enterprise/${slug}/invite`, { method: 'POST' })
    const json = await res.json()
    if (json.data?.inviteUrl) setInviteUrl(json.data.inviteUrl)
    setInviteLoading(false)
  }

  async function addLearner(e: React.FormEvent) {
    e.preventDefault()
    setAddLoading(true)
    setAddMsg('')
    const res = await fetch(`/api/enterprise/${slug}/learners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addEmail }),
    })
    const json = await res.json()
    setAddMsg(json.data?.message ?? json.error ?? 'Error')
    if (json.data) setAddEmail('')
    setAddLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-earth-950 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold mb-2">Access denied</h1>
          <p className="text-gray-400">{error}</p>
          <Link href="/auth/login" className="btn-primary mt-6 inline-block px-6 py-3">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-950 text-white">
      {/* Top bar */}
      <header className="py-4 px-6 border-b border-earth-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/org/${slug}`} className="text-gray-400 hover:text-white text-sm">← Portal</Link>
          <span className="text-gray-700">/</span>
          <h1 className="font-bold">{analytics.orgName} — Admin Dashboard</h1>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            analytics.isActive ? 'bg-forest-500/20 text-forest-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {analytics.isActive ? 'Active' : 'Inactive'}
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Learners', value: analytics.totalLearners, color: 'text-white' },
            { label: 'Active (7 days)', value: analytics.activeLearners, color: 'text-forest-400' },
            { label: 'Seat Usage', value: `${analytics.seatUtilisationPct}%`, color: 'text-brand-500' },
            {
              label: analytics.daysToExpiry !== null ? 'Days to Expiry' : 'Contract',
              value: analytics.daysToExpiry !== null ? analytics.daysToExpiry : '—',
              color: analytics.daysToExpiry !== null && analytics.daysToExpiry < 30 ? 'text-amber-400' : 'text-purple-400',
            },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Curriculum */}
          <div className="card p-6">
            <h2 className="font-bold mb-4">Curriculum</h2>
            {analytics.curriculumSummary.length === 0 ? (
              <p className="text-gray-500 text-sm">No courses assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.curriculumSummary.map((c) => (
                  <div key={c.slug} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 truncate max-w-[200px]">{c.title}</span>
                    <span className="text-xs text-gray-500">{c.enrollments} enrolled</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top countries */}
          <div className="card p-6">
            <h2 className="font-bold mb-4">Learner Countries</h2>
            {analytics.topCountries.length === 0 ? (
              <p className="text-gray-500 text-sm">No location data yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.topCountries.map((c) => (
                  <div key={c.country} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{c.country}</span>
                    <span className="text-xs text-gray-500">{c.count} learners</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Invite */}
        <div className="card p-6">
          <h2 className="font-bold mb-1">Invite Learners</h2>
          <p className="text-sm text-gray-400 mb-4">
            Generate a shareable invite link (expires in 7 days). Anyone with the link can join your org as a learner.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={generateInvite} disabled={inviteLoading}
              className="btn-primary px-5 py-2 text-sm"
            >
              {inviteLoading ? 'Generating…' : 'Generate Invite Link'}
            </button>
            {inviteUrl && (
              <div className="flex-1 flex gap-2">
                <input
                  readOnly value={inviteUrl}
                  className="input-field flex-1 text-xs"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(inviteUrl)}
                  className="btn-secondary px-3 py-2 text-xs"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add learner by email */}
        <div className="card p-6">
          <h2 className="font-bold mb-1">Add Learner by Email</h2>
          <p className="text-sm text-gray-400 mb-4">Add a registered AfriFlow user directly to your org.</p>
          <form onSubmit={addLearner} className="flex gap-3 flex-wrap">
            <input
              type="email" required placeholder="learner@company.com"
              className="input-field flex-1" value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
            />
            <button type="submit" disabled={addLoading} className="btn-primary px-5 py-2 text-sm">
              {addLoading ? 'Adding…' : 'Add Learner'}
            </button>
          </form>
          {addMsg && <p className="mt-2 text-sm text-gray-400">{addMsg}</p>}
        </div>

        {/* Learner list */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Learner Roster ({learners.length})</h2>
            <span className="text-xs text-gray-500">{analytics.seatLimit - analytics.usedSeats} seats remaining</span>
          </div>
          {learners.length === 0 ? (
            <p className="text-gray-500 text-sm">No learners yet. Invite your first team member above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-earth-800">
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Email</th>
                    <th className="pb-2">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((l) => (
                    <tr key={l._id} className="border-b border-earth-900 hover:bg-earth-800/30">
                      <td className="py-2 pr-4 text-gray-200">{l.name}</td>
                      <td className="py-2 pr-4 text-gray-400">{l.email}</td>
                      <td className="py-2 text-gray-500">{l.country ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contract info */}
        <div className="card p-6 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Plan</p>
            <p className="font-semibold capitalize">{analytics.plan}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Annual Fee</p>
            <p className="font-semibold">${analytics.annualFeeUSD.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Payment Status</p>
            <p className={`font-semibold capitalize ${analytics.paymentStatus === 'paid' ? 'text-forest-400' : 'text-amber-400'}`}>
              {analytics.paymentStatus}
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}
