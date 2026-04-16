'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  Target, ArrowRight, Clock, CheckCircle, ChevronRight,
  Briefcase, Zap, TrendingUp, Users, BookOpen,
  DollarSign, Star, Rocket, Award, BarChart3, Shield
} from 'lucide-react'
import Link from 'next/link'

const PATHS = [
  {
    id: 'ai-worker',
    icon: '🚀',
    title: 'AI-Ready Worker',
    subtitle: 'Land your first AI-enhanced job or promotion',
    duration: '30 days',
    effort: '1–2 hrs/day',
    audience: 'Graduates, job seekers, employed professionals',
    salary: '$400–1,200/month',
    salaryLabel: 'Typical starting salary',
    difficulty: 'Beginner',
    diffColor: 'text-forest-400 bg-forest-500/10',
    accent: 'brand',
    phases: [
      { week: 'Week 1', title: 'AI Foundations', courses: ['AI for Complete Beginners in Africa', 'Understanding AI Tools & Capabilities'], outcome: 'Know what AI can and cannot do' },
      { week: 'Week 2', title: 'Productivity Mastery', courses: ['ChatGPT & Claude for Work', 'AI Writing, Research & Analysis'], outcome: 'Use AI tools daily at work' },
      { week: 'Week 3', title: 'Professional AI', courses: ['AI for Professional Communication', 'AI-Enhanced Data Analysis'], outcome: 'Stand out in your role' },
      { week: 'Week 4', title: 'Career Positioning', courses: ['AI-Enhanced CV & LinkedIn', 'Portfolio Project: 5 AI Work Samples'], outcome: 'Ready to apply with confidence' },
    ],
    outcomes: ['Get shortlisted over non-AI candidates', 'Impress employers with real AI skills', 'Get promoted or land a new job', 'Earn $400–1,200/month in AI-enhanced roles'],
    testimonial: { name: 'Blessing O.', country: '🇳🇬', quote: 'Got a data analyst role in 3 weeks after finishing the path. The AI-enhanced CV template alone made my applications unrecognizable.' },
  },
  {
    id: 'ai-freelancer',
    icon: '💼',
    title: 'AI Freelancer',
    subtitle: 'Build real income selling AI services',
    duration: '60 days',
    effort: '2–3 hrs/day',
    audience: 'Youth, graduates, side-hustlers',
    salary: '$500–3,000/month',
    salaryLabel: 'Freelance income potential',
    difficulty: 'Beginner–Intermediate',
    diffColor: 'text-brand-400 bg-brand-500/10',
    accent: 'brand',
    phases: [
      { week: 'Weeks 1–2', title: 'AI Foundations', courses: ['AI for Complete Beginners', 'Top AI Tools for Business'], outcome: 'Understand what you\'ll sell' },
      { week: 'Weeks 3–4', title: 'Core Skills', courses: ['No-Code Automation (Zapier & Make)', 'WhatsApp Business Automation'], outcome: 'Build automations for clients' },
      { week: 'Weeks 5–6', title: 'Business Setup', courses: ['Packaging & Pricing AI Services', 'AI Freelance Proposals & Contracts'], outcome: 'Ready to sell' },
      { week: 'Weeks 7–8', title: 'Client Acquisition', courses: ['Finding Clients on LinkedIn & Upwork', 'First Client Project: Deliver & Get Paid'], outcome: 'First invoice sent' },
    ],
    outcomes: ['Land your first 3 paying clients', 'Earn $500–3,000/month freelancing', 'Build a repeatable sales system', 'Run a solo AI automation agency'],
    testimonial: { name: 'Kofi M.', country: '🇬🇭', quote: 'Hit $1,200 in month 2. The client acquisition module changed everything — I stopped waiting and started reaching out.' },
  },
  {
    id: 'sme-owner',
    icon: '🏪',
    title: 'SME AI Transformation',
    subtitle: 'Automate your business and grow faster',
    duration: '21 days',
    effort: '45 min/day',
    audience: 'Business owners, entrepreneurs',
    salary: 'Save $500–5,000/month',
    salaryLabel: 'Typical monthly savings',
    difficulty: 'Beginner',
    diffColor: 'text-forest-400 bg-forest-500/10',
    accent: 'forest',
    phases: [
      { week: 'Days 1–5', title: 'AI for Your Business', courses: ['AI for African SMEs — Grow Faster', 'Identifying your automation opportunities'], outcome: 'Know exactly what to automate first' },
      { week: 'Days 6–12', title: 'Customer Automation', courses: ['WhatsApp Business Automation Masterclass', 'AI Customer Service Bot Setup'], outcome: '24/7 automated customer support' },
      { week: 'Days 13–17', title: 'Marketing & Sales AI', courses: ['AI Social Media & Content Creation', 'Email & SMS Marketing Automation'], outcome: 'Automated lead nurturing' },
      { week: 'Days 18–21', title: 'Go Live', courses: ['Launch your automations', 'Dashboard setup & monitoring'], outcome: '3+ automations running live' },
    ],
    outcomes: ['3+ automations live by day 21', 'Cut 10+ hours/week of manual work', 'Handle 10x more customers without hiring', 'Free time to focus on growth'],
    testimonial: { name: 'Amara J.', country: '🇸🇱', quote: 'My tailoring business went from 20 WhatsApp replies a day to zero. The bot handles everything. I now take Saturdays off.' },
  },
  {
    id: 'ai-consultant',
    icon: '📈',
    title: 'AI Consultant',
    subtitle: 'Become the AI expert organizations hire',
    duration: '90 days',
    effort: '2–3 hrs/day',
    audience: 'Marketing pros, managers, tech leads',
    salary: '$2,000–8,000/month',
    salaryLabel: 'Consulting income range',
    difficulty: 'Intermediate',
    diffColor: 'text-purple-400 bg-purple-500/10',
    accent: 'purple',
    phases: [
      { week: 'Month 1', title: 'AI Mastery', courses: ['Python for AI Automation', 'LangChain & AI Agent Development', 'OpenAI & Anthropic API Mastery'], outcome: 'Technical credibility established' },
      { week: 'Month 2', title: 'Consulting Framework', courses: ['AI Workflow Audit Methodology', 'ROI Measurement & Reporting', 'Stakeholder Communication'], outcome: 'Can run a full AI audit' },
      { week: 'Month 3', title: 'Business Development', courses: ['AI Consulting Proposals & Pricing', 'Case Studies & Social Proof Building', 'First Enterprise Client'], outcome: 'Landed first retainer' },
    ],
    outcomes: ['Command $2,000–8,000/month rates', 'Work with enterprises and NGOs', 'Build a consulting practice', 'Become the AI expert in your industry'],
    testimonial: { name: 'Tunde F.', country: '🇳🇬', quote: 'Went from marketing manager to $4,500/month AI consultant in 4 months. The consulting framework is worth the entire course fee alone.' },
  },
]

const PATH_COMPARE = [
  { feature: 'Time to first income', worker: '30 days', freelancer: '60 days', sme: 'Savings in 21 days', consultant: '60–90 days' },
  { feature: 'Income potential', worker: '$400–1,200/mo', freelancer: '$500–3,000/mo', sme: 'Saves $500–5K/mo', consultant: '$2,000–8,000/mo' },
  { feature: 'Technical depth', worker: 'Low', freelancer: 'Medium', sme: 'Low', consultant: 'High' },
  { feature: 'Client work required', worker: 'No', freelancer: 'Yes', sme: 'No', consultant: 'Yes' },
  { feature: 'Best for', worker: 'Job seekers', freelancer: 'Side income', sme: 'Biz owners', consultant: 'Career changers' },
]

export default function PathsPage() {
  const [activePath, setActivePath] = useState(0)
  const [openPhase, setOpenPhase] = useState<number | null>(0)
  const path = PATHS[activePath]

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-20 bg-earth-900 border-b border-earth-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-20 right-1/4 w-[500px] h-[400px] glow-orb bg-brand-500/8" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-6"><Target size={14} /> Learning Paths</span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Pick your destination.<br />
              <span className="gradient-text">We map the route.</span>
            </h1>
            <p className="text-earth-400 text-xl mb-8 max-w-2xl mx-auto">
              Four structured AI career paths. Each one has a clear start, a daily plan, and a specific income or outcome at the end.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-earth-400">
              <span className="flex items-center gap-2"><Rocket size={14} className="text-brand-400" /> 30–90 day paths</span>
              <span className="flex items-center gap-2"><DollarSign size={14} className="text-forest-400" /> Real income outcomes</span>
              <span className="flex items-center gap-2"><Users size={14} className="text-purple-400" /> 8,400+ path graduates</span>
              <span className="flex items-center gap-2"><Star size={14} className="text-amber-400" /> 4.8 avg satisfaction</span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* PATH SELECTOR */}
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {PATHS.map((p, i) => (
                <button key={p.id} onClick={() => { setActivePath(i); setOpenPhase(0) }}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${activePath === i ? 'border-brand-500/60 bg-brand-500/5' : 'border-earth-800 hover:border-earth-700 bg-earth-900'}`}>
                  <span className="text-3xl block mb-3">{p.icon}</span>
                  <h3 className={`font-semibold mb-1 ${activePath === i ? 'text-white' : 'text-earth-300'}`}>{p.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-earth-500">
                    <Clock size={11} /> {p.duration}
                  </div>
                </button>
              ))}
            </div>

            {/* ACTIVE PATH DETAIL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{path.icon}</span>
                    <div>
                      <h2 className="font-display text-3xl font-bold text-white">{path.title}</h2>
                      <p className="text-earth-400">{path.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full border ${path.diffColor}`}>{path.difficulty}</span>
                    <span className="text-xs text-earth-400 bg-earth-800 px-3 py-1 rounded-full border border-earth-700 flex items-center gap-1"><Clock size={11} /> {path.duration}</span>
                    <span className="text-xs text-earth-400 bg-earth-800 px-3 py-1 rounded-full border border-earth-700">{path.effort}</span>
                    <span className="text-xs text-earth-400 bg-earth-800 px-3 py-1 rounded-full border border-earth-700 flex items-center gap-1"><Users size={11} /> {path.audience}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><BookOpen size={16} className="text-brand-400" /> Your weekly roadmap</h3>
                  <div className="space-y-3">
                    {path.phases.map((phase, i) => (
                      <div key={i} className="card overflow-hidden">
                        <button className="w-full flex items-center justify-between gap-4 text-left"
                          onClick={() => setOpenPhase(openPhase === i ? null : i)}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center text-brand-400 font-bold text-xs flex-shrink-0">
                              {i + 1}
                            </div>
                            <div>
                              <span className="text-earth-500 text-xs">{phase.week}</span>
                              <p className="text-white font-medium">{phase.title}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className={`text-earth-600 transition-transform flex-shrink-0 ${openPhase === i ? 'rotate-90' : ''}`} />
                        </button>
                        {openPhase === i && (
                          <div className="mt-4 pt-4 border-t border-earth-800 space-y-3">
                            <div>
                              <p className="text-earth-600 text-xs uppercase tracking-wide mb-2">Courses in this phase</p>
                              {phase.courses.map(course => (
                                <div key={course} className="flex items-center gap-2 text-sm text-earth-300 py-1.5">
                                  <CheckCircle size={13} className="text-forest-400 flex-shrink-0" />
                                  {course}
                                </div>
                              ))}
                            </div>
                            <div className="bg-forest-500/5 border border-forest-500/20 rounded-xl p-3">
                              <p className="text-forest-400 text-xs font-medium uppercase tracking-wide mb-1">Phase outcome</p>
                              <p className="text-earth-300 text-sm">{phase.outcome}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Income card */}
                <div className="card bg-forest-500/5 border-forest-500/30">
                  <p className="text-forest-400 text-xs uppercase tracking-wide mb-1">{path.salaryLabel}</p>
                  <p className="font-display text-3xl font-black text-forest-300 mb-1">{path.salary}</p>
                  <p className="text-earth-500 text-xs">Based on AfriFlow graduate surveys</p>
                </div>

                {/* Outcomes */}
                <div className="card">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Award size={15} className="text-brand-400" /> What you&apos;ll achieve</h3>
                  <div className="space-y-2.5">
                    {path.outcomes.map(o => (
                      <div key={o} className="flex items-start gap-2.5 text-sm text-earth-300">
                        <CheckCircle size={14} className="text-forest-400 mt-0.5 flex-shrink-0" />
                        {o}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="card bg-earth-900/50">
                  <div className="flex items-center gap-2 mb-3">
                    {[1,2,3,4,5].map(j => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <blockquote className="text-earth-300 text-sm leading-relaxed mb-3">&ldquo;{path.testimonial.quote}&rdquo;</blockquote>
                  <p className="text-earth-500 text-xs">{path.testimonial.name} {path.testimonial.country}</p>
                </div>

                <Link href="/auth/register" className="btn-primary w-full justify-center py-4 text-base">
                  <Rocket size={18} /> Start this path
                </Link>
              </div>
            </div>
          </section>

          {/* COMPARISON TABLE */}
          <section>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><BarChart3 size={14} /> Compare Paths</span>
              <h2 className="font-display text-3xl font-bold text-white mb-4">Not sure which path to pick?</h2>
              <p className="text-earth-400">Here&apos;s a side-by-side breakdown to help you decide.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-earth-800">
                    <th className="text-left py-3 pr-6 text-earth-500 text-sm font-medium">Feature</th>
                    {PATHS.map(p => (
                      <th key={p.id} className="text-center py-3 px-4 text-white text-sm font-semibold">
                        {p.icon} {p.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PATH_COMPARE.map((row, i) => (
                    <tr key={i} className="border-b border-earth-800/50">
                      <td className="py-3.5 pr-6 text-earth-400 text-sm">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center text-earth-300 text-sm">{row.worker}</td>
                      <td className="py-3.5 px-4 text-center text-earth-300 text-sm">{row.freelancer}</td>
                      <td className="py-3.5 px-4 text-center text-earth-300 text-sm">{row.sme}</td>
                      <td className="py-3.5 px-4 text-center text-earth-300 text-sm">{row.consultant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '8,400+', label: 'Path graduates', icon: Users },
              { value: '78%', label: 'Achieve income goal within 90 days', icon: TrendingUp },
              { value: '4.8/5', label: 'Average path satisfaction', icon: Star },
              { value: '24 hrs', label: 'Avg support response time', icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card text-center">
                  <Icon size={24} className="text-brand-400 mx-auto mb-3" />
                  <p className="font-display text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-earth-500 text-xs">{stat.label}</p>
                </div>
              )
            })}
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-earth-900 border border-earth-800 p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] glow-orb bg-brand-500/8" />
            <div className="relative">
              <span className="section-tag mb-6"><Target size={14} /> Pick Your Path</span>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                The best time to start was 6 months ago.<br />
                <span className="gradient-text">The second best time is today.</span>
              </h2>
              <p className="text-earth-400 text-lg mb-8 max-w-xl mx-auto">
                Create your free account and pick your path. Your first week of content is completely free.
              </p>
              <Link href="/auth/register" className="btn-primary py-4 px-10 text-base">
                <Rocket size={18} /> Start free today
              </Link>
              <p className="text-earth-600 text-sm mt-4">No credit card required · Cancel anytime</p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
