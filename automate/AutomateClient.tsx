'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Zap, CheckCircle, ChevronRight, Clock, DollarSign,
  BarChart3, Mail, Users, ShoppingCart, FileSpreadsheet,
  MessageSquare, Briefcase, Settings2, ArrowRight, Star
} from 'lucide-react'
import { automateApi } from '@/lib/api'

const CATEGORIES = [
  { value: 'lead_generation', label: 'Lead Generation', icon: Users, desc: 'Auto-qualify & follow up leads from any source' },
  { value: 'crm_integration', label: 'CRM Integration', icon: Briefcase, desc: 'Sync contacts, deals, and data across tools' },
  { value: 'data_processing', label: 'Data Processing', icon: FileSpreadsheet, desc: 'Collect, transform, and report data automatically' },
  { value: 'email_automation', label: 'Email Automation', icon: Mail, desc: 'Sequences, newsletters, and transactional emails' },
  { value: 'social_media', label: 'Social Media', icon: MessageSquare, desc: 'Schedule, post, and monitor across platforms' },
  { value: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, desc: 'Orders, inventory, reviews, and customer ops' },
  { value: 'reporting', label: 'Reporting & BI', icon: BarChart3, desc: 'Automated dashboards and weekly reports' },
  { value: 'hr_ops', label: 'HR & Onboarding', icon: Users, desc: 'Contracts, onboarding flows, and payroll triggers' },
  { value: 'custom', label: 'Custom Build', icon: Settings2, desc: 'Anything else — we scope it with you' },
]

const BUDGET_OPTIONS = [
  { value: 'under_500', label: 'Under $500' },
  { value: '500_2000', label: '$500 – $2,000' },
  { value: '2000_5000', label: '$2,000 – $5,000' },
  { value: '5000_plus', label: '$5,000+' },
  { value: 'unsure', label: 'Not sure yet' },
]

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'ASAP (< 2 weeks)' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '3_months', label: 'Within 3 months' },
  { value: 'flexible', label: 'Flexible' },
]

const AFRICAN_COUNTRIES = [
  'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Ethiopia', 'Egypt', 'Tanzania',
  'Uganda', 'Rwanda', 'Senegal', 'Côte d\'Ivoire', 'Cameroon', 'Zimbabwe',
  'Zambia', 'Morocco', 'Tunisia', 'Algeria', 'Angola', 'Mozambique', 'Other',
]

const CASE_STUDIES = [
  {
    category: 'Lead Generation',
    client: 'Lagos Real Estate Agency',
    country: '🇳🇬',
    problem: 'Manually calling 200+ Facebook lead form submissions per week.',
    solution: 'Built a Make.com flow: Facebook → CRM → WhatsApp greeting → auto-follow-up after 48h.',
    result: '73% faster response time, 2.1× more qualified meetings booked.',
    tools: ['Make.com', 'WhatsApp Business', 'HubSpot'],
    xp: 150,
  },
  {
    category: 'E-commerce Ops',
    client: 'Accra Fashion Brand',
    country: '🇬🇭',
    problem: 'Order tracking spreadsheets, manual Instagram DMs for shipping updates.',
    solution: 'Shopify → Google Sheets dashboard + automated WhatsApp shipping notifications.',
    result: 'Customer service tickets dropped 60%. Owner saves 12h/week.',
    tools: ['Zapier', 'Shopify', 'Google Sheets'],
    xp: 120,
  },
  {
    category: 'Reporting',
    client: 'Nairobi EdTech Startup',
    country: '🇰🇪',
    problem: 'Weekly investor report took 6 hours to compile from 4 different platforms.',
    solution: 'Airtable + Make.com pipeline: auto-pulls metrics, formats PDF, emails every Monday 8am.',
    result: '6 hours → 0 minutes per week. Always on time.',
    tools: ['Airtable', 'Make.com', 'Notion'],
    xp: 100,
  },
]

type Step = 'category' | 'details' | 'contact' | 'success'

interface FormData {
  category: string
  title: string
  description: string
  currentProcess: string
  desiredOutcome: string
  toolsUsed: string
  budget: string
  timeline: string
  clientName: string
  clientEmail: string
  clientPhone: string
  company: string
  country: string
}

const INITIAL_FORM: FormData = {
  category: '', title: '', description: '', currentProcess: '',
  desiredOutcome: '', toolsUsed: '', budget: '', timeline: '',
  clientName: '', clientEmail: '', clientPhone: '', company: '', country: '',
}

export default function AutomateClient() {
  const [step, setStep] = useState<Step>('category')
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [requestRef, setRequestRef] = useState('')

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submit() {
    setSubmitting(true)
    try {
      const res = await automateApi.submit({
        ...form,
        toolsUsed: form.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean),
      })
      setRequestRef(res.data.request.requestRef)
      setStep('success')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Submission failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-earth-950">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-950/0 via-earth-950/50 to-earth-950" />

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <span className="section-tag mb-6">AI Automation Service</span>
          <h1 className="font-display text-5xl font-bold text-white lg:text-7xl">
            We Build Your{' '}
            <span className="gradient-text">Automation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70">
            Describe any repetitive business process. Our team of African AI builders will
            automate it with Make, Zapier, or custom AI — in days, not months.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> Free scoping call</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> Fixed-price delivery</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> 30-day support included</span>
          </div>
        </div>
      </section>

      {/* ── MULTI-STEP FORM ── */}
      <section className="py-10">
        <div className="mx-auto max-w-2xl px-4">
          {/* Progress bar */}
          {step !== 'success' && (
            <div className="mb-8">
              <div className="mb-2 flex justify-between text-xs text-white/40">
                {(['category', 'details', 'contact'] as Step[]).map((s, i) => (
                  <span key={s} className={step === s ? 'text-brand-400' : ''}>
                    {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-brand-500 transition-all"
                  style={{ width: step === 'category' ? '33%' : step === 'details' ? '66%' : '100%' }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 1: Category ── */}
          {step === 'category' && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-white">
                What do you want to automate?
              </h2>
              <p className="mb-6 text-white/50">Pick the category that best fits your need.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { update('category', cat.value); setStep('details') }}
                    className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition hover:border-brand-500 ${
                      form.category === cat.value ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <cat.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    <div>
                      <div className="font-medium text-white">{cat.label}</div>
                      <div className="mt-0.5 text-xs text-white/50">{cat.desc}</div>
                    </div>
                    <ChevronRight className="ml-auto mt-0.5 h-4 w-4 text-white/20 group-hover:text-brand-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 'details' && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 font-display text-2xl font-bold text-white">Tell us about the process</h2>
                <p className="text-sm text-white/50">
                  Category: <span className="text-brand-400 capitalize">{form.category.replace(/_/g, ' ')}</span>
                  <button onClick={() => setStep('category')} className="ml-2 text-xs underline opacity-50 hover:opacity-100">change</button>
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Project Title *</label>
                <input
                  className="input-field w-full"
                  placeholder="e.g. Automate our WhatsApp lead follow-up"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Brief Description *</label>
                <textarea
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Describe what you want automated in 1-3 sentences…"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">How do you do this today? *</label>
                <textarea
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Walk us through the manual process step by step…"
                  value={form.currentProcess}
                  onChange={(e) => update('currentProcess', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">What should happen automatically? *</label>
                <textarea
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Describe the ideal automated outcome…"
                  value={form.desiredOutcome}
                  onChange={(e) => update('desiredOutcome', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Tools you already use (comma-separated)</label>
                <input
                  className="input-field w-full"
                  placeholder="e.g. WhatsApp, Google Sheets, Shopify, Notion"
                  value={form.toolsUsed}
                  onChange={(e) => update('toolsUsed', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-white/60">Budget *</label>
                  <select
                    className="input-field w-full"
                    value={form.budget}
                    onChange={(e) => update('budget', e.target.value)}
                  >
                    <option value="">Select…</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/60">Timeline *</label>
                  <select
                    className="input-field w-full"
                    value={form.timeline}
                    onChange={(e) => update('timeline', e.target.value)}
                  >
                    <option value="">Select…</option>
                    {TIMELINE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!form.title || !form.description || !form.currentProcess || !form.desiredOutcome || !form.budget || !form.timeline) {
                    toast.error('Please fill in all required fields')
                    return
                  }
                  setStep('contact')
                }}
                className="btn-primary w-full"
              >
                Next: Contact Info →
              </button>
            </div>
          )}

          {/* ── STEP 3: Contact ── */}
          {step === 'contact' && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 font-display text-2xl font-bold text-white">Your contact details</h2>
                <p className="text-sm text-white/50">We&apos;ll reach out within 24 hours to schedule a free scoping call.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-white/60">Your Name *</label>
                  <input
                    className="input-field w-full"
                    placeholder="Amara Okafor"
                    value={form.clientName}
                    onChange={(e) => update('clientName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/60">Company</label>
                  <input
                    className="input-field w-full"
                    placeholder="Company name"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Email *</label>
                <input
                  className="input-field w-full"
                  type="email"
                  placeholder="you@company.com"
                  value={form.clientEmail}
                  onChange={(e) => update('clientEmail', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-white/60">WhatsApp / Phone</label>
                  <input
                    className="input-field w-full"
                    placeholder="+234 800 000 0000"
                    value={form.clientPhone}
                    onChange={(e) => update('clientPhone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/60">Country *</label>
                  <select
                    className="input-field w-full"
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                  >
                    <option value="">Select…</option>
                    {AFRICAN_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!form.clientName || !form.clientEmail || !form.country) {
                    toast.error('Please fill in name, email, and country')
                    return
                  }
                  submit()
                }}
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? 'Submitting…' : 'Submit Request →'}
              </button>

              <button onClick={() => setStep('details')} className="w-full text-sm text-white/40 hover:text-white">
                ← Back
              </button>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === 'success' && (
            <div className="rounded-2xl border border-forest-500/30 bg-forest-500/10 p-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-forest-500/20">
                <CheckCircle className="h-10 w-10 text-forest-500" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white">Request Submitted!</h2>
              <p className="mt-3 text-white/60">
                Your reference number is{' '}
                <span className="font-mono font-bold text-brand-400">{requestRef}</span>
              </p>
              <p className="mt-2 text-sm text-white/40">
                We&apos;ll review your request and reach out within 24 hours to schedule a free scoping call.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { setForm(INITIAL_FORM); setStep('category') }}
                  className="btn-secondary"
                >
                  Submit Another
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      {step !== 'success' && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center">
              <span className="section-tag mb-4">The Process</span>
              <h2 className="font-display text-3xl font-bold text-white">From Idea to Live in Days</h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {[
                { step: '01', icon: MessageSquare, title: 'Submit Request', desc: 'Fill in the form above with your process details.' },
                { step: '02', icon: Clock, title: 'Free Scoping Call', desc: 'Our builder maps your workflow and confirms the solution.' },
                { step: '03', icon: Zap, title: 'We Build It', desc: 'Our team builds and tests your automation end-to-end.' },
                { step: '04', icon: CheckCircle, title: 'Delivered + Support', desc: 'You go live. We support you for 30 days post-delivery.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
                    <item.icon className="h-7 w-7 text-brand-500" />
                  </div>
                  <div className="font-mono text-xs text-brand-500">{item.step}</div>
                  <div className="mt-1 font-semibold text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-white/50">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CASE STUDIES ── */}
      <section className="bg-white/5 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="section-tag mb-4">Case Studies</span>
            <h2 className="font-display text-3xl font-bold text-white">
              Automations We&apos;ve Built
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.client} className="card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs text-brand-400">{cs.category}</span>
                  <span className="text-lg">{cs.country}</span>
                </div>
                <h3 className="font-semibold text-white">{cs.client}</h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white/30">Problem</span>
                    <p className="mt-0.5 text-white/60">{cs.problem}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white/30">Solution</span>
                    <p className="mt-0.5 text-white/60">{cs.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white/30">Result</span>
                    <p className="mt-0.5 font-medium text-forest-400">{cs.result}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cs.tools.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40">{t}</span>
                  ))}
                </div>

                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: DollarSign, title: 'Fixed Price', desc: 'No hourly surprises. You approve the quote before we start.' },
              { icon: Clock, title: 'Fast Turnaround', desc: 'Most automations delivered in 5-14 business days.' },
              { icon: Settings2, title: 'Built to Last', desc: 'We document everything and train your team to manage it.' },
            ].map((item) => (
              <div key={item.title} className="card flex items-start gap-4 p-6">
                <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-500" />
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="mt-1 text-sm text-white/50">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="btn-primary"
            >
              Get Your Automation Built <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
