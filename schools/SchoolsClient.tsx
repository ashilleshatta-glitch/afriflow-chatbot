'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Building2, Users, BarChart3, Award, CheckCircle,
  ChevronRight, Globe, Zap, Shield, BookOpen, ArrowRight, Star
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { schoolsApi } from '@/lib/api'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    seats: 30,
    features: [
      '30 student seats',
      'All free courses',
      'Progress dashboard',
      'School invite link',
      'Community access',
    ],
    cta: 'Start Free',
    highlight: false,
    badge: '',
  },
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    seats: 150,
    features: [
      '150 student seats',
      'All 50+ courses',
      'Analytics dashboard',
      'Bulk certificates',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Get Started',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    seats: 9999,
    features: [
      'Unlimited seats',
      'White-label portal',
      'API access',
      'Dedicated account manager',
      'Custom curriculum',
      'SLA guarantee',
      'SSO / SAML',
    ],
    cta: 'Contact Sales',
    highlight: false,
    badge: 'Best Value',
  },
]

const SCHOOL_TYPES = [
  { value: 'university', label: 'University' },
  { value: 'college', label: 'College' },
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'secondary', label: 'Secondary School' },
  { value: 'vocational', label: 'Vocational Institute' },
  { value: 'corporate', label: 'Corporate Training' },
]

const AFRICAN_COUNTRIES = [
  'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Ethiopia', 'Egypt', 'Tanzania',
  'Uganda', 'Rwanda', 'Senegal', 'Côte d\'Ivoire', 'Cameroon', 'Zimbabwe',
  'Zambia', 'Morocco', 'Tunisia', 'Algeria', 'Angola', 'Mozambique', 'Botswana',
]

const STATS = [
  { value: '120+', label: 'Institutions', icon: Building2 },
  { value: '18,000+', label: 'Students Enrolled', icon: Users },
  { value: '94%', label: 'Course Completion', icon: BarChart3 },
  { value: '12,400+', label: 'Certificates Issued', icon: Award },
]

const TESTIMONIALS = [
  {
    quote: "AfriFlow AI transformed how we teach digital skills. Our students now graduate with real AI credentials employers trust.",
    name: "Dr. Amara Okafor",
    role: "Dean of Technology, Lagos State University",
    country: "🇳🇬",
  },
  {
    quote: "We deployed across 3 campuses in a week. The progress dashboard alone saved us 20 hours a month in reporting.",
    name: "James Kimani",
    role: "L&D Director, Equity Bank Kenya",
    country: "🇰🇪",
  },
  {
    quote: "Our bootcamp completion rate jumped from 61% to 89% after adding the 30-Day Challenge and peer leaderboards.",
    name: "Nana Ama Asante",
    role: "Founder, Accra Code Academy",
    country: "🇬🇭",
  },
]

export default function SchoolsClient() {
  const { user, token } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '', country: '', city: '', type: 'university', website: '', description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!token) { toast.error('Please log in first'); router.push('/auth/login'); return }
    setSubmitting(true)
    try {
      const res = await schoolsApi.create(form)
      toast.success('School created! Redirecting to your portal…')
      router.push(`/school/${res.data.school.slug}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create school'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-earth-950">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-950/0 via-earth-950/60 to-earth-950" />

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <span className="section-tag mb-6">For Schools & Institutions</span>

          <h1 className="font-display text-5xl font-bold tracking-tight text-white lg:text-7xl">
            Africa&apos;s AI Curriculum,{' '}
            <span className="gradient-text">Deployed at Scale</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/70">
            White-label AI learning portals for universities, bootcamps, and corporate teams.
            Track progress, assign courses, and certify your students with AfriFlow AI.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <button onClick={() => setShowForm(true)} className="btn-primary text-lg">
                Create Your School Portal <ArrowRight className="ml-2 inline h-5 w-5" />
              </button>
            ) : (
              <Link href="/auth/register?next=/schools" className="btn-primary text-lg">
                Get Started Free <ArrowRight className="ml-2 inline h-5 w-5" />
              </Link>
            )}
            <Link href="#pricing" className="btn-secondary text-lg">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/10 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto mb-2 h-7 w-7 text-brand-500" />
                <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-sm text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="section-tag mb-4">Why Schools Choose AfriFlow</span>
            <h2 className="font-display text-4xl font-bold text-white">
              Everything Your Institution Needs
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BarChart3, title: 'Real-time Analytics',
                desc: 'Track every student\'s progress across all assigned courses. Spot who\'s falling behind before they drop out.',
              },
              {
                icon: Award, title: 'Branded Certificates',
                desc: 'Issue blockchain-verified certificates with your institution\'s logo. Recognised by 500+ African employers.',
              },
              {
                icon: BookOpen, title: 'Curated AI Curriculum',
                desc: 'Assign any of 50+ courses — from AI Basics to Advanced Automation. Updated quarterly by practitioners.',
              },
              {
                icon: Users, title: 'Easy Onboarding',
                desc: 'One invite link gets students enrolled in minutes. No IT setup required. Works on any device.',
              },
              {
                icon: Globe, title: 'Multi-campus Support',
                desc: 'Manage multiple cohorts, cities, and departments from a single admin dashboard.',
              },
              {
                icon: Shield, title: 'Enterprise Security',
                desc: 'SOC-2 compliant, FERPA-ready. Single Sign-On (SSO) and role-based access available on Enterprise.',
              },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <f.icon className="mb-4 h-8 w-8 text-brand-500" />
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white/5 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="section-tag mb-4">Trusted by Institutions</span>
            <h2 className="font-display text-3xl font-bold text-white">What Educators Say</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-500 text-brand-500" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-white/80">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-xl">
                    {t.country}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/50">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="section-tag mb-4">Pricing</span>
            <h2 className="font-display text-4xl font-bold text-white">
              Simple, Transparent Plans
            </h2>
            <p className="mt-3 text-white/60">
              All plans include full course access. Upgrade as you grow.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight
                    ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_40px_rgba(255,122,0,0.2)]'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                )}
                <div className="text-sm font-medium text-white/50">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/50">{plan.period}</span>
                </div>
                <div className="mt-1 text-xs text-white/40">up to {plan.seats === 9999 ? 'unlimited' : plan.seats} students</div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 shrink-0 text-forest-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      window.open('mailto:schools@afriflow.ai?subject=Enterprise Inquiry', '_blank')
                    } else {
                      setShowForm(true)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
                    plan.highlight
                      ? 'bg-brand-500 text-white hover:bg-brand-600'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta} <ChevronRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREATE SCHOOL FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-earth-950 p-8 shadow-2xl">
            <h2 className="mb-1 font-display text-2xl font-bold text-white">
              Create Your School Portal
            </h2>
            <p className="mb-6 text-sm text-white/50">
              Your portal will be live at afriflow.ai/school/your-slug
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-white/60">Institution Name *</label>
                <input
                  className="input-field w-full"
                  placeholder="e.g. University of Lagos"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-white/60">Country *</label>
                  <select
                    className="input-field w-full"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                  >
                    <option value="">Select…</option>
                    {AFRICAN_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/60">City</label>
                  <input
                    className="input-field w-full"
                    placeholder="Lagos"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Institution Type *</label>
                <select
                  className="input-field w-full"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                >
                  {SCHOOL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Website</label>
                <input
                  className="input-field w-full"
                  placeholder="https://youruniversity.edu"
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">Short Description</label>
                <textarea
                  className="input-field w-full resize-none"
                  rows={2}
                  placeholder="Brief description of your institution…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-white/20 py-3 text-sm text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? 'Creating…' : 'Create Portal →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BOTTOM CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="card-glow rounded-3xl p-12">
            <Zap className="mx-auto mb-4 h-10 w-10 text-brand-500" />
            <h2 className="font-display text-3xl font-bold text-white">
              Ready to Deploy AI Education?
            </h2>
            <p className="mt-3 text-white/60">
              Join 120+ institutions already using AfriFlow AI. Setup takes less than 5 minutes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => {
                  setShowForm(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="btn-primary"
              >
                Start for Free →
              </button>
              <a
                href="mailto:schools@afriflow.ai"
                className="btn-secondary"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
