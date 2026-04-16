'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  CheckCircle, X, Zap, ArrowRight, Users, Building2,
  Star, ChevronDown, ChevronUp, Shield, Globe, DollarSign
} from 'lucide-react'
import Link from 'next/link'

type BillingCycle = 'monthly' | 'annual'

const PLANS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    desc: 'Start your AI journey at zero cost',
    highlight: false,
    color: 'border-earth-700',
    badge: null,
    cta: 'Start Free',
    href: '/auth/register',
    features: [
      { text: '20+ free AI lessons', included: true },
      { text: 'AfriAI Coach (5 chats/day)', included: true },
      { text: 'Community forum access', included: true },
      { text: '1 weekly live webinar', included: true },
      { text: '3 free templates', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'All 50+ premium courses', included: false },
      { text: 'Unlimited AfriAI Coach', included: false },
      { text: 'Verified certificates', included: false },
      { text: 'Automation Lab (all projects)', included: false },
      { text: 'Premium templates (40+)', included: false },
      { text: 'Mentor sessions', included: false },
    ],
  },
  {
    name: 'Premium',
    monthlyPrice: 15,
    annualPrice: 9,
    desc: 'Everything you need to earn with AI',
    highlight: true,
    color: 'border-brand-500/60',
    badge: 'Most Popular',
    cta: 'Start Premium',
    href: '/auth/register?plan=premium',
    features: [
      { text: 'All 50+ premium courses', included: true },
      { text: 'AfriAI Coach (unlimited)', included: true },
      { text: 'Full community access + events', included: true },
      { text: 'All live webinars + replays', included: true },
      { text: 'All 40+ templates & blueprints', included: true },
      { text: 'Certificates for all completions', included: true },
      { text: 'Full Automation Lab (12 projects)', included: true },
      { text: 'Learning paths (4 career tracks)', included: true },
      { text: '2 mentor sessions/month', included: true },
      { text: 'Offline content access', included: true },
      { text: 'Priority support', included: false },
      { text: 'Team features', included: false },
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: 19,
    desc: 'For serious practitioners and consultants',
    highlight: false,
    color: 'border-purple-500/30',
    badge: 'For Consultants',
    cta: 'Start Pro',
    href: '/auth/register?plan=pro',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Unlimited mentor sessions', included: true },
      { text: 'Priority 24hr support', included: true },
      { text: 'Early access to new content', included: true },
      { text: 'AfriFlow AI Pro badge', included: true },
      { text: 'Featured community profile', included: true },
      { text: 'Revenue share on referred signups', included: true },
      { text: 'Advanced Python + API labs', included: true },
      { text: 'AI Agent building labs', included: true },
      { text: '1-on-1 career coaching call (monthly)', included: true },
      { text: 'Team features', included: false },
      { text: 'Branded org portal', included: false },
    ],
  },
]

const FEATURE_TABLE = [
  { feature: 'Free courses', free: '20+', premium: 'All 50+', pro: 'All 50+' },
  { feature: 'AfriAI Coach', free: '5/day', premium: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Certificates', free: '—', premium: '✓ All', pro: '✓ All + Pro badge' },
  { feature: 'Automation Lab', free: '2 projects', premium: '12 projects', pro: 'All + advanced' },
  { feature: 'Templates', free: '3 free', premium: '40+ all', pro: '40+ all' },
  { feature: 'Mentor sessions', free: '—', premium: '2/month', pro: 'Unlimited' },
  { feature: 'Support', free: 'Community', premium: 'Email + WhatsApp', pro: 'Priority 24hr' },
  { feature: 'Offline access', free: '—', premium: '✓', pro: '✓' },
  { feature: 'Career coaching', free: '—', premium: '—', pro: '1x/month' },
]

const FAQS = [
  { q: 'Can I pay in local currency?', a: 'Yes. We accept Mobile Money (MTN, Airtel, M-PESA), Flutterwave, Paystack, and Stripe. You can pay in USD, NGN, GHS, KES, ZAR, and more. Prices are automatically converted at current rates.' },
  { q: 'Is there a free trial for Premium?', a: 'All accounts start free with 20+ lessons. If you upgrade to Premium, you get a 7-day full refund — no questions asked. We\'d rather you try it risk-free.' },
  { q: 'What if I\'m a student with limited income?', a: 'We have a scholarship program for verified students and unemployed youth in Africa. Apply at scholarships@afriflowai.com — we review weekly.' },
  { q: 'Can I cancel at any time?', a: 'Yes. Monthly plans cancel with one click in your account settings. Annual plans can be cancelled for a pro-rated refund in the first 30 days.' },
  { q: 'Does Premium include the Automation Lab?', a: 'Yes. Premium includes all 12 Automation Lab projects. Pro adds the advanced Python and AI Agent labs on top.' },
  { q: 'What\'s included in mentor sessions?', a: 'Each session is 45 minutes with a verified AfriFlow mentor. You can use them for career advice, technical help, project review, or client acquisition coaching. Book through the Community tab.' },
  { q: 'Do certificates expire?', a: 'No. Your AfriFlow certificates are permanent and shareable via a public link that employers can verify. We\'ll never delete your records.' },
  { q: 'Do you offer team or business plans?', a: 'Yes — our Business plan starts at $299/month for up to 10 seats. Check our For Business page or email enterprise@afriflowai.com for a custom quote.' },
]

const SOCIAL_PROOF = [
  { name: 'Chidi N.', country: '🇳🇬', avatar: 'CN', quote: 'Premium paid for itself in 3 weeks. The automation labs alone saved me 40 client hours.', plan: 'Premium' },
  { name: 'Wanjiru K.', country: '🇰🇪', avatar: 'WK', quote: 'The mentors are the real deal. My Pro subscription connected me with someone who changed my career trajectory.', plan: 'Pro' },
  { name: 'Kofi A.', country: '🇬🇭', avatar: 'KA', quote: 'Started free, upgraded after my first live webinar. Best $9/month I spend.', plan: 'Premium (Annual)' },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>('annual')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-20 bg-earth-900 border-b border-earth-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] glow-orb bg-brand-500/8" />
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <span className="section-tag mb-6"><DollarSign size={14} /> Pricing</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Start free. Upgrade when <span className="gradient-text">you&apos;re ready.</span>
            </h1>
            <p className="text-earth-400 text-xl mb-8">
              Affordable plans for African learners. No hidden fees. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center bg-earth-900 border border-earth-800 rounded-2xl p-1 gap-1 mb-4">
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${billing === b ? 'bg-brand-500 text-white' : 'text-earth-400 hover:text-white'}`}>
                  {b === 'monthly' ? 'Monthly' : 'Annual'}
                </button>
              ))}
            </div>
            {billing === 'annual' && (
              <p className="text-forest-400 text-sm flex items-center gap-1.5 justify-center">
                <CheckCircle size={14} /> Save up to 40% with annual billing
              </p>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* PLAN CARDS */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {PLANS.map((plan) => {
                const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice
                return (
                  <div key={plan.name} className={`card flex flex-col relative border-2 ${plan.color} ${plan.highlight ? 'scale-105 shadow-2xl shadow-brand-500/10' : ''}`}>
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${plan.highlight ? 'bg-brand-500 text-white' : 'bg-purple-500/80 text-white'}`}>
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                      <p className="text-earth-500 text-sm mb-5">{plan.desc}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-5xl font-black text-white">
                          {price === 0 ? 'Free' : `$${price}`}
                        </span>
                        {price > 0 && (
                          <div>
                            <span className="text-earth-500 text-sm">/month</span>
                            {billing === 'annual' && price > 0 && (
                              <p className="text-earth-600 text-xs">billed annually</p>
                            )}
                          </div>
                        )}
                      </div>
                      {billing === 'monthly' && plan.annualPrice > 0 && (
                        <p className="text-earth-600 text-xs mt-1">
                          ${plan.annualPrice}/mo with annual plan
                        </p>
                      )}
                    </div>
                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map(f => (
                        <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.included ? 'text-earth-300' : 'text-earth-700'}`}>
                          {f.included
                            ? <CheckCircle size={15} className="text-forest-400 mt-0.5 flex-shrink-0" />
                            : <X size={15} className="text-earth-700 mt-0.5 flex-shrink-0" />
                          }
                          {f.text}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={billing === 'annual' ? `${plan.href}&billing=annual` : plan.href}
                      className={plan.highlight ? 'btn-primary justify-center py-4 text-base' : 'btn-secondary justify-center py-4 text-base'}
                    >
                      {plan.cta} {price > 0 && <ArrowRight size={16} />}
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Enterprise row */}
            <div className="mt-8 card flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-earth-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-earth-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Enterprise / Team</h3>
                  <p className="text-earth-400 text-sm">Custom plans for organizations with 10+ people. Branded portal, analytics, and dedicated support.</p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/business" className="btn-secondary whitespace-nowrap">
                  Learn more
                </Link>
                <a href="mailto:enterprise@afriflowai.com" className="btn-primary whitespace-nowrap">
                  <Users size={15} /> Contact sales
                </a>
              </div>
            </div>
          </section>

          {/* FEATURE TABLE */}
          <section>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-white mb-3">Full feature comparison</h2>
              <p className="text-earth-400">See exactly what you get on each plan</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-earth-800">
                    <th className="text-left py-4 pr-6 text-earth-500 text-sm font-medium w-1/3">Feature</th>
                    <th className="text-center py-4 px-6 text-earth-300 text-sm font-semibold">Free</th>
                    <th className="text-center py-4 px-6 text-brand-300 text-sm font-semibold">Premium</th>
                    <th className="text-center py-4 px-6 text-purple-300 text-sm font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_TABLE.map((row, i) => (
                    <tr key={i} className={`border-b border-earth-800/50 ${i % 2 === 0 ? '' : 'bg-earth-900/30'}`}>
                      <td className="py-4 pr-6 text-earth-300 text-sm">{row.feature}</td>
                      <td className="py-4 px-6 text-center text-earth-400 text-sm">{row.free}</td>
                      <td className="py-4 px-6 text-center text-earth-200 text-sm">{row.premium}</td>
                      <td className="py-4 px-6 text-center text-earth-200 text-sm">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section>
            <div className="text-center mb-10">
              <span className="section-tag mb-4"><Star size={14} /> What members say</span>
              <h2 className="font-display text-3xl font-bold text-white mb-3">The most affordable AI education on the continent</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SOCIAL_PROOF.map((t, i) => (
                <div key={i} className="card-glow">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(j => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <blockquote className="text-earth-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="flex items-center justify-between pt-3 border-t border-earth-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-xs">{t.avatar}</div>
                      <div>
                        <p className="text-white text-sm font-medium">{t.name} {t.country}</p>
                      </div>
                    </div>
                    <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">{t.plan}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TRUST BADGES */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: '7-day refund', desc: 'Full money back, no questions asked' },
                { icon: Globe, title: 'Pay locally', desc: 'Mobile Money, Paystack, Flutterwave' },
                { icon: Zap, title: 'Instant access', desc: 'Start learning in under 2 minutes' },
                { icon: Users, title: '24,000+ members', desc: 'Largest AI community in Africa' },
              ].map((b) => {
                const Icon = b.icon
                return (
                  <div key={b.title} className="card text-center">
                    <Icon size={24} className="text-brand-400 mx-auto mb-3" />
                    <p className="text-white font-semibold text-sm mb-1">{b.title}</p>
                    <p className="text-earth-500 text-xs">{b.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-white mb-3">Frequently asked questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button className="w-full flex items-center justify-between gap-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white font-medium">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp size={18} className="text-brand-400 flex-shrink-0" />
                      : <ChevronDown size={18} className="text-earth-500 flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && <p className="text-earth-400 text-sm leading-relaxed mt-4 pt-4 border-t border-earth-800">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-earth-900 border border-earth-800 p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] glow-orb bg-brand-500/8" />
            <div className="relative">
              <span className="section-tag mb-6"><Zap size={14} /> Get Started Today</span>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Start free. No credit card.<br /><span className="gradient-text">Just skills.</span>
              </h2>
              <p className="text-earth-400 text-lg mb-8 max-w-xl mx-auto">
                20 free lessons, AfriAI Coach, community access, and live webinars — all free. Upgrade when you see the value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn-primary py-4 px-10 text-base">
                  <Zap size={18} /> Create free account
                </Link>
                <Link href="/auth/register?plan=premium" className="btn-secondary py-4 px-10 text-base">
                  Start Premium trial <ArrowRight size={16} />
                </Link>
              </div>
              <p className="text-earth-600 text-sm mt-4">7-day refund guarantee · Cancel anytime · No hidden fees</p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
