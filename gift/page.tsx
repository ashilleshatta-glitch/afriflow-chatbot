'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  Gift, Heart, ArrowRight, CheckCircle, Globe, Users,
  Star, Zap, ChevronDown, ChevronUp, Building2, DollarSign,
} from 'lucide-react'

const PLANS = [
  {
    id: '1month',
    label: '1 Month Gift',
    usd: 20,
    duration: '30 days of Premium access',
    popular: false,
    color: 'border-earth-700',
    savings: null,
  },
  {
    id: '6months',
    label: '6 Month Gift',
    usd: 99,
    duration: '6 months of Premium access',
    popular: true,
    color: 'border-brand-500/50',
    savings: 'Save $21 vs monthly',
  },
  {
    id: '12months',
    label: '1 Year Gift',
    usd: 179,
    duration: '12 months of Premium access',
    popular: false,
    color: 'border-forest-500/30',
    savings: 'Save $61 vs monthly',
  },
]

const STORIES = [
  {
    gifter: 'Emmanuel O.',
    gifterFlag: '🇬🇧',
    recipient: 'His sister in Lagos',
    plan: '6 months',
    quote: 'I spent more on a birthday dinner than on 6 months of skills that changed her career. She now earns double her old salary freelancing AI work.',
  },
  {
    gifter: 'Dr. Amara S.',
    gifterFlag: '🇺🇸',
    recipient: 'Team of 5 at her NGO in Accra',
    plan: '12 months each',
    quote: 'The ROI was immediate. Within 3 months, my team automated our donor reporting and freed up 30 hours a month for actual fieldwork.',
  },
  {
    gifter: 'Tunde F.',
    gifterFlag: '🇨🇦',
    recipient: 'His nephew in Abuja',
    plan: '1 year',
    quote: 'Best investment I\'ve ever made in a person. He went from unemployed to running a small AI consulting practice in under a year.',
  },
]

const FAQS = [
  { q: 'How does the recipient access their gift?', a: 'They receive a beautiful email with a personal note from you and a one-click claim link. If they already have an AfriFlow account, Premium activates instantly. If not, they create a free account first — takes under 2 minutes.' },
  { q: 'What currency can I pay in?', a: 'USD, GBP, EUR, CAD via Stripe. NGN, GHS, KES, ZAR via Paystack or Flutterwave. We auto-detect your location and show the right option.' },
  { q: 'Can I send a gift anonymously?', a: 'Yes. Leave the gifter name blank and your name won\'t appear in the email to the recipient.' },
  { q: 'What if the recipient already has Premium?', a: 'Their Premium gets extended by the gift duration — it doesn\'t replace their existing subscription.' },
  { q: 'What is the scholarship option?', a: 'Your payment goes into AfriFlow\'s scholarship pool and is distributed to verified low-income learners who applied for aid. We\'ll send you a report of the impact at the end of each quarter.' },
]

export default function GiftPage() {
  const [selectedPlan, setSelectedPlan] = useState('6months')
  const [step, setStep] = useState<'select' | 'form' | 'confirm'>('select')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({
    gifterName: '', gifterEmail: '', gifterCountry: '',
    recipientName: '', recipientEmail: '', recipientCountry: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const chosen = PLANS.find(p => p.id === selectedPlan)!

  const handleSubmit = async () => {
    if (!form.gifterName || !form.gifterEmail || !form.recipientName || !form.recipientEmail) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gift/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan: selectedPlan, paymentProvider: 'stripe' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setStep('confirm')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-20 bg-earth-900 border-b border-earth-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] glow-orb bg-brand-500/8" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <span className="section-tag mb-6"><Heart size={14} className="text-red-400" /> Diaspora Gifting</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5">
              Give the gift that <span className="gradient-text">changes a life.</span>
            </h1>
            <p className="text-earth-300 text-xl mb-4 max-w-2xl mx-auto">
              Sponsor AI education for someone in Africa. In Ghana, a 6-month gift costs less than one family dinner — and it can double their income.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-earth-400">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-forest-400" /> Instant delivery</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-forest-400" /> Pay in your currency</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-forest-400" /> Personal message included</span>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* GIFT BUILDER */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left: plan picker + form */}
              <div className="lg:col-span-3 space-y-6">
                {/* Plan selection */}
                <div>
                  <h2 className="text-white font-bold text-xl mb-4">1. Choose a plan</h2>
                  <div className="space-y-3">
                    {PLANS.map(p => (
                      <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                          selectedPlan === p.id
                            ? 'border-brand-500 bg-brand-500/8'
                            : `${p.color} bg-earth-900/50 hover:bg-earth-800/50`
                        }`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{p.label}</span>
                            {p.popular && <span className="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-bold">MOST POPULAR</span>}
                          </div>
                          <p className="text-earth-400 text-sm mt-0.5">{p.duration}</p>
                          {p.savings && <p className="text-forest-400 text-xs mt-1">{p.savings}</p>}
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-display text-3xl font-black text-white">${p.usd}</p>
                          <p className="text-earth-500 text-xs">USD</p>
                        </div>
                      </button>
                    ))}
                    {/* Scholarship option */}
                    <button onClick={() => setSelectedPlan('scholarship')}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPlan === 'scholarship'
                          ? 'border-purple-500 bg-purple-500/8'
                          : 'border-earth-700 bg-earth-900/50 hover:bg-earth-800/50'
                      }`}>
                      <div>
                        <span className="text-white font-semibold flex items-center gap-2">
                          <Gift size={14} className="text-purple-400" /> Gift to a Stranger
                        </span>
                        <p className="text-earth-400 text-sm mt-0.5">Donate to AfriFlow&apos;s scholarship pool for low-income learners</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-display text-3xl font-black text-white">$20</p>
                        <p className="text-earth-500 text-xs">USD</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form */}
                {step !== 'confirm' && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-4">2. Who is it from &amp; to?</h2>
                    <div className="card space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-earth-400 text-xs font-medium mb-1.5 block">Your name *</label>
                          <input className="input-field" placeholder="Your full name"
                            value={form.gifterName} onChange={e => setForm(f => ({ ...f, gifterName: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-earth-400 text-xs font-medium mb-1.5 block">Your email *</label>
                          <input className="input-field" type="email" placeholder="you@email.com"
                            value={form.gifterEmail} onChange={e => setForm(f => ({ ...f, gifterEmail: e.target.value }))} />
                        </div>
                      </div>
                      {selectedPlan !== 'scholarship' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-earth-400 text-xs font-medium mb-1.5 block">Recipient&apos;s name *</label>
                              <input className="input-field" placeholder="Their full name"
                                value={form.recipientName} onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))} />
                            </div>
                            <div>
                              <label className="text-earth-400 text-xs font-medium mb-1.5 block">Recipient&apos;s email *</label>
                              <input className="input-field" type="email" placeholder="their@email.com"
                                value={form.recipientEmail} onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))} />
                            </div>
                          </div>
                          <div>
                            <label className="text-earth-400 text-xs font-medium mb-1.5 block">Personal message</label>
                            <textarea className="input-field min-h-[80px] resize-none" placeholder="Write them a personal note..."
                              value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                          </div>
                        </>
                      )}
                      {error && <p className="text-red-400 text-sm">{error}</p>}
                      <button onClick={handleSubmit} disabled={loading}
                        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60">
                        {loading ? 'Processing...' : `Continue to payment — $${chosen.usd}`}
                        <ArrowRight size={16} />
                      </button>
                      <p className="text-earth-600 text-xs text-center">Secure payment via Stripe · Paystack · Flutterwave</p>
                    </div>
                  </div>
                )}

                {step === 'confirm' && (
                  <div className="card text-center">
                    <div className="w-16 h-16 bg-forest-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-forest-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Gift created!</h3>
                    <p className="text-earth-400 mb-4">Your payment link is ready. In production, you&apos;d be redirected to complete payment now.</p>
                    <p className="text-earth-500 text-sm">Once paid, {form.recipientName || 'the recipient'} will receive a beautiful email with their claim link instantly.</p>
                  </div>
                )}
              </div>

              {/* Right: preview card */}
              <div className="lg:col-span-2">
                <div className="card-glow sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🎁</div>
                    <p className="text-earth-500 text-xs uppercase tracking-widest">Gift preview</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-400">Plan</span>
                      <span className="text-white font-medium">{chosen.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-400">What they get</span>
                      <span className="text-white font-medium">Full Premium</span>
                    </div>
                    <div className="border-t border-earth-800 pt-3 flex justify-between">
                      <span className="text-earth-400 font-medium">Total</span>
                      <span className="text-white font-bold text-xl">${chosen.usd} USD</span>
                    </div>
                  </div>
                  <div className="bg-earth-800/40 rounded-xl p-4 text-xs space-y-2">
                    <p className="text-forest-400 font-semibold">What&apos;s included:</p>
                    {['50+ premium AI courses', 'Unlimited AfriAI Coach', 'All templates & blueprints', 'Verified certificates', 'Automation Lab projects', 'Mentor sessions'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-earth-300">
                        <CheckCircle size={11} className="text-forest-400 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CORPORATE GIFTING */}
          <section className="card flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={22} className="text-brand-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Corporate gifting</h3>
                <p className="text-earth-400 text-sm">Sponsor 10+ employees or family members. Bulk pricing, one invoice, massive impact.</p>
              </div>
            </div>
            <a href="mailto:gifts@afriflowai.com" className="btn-primary whitespace-nowrap flex-shrink-0">
              <DollarSign size={15} /> Get bulk pricing
            </a>
          </section>

          {/* STORIES */}
          <section>
            <div className="text-center mb-10">
              <span className="section-tag mb-4"><Heart size={14} className="text-red-400" /> Real stories</span>
              <h2 className="font-display text-3xl font-bold text-white">Gifts that changed trajectories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STORIES.map((s, i) => (
                <div key={i} className="card-glow">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(j => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <blockquote className="text-earth-300 text-sm leading-relaxed mb-4">&ldquo;{s.quote}&rdquo;</blockquote>
                  <div className="border-t border-earth-800 pt-3">
                    <p className="text-white text-sm font-medium">{s.gifterFlag} {s.gifter}</p>
                    <p className="text-earth-500 text-xs">Gifted {s.plan} to {s.recipient}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: '2,400+', l: 'Gifts sent' },
              { n: '37',     l: 'Countries gifted to' },
              { n: '91%',    l: 'Recipients complete first course' },
              { n: '3.4×',   l: 'Average income increase' },
            ].map(s => (
              <div key={s.l} className="card text-center">
                <p className="font-display text-3xl font-black text-brand-400 mb-1">{s.n}</p>
                <p className="text-earth-500 text-sm">{s.l}</p>
              </div>
            ))}
          </section>

          {/* HOW IT WORKS */}
          <section>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-white mb-3">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'You choose & pay', desc: 'Pick a plan, write a personal message, and complete payment in your local currency.' },
                { step: '02', title: 'They get the email', desc: 'We send a beautiful HTML email to your recipient with your note and a one-click claim link.' },
                { step: '03', title: 'Learning begins', desc: 'They create a free account (or log into their existing one) and Premium activates instantly.' },
              ].map(s => (
                <div key={s.step} className="text-center">
                  <div className="font-display text-5xl font-black text-earth-800 mb-3">{s.step}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-earth-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-6">Questions</h2>
            <div className="space-y-3 max-w-2xl">
              {FAQS.map((faq, i) => (
                <div key={i} className="card">
                  <button className="w-full flex items-center justify-between gap-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white font-medium text-sm">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-brand-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-earth-500 flex-shrink-0" />}
                  </button>
                  {openFaq === i && <p className="text-earth-400 text-sm leading-relaxed mt-3 pt-3 border-t border-earth-800">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
