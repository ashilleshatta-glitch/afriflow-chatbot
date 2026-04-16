import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import AnimatedHero from '@/components/hero/AnimatedHero'
import Link from 'next/link'
import {
  Zap, ArrowRight, Play, Star, Users, BookOpen, Award,
  CheckCircle, Globe, Smartphone, Wifi, TrendingUp,
  ChevronRight, Flame, Target, Clock, MessageCircle,
  BarChart2, Shield, Bot, Building2, Trophy
} from 'lucide-react'
import { TRANSFORMATION_PATHS, SCHOOLS, SAMPLE_COURSES } from '@/lib/data'
import { COUNTRY_DATA, INDEX_YEAR, INDEX_QUARTER } from '@/lib/benchmarkData'
import CourseCard from '@/components/CourseCard'

const STATS = [
  { value: '24K+', label: 'Learners enrolled', icon: Users },
  { value: '7', label: 'Schools & tracks', icon: BookOpen },
  { value: '50+', label: 'Courses & lessons', icon: Award },
  { value: '12+', label: 'African countries', icon: Globe },
]

const TESTIMONIALS = [
  {
    name: 'Kwame Asante',
    role: 'Freelance AI Consultant',
    country: '🇬🇭 Ghana',
    avatar: 'KA',
    text: 'AfriFlow AI changed my life. Within 60 days I was making $800/month helping SMEs automate their WhatsApp. The practical approach is what sets it apart.',
    rating: 5,
  },
  {
    name: 'Chioma Okafor',
    role: 'Business Owner',
    country: '🇳🇬 Nigeria',
    avatar: 'CO',
    text: 'I used to spend 4 hours a day on customer messages. Now my AI bot handles everything and I focus on growing. Best investment for my business.',
    rating: 5,
  },
  {
    name: 'Aisha Kamara',
    role: 'Marketing Manager',
    country: '🇰🇪 Kenya',
    avatar: 'AK',
    text: 'The AfriAI Coach is incredible. It\'s like having a personal tutor available 24/7 who understands African business contexts. Highly recommended.',
    rating: 5,
  },
]

const FEATURES = [
  { icon: Smartphone, title: 'Mobile-first learning', desc: 'Optimized for the phone you already own' },
  { icon: Wifi, title: 'Low-bandwidth mode', desc: 'Works on 2G/3G with downloadable notes' },
  { icon: Globe, title: 'Africa-specific content', desc: 'Real examples from Ghana, Nigeria, Kenya and more' },
  { icon: Zap, title: 'AI-powered coach', desc: 'Personal guidance from AfriAI Coach, 24/7' },
  { icon: TrendingUp, title: 'Income-focused', desc: 'Every lesson connects to real earning opportunities' },
  { icon: Target, title: 'Certification paths', desc: 'Employer-recognized certificates in 6 specialties' },
]

export default function HomePage() {
  const featuredCourses = SAMPLE_COURSES.slice(0, 3)

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />

      {/* ANIMATED HERO */}
      <AnimatedHero />

      {/* STATS */}
      <section className="border-y border-earth-800 bg-earth-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} className="text-brand-400" />
                  </div>
                  <div className="font-display text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-earth-500 text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TRANSFORMATION PATHS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-tag mb-4">
              <Target size={14} />
              Transformation Paths
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              We sell outcomes, <span className="gradient-text">not courses</span>
            </h2>
            <p className="text-earth-400 text-lg max-w-2xl mx-auto">
              Pick a path based on where you want to be. Every path is designed around real African earning opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRANSFORMATION_PATHS.map((path, i) => (
              <div key={i} className="card-glow group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{path.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg group-hover:text-brand-300 transition-colors">
                        {path.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1 text-brand-400 text-sm font-medium">
                        <Clock size={13} />
                        {path.duration}
                      </span>
                      <span className="text-earth-600 text-sm">•</span>
                      <span className="text-earth-500 text-sm">{path.audience}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {path.steps.map((step, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 bg-earth-800 text-earth-400 rounded-lg">
                            {step}
                          </span>
                          {j < path.steps.length - 1 && (
                            <ChevronRight size={12} className="text-earth-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-earth-800">
                  <Link href="/paths" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
                    Start this path <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHOOLS */}
      <section className="py-24 bg-earth-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-tag mb-4">
              <BookOpen size={14} />
              7 Schools
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything you need to <span className="gradient-text">master AI</span>
            </h2>
            <p className="text-earth-400 text-lg max-w-2xl mx-auto">
              From absolute beginner to professional AI builder — structured schools with clear progression.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHOOLS.map((school) => (
              <Link
                key={school.id}
                href={`/courses?school=${school.id}`}
                className="card group hover:border-earth-600 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {school.icon}
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-brand-300 transition-colors">
                  {school.name}
                </h3>
                <div className="flex items-center gap-1 text-earth-500 text-sm mt-2">
                  <span>Explore school</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
            
            {/* Community card */}
            <Link
              href="/community"
              className="card group hover:border-earth-600 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🌍
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-brand-300 transition-colors">
                Community Hub
              </h3>
              <div className="flex items-center gap-1 text-earth-500 text-sm mt-2">
                <span>Join community</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-tag mb-4">
                <Star size={14} />
                Popular courses
              </span>
              <h2 className="font-display text-4xl font-bold text-white">
                Start with our <span className="gradient-text">best courses</span>
              </h2>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:flex">
              View all courses <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCourses.map((course, i) => (
              <CourseCard key={i} course={course as any} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link href="/courses" className="btn-secondary">
              View all courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY AFRIFLOW */}
      <section className="py-24 bg-earth-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-tag mb-4">
              <Zap size={14} />
              Built for Africa
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Why AfriFlow AI is <span className="gradient-text">different</span>
            </h2>
            <p className="text-earth-400 text-lg max-w-2xl mx-auto">
              We&apos;ve built this platform around African realities — not just translated Western content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-earth-500 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-tag mb-4">
              <Star size={14} />
              Success stories
            </span>
            <h2 className="font-display text-4xl font-bold text-white">
              Africans already <span className="gradient-text">earning with AI</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-glow">
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-earth-300 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-forest-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-earth-500 text-xs">{t.role} · {t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-24 bg-earth-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Simple, affordable <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-earth-400 text-lg">Start free. Upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['20+ free lessons', 'AfriAI Coach (basic)', 'Community access', 'Weekly live webinar'],
                cta: 'Start free',
                href: '/auth/register',
                highlight: false,
              },
              {
                name: 'Premium',
                price: '$15',
                period: '/month',
                features: ['All 50+ courses', 'Full AfriAI Coach', 'All templates & tools', 'Certificates', 'Live sessions', 'Priority support'],
                cta: 'Go Premium',
                href: '/pricing',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'per team',
                features: ['Team dashboard', 'Custom curriculum', 'Dedicated trainer', 'Analytics & reporting', 'SLA support'],
                cta: 'Contact us',
                href: '/business',
                highlight: false,
              }
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border ${
                plan.highlight
                  ? 'border-brand-500/50 bg-brand-500/5 shadow-lg shadow-brand-500/10'
                  : 'border-earth-800 bg-earth-900'
              }`}>
                {plan.highlight && (
                  <span className="text-xs font-medium px-3 py-1 bg-brand-500 text-white rounded-full mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-white font-display font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-earth-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-earth-400">
                      <CheckCircle size={14} className="text-forest-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-brand-500 hover:bg-brand-400 text-white'
                      : 'border border-earth-700 hover:border-earth-600 text-earth-300 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GC6 — 30-DAY AI CHALLENGE BANNER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-gradient-to-r from-brand-500/20 via-brand-500/10 to-brand-500/20 border-y border-brand-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-2xl">
                🔥
              </div>
              <div>
                <div className="font-bold text-white">30-Day AI Challenge — Q1 2026</div>
                <div className="text-sm text-white/60">2,847 learners on Day 26 · 4 days left</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['KA','CO','AM','RO'].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-forest-500 flex items-center justify-center text-white text-xs font-bold border-2 border-earth-950">{i}</div>
                ))}
              </div>
              <Link href="/challenge" className="btn-primary py-2 text-sm flex items-center gap-1.5">
                <Flame size={14} /> Join the Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GC4 — BENCHMARK INDEX TEASER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <span className="section-tag mb-4">
                <BarChart2 size={14} /> Africa AI Adoption Index {INDEX_YEAR} {INDEX_QUARTER}
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                Who is leading Africa&apos;s <span className="gradient-text">AI revolution?</span>
              </h2>
              <p className="text-earth-400 text-lg mb-8">
                We rank 22 African nations on AI readiness across 5 dimensions:
                digital infrastructure, talent, policy, adoption, and startup ecosystem.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/benchmark" className="btn-primary flex items-center gap-2">
                  View Full Rankings <ArrowRight size={16} />
                </Link>
                <Link href="/benchmark" className="btn-secondary flex items-center gap-2">
                  Download Report
                </Link>
              </div>
            </div>
            {/* Right: top-3 podium */}
            <div className="space-y-3">
              {COUNTRY_DATA.slice(0, 3).map((c, i) => (
                <div key={c.code} className={`flex items-center gap-4 rounded-2xl border p-4 ${
                  i === 0 ? 'border-amber-500/40 bg-amber-500/5' :
                  i === 1 ? 'border-white/20 bg-white/5' :
                  'border-amber-700/30 bg-amber-700/5'
                }`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-lg ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-white/10 text-white/70' :
                    'bg-amber-700/20 text-amber-700'
                  }`}>
                    {['🥇','🥈','🥉'][i]}
                  </div>
                  <div className="text-2xl">{c.flag}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{c.country}</div>
                    <div className="text-xs text-white/50">{c.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{c.overallScore}</div>
                    <div className="text-xs text-white/40">/ 100</div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/benchmark" className="text-sm text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1">
                  See all 22 countries <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GC5 — SCHOOLS B2B */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-earth-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: school stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, value: '140+', label: 'Schools onboarded', color: 'brand' },
                { icon: Users, value: '18K+', label: 'Students enrolled', color: 'forest' },
                { icon: Globe, value: '21', label: 'African countries', color: 'brand' },
                { icon: Award, value: '94%', label: 'Completion rate', color: 'forest' },
              ].map(s => (
                <div key={s.label} className="card text-center py-6">
                  <s.icon size={24} className={`mx-auto mb-2 text-${s.color}-500`} />
                  <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/50 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Right: copy */}
            <div>
              <span className="section-tag mb-4">
                <Building2 size={14} /> Schools &amp; Institutions
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                Deploy AI education <span className="gradient-text">at scale</span>
              </h2>
              <p className="text-earth-400 text-lg mb-6">
                White-label AfriFlow AI for your school, university, or training institution.
                Track every student, assign custom courses, and export certificates — all from one dashboard.
              </p>
              <ul className="space-y-3 mb-8">
                {['Custom school branding & domain','Bulk student enrollment via invite code','Real-time progress & completion analytics','AfriFlow certificates with your logo'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-earth-300">
                    <CheckCircle size={14} className="text-forest-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/schools" className="btn-primary flex items-center gap-2 w-fit">
                Get a Free School Portal <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GC1 — WHATSAPP ACADEMY */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-forest-500/20 bg-forest-500/5 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Left: phone mockup */}
              <div className="lg:col-span-2 bg-gradient-to-br from-forest-500/20 to-forest-500/5 p-8 flex items-center justify-center">
                <div className="w-56 rounded-3xl border-4 border-white/20 bg-earth-950 shadow-2xl overflow-hidden">
                  <div className="bg-green-600 px-4 py-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">AfriFlow AI</div>
                      <div className="text-xs text-green-200">online</div>
                    </div>
                  </div>
                  <div className="p-3 space-y-2 min-h-40">
                    <div className="bg-earth-800 rounded-xl rounded-tl-none p-2.5 text-xs text-white/90 max-w-[80%]">
                      👋 Welcome! I&apos;m your AfriFlow AI coach. What&apos;s your name?
                    </div>
                    <div className="bg-green-600/30 rounded-xl rounded-tr-none p-2.5 text-xs text-white/90 max-w-[80%] ml-auto text-right">
                      Amara
                    </div>
                    <div className="bg-earth-800 rounded-xl rounded-tl-none p-2.5 text-xs text-white/90 max-w-[80%]">
                      Nice to meet you Amara! 🌍 Which country are you from?
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <div className="flex items-center gap-2 bg-earth-800 rounded-full px-3 py-2">
                      <span className="text-xs text-white/30 flex-1">Type a message...</span>
                      <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                        <ArrowRight size={10} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: copy */}
              <div className="lg:col-span-3 p-8 lg:p-12">
                <span className="section-tag mb-4">
                  <MessageCircle size={14} /> WhatsApp AI Academy
                </span>
                <h2 className="font-display text-4xl font-bold text-white mb-4">
                  Learn AI on <span className="gradient-text">WhatsApp</span>
                </h2>
                <p className="text-earth-400 text-lg mb-6">
                  No app. No laptop. No WiFi required. Just send us a message on WhatsApp
                  and get AI lessons delivered straight to your phone.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { v: '14K+', l: 'Learners' },
                    { v: '5', l: 'Languages' },
                    { v: '87%', l: 'Completion' },
                  ].map(s => (
                    <div key={s.l} className="text-center">
                      <div className="font-bold text-2xl text-white">{s.v}</div>
                      <div className="text-xs text-white/50">{s.l}</div>
                    </div>
                  ))}
                </div>
                <Link href="/whatsapp-academy" className="btn-primary flex items-center gap-2 w-fit text-lg">
                  <MessageCircle size={18} /> Start Learning Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GC2 — AUTOMATE SERVICE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-earth-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-tag mb-4">
              <Zap size={14} /> Done-for-You AI
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Tell us what to automate.<br />
              <span className="gradient-text">We&apos;ll build it for you.</span>
            </h2>
            <p className="text-earth-400 text-lg max-w-2xl mx-auto">
              Don&apos;t have the time to learn? Our team will design and deploy custom AI automation
              for your business — from WhatsApp bots to full workflow automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '💬', title: 'WhatsApp AI Bot', desc: 'Customer service, order tracking, and lead capture — 24/7', time: '5–7 days' },
              { icon: '⚡', title: 'Business Automation', desc: 'Connect your apps, automate workflows, eliminate manual tasks', time: '7–14 days' },
              { icon: '📊', title: 'AI Data Pipeline', desc: 'Automated reports, dashboards, and AI-powered insights', time: '10–21 days' },
            ].map(s => (
              <div key={s.title} className="card text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 mb-4">{s.desc}</p>
                <div className="text-xs text-brand-400 font-medium">⏱ {s.time} delivery</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/automate" className="btn-primary text-lg flex items-center gap-2 mx-auto w-fit">
              Get a Free Consultation <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* GC3 — AFRIFLOW VERIFIED */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-tag mb-4">
                <Shield size={14} /> AfriFlow Verified
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                Your AI skills, <span className="gradient-text">verified on-chain</span>
              </h2>
              <p className="text-earth-400 text-lg mb-6">
                Earn an AfriFlow Verified AI Talent Passport — a tamper-proof, blockchain-anchored credential
                that employers and clients can verify in seconds.
              </p>
              <ul className="space-y-3 mb-8">
                {['Shareable link & QR code for every certificate','Verified by AfriFlow AI — trusted by 200+ employers','Adds to your LinkedIn, CV, and portfolio automatically','Issued instantly when you complete a course'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-earth-300">
                    <CheckCircle size={14} className="text-forest-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link href="/certificates" className="btn-primary flex items-center gap-2">
                  View My Certificates <Award size={16} />
                </Link>
                <Link href="/employers" className="btn-secondary flex items-center gap-2">
                  For Employers
                </Link>
              </div>
            </div>
            {/* Right: certificate mock */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-earth-900 p-8 shadow-2xl shadow-brand-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-brand-500/20 flex items-center justify-center">
                    <Shield size={24} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">AfriFlow Verified</div>
                    <div className="text-xs text-brand-400">AI Talent Passport</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-display text-2xl font-bold text-white">Amara Diallo</div>
                  <div className="text-sm text-white/60 mt-0.5">has successfully completed</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
                  <div className="font-semibold text-white text-sm">AI for Business Africa</div>
                  <div className="text-xs text-white/40 mt-1">AfriFlow AI · March 2026</div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>🔒 Blockchain verified</span>
                  <span className="text-forest-400 font-medium flex items-center gap-1">
                    <CheckCircle size={10} /> Valid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl overflow-hidden border border-earth-700 bg-earth-900 p-12">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 glow-orb bg-brand-500/20" />
            <div className="relative">
              <div className="text-5xl mb-6">🌍</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                Africa&apos;s AI moment is <span className="gradient-text">right now</span>
              </h2>
              <p className="text-earth-400 text-lg mb-8 max-w-2xl mx-auto">
                Join 24,000+ Africans who are learning, automating, and earning with AI. 
                Your journey starts with one free lesson.
              </p>
              <Link href="/auth/register" className="btn-primary text-lg px-10 py-4">
                Join AfriFlow AI Free <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AfriAICoach />
    </div>
  )
}
