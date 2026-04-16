'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$3,000',
    perYear: true,
    seats: '50 seats',
    headline: 'Perfect for departments & teams',
    features: [
      '50 learner seats',
      'Curated AfriFlow curriculum',
      'Team progress dashboard',
      'AfriFlow AI Coach access',
      'Priority support',
      'AfriFlow certificates for all learners',
    ],
    cta: 'Start with Starter',
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$12,000',
    perYear: true,
    seats: '500 seats',
    headline: 'For ambitious organisations scaling AI',
    features: [
      '500 learner seats',
      'Custom curriculum builder',
      'Branded learning portal',
      'Advanced analytics & reporting',
      'Custom AI Coach persona',
      'Bulk certificate issuance',
      'Dedicated success manager',
      'API access (System 4)',
    ],
    cta: 'Go Growth',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    perYear: false,
    seats: 'Unlimited seats',
    headline: 'For large enterprises & governments',
    features: [
      'Unlimited seats',
      'White-label portal (your domain)',
      'SSO / SAML integration',
      'Custom LMS integration',
      'On-site training sessions',
      'SLA-backed uptime guarantee',
      'Co-branded certifications',
      'Full API access + webhooks',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

const INDUSTRIES = [
  { icon: '🏦', label: 'Banking & Finance' },
  { icon: '📡', label: 'Telcos & ISPs' },
  { icon: '🏥', label: 'Healthcare' },
  { icon: '🏛️', label: 'Government & Public Sector' },
  { icon: '🎓', label: 'Universities & Institutions' },
  { icon: '🛒', label: 'Retail & E-commerce' },
  { icon: '⚡', label: 'Energy & Utilities' },
  { icon: '🌱', label: 'NGOs & Development Orgs' },
]

const CASE_STUDY = {
  org: 'First Continental Bank',
  country: 'Nigeria',
  employees: 200,
  days: 60,
  outcome:
    '200 employees completed AI Foundations in 60 days. Fraud detection time dropped 40%. Three internal automation projects launched in week one post-training.',
}

const FAQS = [
  {
    q: 'How quickly can we get started?',
    a: 'Onboarding takes less than 48 hours. We configure your branded portal, load your curriculum, and your learners can start the same week.',
  },
  {
    q: 'Can we use our own content?',
    a: 'Yes. Growth and Enterprise plans let you upload custom courses alongside the AfriFlow library. You can mix and match freely.',
  },
  {
    q: 'Do learners need AfriFlow accounts?',
    a: 'Learners are invited via a unique link and auto-enrolled to your org. They get personal AfriFlow AI profiles linked to your organisation.',
  },
  {
    q: 'Are certificates recognised?',
    a: 'AfriFlow certificates include blockchain-verifiable links and are designed for African professional contexts — recognised by our employer network.',
  },
  {
    q: 'Can we pay in local currency?',
    a: 'Yes. We accept NGN, KES, GHS, ZAR, UGX, TZS, and USD. Payment via bank transfer or card.',
  },
]

export default function EnterprisePage() {
  const [employees, setEmployees] = useState(100)
  const [hourlyRate, setHourlyRate] = useState(20)
  const [hoursSaved, setHoursSaved] = useState(4)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [form, setForm] = useState({
    name: '', email: '', org: '', country: '', size: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const roiMonthly = employees * hourlyRate * hoursSaved * 4.33
  const roiAnnual = roiMonthly * 12

  async function handleDemo(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // In production, POST to /api/enterprise/demo or send to sales CRM
    await new Promise((r) => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-earth-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="glow-orb w-[600px] h-[600px] bg-brand-500/10 -top-40 left-1/2 -translate-x-1/2" />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="section-tag mb-4">AfriFlow Enterprise OS</span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Power your organisation&apos;s<br />
            <span className="gradient-text">AI transformation</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            A fully managed AI learning OS for African organisations. Branded portals, custom curricula,
            team analytics, and certificates your people are proud to show.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#demo" className="btn-primary px-8 py-4 text-lg">Book a Free Demo</a>
            <a href="#pricing" className="btn-secondary px-8 py-4 text-lg">View Pricing</a>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-widest">
          Trusted by teams across
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind) => (
            <div key={ind.label} className="card text-center py-5">
              <span className="text-3xl">{ind.icon}</span>
              <p className="mt-2 text-sm text-gray-300">{ind.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case study */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="card-glow p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <span className="section-tag mb-4">Case Study</span>
          <h3 className="text-2xl font-bold mb-1">{CASE_STUDY.org}</h3>
          <p className="text-gray-400 mb-4 text-sm">{CASE_STUDY.country} · {CASE_STUDY.employees} employees</p>
          <p className="text-gray-200 text-lg leading-relaxed">&ldquo;{CASE_STUDY.outcome}&rdquo;</p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div><p className="text-3xl font-bold text-brand-500">{CASE_STUDY.employees}</p><p className="text-sm text-gray-400">Employees trained</p></div>
            <div><p className="text-3xl font-bold text-forest-500">{CASE_STUDY.days} days</p><p className="text-sm text-gray-400">To completion</p></div>
            <div><p className="text-3xl font-bold text-purple-400">40%</p><p className="text-sm text-gray-400">Faster fraud detection</p></div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-earth-900/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="section-tag mb-4">ROI Calculator</span>
            <h2 className="text-3xl font-bold">See your return before you sign</h2>
          </div>
          <div className="card p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Employees being trained</label>
                <input
                  type="range" min={10} max={1000} step={10} value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <p className="text-brand-500 font-bold text-xl mt-1">{employees}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Avg hourly rate (USD)</label>
                <input
                  type="range" min={5} max={100} step={5} value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <p className="text-brand-500 font-bold text-xl mt-1">${hourlyRate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Hours saved per week / person</label>
                <input
                  type="range" min={1} max={20} step={1} value={hoursSaved}
                  onChange={(e) => setHoursSaved(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <p className="text-brand-500 font-bold text-xl mt-1">{hoursSaved}h</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center bg-earth-800 rounded-xl p-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Monthly productivity value</p>
                <p className="text-3xl font-bold text-forest-500">${roiMonthly.toLocaleString('en', { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Annual ROI estimate</p>
                <p className="text-3xl font-bold gradient-text">${roiAnnual.toLocaleString('en', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag mb-4">Pricing</span>
          <h2 className="text-3xl font-bold">Plans that scale with your organisation</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`card p-8 flex flex-col ${tier.highlight ? 'ring-2 ring-brand-500 relative' : ''}`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <p className="text-sm text-gray-400 mb-1">{tier.name}</p>
              <p className="text-4xl font-bold mb-1">{tier.price}</p>
              {tier.perYear && <p className="text-xs text-gray-500 mb-2">per year</p>}
              <p className="text-brand-500 font-semibold mb-4">{tier.seats}</p>
              <p className="text-sm text-gray-400 mb-6">{tier.headline}</p>
              <ul className="space-y-2 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-forest-500 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#demo"
                className={`text-center py-3 rounded-lg font-semibold ${tier.highlight ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Common questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium">{faq.q}</span>
                <span className="text-brand-500 text-xl">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Demo form */}
      <section id="demo" className="py-20 bg-earth-900/60">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="section-tag mb-4">Book a Demo</span>
            <h2 className="text-3xl font-bold">Let&apos;s talk about your team</h2>
            <p className="text-gray-400 mt-2">We&apos;ll walk you through the platform and set up a free pilot.</p>
          </div>
          {sent ? (
            <div className="card p-10 text-center">
              <p className="text-4xl mb-4">🎉</p>
              <h3 className="text-xl font-bold mb-2">Request received!</h3>
              <p className="text-gray-400">Our enterprise team will reach out within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleDemo} className="card p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Your name</label>
                  <input
                    className="input-field w-full" required placeholder="Amara Osei"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Work email</label>
                  <input
                    type="email" className="input-field w-full" required placeholder="amara@firstbank.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Organisation</label>
                <input
                  className="input-field w-full" required placeholder="First Continental Bank"
                  value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Country</label>
                  <input
                    className="input-field w-full" required placeholder="Nigeria"
                    value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Team size</label>
                  <select
                    className="input-field w-full" required
                    value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                  >
                    <option value="">Select…</option>
                    <option value="1-50">1–50</option>
                    <option value="51-200">51–200</option>
                    <option value="201-500">201–500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">What are you hoping to achieve?</label>
                <textarea
                  className="input-field w-full" rows={3} placeholder="We want to upskill our analysts in AI automation…"
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? 'Sending…' : 'Book Free Demo →'}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
