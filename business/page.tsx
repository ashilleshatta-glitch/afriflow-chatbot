'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  Building2, Users, BarChart3, CheckCircle, ArrowRight, Mail,
  TrendingUp, Zap, Globe, Clock, DollarSign, MessageSquare,
  ChevronDown, ChevronUp, PlayCircle, Star, Briefcase,
  Brain, Layers, Cpu, BarChart2, Rocket, PieChart
} from 'lucide-react'
import Link from 'next/link'

const INDUSTRIES = [
  { icon: '🎓', title: 'Education & Universities', pain: 'Manual admin eating up staff time', solution: 'AI-powered student support bots, auto-grading, and enrollment automation', result: '40% reduction in admin overhead', tools: ['ChatGPT API', 'Zapier', 'Google Workspace'] },
  { icon: '🏦', title: 'Banks & Fintechs', pain: 'High volume customer queries, slow KYC', solution: 'Intelligent WhatsApp assistants, document processing automation, fraud flag pipelines', result: '3x faster customer resolution', tools: ['WhatsApp Business API', 'Python', 'OpenAI'] },
  { icon: '🏥', title: 'Healthcare Clinics', pain: 'Appointment no-shows, manual records', solution: 'Automated appointment reminders, AI-assisted triage, patient follow-up sequences', result: '60% fewer no-shows', tools: ['WhatsApp', 'Make', 'Airtable'] },
  { icon: '🌍', title: 'NGOs & Government', pain: 'Beneficiary tracking, donor reporting', solution: 'AI dashboards, automated impact reports, community chatbots in local languages', result: '50% faster reporting cycles', tools: ['Google Data Studio', 'Claude', 'n8n'] },
  { icon: '🏪', title: 'Retail & E-commerce', pain: 'Manual order processing, customer service overload', solution: 'AI order bots, inventory forecasting, personalised marketing automation', result: '2x sales conversion rate', tools: ['Shopify', 'Zapier', 'ChatGPT'] },
  { icon: '💻', title: 'Tech Companies', pain: 'Slow content production, repetitive dev tasks', solution: 'AI copilots for code review, automated documentation, AI-first hiring pipelines', result: '30% faster product velocity', tools: ['GitHub Copilot', 'LangChain', 'Notion AI'] },
]

const SOLUTIONS = [
  { icon: Brain, title: 'AI Workflow Audit', desc: 'We map every bottleneck in your operations and show exactly where AI will save you time and money.', tag: 'Step 1', tagColor: 'text-brand-400 bg-brand-500/10' },
  { icon: Layers, title: 'Custom AI Training', desc: 'Your team learns the exact tools for your industry — not generic content. Built for your workflows.', tag: 'Step 2', tagColor: 'text-forest-400 bg-forest-500/10' },
  { icon: Cpu, title: 'AI System Deployment', desc: 'We build and deploy the automations your team learned — WhatsApp bots, reporting dashboards, pipelines.', tag: 'Step 3', tagColor: 'text-purple-400 bg-purple-500/10' },
  { icon: BarChart3, title: 'ROI Tracking', desc: 'Live dashboard shows hours saved, tasks automated, and financial impact per department.', tag: 'Step 4', tagColor: 'text-amber-400 bg-amber-500/10' },
]

const ROI_CASES = [
  { org: 'Lagos Tech SME', employees: 12, problem: 'Spent 3 hours/day on WhatsApp customer replies', solution: 'WhatsApp AI bot + CRM integration', savedHours: 90, savedMoney: '$1,800/month', timeToROI: '2 weeks' },
  { org: 'Nairobi University', employees: 200, problem: 'Manual admission tracking and student FAQ volume', solution: 'AI admissions portal + student support bot', savedHours: 480, savedMoney: '$6,200/month', timeToROI: '3 weeks' },
  { org: 'Accra Microfinance', employees: 45, problem: 'Manual loan document collection and status updates', solution: 'AI document pipeline + automated WhatsApp status updates', savedHours: 200, savedMoney: '$3,100/month', timeToROI: '4 weeks' },
]

const PLANS = [
  {
    name: 'Starter', price: '$299', period: '/month', seats: 'Up to 10 seats',
    highlight: false, color: 'border-earth-700', badge: null,
    features: ['Custom onboarding workshop (2hr)', '10 seats on full course library', 'Sector-specific curriculum track', 'Monthly progress report', 'Email + WhatsApp support', 'Team certificate batch'],
    cta: 'Contact Sales', href: 'mailto:enterprise@afriflowai.com?subject=Starter Plan',
  },
  {
    name: 'Growth', price: '$799', period: '/month', seats: '11–50 seats',
    highlight: true, color: 'border-brand-500/60', badge: 'Most Popular',
    features: ['Everything in Starter', 'Dedicated account manager', 'Live training sessions (4/month)', 'Custom AI workflow audit', 'WhatsApp bot deployment included', 'Branded learning portal', 'Real-time analytics dashboard', 'Slack / WhatsApp group support'],
    cta: 'Contact Sales', href: 'mailto:enterprise@afriflowai.com?subject=Growth Plan',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', seats: '50+ seats',
    highlight: false, color: 'border-earth-700', badge: null,
    features: ['Everything in Growth', 'On-site or live training', 'Full AI system deployment', 'Custom LMS integration', 'SLA & uptime guarantee', 'Dedicated AfriFlow AI engineer', 'Custom reporting & data exports', 'Unlimited seats'],
    cta: 'Schedule a call', href: 'mailto:enterprise@afriflowai.com?subject=Enterprise Plan',
  },
]

const FAQS = [
  { q: 'How long does team onboarding take?', a: 'Most teams are fully onboarded within 5 business days. We run a 2-hour kickoff workshop, configure your branded portal, and activate all seats immediately.' },
  { q: 'Can you customise the curriculum for our industry?', a: "Every Growth and Enterprise plan includes a sector-specific curriculum review. We map our course library to your team's actual job roles and pain points." },
  { q: 'What if our staff have very different skill levels?', a: 'Our adaptive learning paths handle this. Each learner starts with a skills diagnostic and gets a personalised roadmap — beginners and advanced users learn at the right pace.' },
  { q: 'Do you support local languages?', a: 'We have content modules in English, French, Swahili, Pidgin English, and Twi. More languages are added quarterly.' },
  { q: 'Is there a minimum contract length?', a: 'Starter plans are month-to-month. Growth and Enterprise plans are annual with monthly invoicing — you save 20% vs monthly billing.' },
  { q: 'Can you deploy the automations too, or just train our team?', a: 'Both. Growth plans include one WhatsApp bot deployment. Enterprise plans include full AI system architecture, deployment, and handoff documentation.' },
]

const TESTIMONIALS = [
  { name: 'Kwame Asante', title: 'Head of Operations, GreenTech Accra', avatar: 'KA', rating: 5, quote: 'Within 3 weeks our team went from zero AI knowledge to running 4 live automations. The ROI was visible on the first invoice.' },
  { name: 'Fatima Al-Rashid', title: 'COO, Nairobi Fintech Ltd', avatar: 'FA', rating: 5, quote: "The sector-specific training was exactly what we needed. AfriFlow's team understood banking compliance constraints and built around them." },
  { name: 'Chibuike Okafor', title: 'IT Director, Lagos University', avatar: 'CO', rating: 5, quote: 'We trained 200 staff in 6 weeks. The WhatsApp bot they deployed now handles 400+ student queries a day with zero human input.' },
]

const METRICS = [
  { value: '340+', label: 'Organizations trained', icon: Building2 },
  { value: '18,000+', label: 'Enterprise learners', icon: Users },
  { value: '$2.4M', label: 'Saved by our clients', icon: DollarSign },
  { value: '94%', label: 'Satisfaction rate', icon: Star },
]

export default function BusinessPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeIndustry, setActiveIndustry] = useState(0)
  const [roiEmployees, setRoiEmployees] = useState(25)
  const [roiHourlyRate, setRoiHourlyRate] = useState(15)

  const estimatedHoursSaved = Math.round(roiEmployees * 4.5)
  const estimatedMonthlySaving = estimatedHoursSaved * roiHourlyRate
  const planCost = roiEmployees <= 10 ? 299 : roiEmployees <= 50 ? 799 : 1500
  const monthlyROI = estimatedMonthlySaving - planCost

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-24 overflow-hidden bg-earth-900 border-b border-earth-800">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-40 left-1/3 w-[600px] h-[400px] glow-orb bg-brand-500/8" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="section-tag mb-6"><Building2 size={14} /> AI for Business</span>
                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Your entire organization,{' '}
                  <span className="gradient-text">AI-powered</span>{' '}in 30 days
                </h1>
                <p className="text-earth-300 text-xl mb-8 leading-relaxed">
                  We train your team, audit your workflows, and deploy the automations — so you see real ROI, not just certificates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="mailto:enterprise@afriflowai.com" className="btn-primary py-4 px-8 text-base">
                    <Mail size={18} /> Talk to Enterprise Sales
                  </a>
                  <Link href="#roi-calculator" className="btn-secondary py-4 px-8 text-base">
                    <PieChart size={18} /> Calculate your ROI
                  </Link>
                </div>
                <div className="flex flex-wrap gap-5 text-sm text-earth-400">
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-forest-400" /> No long-term lock-in</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-forest-400" /> Setup in 5 days</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-forest-400" /> African-focused</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {METRICS.map((m) => {
                  const Icon = m.icon
                  return (
                    <div key={m.label} className="card text-center group hover:border-brand-500/40 transition-all">
                      <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Icon size={20} className="text-brand-400" />
                      </div>
                      <p className="font-display text-3xl font-bold text-white mb-1">{m.value}</p>
                      <p className="text-earth-500 text-xs leading-snug">{m.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY */}
        <section className="border-b border-earth-800 py-6 bg-earth-900/50">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-earth-500 text-sm mb-4">Trusted by organizations across Africa</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {['🏦 Access Bank', '🎓 KU Nairobi', '🌍 USAID Ghana', '🏥 Aga Khan Health', '💻 Flutterwave', '🏪 Konga'].map(name => (
                <span key={name} className="text-earth-400 text-sm font-medium">{name}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 py-20">

          {/* HOW IT WORKS */}
          <section>
            <div className="text-center mb-16">
              <span className="section-tag mb-4"><Rocket size={14} /> Our Process</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">From sign-up to measurable ROI in 30 days</h2>
              <p className="text-earth-400 max-w-2xl mx-auto">
                We don&apos;t just give you login credentials and leave. Our end-to-end process guarantees your team actually uses AI.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SOLUTIONS.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="card group hover:border-brand-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-3 right-3 font-display text-6xl font-black text-white opacity-5">{i + 1}</div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${step.tagColor} inline-block mb-4`}>{step.tag}</span>
                    <div className="w-11 h-11 bg-earth-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/10 transition-colors">
                      <Icon size={22} className="text-brand-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-earth-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* INDUSTRY SOLUTIONS */}
          <section>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><Globe size={14} /> By Industry</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">AI solutions built for your sector</h2>
              <p className="text-earth-400 max-w-xl mx-auto">Every industry has different problems. We have specific playbooks for each.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                {INDUSTRIES.map((industry, i) => (
                  <button key={i} onClick={() => setActiveIndustry(i)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${activeIndustry === i ? 'border-brand-500/50 bg-brand-500/5' : 'border-earth-800 hover:border-earth-700 bg-earth-900'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{industry.icon}</span>
                      <span className={`font-medium ${activeIndustry === i ? 'text-white' : 'text-earth-300'}`}>{industry.title}</span>
                      {activeIndustry === i && <ArrowRight size={16} className="ml-auto text-brand-400" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="card-glow lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{INDUSTRIES[activeIndustry].icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-xl">{INDUSTRIES[activeIndustry].title}</h3>
                    <span className="text-xs text-forest-400 bg-forest-500/10 px-2 py-0.5 rounded-full">
                      ✓ {INDUSTRIES[activeIndustry].result}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-red-400 font-medium mb-1 uppercase tracking-wide">The Pain Point</p>
                    <p className="text-earth-300 text-sm">{INDUSTRIES[activeIndustry].pain}</p>
                  </div>
                  <div className="bg-forest-500/5 border border-forest-500/20 rounded-xl p-4">
                    <p className="text-xs text-forest-400 font-medium mb-1 uppercase tracking-wide">Our AI Solution</p>
                    <p className="text-earth-300 text-sm">{INDUSTRIES[activeIndustry].solution}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs text-earth-500 mb-2 uppercase tracking-wide">Tools Deployed</p>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES[activeIndustry].tools.map(tool => (
                      <span key={tool} className="bg-earth-800 text-earth-300 text-xs px-3 py-1 rounded-lg border border-earth-700">{tool}</span>
                    ))}
                  </div>
                </div>
                <a href={`mailto:enterprise@afriflowai.com?subject=AI for ${INDUSTRIES[activeIndustry].title}`}
                  className="btn-primary w-full justify-center py-3">
                  <Mail size={16} /> Get a proposal
                </a>
              </div>
            </div>
          </section>

          {/* ROI CALCULATOR */}
          <section id="roi-calculator">
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><TrendingUp size={14} /> ROI Calculator</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">See your potential savings</h2>
              <p className="text-earth-400 max-w-xl mx-auto">Calculate how much your organization saves by automating repetitive tasks with AI.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="card space-y-8">
                <div>
                  <label className="block text-earth-300 text-sm font-medium mb-3">
                    Employees being trained <span className="ml-2 text-brand-400 font-bold text-lg">{roiEmployees}</span>
                  </label>
                  <input type="range" min={5} max={500} step={5} value={roiEmployees}
                    onChange={e => setRoiEmployees(Number(e.target.value))} className="w-full accent-brand-500" />
                  <div className="flex justify-between text-earth-600 text-xs mt-1"><span>5</span><span>500</span></div>
                </div>
                <div>
                  <label className="block text-earth-300 text-sm font-medium mb-3">
                    Avg hourly rate (USD) <span className="ml-2 text-brand-400 font-bold text-lg">${roiHourlyRate}</span>
                  </label>
                  <input type="range" min={5} max={100} step={5} value={roiHourlyRate}
                    onChange={e => setRoiHourlyRate(Number(e.target.value))} className="w-full accent-brand-500" />
                  <div className="flex justify-between text-earth-600 text-xs mt-1"><span>$5</span><span>$100</span></div>
                </div>
                <div className="bg-earth-800/50 rounded-xl p-4 border border-earth-700 text-sm text-earth-400">
                  📊 Based on client data — AI saves each employee an avg of{' '}
                  <strong className="text-white">4.5 hrs/week</strong> within the first 30 days.
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Hours saved per month', value: `${estimatedHoursSaved.toLocaleString()} hrs`, color: 'text-brand-400', Icon: Clock },
                  { label: 'Value of time recovered', value: `$${estimatedMonthlySaving.toLocaleString()}`, color: 'text-forest-400', Icon: DollarSign },
                  { label: 'Monthly plan cost', value: `$${planCost.toLocaleString()}`, color: 'text-earth-400', Icon: BarChart2 },
                ].map(row => (
                  <div key={row.label} className="card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <row.Icon size={18} className={row.color} />
                      <span className="text-earth-400 text-sm">{row.label}</span>
                    </div>
                    <span className={`font-display text-xl font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
                <div className={`card border-2 ${monthlyROI >= 0 ? 'border-forest-500/40 bg-forest-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-earth-400 text-sm mb-1">Net monthly ROI</p>
                      <p className={`font-display text-4xl font-black ${monthlyROI >= 0 ? 'text-forest-400' : 'text-red-400'}`}>
                        {monthlyROI >= 0 ? '+' : ''}{monthlyROI.toLocaleString()}<span className="text-xl"> USD</span>
                      </p>
                    </div>
                    <TrendingUp size={40} className={monthlyROI >= 0 ? 'text-forest-500/40' : 'text-red-500/40'} />
                  </div>
                  {monthlyROI >= 0 && (
                    <p className="text-forest-400 text-sm mt-3">
                      ✓ Full cost recovery in <strong>{Math.ceil((planCost / estimatedMonthlySaving) * 30)} days</strong>
                    </p>
                  )}
                </div>
                <a href="mailto:enterprise@afriflowai.com?subject=ROI Analysis" className="btn-primary w-full justify-center py-4 text-base">
                  <Mail size={18} /> Get a detailed ROI analysis
                </a>
              </div>
            </div>
          </section>

          {/* CASE STUDIES */}
          <section>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><BarChart2 size={14} /> Case Studies</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Real organizations. Real numbers.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROI_CASES.map((c, i) => (
                <div key={i} className="card-glow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{c.org}</h3>
                      <p className="text-earth-500 text-xs">{c.employees} employees</p>
                    </div>
                    <span className="text-xs bg-forest-500/10 text-forest-400 px-2.5 py-1 rounded-full border border-forest-500/20">ROI in {c.timeToROI}</span>
                  </div>
                  <div className="space-y-3 flex-1 text-sm">
                    <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3">
                      <p className="text-red-400 text-xs uppercase tracking-wide font-medium mb-1">Problem</p>
                      <p className="text-earth-300">{c.problem}</p>
                    </div>
                    <div className="bg-brand-500/5 border border-brand-500/15 rounded-lg p-3">
                      <p className="text-brand-400 text-xs uppercase tracking-wide font-medium mb-1">Solution</p>
                      <p className="text-earth-300">{c.solution}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-earth-800">
                    <div className="text-center">
                      <p className="font-display text-2xl font-bold text-forest-400">{c.savedHours}hrs</p>
                      <p className="text-earth-500 text-xs">saved/month</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-2xl font-bold text-brand-400">{c.savedMoney}</p>
                      <p className="text-earth-500 text-xs">value recovered</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PLANS */}
          <section id="plans">
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><Briefcase size={14} /> Enterprise Plans</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Plans that scale with your organization</h2>
              <p className="text-earth-400">All plans include dedicated support, sector-specific content, and certificates.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`card flex flex-col relative border-2 ${plan.color} ${plan.highlight ? 'scale-105 shadow-xl shadow-brand-500/10' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">{plan.badge}</span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                    <p className="text-earth-500 text-sm mb-4">{plan.seats}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-earth-500 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-earth-300">
                        <CheckCircle size={15} className="text-forest-400 mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.href} className={plan.highlight ? 'btn-primary justify-center py-3.5' : 'btn-secondary justify-center py-3.5'}>
                    {plan.cta} <ArrowRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><Star size={14} /> Client Stories</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">What our enterprise clients say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="card-glow flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-brand-400 fill-brand-400" />
                    ))}
                  </div>
                  <blockquote className="text-earth-300 text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="flex items-center gap-3 pt-4 border-t border-earth-800">
                    <div className="w-9 h-9 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-xs">{t.avatar}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="text-earth-500 text-xs">{t.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><MessageSquare size={14} /> FAQ</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Common questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button className="w-full flex items-center justify-between gap-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white font-medium">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={18} className="text-brand-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-earth-500 flex-shrink-0" />}
                  </button>
                  {openFaq === i && <p className="text-earth-400 text-sm leading-relaxed mt-4 pt-4 border-t border-earth-800">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-earth-900 border border-earth-800 p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] glow-orb bg-brand-500/10" />
            <div className="relative">
              <span className="section-tag mb-6"><Zap size={14} /> Get Started</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to make your organization<br /><span className="gradient-text">AI-powered?</span>
              </h2>
              <p className="text-earth-400 text-xl mb-10 max-w-2xl mx-auto">
                Our enterprise team will map out your AI transformation plan in a free 45-minute call.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:enterprise@afriflowai.com?subject=Book Demo Call" className="btn-primary py-4 px-10 text-base">
                  <PlayCircle size={18} /> Book a free demo call
                </a>
                <Link href="#plans" className="btn-secondary py-4 px-10 text-base">
                  See all plans <ArrowRight size={16} />
                </Link>
              </div>
              <p className="text-earth-600 text-sm mt-6">Average response time: under 4 hours · enterprise@afriflowai.com</p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
