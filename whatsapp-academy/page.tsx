import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  MessageCircle, CheckCircle, Zap, Globe, Star, Shield,
  BookOpen, Award, Users, ArrowRight, Smartphone,
  Wifi, Clock, Target, TrendingUp, ChevronRight, Bot,
  BrainCircuit, Briefcase, Palette, Code2, Rocket, Heart,
  GraduationCap, FileText, Send, BarChart3,
  Headphones, Languages, BadgeCheck, Sparkles,
  Building2, ShoppingBag, Stethoscope, Sprout, Banknote,
  Mic2, Lightbulb
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'WhatsApp AI Academy \u2014 Learn AI on WhatsApp | AfriFlow AI',
  description:
    'Africa\'s first WhatsApp-native AI school. 6 learning tracks, 32 lessons, quizzes, certificates \u2014 all on the phone you already have.',
  openGraph: {
    title: 'WhatsApp AI Academy \u2014 Learn AI on WhatsApp',
    description: 'Africa\'s first WhatsApp-native AI school. 32 lessons delivered to your phone.',
  },
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '+1 415 523 8886'
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=START`

/* ======= DATA ======= */

const LEARNING_TRACKS = [
  {
    id: 'foundations',
    icon: BrainCircuit,
    title: 'AI Foundations',
    tagline: 'Zero to AI-literate in 5 lessons',
    colorText: 'text-blue-400',
    colorBg: 'bg-blue-500/10',
    lessons: 5,
    duration: '50 min',
    level: 'Beginner',
    isFree: true,
    topics: [
      'What is AI? (Real talk, no jargon)',
      'Machine Learning vs AI vs Deep Learning',
      'Prompt Engineering \u2014 talk to AI like a pro',
      'AI Tools You Can Use Today (free)',
      'AI Opportunities in Africa by Industry',
    ],
    outcomes: ['Understand AI fundamentals', 'Use ChatGPT & Claude confidently', 'Write effective prompts'],
  },
  {
    id: 'business',
    icon: Briefcase,
    title: 'AI for Business',
    tagline: 'Automate & grow your African SME',
    colorText: 'text-brand-400',
    colorBg: 'bg-brand-500/10',
    lessons: 6,
    duration: '60 min',
    level: 'Beginner',
    isFree: false,
    topics: [
      'AI Customer Service \u2014 WhatsApp auto-replies',
      'AI Marketing \u2014 content that converts',
      'AI Finance \u2014 invoicing & bookkeeping',
      'AI Sales \u2014 lead generation on autopilot',
      'AI Operations \u2014 inventory & scheduling',
      'Build Your AI Business System',
    ],
    outcomes: ['Automate customer service', 'Generate marketing content with AI', 'Set up AI-powered sales funnels'],
  },
  {
    id: 'automation',
    icon: Zap,
    title: 'WhatsApp Automation',
    tagline: 'Build bots that sell while you sleep',
    colorText: 'text-forest-400',
    colorBg: 'bg-forest-500/10',
    lessons: 6,
    duration: '70 min',
    level: 'Intermediate',
    isFree: false,
    topics: [
      'WhatsApp Business API Setup',
      'Build: FAQ Auto-Reply Bot',
      'Build: Lead Capture Bot',
      'Build: Order Confirmation System',
      'Build: Appointment Booking Bot',
      'AI-Powered Conversational Bot',
    ],
    outcomes: ['Build WhatsApp bots from scratch', 'Automate customer conversations', 'Set up order & booking systems'],
  },
  {
    id: 'creator',
    icon: Palette,
    title: 'AI Creator & Income',
    tagline: 'Turn AI skills into real money',
    colorText: 'text-purple-400',
    colorBg: 'bg-purple-500/10',
    lessons: 5,
    duration: '55 min',
    level: 'Intermediate',
    isFree: false,
    topics: [
      'Package & Sell AI Services in Africa',
      'AI Content Creation \u2014 blogs, social, ads',
      'Start an AI Automation Agency',
      'Freelance AI on Upwork & Fiverr',
      'Build & Sell Digital Products with AI',
    ],
    outcomes: ['Price AI services profitably', 'Land your first paying client', 'Build recurring revenue streams'],
  },
  {
    id: 'builder',
    icon: Code2,
    title: 'AI Builder',
    tagline: 'Code AI tools & agents',
    colorText: 'text-red-400',
    colorBg: 'bg-red-500/10',
    lessons: 5,
    duration: '65 min',
    level: 'Advanced',
    isFree: false,
    topics: [
      'Python + OpenAI API \u2014 Your First Script',
      'Build AI Agents with LangChain',
      'RAG \u2014 AI That Knows Your Data',
      'Multi-Agent Systems with CrewAI',
      'Deploy AI to Production',
    ],
    outcomes: ['Call AI APIs with Python', 'Build autonomous AI agents', 'Deploy production AI systems'],
  },
  {
    id: 'career',
    icon: Rocket,
    title: 'AI Career Launchpad',
    tagline: 'Land a remote AI job from Africa',
    colorText: 'text-teal-400',
    colorBg: 'bg-teal-500/10',
    lessons: 5,
    duration: '50 min',
    level: 'All levels',
    isFree: false,
    topics: [
      'AI-Ready CV & LinkedIn Optimisation',
      'Where to Find Remote AI Jobs',
      'Application Strategy That Gets Interviews',
      'Ace the Remote AI Interview',
      'Succeed in Your First Remote Role',
    ],
    outcomes: ['Build an ATS-optimised CV', 'Land remote AI interviews', 'Navigate remote work culture'],
  },
]

const PHONE_DEMO_MESSAGES = [
  { from: 'user', text: 'START', time: '9:01 AM' },
  { from: 'bot', text: '\ud83c\udf0d *Welcome to AfriFlow AI Academy!*\n\nLearn AI skills used by Africa\'s fastest-growing companies.\n\n\ud83d\udcda 6 Learning Tracks\n\u23f1 32 lessons \u00b7 5-10 min each\n\ud83c\udfc6 Earn XP + Certificates!\n\nWhat\'s your name? \ud83d\udc47', time: '9:01 AM' },
  { from: 'user', text: 'Amara', time: '9:02 AM' },
  { from: 'bot', text: 'Nice to meet you, Amara! \ud83e\udd1d\n\nWhich country are you in?', time: '9:02 AM' },
  { from: 'user', text: 'Ghana', time: '9:02 AM' },
  { from: 'bot', text: 'Perfect, Amara from Ghana! \ud83c\uddec\ud83c\udded\n\n\ud83c\udf93 *Choose your track:*\n\n1. \ud83e\udde0 AI Foundations (FREE)\n2. \ud83d\udcbc AI for Business\n3. \u26a1 WhatsApp Automation\n4. \ud83c\udfa8 AI Creator & Income\n5. \ud83d\udcbb AI Builder\n6. \ud83d\ude80 AI Career Launchpad\n\nReply with a number \ud83d\udc47', time: '9:02 AM' },
  { from: 'user', text: '1', time: '9:03 AM' },
  { from: 'bot', text: '\ud83e\udde0 *Lesson 1: What is AI?*\n\nAI = software that learns from data.\n\n\ud83d\udcf1 Your phone recognises faces\n\ud83d\udcb3 Your bank detects fraud\n\ud83d\uded2 Jumia recommends products\n\n\ud83d\udd25 Africa AI opportunities:\n\u2022 Fintech fraud detection\n\u2022 AgriTech crop prediction\n\u2022 Healthcare diagnosis\n\nReply *NEXT* for the quiz \ud83d\udc47', time: '9:03 AM' },
]

const SUCCESS_STORIES = [
  {
    name: 'Amara K.',
    country: 'Ghana \ud83c\uddec\ud83c\udded',
    role: 'Fashion Store Owner',
    quote: 'I learned WhatsApp automation on my phone during my commute. Now my bot handles 80% of customer queries. Sales up 35%.',
    track: 'WhatsApp Automation',
    xp: 340,
    avatar: '\ud83d\udc69\ud83c\udffe\u200d\ud83d\udcbc',
  },
  {
    name: 'Chidi O.',
    country: 'Nigeria \ud83c\uddf3\ud83c\uddec',
    role: 'Freelance AI Consultant',
    quote: 'Started with the free AI Foundations track. 3 months later I\'m earning \u20a6800K/month building AI automations for businesses.',
    track: 'AI Creator & Income',
    xp: 520,
    avatar: '\ud83d\udc68\ud83c\udffe\u200d\ud83d\udcbb',
  },
  {
    name: 'Wanjiku M.',
    country: 'Kenya \ud83c\uddf0\ud83c\uddea',
    role: 'Marketing Manager',
    quote: 'The AI for Business track changed how I work. I create a week\'s content in 2 hours. My boss thinks I hired an assistant.',
    track: 'AI for Business',
    xp: 280,
    avatar: '\ud83d\udc69\ud83c\udffe\u200d\ud83c\udf93',
  },
  {
    name: 'Boubacar D.',
    country: 'Senegal \ud83c\uddf8\ud83c\uddf3',
    role: 'Junior Data Analyst',
    quote: 'J\'ai appris l\'IA en fran\u00e7ais sur WhatsApp! I landed a remote AI job 2 months after finishing the Career Launchpad.',
    track: 'AI Career Launchpad',
    xp: 410,
    avatar: '\ud83d\udc68\ud83c\udffe\u200d\ud83d\udd2c',
  },
]

const LANGUAGES = [
  { lang: 'English', flag: '\ud83c\uddec\ud83c\udde7', status: 'live' as const, learners: '38,000+' },
  { lang: 'Fran\u00e7ais', flag: '\ud83c\uddeb\ud83c\uddf7', status: 'live' as const, learners: '12,000+' },
  { lang: 'Kiswahili', flag: '\ud83c\uddf0\ud83c\uddea', status: 'live' as const, learners: '8,500+' },
  { lang: 'Hausa', flag: '\ud83c\uddf3\ud83c\uddec', status: 'live' as const, learners: '4,200+' },
  { lang: 'Yor\u00f9b\u00e1', flag: '\ud83c\uddf3\ud83c\uddec', status: 'live' as const, learners: '3,100+' },
  { lang: 'Amharic', flag: '\ud83c\uddea\ud83c\uddf9', status: 'beta' as const, learners: '1,800+' },
  { lang: 'Twi', flag: '\ud83c\uddec\ud83c\udded', status: 'beta' as const, learners: '2,400+' },
  { lang: 'Pidgin', flag: '\ud83c\uddf3\ud83c\uddec', status: 'beta' as const, learners: '5,600+' },
  { lang: 'isiZulu', flag: '\ud83c\uddff\ud83c\udde6', status: 'coming' as const, learners: '' },
  { lang: 'Wolof', flag: '\ud83c\uddf8\ud83c\uddf3', status: 'coming' as const, learners: '' },
]

const INDUSTRY_USE_CASES = [
  { icon: ShoppingBag, title: 'Retail & E-commerce', desc: 'Automated order tracking, product recommendations, WhatsApp catalog bots', stat: '4,200+ retailers' },
  { icon: Banknote, title: 'Finance & Fintech', desc: 'Fraud detection, loan qualification chatbots, expense categorisation', stat: '1,800+ agents' },
  { icon: Stethoscope, title: 'Healthcare', desc: 'Appointment booking, symptom triage, medication reminders', stat: '900+ clinics' },
  { icon: Sprout, title: 'Agriculture', desc: 'Crop disease detection, weather alerts, market price updates via WhatsApp', stat: '3,100+ farmers' },
  { icon: GraduationCap, title: 'Education', desc: 'Student enrollment bots, homework help, parent communication', stat: '2,500+ schools' },
  { icon: Building2, title: 'Real Estate', desc: 'Property listing bots, virtual tour scheduling, tenant communication', stat: '800+ agents' },
]

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'border-earth-700',
    badge: '',
    features: [
      'AI Foundations track (5 lessons)',
      'Quizzes with instant feedback',
      'Foundation Certificate',
      'English language',
      'Community access',
    ],
    cta: 'Start Free',
    ctaStyle: 'btn-secondary',
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    color: 'border-brand-500',
    badge: 'Most Popular',
    features: [
      'All 6 learning tracks (32 lessons)',
      'All quizzes + advanced exercises',
      'All 6 track certificates',
      'All 10 languages',
      'Priority WhatsApp support',
      'Business templates library',
      'Weekly AI tool updates',
    ],
    cta: 'Go Pro',
    ctaStyle: 'btn-primary',
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    color: 'border-purple-500',
    badge: 'Teams',
    features: [
      'Everything in Pro',
      'Up to 50 team members',
      'Custom onboarding flow',
      'Admin dashboard & analytics',
      'Branded certificates',
      'API access for your systems',
      'Dedicated account manager',
      'Custom learning tracks',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'btn-secondary',
  },
]

/* ======= COMPONENT ======= */

export default function WhatsAppAcademyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-earth-950">

        {/* HERO */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="bg-grid absolute inset-0 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-earth-950/0 via-earth-950/50 to-earth-950" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute top-24 left-[10%] text-6xl opacity-10 animate-pulse">{'\ud83d\udcf1'}</div>
            <div className="absolute top-40 right-[15%] text-5xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>{'\ud83e\udd16'}</div>
            <div className="absolute bottom-32 left-[20%] text-5xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>{'\ud83c\udf0d'}</div>
            <div className="absolute bottom-24 right-[25%] text-4xl opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}>{'\ud83c\udf93'}</div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left copy */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="section-tag">WhatsApp AI Academy</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-forest-500/10 text-forest-400 border border-forest-500/20 rounded-full">
                    NEW: 6 Tracks Live
                  </span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                  Learn AI on{' '}
                  <span className="gradient-text">WhatsApp</span>
                  <br />
                  <span className="text-3xl sm:text-4xl lg:text-5xl text-earth-300">
                    {'\u2014'} right from your phone
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-lg text-earth-400 leading-relaxed">
                  Africa&apos;s first WhatsApp-native AI school. 6 learning tracks, 32 lessons,
                  quizzes, certificates {'\u2014'} delivered message by message to the phone you already have.
                  No app. No laptop. Works on 2G.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
                  >
                    <MessageCircle className="h-6 w-6" />
                    Start Learning {'\u2014'} Free
                  </a>
                  <div className="flex flex-col text-sm text-earth-500">
                    <span>or message</span>
                    <span className="font-mono text-earth-300">{WHATSAPP_NUMBER}</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: CheckCircle, text: '100% free tier' },
                    { icon: Wifi, text: 'Works on 2G/3G' },
                    { icon: Languages, text: '10 languages' },
                    { icon: Award, text: '6 certificates' },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-1.5 text-sm text-earth-400">
                      <f.icon className="h-4 w-4 text-forest-500 flex-shrink-0" />
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right phone mockup */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-[320px] sm:w-[360px]">
                  <div className="bg-earth-900 rounded-[2.5rem] border-2 border-earth-700 shadow-2xl shadow-brand-500/10 p-3 relative overflow-hidden">
                    <div className="bg-earth-800 rounded-t-[2rem] px-6 py-2 flex items-center justify-between text-xs text-earth-400">
                      <span>9:03 AM</span>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        <span>3G</span>
                      </div>
                    </div>
                    <div className="bg-forest-700 px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center text-sm">{'\ud83e\udd16'}</div>
                      <div>
                        <div className="text-white text-sm font-semibold">AfriFlow AI Academy</div>
                        <div className="text-forest-200 text-xs">online</div>
                      </div>
                    </div>
                    <div className="bg-[#0B1519] space-y-2 p-3 h-[400px] overflow-y-auto scrollbar-hide">
                      {PHONE_DEMO_MESSAGES.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                              msg.from === 'user'
                                ? 'bg-forest-700 text-white rounded-br-sm'
                                : 'bg-earth-800 text-earth-200 rounded-bl-sm'
                            }`}
                          >
                            <div className="whitespace-pre-line">{msg.text}</div>
                            <div className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-forest-300' : 'text-earth-500'} text-right`}>
                              {msg.time} {msg.from === 'user' && '\u2713\u2713'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-earth-800 px-3 py-2 flex items-center gap-2 rounded-b-[2rem]">
                      <div className="flex-1 bg-earth-700 rounded-full px-4 py-2 text-xs text-earth-500">
                        Type a message...
                      </div>
                      <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                        <Mic2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -z-10 inset-0 bg-gradient-to-b from-forest-500/20 to-brand-500/20 blur-3xl rounded-full scale-110" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-y border-earth-800 bg-earth-900/50">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: Users, value: '67,000+', label: 'WhatsApp learners', color: 'text-brand-400' },
                { icon: Globe, value: '34', label: 'African countries', color: 'text-forest-400' },
                { icon: BarChart3, value: '91%', label: 'Completion rate', color: 'text-purple-400' },
                { icon: Award, value: '23,000+', label: 'Certificates earned', color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <s.icon className={`mx-auto mb-2 h-6 w-6 ${s.color}`} />
                  <div className="font-display text-2xl md:text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-earth-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">How It Works</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                Start learning in <span className="gradient-text">30 seconds</span>
              </h2>
              <p className="mt-3 text-earth-400 max-w-2xl mx-auto">
                No signups, no downloads, no credit card. Just send one WhatsApp message.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  icon: Send,
                  title: 'Send "START"',
                  desc: 'Message our WhatsApp number. Bot greets you and asks your name.',
                  detail: 'Works on any phone with WhatsApp \u2014 smartphones, feature phones, even 2G.',
                },
                {
                  step: '2',
                  icon: Target,
                  title: 'Pick Your Track',
                  desc: 'Choose from 6 learning tracks based on your goals \u2014 beginner to advanced.',
                  detail: 'AI Foundations is free. Pro tracks unlock with a $9/mo subscription.',
                },
                {
                  step: '3',
                  icon: BookOpen,
                  title: 'Learn & Quiz',
                  desc: 'Receive bite-sized lessons with real African examples. Pass quizzes to earn XP.',
                  detail: 'Each lesson is 5-10 minutes. Learn during your commute, lunch break, or before bed.',
                },
                {
                  step: '4',
                  icon: Award,
                  title: 'Get Certified',
                  desc: 'Complete a track to earn a verified AfriFlow AI certificate. Share on LinkedIn.',
                  detail: 'Certificates are blockchain-verified and recognized by 200+ African employers.',
                },
              ].map(item => (
                <div key={item.step} className="card relative group hover:border-earth-600 transition-all">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
                    <item.icon className="h-7 w-7 text-brand-500" />
                  </div>
                  <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-earth-400">{item.desc}</p>
                  <p className="mt-3 text-xs text-earth-600 border-t border-earth-800 pt-3">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEARNING TRACKS */}
        <section className="py-20 bg-earth-900/50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">Learning Tracks</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                6 tracks. 32 lessons. <span className="gradient-text">Real skills.</span>
              </h2>
              <p className="mt-3 text-earth-400 max-w-2xl mx-auto">
                From complete beginner to AI builder {'\u2014'} every track delivered via WhatsApp with lessons, quizzes, exercises, and certificates.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LEARNING_TRACKS.map(track => (
                <div key={track.id} className="card group hover:border-earth-600 transition-all relative overflow-hidden">
                  {track.isFree && (
                    <div className="absolute top-4 right-4 px-2 py-0.5 bg-forest-500/10 text-forest-400 text-xs font-bold rounded-full border border-forest-500/20">
                      FREE
                    </div>
                  )}
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${track.colorBg}`}>
                    <track.icon className={`h-7 w-7 ${track.colorText}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{track.title}</h3>
                  <p className="text-sm text-earth-400 mt-1">{track.tagline}</p>

                  <div className="flex items-center gap-3 mt-4 text-xs text-earth-500">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {track.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {track.duration}</span>
                    <span className={`px-1.5 py-0.5 rounded ${track.colorBg} ${track.colorText}`}>{track.level}</span>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    {track.topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold ${track.colorBg} ${track.colorText}`}>
                          {i + 1}
                        </div>
                        <span className="text-earth-300">{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-earth-800">
                    <p className="text-xs text-earth-500 font-medium mb-2">You&apos;ll be able to:</p>
                    <div className="space-y-1">
                      {track.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-earth-400">
                          <CheckCircle className="h-3 w-3 text-forest-500 flex-shrink-0" />
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRY USE CASES */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">Built for Africa</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                AI skills for <span className="gradient-text">every industry</span>
              </h2>
              <p className="mt-3 text-earth-400 max-w-2xl mx-auto">
                Every lesson uses real African business examples. Every template is built for the African market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {INDUSTRY_USE_CASES.map(uc => (
                <div key={uc.title} className="card hover:border-earth-600 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 flex-shrink-0">
                      <uc.icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{uc.title}</h3>
                      <p className="mt-1 text-sm text-earth-400">{uc.desc}</p>
                      <span className="inline-block mt-2 text-xs text-brand-400 font-medium">{uc.stat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY WHATSAPP */}
        <section className="py-20 bg-earth-900/50">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">Why WhatsApp?</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                The most <span className="gradient-text">accessible</span> AI education on earth
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Smartphone, title: 'No App Download', desc: 'Uses WhatsApp \u2014 already on 700M+ African phones. Nothing to install.' },
                { icon: Wifi, title: 'Works on 2G/3G', desc: 'Text-based lessons work on the slowest connections. No video streaming required.' },
                { icon: Clock, title: '5-Minute Lessons', desc: 'Micro-learning that fits your schedule. Learn on the matatu, at lunch, or before bed.' },
                { icon: Bot, title: 'AI-Powered Tutor', desc: 'Our bot adapts to your pace, answers questions, and gives personalised feedback.' },
                { icon: Languages, title: '10 African Languages', desc: 'English, French, Kiswahili, Hausa, Yor\u00f9b\u00e1, Amharic, Twi, Pidgin \u2014 and growing.' },
                { icon: Shield, title: 'Offline-Friendly', desc: 'Messages queue when offline and deliver when you reconnect. Never lose progress.' },
                { icon: Sparkles, title: 'Real Quizzes & XP', desc: 'Test your knowledge after every lesson. Earn XP, climb the leaderboard.' },
                { icon: BadgeCheck, title: 'Verified Certificates', desc: 'Blockchain-verified certificates accepted by 200+ African employers.' },
                { icon: Heart, title: 'Free Tier Forever', desc: 'AI Foundations track is 100% free. Always. No trial, no paywall, no tricks.' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl bg-earth-800/50 border border-earth-800 hover:border-earth-700 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 flex-shrink-0">
                    <f.icon className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                    <p className="mt-1 text-xs text-earth-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LANGUAGES */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
              <span className="section-tag mb-4">Languages</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                Learn in <span className="gradient-text">your language</span>
              </h2>
              <p className="mt-3 text-earth-400">
                AI education shouldn&apos;t require English fluency. We support 10 languages {'\u2014'} with more coming.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {LANGUAGES.map(l => (
                <div
                  key={l.lang}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    l.status === 'live'
                      ? 'border-forest-500/30 bg-forest-500/5 hover:bg-forest-500/10'
                      : l.status === 'beta'
                      ? 'border-amber-500/20 bg-amber-500/5'
                      : 'border-earth-800 bg-earth-900/50'
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span className={`text-sm font-medium ${l.status === 'coming' ? 'text-earth-500' : 'text-white'}`}>{l.lang}</span>
                  {l.status === 'live' && (
                    <span className="text-xs text-forest-400 font-medium">{l.learners}</span>
                  )}
                  {l.status === 'beta' && (
                    <span className="text-xs text-amber-400 font-medium">Beta {'\u00b7'} {l.learners}</span>
                  )}
                  {l.status === 'coming' && (
                    <span className="text-xs text-earth-600">Coming soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUCCESS STORIES */}
        <section className="py-20 bg-earth-900/50">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">Success Stories</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                Real people. Real results.{' '}
                <span className="gradient-text">Real WhatsApp.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {SUCCESS_STORIES.map(story => (
                <div key={story.name} className="card hover:border-earth-600 transition-all">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{story.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{story.name}</h4>
                          <p className="text-sm text-earth-500">{story.role} {'\u00b7'} {story.country}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-brand-400 font-medium">{story.xp} XP</div>
                          <div className="text-xs text-earth-600">{story.track}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-earth-300 leading-relaxed italic">
                        &quot;{story.quote}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUSINESS TEMPLATES */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">Business Templates</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                Ready-to-use <span className="gradient-text">WhatsApp AI templates</span>
              </h2>
              <p className="mt-3 text-earth-400 max-w-2xl mx-auto">
                Pro members get instant access to 50+ tested templates. Copy, customize, and deploy in minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: MessageCircle, title: 'Customer FAQ Bot', desc: '10 pre-built FAQ flows for retail, services, restaurants, clinics', tag: 'Automation' },
                { icon: ShoppingBag, title: 'Order Confirmation', desc: 'Auto-send order details, tracking updates, delivery notifications', tag: 'E-commerce' },
                { icon: FileText, title: 'Invoice Generator', desc: 'WhatsApp-friendly invoice format with payment links (Paystack/Flutterwave)', tag: 'Finance' },
                { icon: Target, title: 'Lead Capture Bot', desc: 'Qualify leads via WhatsApp conversation, save to CRM/sheets', tag: 'Sales' },
                { icon: Clock, title: 'Booking System', desc: 'Appointment scheduling with calendar sync and reminders', tag: 'Services' },
                { icon: Headphones, title: 'Support Escalation', desc: 'AI handles L1, routes complex queries to human agents', tag: 'Support' },
                { icon: TrendingUp, title: 'Marketing Campaigns', desc: 'Broadcast templates, drip sequences, re-engagement flows', tag: 'Marketing' },
                { icon: Lightbulb, title: 'AI Content Generator', desc: 'Generate social posts, emails, product descriptions via WhatsApp', tag: 'Content' },
              ].map(t => (
                <div key={t.title} className="p-4 rounded-xl border border-earth-800 bg-earth-900/50 hover:border-earth-700 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <t.icon className="h-5 w-5 text-brand-400" />
                    <span className="text-xs px-2 py-0.5 bg-brand-500/10 text-brand-400 rounded-full">{t.tag}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{t.title}</h4>
                  <p className="mt-1 text-xs text-earth-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-20 bg-earth-900/50">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-14">
              <span className="section-tag mb-4">Pricing</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                Start free. <span className="gradient-text">Go Pro when ready.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PRICING_TIERS.map(tier => (
                <div key={tier.name} className={`card relative ${tier.color} ${tier.badge ? 'border-2 scale-[1.02] md:scale-105' : ''}`}>
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                      {tier.badge}
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold text-white">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="text-earth-500 text-sm">{tier.period}</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="h-4 w-4 text-forest-500 flex-shrink-0 mt-0.5" />
                        <span className="text-earth-300">{f}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={tier.name === 'Enterprise' ? 'mailto:enterprise@afriflowai.com' : WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${tier.ctaStyle} w-full flex items-center justify-center gap-2`}
                  >
                    {tier.name !== 'Enterprise' && <MessageCircle className="h-4 w-4" />}
                    {tier.cta}
                  </a>
                </div>
              ))}
            </div>

            <p className="text-center text-earth-600 text-xs mt-6">
              All prices in USD. Pay via M-Pesa, Paystack, Flutterwave, or card. Cancel anytime.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center mb-12">
              <span className="section-tag mb-4">FAQ</span>
              <h2 className="font-display text-3xl font-bold text-white">Common Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Do I need a smartphone?',
                  a: 'You need WhatsApp, which runs on Android, iPhone, and even some feature phones via WhatsApp Lite. As long as you can send a WhatsApp message, you can learn.',
                },
                {
                  q: 'How much data does it use?',
                  a: 'Each lesson uses less than 50KB of data \u2014 about 100x less than watching a YouTube video. You can complete the entire free track for less than 1MB.',
                },
                {
                  q: 'Is the free track really free?',
                  a: 'Yes. The AI Foundations track (5 lessons + quizzes + certificate) is 100% free, forever. No trial period, no credit card, no hidden costs.',
                },
                {
                  q: 'Can I learn in my language?',
                  a: 'We support 10 languages: English, French, Kiswahili, Hausa, Yor\u00f9b\u00e1, Amharic, Twi, Pidgin, with isiZulu and Wolof coming soon. Send "LANGUAGE" to switch anytime.',
                },
                {
                  q: 'Are the certificates recognised?',
                  a: 'AfriFlow AI certificates are blockchain-verified and accepted by 200+ companies across Africa. Each certificate has a unique verification link you can share on LinkedIn.',
                },
                {
                  q: 'Can I use this for my team/company?',
                  a: 'Yes! Our Enterprise plan supports up to 50 team members with custom onboarding, admin analytics, and branded certificates. Contact enterprise@afriflowai.com.',
                },
                {
                  q: 'What if I get stuck on a lesson?',
                  a: 'Send "HELP" for commands, "REPEAT" to hear a lesson again, or "HINT" for quiz help. Pro members get priority WhatsApp support from human tutors.',
                },
              ].map((faq, i) => (
                <details key={i} className="group card cursor-pointer">
                  <summary className="flex items-center justify-between font-medium text-white list-none">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-earth-500 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm text-earth-400 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* MEGA CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="card-glow rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-forest-500/5 to-brand-500/5 pointer-events-none" />
              <div className="relative">
                <div className="flex justify-center gap-3 mb-6">
                  <span className="text-5xl">{'\ud83d\udcf1'}</span>
                  <span className="text-5xl">{'\ud83e\udd16'}</span>
                  <span className="text-5xl">{'\ud83c\udf0d'}</span>
                </div>
                <h2 className="font-display text-3xl lg:text-5xl font-bold text-white leading-tight">
                  67,000 Africans are<br />
                  already learning AI<br />
                  on <span className="gradient-text">WhatsApp</span>
                </h2>
                <p className="mt-4 text-lg text-earth-400 max-w-xl mx-auto">
                  It takes 30 seconds. One message. No signup. No download.
                  Just AI skills delivered to the phone in your pocket.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-3 text-xl px-10 py-5"
                  >
                    <MessageCircle className="h-7 w-7" />
                    Start on WhatsApp {'\u2014'} Free
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-earth-500">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> No credit card</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> Works on 2G</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> 10 languages</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-forest-500" /> Free forever tier</span>
                </div>

                <p className="mt-8 text-earth-600 text-xs">
                  or message <span className="font-mono text-earth-400">{WHATSAPP_NUMBER}</span> from any WhatsApp account
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LINK TO FULL COURSES */}
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="p-8 rounded-2xl border border-earth-800 bg-earth-900/50">
              <h3 className="font-display text-xl font-bold text-white">Want deeper learning?</h3>
              <p className="mt-2 text-earth-400 text-sm">
                WhatsApp Academy gives you the essentials. For full courses with projects, labs, and mentorship:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link href="/courses" className="btn-secondary flex items-center gap-2 text-sm">
                  Browse Full Courses <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/lab" className="btn-secondary flex items-center gap-2 text-sm">
                  AI Automation Labs <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/paths" className="btn-secondary flex items-center gap-2 text-sm">
                  Learning Paths <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
