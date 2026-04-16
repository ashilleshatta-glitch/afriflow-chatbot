import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import { Heart, Globe, Users, BookOpen, Zap, ArrowRight, Star, Award, Target, Mail } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — AfriFlow AI | Our Mission to Empower Africa with AI',
  description: 'AfriFlow AI is building Africa\'s #1 AI learning platform. Meet our team, learn our mission, and see how we\'re empowering 24,000+ learners across 12+ countries.',
  openGraph: {
    title: 'About AfriFlow AI',
    description: 'Our mission: Make AI accessible to every African professional. Meet the team behind AfriFlow AI.',
  },
}

const TEAM = [
  {
    name: 'Kofi Asante',
    role: 'Founder & CEO',
    bio: 'Former software engineer at Google. Left to build AI education for Africa. Believes every African should have access to AI skills.',
    avatar: 'KA',
    country: '🇬🇭',
    color: 'from-brand-500 to-forest-500',
  },
  {
    name: 'Ngozi Okonkwo',
    role: 'Head of Curriculum',
    bio: 'EdTech veteran with 10+ years designing learning experiences. Previously at Andela and ALX. Ensures every course delivers real outcomes.',
    avatar: 'NO',
    country: '🇳🇬',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'David Kimani',
    role: 'CTO',
    bio: 'Full-stack engineer and AI enthusiast. Built the AfriFlow AI platform from the ground up. Passionate about accessible tech.',
    avatar: 'DK',
    country: '🇰🇪',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Amara Diallo',
    role: 'Head of Community',
    bio: 'Community builder and facilitator. Manages 24K+ learners across 12 African countries. Runs events, hackathons, and mentorship programs.',
    avatar: 'AD',
    country: '🇸🇳',
    color: 'from-forest-500 to-teal-500',
  },
]

const MILESTONES = [
  { year: '2024', event: 'AfriFlow AI founded with a mission to democratize AI education in Africa' },
  { year: '2024', event: 'Launched first 10 courses and the AI Foundations school' },
  { year: '2025', event: 'Reached 10,000 learners across 8 African countries' },
  { year: '2025', event: 'Launched AfriAI Coach — personalized AI learning assistant' },
  { year: '2025', event: 'Opened all 7 schools and launched certification program' },
  { year: '2026', event: '24,000+ learners, 50+ courses, community in 12+ countries' },
]

const PARTNERS = [
  'Google for Startups Africa',
  'Andela',
  'ALX Africa',
  'Flutterwave',
  'Paystack',
  'Africa\'s Talking',
  'TechStars Lagos',
  'Microsoft for Africa',
]

const PRESS = [
  { outlet: 'TechCrunch Africa', title: '"AfriFlow AI is making AI accessible to millions of Africans"', year: '2025' },
  { outlet: 'Disrupt Africa', title: '"The edtech startup bridging Africa\'s AI skills gap"', year: '2025' },
  { outlet: 'CNN Africa', title: '"How young Africans are building businesses with AI"', year: '2026' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-24 bg-earth-900 border-b border-earth-800">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 glow-orb bg-brand-500/10" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-4"><Heart size={14} /> Our Story</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              AI education built <span className="gradient-text">by Africa, for Africa</span>
            </h1>
            <p className="text-earth-400 text-xl max-w-2xl mx-auto leading-relaxed">
              We believe every African — from a student in Accra to a shop owner in Nairobi — deserves access to
              AI skills that can transform their life and livelihood.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          {/* Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag mb-4"><Target size={14} /> Our Mission</span>
              <h2 className="font-display text-3xl font-bold text-white mb-6">
                To make 10 million Africans AI-literate by 2030
              </h2>
              <p className="text-earth-400 leading-relaxed mb-4">
                Africa has the youngest population on Earth and the fastest-growing internet adoption.
                But AI education is still inaccessible — too expensive, too theoretical, and too disconnected
                from African realities.
              </p>
              <p className="text-earth-400 leading-relaxed mb-4">
                AfriFlow AI changes that. We build practical, affordable, Africa-specific AI education
                that connects directly to real earning opportunities. No computer science degree required.
              </p>
              <p className="text-earth-400 leading-relaxed">
                From WhatsApp automation for a market trader in Lagos to Python AI development for a
                graduate in Kigali — we meet learners where they are and take them where they want to go.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, value: '12+', label: 'African countries', color: 'text-brand-400', bg: 'bg-brand-500/10' },
                { icon: Users, value: '24K+', label: 'Active learners', color: 'text-forest-400', bg: 'bg-forest-500/10' },
                { icon: BookOpen, value: '50+', label: 'Courses & lessons', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Award, value: '4,100+', label: 'Certificates earned', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="card text-center">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon size={18} className={stat.color} />
                    </div>
                    <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-earth-500 text-sm mt-1">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-white mb-3">Our journey</h2>
              <p className="text-earth-400">From idea to Africa&apos;s largest AI education platform</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="relative pl-8 border-l-2 border-earth-800 space-y-8">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 bg-earth-950 border-2 border-brand-500 rounded-full" />
                    <span className="text-brand-400 text-sm font-medium">{m.year}</span>
                    <p className="text-earth-300 mt-1">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><Users size={14} /> The Team</span>
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                Built by people who <span className="gradient-text">understand Africa</span>
              </h2>
              <p className="text-earth-400">Our team spans 4 African countries and shares one vision.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((person) => (
                <div key={person.name} className="card text-center group hover:border-earth-700 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-br ${person.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {person.avatar}
                  </div>
                  <h3 className="text-white font-semibold">{person.name}</h3>
                  <p className="text-brand-400 text-sm mb-1">{person.role}</p>
                  <span className="text-lg">{person.country}</span>
                  <p className="text-earth-500 text-xs leading-relaxed mt-3">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-white mb-3">Our partners</h2>
              <p className="text-earth-400">We work with leading African and global tech organizations</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {PARTNERS.map(partner => (
                <span
                  key={partner}
                  className="px-6 py-3 bg-earth-900 border border-earth-800 text-earth-400 rounded-xl text-sm hover:text-white hover:border-earth-700 transition-all"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Press */}
          <div>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-white mb-3">In the press</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRESS.map((item, i) => (
                <div key={i} className="card hover:border-earth-700 transition-all">
                  <p className="text-brand-400 text-sm font-medium mb-2">{item.outlet}</p>
                  <p className="text-earth-300 text-sm leading-relaxed mb-3">{item.title}</p>
                  <span className="text-earth-600 text-xs">{item.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="relative rounded-2xl overflow-hidden border border-earth-700 bg-earth-900 p-12 text-center">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 glow-orb bg-brand-500/20" />
            <div className="relative">
              <div className="text-5xl mb-6">🌍</div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                Join the movement
              </h2>
              <p className="text-earth-400 text-lg mb-8 max-w-xl mx-auto">
                Whether you&apos;re a learner, mentor, partner, or investor — there&apos;s a place for you in Africa&apos;s AI future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn-primary py-3 px-8">
                  Start Learning Free <ArrowRight size={16} />
                </Link>
                <a href="mailto:hello@afriflowai.com" className="btn-secondary py-3 px-8">
                  <Mail size={16} /> Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
