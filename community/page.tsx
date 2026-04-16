'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  Users, MessageSquare, Globe, Calendar, Trophy, Zap, ArrowRight,
  Search, Heart, Eye, ChevronRight, Star, MapPin, TrendingUp,
  Flame, Award, BookOpen, ExternalLink, Video, Mic
} from 'lucide-react'
import Link from 'next/link'

const CHAPTERS = [
  { country: '🇬�� Ghana', members: 1240, city: 'Accra · Kumasi', active: true, lead: 'Kofi Mensah' },
  { country: '🇳🇬 Nigeria', members: 3102, city: 'Lagos · Abuja · PH', active: true, lead: 'Amaka Obi' },
  { country: '🇰🇪 Kenya', members: 1890, city: 'Nairobi · Mombasa', active: true, lead: 'Wanjiru Kamau' },
  { country: '🇿🇦 South Africa', members: 980, city: 'Cape Town · Joburg', active: true, lead: 'Sipho Dlamini' },
  { country: '🇷🇼 Rwanda', members: 560, city: 'Kigali', active: true, lead: 'Aimé Ndayisenga' },
  { country: '🇪🇹 Ethiopia', members: 430, city: 'Addis Ababa', active: false, lead: 'Coming soon' },
  { country: '🇹🇿 Tanzania', members: 310, city: 'Dar es Salaam', active: false, lead: 'Coming soon' },
  { country: '🇸🇳 Senegal', members: 290, city: 'Dakar', active: false, lead: 'Coming soon' },
]

const FORUM_POSTS = [
  { title: 'How I automated my tailoring shop with AI — step by step breakdown', replies: 34, views: 1240, tag: 'Success Story', tagColor: 'text-forest-400 bg-forest-500/10', time: '2h ago', author: 'Adaeze K.', authorInitials: 'AK', likes: 89 },
  { title: 'Which AI tools actually work on slow internet in rural areas?', replies: 28, views: 890, tag: 'Tools', tagColor: 'text-brand-400 bg-brand-500/10', time: '5h ago', author: 'Mwangi J.', authorInitials: 'MJ', likes: 62 },
  { title: 'Getting my first freelance AI client — what worked for me', replies: 52, views: 2100, tag: 'Freelancing', tagColor: 'text-purple-400 bg-purple-500/10', time: '1d ago', author: 'Fatima S.', authorInitials: 'FS', likes: 143 },
  { title: 'WhatsApp bot tutorial for church membership management', replies: 19, views: 670, tag: 'Tutorial', tagColor: 'text-amber-400 bg-amber-500/10', time: '1d ago', author: 'Pastor Dele', authorInitials: 'PD', likes: 47 },
  { title: 'Is Claude or ChatGPT better for writing in Twi and Yoruba?', replies: 41, views: 1500, tag: 'Discussion', tagColor: 'text-earth-400 bg-earth-700/50', time: '2d ago', author: 'Kweku A.', authorInitials: 'KA', likes: 98 },
  { title: 'I made $800 last month selling AI content services — my exact system', replies: 67, views: 3200, tag: 'Income Report', tagColor: 'text-forest-400 bg-forest-500/10', time: '3d ago', author: 'Chidi N.', authorInitials: 'CN', likes: 211 },
]

const EVENTS = [
  { title: 'Live Q&A: Getting your first AI freelance client', date: 'Sat, April 5 · 6PM WAT', type: 'Live Webinar', free: true, host: 'Kwame A.', hostInitials: 'KA', attendees: 234, icon: Video },
  { title: 'Workshop: Build a WhatsApp bot in 2 hours (beginner-friendly)', date: 'Tue, April 8 · 7PM EAT', type: 'Workshop', free: false, host: 'Wanjiru K.', hostInitials: 'WK', attendees: 89, icon: Mic },
  { title: 'AfriFlow AI Hackathon — $2,500 in prizes!', date: 'April 19–20, 2026', type: 'Hackathon', free: true, host: 'AfriFlow Team', hostInitials: 'AF', attendees: 512, icon: Trophy },
  { title: 'Panel: Women in AI across Africa — careers, income, and impact', date: 'Wed, April 23 · 5PM WAT', type: 'Panel', free: true, host: 'Amaka O.', hostInitials: 'AO', attendees: 345, icon: Users },
]

const LEADERBOARD = [
  { rank: 1, name: 'Chidi Nwachukwu', country: '🇳🇬', points: 4820, courses: 12, badge: 'AI Master', streak: 47 },
  { rank: 2, name: 'Wanjiru Kamau', country: '🇰🇪', points: 4210, courses: 11, badge: 'Top Mentor', streak: 38 },
  { rank: 3, name: 'Adaeze Kelechi', country: '🇳🇬', points: 3890, courses: 10, badge: 'Builder', streak: 31 },
  { rank: 4, name: 'Sipho Dlamini', country: '🇿🇦', points: 3670, courses: 9, badge: 'Automator', streak: 28 },
  { rank: 5, name: 'Kofi Mensah', country: '🇬🇭', points: 3240, courses: 8, badge: 'Freelancer', streak: 22 },
]

const MENTORS = [
  { name: 'Dr. Amara Jalloh', specialty: 'AI Strategy & Enterprise', country: '🇸🇱 Sierra Leone', sessions: 87, rating: 4.9, initials: 'AJ' },
  { name: 'Tunde Fashola', specialty: 'AI Freelancing & Income', country: '🇳🇬 Nigeria', sessions: 124, rating: 5.0, initials: 'TF' },
  { name: 'Grace Mutuku', specialty: 'Automation & No-Code', country: '🇰🇪 Kenya', sessions: 63, rating: 4.8, initials: 'GM' },
  { name: 'Youssef Berrada', specialty: 'AI for Finance & Fintech', country: '🇲🇦 Morocco', sessions: 45, rating: 4.9, initials: 'YB' },
]

const STATS = [
  { value: '24,000+', label: 'Members', icon: Users },
  { value: '12', label: 'Countries', icon: Globe },
  { value: '340+', label: 'Forum threads', icon: MessageSquare },
  { value: '48', label: 'Events this year', icon: Calendar },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'forum' | 'events' | 'leaderboard' | 'mentors'>('forum')
  const [search, setSearch] = useState('')

  const filteredPosts = FORUM_POSTS.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tag.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-20 bg-earth-900 border-b border-earth-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] glow-orb bg-forest-500/8" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-6"><Globe size={14} /> Community Hub</span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              You&apos;re not learning alone —<br />
              <span className="gradient-text">Africa learns together</span>
            </h1>
            <p className="text-earth-400 text-xl mb-8 max-w-2xl mx-auto">
              Connect with 24,000+ AI learners. Join your country chapter, find a mentor, share wins, and accelerate your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register" className="btn-primary py-4 px-8 text-base">
                <Users size={18} /> Join the Community
              </Link>
              <Link href="#chapters" className="btn-secondary py-4 px-8 text-base">
                <Globe size={18} /> Find your chapter
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {STATS.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="text-center">
                    <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                    <p className="text-earth-500 text-sm flex items-center gap-1 justify-center">
                      <Icon size={12} /> {s.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* MAIN TABS */}
          <section>
            <div className="flex flex-wrap gap-2 border-b border-earth-800 mb-8 pb-px">
              {[
                { key: 'forum', label: 'Forum', icon: MessageSquare },
                { key: 'events', label: 'Events', icon: Calendar },
                { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { key: 'mentors', label: 'Mentors', icon: Star },
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-xl border-b-2 transition-all -mb-px ${activeTab === tab.key ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-earth-500 hover:text-earth-300'}`}>
                    <Icon size={15} /> {tab.label}
                  </button>
                )
              })}
            </div>

            {/* FORUM TAB */}
            {activeTab === 'forum' && (
              <div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500" />
                    <input type="text" placeholder="Search discussions..." value={search}
                      onChange={e => setSearch(e.target.value)} className="input-field pl-11 w-full" />
                  </div>
                  <Link href="/auth/register" className="btn-primary whitespace-nowrap">
                    <Zap size={15} /> New Post
                  </Link>
                </div>
                <div className="space-y-3">
                  {filteredPosts.map((post, i) => (
                    <div key={i} className="card group hover:border-earth-700 transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 bg-earth-800 rounded-full flex items-center justify-center text-earth-400 font-bold text-xs flex-shrink-0">
                          {post.authorInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${post.tagColor}`}>{post.tag}</span>
                            <span className="text-earth-600 text-xs">{post.time}</span>
                          </div>
                          <h3 className="text-white font-medium group-hover:text-brand-300 transition-colors leading-snug mb-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-5 text-xs text-earth-600">
                            <span className="flex items-center gap-1"><Heart size={11} /> {post.likes}</span>
                            <span className="flex items-center gap-1"><MessageSquare size={11} /> {post.replies} replies</span>
                            <span className="flex items-center gap-1"><Eye size={11} /> {post.views.toLocaleString()} views</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-earth-700 group-hover:text-brand-400 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/auth/register" className="btn-secondary">
                    Join to see all discussions <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {EVENTS.map((event, i) => {
                  const Icon = event.icon
                  return (
                    <div key={i} className="card group hover:border-earth-700 transition-all">
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon size={22} className="text-brand-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="bg-earth-800 text-earth-400 text-xs px-2.5 py-0.5 rounded-full">{event.type}</span>
                            {event.free
                              ? <span className="text-forest-400 text-xs bg-forest-500/10 px-2 py-0.5 rounded-full">Free</span>
                              : <span className="text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full">Premium</span>
                            }
                          </div>
                          <h3 className="text-white font-semibold mb-1 group-hover:text-brand-300 transition-colors">{event.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-earth-500">
                            <span className="flex items-center gap-1"><Calendar size={13} /> {event.date}</span>
                            <span className="flex items-center gap-1"><Users size={13} /> {event.attendees} registered</span>
                            <span className="flex items-center gap-1">Host: {event.host}</span>
                          </div>
                        </div>
                        <Link href="/auth/register" className="btn-primary py-2 px-4 text-sm whitespace-nowrap flex-shrink-0">
                          RSVP
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <div>
                <div className="space-y-3 mb-6">
                  {LEADERBOARD.map((member) => (
                    <div key={member.rank} className={`card flex items-center gap-5 ${member.rank <= 3 ? 'border-brand-500/20 bg-brand-500/3' : ''}`}>
                      <span className={`font-display text-2xl font-black w-8 text-center flex-shrink-0 ${member.rank === 1 ? 'text-amber-400' : member.rank === 2 ? 'text-earth-300' : member.rank === 3 ? 'text-amber-700' : 'text-earth-600'}`}>
                        {member.rank}
                      </span>
                      <div className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center text-earth-300 font-bold text-sm flex-shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{member.name}</span>
                          <span className="text-lg">{member.country}</span>
                          <span className="text-xs bg-earth-800 text-earth-400 px-2 py-0.5 rounded-full">{member.badge}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-earth-500 mt-0.5">
                          <span><BookOpen size={10} className="inline mr-1" />{member.courses} courses</span>
                          <span><Flame size={10} className="inline mr-1 text-brand-400" />{member.streak}-day streak</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display text-xl font-bold text-brand-400">{member.points.toLocaleString()}</p>
                        <p className="text-earth-600 text-xs">XP points</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card bg-earth-900/50 border-dashed text-center py-8">
                  <TrendingUp size={32} className="mx-auto mb-3 text-earth-600" />
                  <p className="text-white font-medium mb-1">Your rank: —</p>
                  <p className="text-earth-500 text-sm mb-4">Join to earn XP and appear on the leaderboard</p>
                  <Link href="/auth/register" className="btn-primary inline-flex">
                    Start earning XP <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}

            {/* MENTORS TAB */}
            {activeTab === 'mentors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MENTORS.map((mentor, i) => (
                  <div key={i} className="card-glow flex items-start gap-4">
                    <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-300 font-bold text-lg flex-shrink-0">
                      {mentor.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-semibold">{mentor.name}</h3>
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                          <Star size={12} className="fill-amber-400" /> {mentor.rating}
                        </div>
                      </div>
                      <p className="text-brand-400 text-sm mb-1">{mentor.specialty}</p>
                      <div className="flex items-center gap-3 text-xs text-earth-500 mb-4">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {mentor.country}</span>
                        <span><Users size={11} className="inline mr-1" />{mentor.sessions} sessions done</span>
                      </div>
                      <Link href="/auth/register" className="btn-secondary text-sm py-2">
                        Book a session <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="card border-dashed text-center py-8 col-span-full lg:col-span-2">
                  <Award size={32} className="mx-auto mb-3 text-earth-600" />
                  <p className="text-white font-medium mb-1">Become a mentor</p>
                  <p className="text-earth-500 text-sm mb-4">Share your expertise and earn on AfriFlow Community</p>
                  <a href="mailto:mentors@afriflowai.com" className="btn-secondary inline-flex">
                    Apply to mentor <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* CHAPTERS */}
          <section id="chapters">
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><MapPin size={14} /> Chapters</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Find your country chapter</h2>
              <p className="text-earth-400 max-w-xl mx-auto">Weekly meetups, study groups, and local events — organized by members for members.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CHAPTERS.map((ch, i) => (
                <div key={i} className={`card text-center group hover:border-earth-600 transition-all ${ch.active ? '' : 'opacity-60'}`}>
                  <div className="text-2xl mb-2">{ch.country.split(' ')[0]}</div>
                  <p className="text-white text-sm font-medium mb-0.5">{ch.country.split(' ').slice(1).join(' ')}</p>
                  <p className="text-earth-500 text-xs mb-2">{ch.city}</p>
                  <p className="font-display text-xl font-bold text-brand-400">{ch.members.toLocaleString()}</p>
                  <p className="text-earth-600 text-xs mb-2">members</p>
                  {ch.active ? (
                    <span className="text-xs text-forest-400 bg-forest-500/10 px-2 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="text-xs text-earth-500 bg-earth-800 px-2 py-0.5 rounded-full">Growing</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-earth-900 border border-earth-800 p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] glow-orb bg-forest-500/10" />
            <div className="relative">
              <span className="section-tag mb-6"><Zap size={14} /> Join Now</span>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                24,000 Africans are already learning AI together.
              </h2>
              <p className="text-earth-400 text-lg mb-8 max-w-xl mx-auto">
                Create your free account, join your country chapter, and post your first question today.
              </p>
              <Link href="/auth/register" className="btn-primary py-4 px-10 text-base">
                <Users size={18} /> Join the community free
              </Link>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
