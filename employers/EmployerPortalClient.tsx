'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  Search, BadgeCheck, Briefcase, Users, Shield, Building2,
  ArrowRight, CheckCircle, XCircle, Clock, Zap, Award,
  Globe, ChevronDown, Loader2, Send, ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Types ───────────────────────────────────────────────
interface BulkResult {
  id: string
  status: 'valid' | 'not_found' | 'revoked' | 'expired'
  verified: boolean
  holderName?: string
  courseTitle?: string
  courseSchool?: string
  grade?: string
  score?: number
  issuedAt?: string
  expiryDate?: string
  skills?: string[]
}

interface JobForm {
  companyName: string
  companyEmail: string
  companyCountry: string
  companyWebsite: string
  title: string
  description: string
  requiredSkills: string
  location: string
  isRemote: boolean
  salaryMin: string
  salaryMax: string
  currency: string
  type: string
  level: string
}

const SKILL_TAGS = [
  'AI fundamentals', 'Prompt engineering', 'Zapier', 'Make', 'n8n',
  'WhatsApp automation', 'Python', 'OpenAI API', 'LangChain',
  'Business AI strategy', 'Customer service AI', 'AI marketing',
  'ChatGPT', 'Claude AI', 'Data analysis',
]

const AFRICAN_COUNTRIES = [
  'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Egypt', 'Ethiopia',
  'Tanzania', 'Rwanda', 'Uganda', 'Senegal', 'Côte d\'Ivoire', 'Cameroon',
]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Bulk Verify Panel ────────────────────────────────────
function BulkVerifyPanel() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<BulkResult[]>([])
  const [summary, setSummary] = useState<{ total: number; valid: number; invalid: number } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    const ids = input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)

    if (ids.length === 0) {
      toast.error('Enter at least one certificate ID')
      return
    }
    if (ids.length > 10) {
      toast.error('Maximum 10 IDs at a time')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post('/api/employers/bulk-verify', { ids })
      setResults(data.results)
      setSummary(data.summary)
    } catch {
      toast.error('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Bulk Certificate Verification</h3>
          <p className="text-white/50 text-sm">Paste up to 10 certificate IDs — one per line or comma-separated</p>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={'AF-1A2B3C-XY12\nAF-4D5E6F-ZW34\nAF-7G8H9I-UV56'}
        rows={5}
        className="input-field w-full font-mono text-sm resize-none mb-4"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
        {loading ? 'Verifying…' : 'Verify Certificates'}
      </button>

      {/* Summary */}
      {summary && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center bg-white/5 border border-white/10">
            <div className="text-white font-bold text-xl">{summary.total}</div>
            <div className="text-white/40 text-xs">Checked</div>
          </div>
          <div className="rounded-xl p-3 text-center bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-emerald-400 font-bold text-xl">{summary.valid}</div>
            <div className="text-emerald-400/60 text-xs">Valid</div>
          </div>
          <div className="rounded-xl p-3 text-center bg-red-500/10 border border-red-500/20">
            <div className="text-red-400 font-bold text-xl">{summary.invalid}</div>
            <div className="text-red-400/60 text-xs">Invalid</div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl p-4 border ${
                r.verified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="font-mono text-xs text-white/50">{r.id}</span>
                  {r.holderName && <div className="text-white font-semibold mt-0.5">{r.holderName}</div>}
                  {r.courseTitle && <div className="text-white/60 text-sm">{r.courseTitle}</div>}
                </div>
                <div className="flex-shrink-0">
                  {r.verified ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <BadgeCheck className="w-4 h-4" /> Valid
                    </span>
                  ) : r.status === 'not_found' ? (
                    <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                      <XCircle className="w-4 h-4" /> Not found
                    </span>
                  ) : r.status === 'revoked' ? (
                    <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                      <XCircle className="w-4 h-4" /> Revoked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-400 text-xs font-semibold">
                      <Clock className="w-4 h-4" /> Expired
                    </span>
                  )}
                </div>
              </div>
              {r.verified && r.skills && r.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">{s}</span>
                  ))}
                </div>
              )}
              {r.issuedAt && (
                <div className="text-xs text-white/30 mt-2">
                  Issued {formatDate(r.issuedAt)}
                  {r.expiryDate && ` · Expires ${formatDate(r.expiryDate)}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Post a Job Panel ─────────────────────────────────────
function PostJobPanel() {
  const [form, setForm] = useState<JobForm>({
    companyName: '', companyEmail: '', companyCountry: '', companyWebsite: '',
    title: '', description: '', requiredSkills: '', location: '', isRemote: false,
    salaryMin: '', salaryMax: '', currency: 'USD', type: 'full-time', level: 'any',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: keyof JobForm, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.companyName || !form.companyEmail || !form.companyCountry || !form.title || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/employers/jobs', {
        ...form,
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      })
      setSubmitted(true)
      toast.success('Job posted successfully!')
    } catch {
      toast.error('Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-white font-bold text-xl mb-2">Job Posted Successfully!</h3>
        <p className="text-white/60 mb-6">Your job listing is live and visible to AfriFlow AI graduates. We'll send you applicant details via email.</p>
        <button onClick={() => { setSubmitted(false); setForm({ companyName: '', companyEmail: '', companyCountry: '', companyWebsite: '', title: '', description: '', requiredSkills: '', location: '', isRemote: false, salaryMin: '', salaryMax: '', currency: 'USD', type: 'full-time', level: 'any' }) }} className="btn-secondary text-sm px-6 py-2.5">
          Post another job
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-2xl p-8 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Post a Job</h3>
          <p className="text-white/50 text-sm">Reach 4,000+ verified AfriFlow AI graduates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Company Name *</label>
          <input className="input-field w-full" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Corp" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Company Email *</label>
          <input type="email" className="input-field w-full" value={form.companyEmail} onChange={(e) => update('companyEmail', e.target.value)} placeholder="hr@acme.com" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Country *</label>
          <select className="input-field w-full" value={form.companyCountry} onChange={(e) => update('companyCountry', e.target.value)}>
            <option value="">Select country…</option>
            {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="International">International</option>
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Website (optional)</label>
          <input className="input-field w-full" value={form.companyWebsite} onChange={(e) => update('companyWebsite', e.target.value)} placeholder="https://acme.com" />
        </div>
      </div>

      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5">Job Title *</label>
        <input className="input-field w-full" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="AI Automation Specialist" />
      </div>

      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5">Job Description *</label>
        <textarea className="input-field w-full resize-none" rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for…" />
      </div>

      <div>
        <label className="block text-white/60 text-xs font-medium mb-1.5">Required Skills (comma-separated)</label>
        <input className="input-field w-full" value={form.requiredSkills} onChange={(e) => update('requiredSkills', e.target.value)} placeholder="Zapier, Make, WhatsApp automation" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SKILL_TAGS.slice(0, 8).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => {
                const current = form.requiredSkills ? form.requiredSkills.split(',').map(x => x.trim()) : []
                if (!current.includes(s)) update('requiredSkills', [...current, s].join(', '))
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-brand-500/20 text-white/50 hover:text-brand-300 border border-white/10 hover:border-brand-500/30 transition-all"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Job Type</label>
          <select className="input-field w-full" value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Level</label>
          <select className="input-field w-full" value={form.level} onChange={(e) => update('level', e.target.value)}>
            <option value="any">Any</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Currency</label>
          <select className="input-field w-full" value={form.currency} onChange={(e) => update('currency', e.target.value)}>
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
            <option value="KES">KES</option>
            <option value="GHS">GHS</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Min Salary (optional)</label>
          <input type="number" className="input-field w-full" value={form.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} placeholder="500" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Max Salary (optional)</label>
          <input type="number" className="input-field w-full" value={form.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} placeholder="2000" />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => update('isRemote', !form.isRemote)}
          className={`w-10 h-5 rounded-full transition-colors relative ${form.isRemote ? 'bg-brand-500' : 'bg-white/20'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${form.isRemote ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-white/70 text-sm">Remote position</span>
      </label>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {loading ? 'Posting…' : 'Post Job — Free'}
      </button>

      <p className="text-white/30 text-xs text-center">1 free job post · <Link href="/pricing" className="text-brand-400 hover:text-brand-300">$50/mo for unlimited</Link></p>
    </form>
  )
}

// ─── Main Component ────────────────────────────────────────
const TABS = ['Overview', 'Verify Certificates', 'Post a Job'] as const
type Tab = typeof TABS[number]

export default function EmployerPortalClient() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  return (
    <main className="min-h-screen bg-earth-950 pt-20">
      {/* Hero */}
      <div className="relative py-24 bg-earth-900 border-b border-earth-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="section-tag mb-4"><Building2 size={13} /> For Employers</span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Hire Africa&apos;s best <span className="gradient-text">verified AI talent</span>
              </h1>
              <p className="text-white/60 text-lg mb-8 max-w-xl">
                Access 4,000+ AfriFlow AI graduates with tamper-proof certificates. Search by skill, post jobs, and verify credentials instantly — no guesswork.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button onClick={() => setActiveTab('Post a Job')} className="btn-primary py-3 px-7 inline-flex items-center gap-2">
                  Post a Job — Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveTab('Verify Certificates')} className="btn-secondary py-3 px-7 inline-flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Verify Certificates
                </button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0 w-full lg:w-80">
              {[
                { icon: <Users className="w-5 h-5 text-brand-400" />, value: '4,100+', label: 'Verified graduates' },
                { icon: <BadgeCheck className="w-5 h-5 text-emerald-400" />, value: '6', label: 'Certificate types' },
                { icon: <Globe className="w-5 h-5 text-sky-400" />, value: '19', label: 'African countries' },
                { icon: <Zap className="w-5 h-5 text-yellow-400" />, value: '< 1s', label: 'Verify speed' },
              ].map((s) => (
                <div key={s.label} className="card rounded-2xl p-4 text-center">
                  <div className="flex justify-center mb-2">{s.icon}</div>
                  <div className="text-white font-bold text-xl">{s.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-earth-950/80 backdrop-blur-md border-b border-earth-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === t
                    ? 'border-brand-500 text-brand-400'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Overview ── */}
        {activeTab === 'Overview' && (
          <div className="space-y-12">
            {/* Why AfriFlow */}
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-8 text-center">Why hire AfriFlow AI graduates?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <BadgeCheck className="w-6 h-6 text-emerald-400" />,
                    title: 'Tamper-proof credentials',
                    desc: 'Every certificate is cryptographically signed. Verify any credential in under 1 second.',
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-brand-400" />,
                    title: 'Job-ready from day one',
                    desc: 'Graduates have built real projects and automations — not just watched videos.',
                  },
                  {
                    icon: <Globe className="w-6 h-6 text-sky-400" />,
                    title: 'Pan-African talent pool',
                    desc: 'Access skilled professionals from 19 African countries, remote-ready.',
                  },
                  {
                    icon: <Shield className="w-6 h-6 text-purple-400" />,
                    title: 'Bulk verification',
                    desc: 'Paste up to 10 certificate IDs and verify them all at once — perfect for hiring pipelines.',
                  },
                  {
                    icon: <Briefcase className="w-6 h-6 text-yellow-400" />,
                    title: 'Free first job post',
                    desc: 'Post your first job listing free. Upgrade to $50/mo for unlimited postings.',
                  },
                  {
                    icon: <Award className="w-6 h-6 text-pink-400" />,
                    title: 'Skills-first hiring',
                    desc: 'Search graduates by specific skills, certification level, country, and availability.',
                  },
                ].map((item) => (
                  <div key={item.title} className="card rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="card rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-8 text-center">How it works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { step: '1', title: 'Post a job', desc: 'List your role with required skills and AfriFlow certificates. Free for your first post.' },
                  { step: '2', title: 'Get matched', desc: 'Graduates with matching certificates and skills are notified instantly.' },
                  { step: '3', title: 'Verify & hire', desc: 'Bulk-verify shortlisted candidates\' certificates in seconds, then make your hire.' },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                      {s.step}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                    <p className="text-white/50 text-sm">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">Simple pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Free',
                    price: '$0',
                    period: '',
                    features: ['1 job post', 'Bulk verify (10 IDs)', 'Certificate verification', 'Email applicant details'],
                    cta: 'Post a Job Free',
                    tab: 'Post a Job' as Tab,
                    highlight: false,
                  },
                  {
                    name: 'Premium',
                    price: '$50',
                    period: '/month',
                    features: ['Unlimited job posts', 'Bulk verify (100 IDs)', 'Priority listing (top of search)', 'Applicant management dashboard', 'Dedicated account manager'],
                    cta: 'Upgrade to Premium',
                    tab: 'Post a Job' as Tab,
                    highlight: true,
                  },
                ].map((plan) => (
                  <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? 'border-brand-500/50 bg-brand-500/5' : 'border-white/10 bg-white/3'}`}>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="font-display text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/40 text-sm mb-1">{plan.period}</span>
                    </div>
                    <div className="text-brand-400 font-semibold mb-4">{plan.name}</div>
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setActiveTab(plan.tab)}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-10 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">Ready to hire top African AI talent?</h2>
              <p className="text-white/60 mb-6 max-w-lg mx-auto">Join 40+ companies already hiring AfriFlow AI graduates. Post your first job free — no credit card required.</p>
              <button onClick={() => setActiveTab('Post a Job')} className="btn-primary py-3 px-8 inline-flex items-center gap-2">
                Post a Job — Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Verify Certificates ── */}
        {activeTab === 'Verify Certificates' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-white mb-2">Bulk Certificate Verification</h2>
              <p className="text-white/60">Instantly verify AfriFlow AI certificates from job applicants.</p>
            </div>
            <BulkVerifyPanel />
            <div className="mt-6 text-center">
              <p className="text-white/40 text-sm">Need to verify a single certificate in detail?{' '}
                <Link href="/certificates" className="text-brand-400 hover:text-brand-300 transition-colors">
                  Use the public verify page <ExternalLink className="w-3 h-3 inline" />
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* ── Post a Job ── */}
        {activeTab === 'Post a Job' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-white mb-2">Post a Job</h2>
              <p className="text-white/60">Reach 4,000+ verified AfriFlow AI graduates. First post is free.</p>
            </div>
            <PostJobPanel />
          </div>
        )}

      </div>
    </main>
  )
}
