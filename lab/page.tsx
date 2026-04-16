'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  Zap, Lock, CheckCircle, Clock, ChevronRight, PlayCircle, Star,
  Code2, Cpu, Globe, Wrench, ArrowRight, BookOpen, Users,
  BarChart3, Search, Filter, Terminal, Layers, Rocket
} from 'lucide-react'
import Link from 'next/link'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

const ALL_LABS = [
  { id: 'whatsapp-bot', title: 'WhatsApp Customer Support Bot', desc: 'Build a 24/7 auto-reply bot that handles customer FAQs for your business using Make + WhatsApp Business API.', difficulty: 'Beginner' as Difficulty, time: '45 min', tools: ['WhatsApp Business API', 'Make'], free: true, icon: '💬', category: 'Automation', completions: 3421 },
  { id: 'invoice-gen', title: 'Auto Invoice Generator', desc: 'Automatically create and send professional invoices when a sale is made. Google Sheets + Zapier + Gmail.', difficulty: 'Beginner' as Difficulty, time: '30 min', tools: ['Google Sheets', 'Zapier', 'Gmail'], free: true, icon: '🧾', category: 'Finance', completions: 2180 },
  { id: 'lead-capture', title: 'Lead Capture & Email Follow-up', desc: 'Capture leads from your website, push to Airtable, and auto-send a 5-step personalised email sequence.', difficulty: 'Intermediate' as Difficulty, time: '60 min', tools: ['Google Forms', 'Make', 'Airtable'], free: false, icon: '🎯', category: 'Marketing', completions: 1890 },
  { id: 'social-scheduler', title: 'Social Media Auto-Poster', desc: 'Write content once in a Google Sheet, schedule automatic posts across Facebook, Instagram, and X.', difficulty: 'Beginner' as Difficulty, time: '40 min', tools: ['Buffer', 'Zapier', 'Google Sheets'], free: false, icon: '📱', category: 'Marketing', completions: 2670 },
  { id: 'ai-chatbot', title: 'Custom ChatGPT Business Bot', desc: 'Build a GPT-4o powered chatbot trained on your business data — products, prices, FAQs — with no code.', difficulty: 'Intermediate' as Difficulty, time: '90 min', tools: ['OpenAI API', 'n8n', 'Supabase'], free: false, icon: '🤖', category: 'AI', completions: 1340 },
  { id: 'cv-screener', title: 'AI CV Screening Pipeline', desc: 'Automatically screen job applications, score CVs against your criteria, and shortlist candidates — zero manual work.', difficulty: 'Intermediate' as Difficulty, time: '75 min', tools: ['Claude API', 'Make', 'Airtable'], free: false, icon: '📋', category: 'HR', completions: 980 },
  { id: 'inventory-alert', title: 'Low-Stock Inventory Alert Bot', desc: 'Connect your Google Sheet inventory to WhatsApp — get instant alerts when stock drops below threshold.', difficulty: 'Beginner' as Difficulty, time: '35 min', tools: ['Google Sheets', 'Make', 'WhatsApp'], free: true, icon: '📦', category: 'Operations', completions: 1560 },
  { id: 'content-writer', title: 'AI Content Writing Machine', desc: 'Feed a topic, target audience, and tone — get SEO blog posts, social captions, and ads generated automatically.', difficulty: 'Beginner' as Difficulty, time: '25 min', tools: ['ChatGPT API', 'Notion', 'Make'], free: false, icon: '✍️', category: 'AI', completions: 3100 },
  { id: 'payment-notifier', title: 'Payment Received Notifier', desc: 'When a client pays via Paystack, auto-send a WhatsApp receipt and update your Google Sheets ledger.', difficulty: 'Intermediate' as Difficulty, time: '50 min', tools: ['Paystack', 'Make', 'WhatsApp'], free: false, icon: '💳', category: 'Finance', completions: 870 },
  { id: 'python-openai', title: 'Python + OpenAI API Quickstart', desc: 'Write your first Python script that calls GPT-4o, processes responses, and logs results to a database.', difficulty: 'Advanced' as Difficulty, time: '120 min', tools: ['Python', 'OpenAI API', 'SQLite'], free: false, icon: '🐍', category: 'Development', completions: 760 },
  { id: 'data-summarizer', title: 'AI Data Summarizer & Report Writer', desc: 'Upload a CSV of sales data — get an AI-written executive summary with key insights and recommendations.', difficulty: 'Intermediate' as Difficulty, time: '45 min', tools: ['Claude API', 'Python', 'Pandas'], free: false, icon: '📊', category: 'Data', completions: 1120 },
  { id: 'n8n-agent', title: 'Build an AI Agent with n8n', desc: 'Build a fully autonomous AI agent that can search the web, send emails, and update spreadsheets — no code required.', difficulty: 'Advanced' as Difficulty, time: '150 min', tools: ['n8n', 'OpenAI', 'Serper API'], free: false, icon: '🤯', category: 'AI', completions: 540 },
]

const CATEGORIES = ['All', 'Automation', 'AI', 'Marketing', 'Finance', 'Operations', 'HR', 'Development', 'Data']
const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced']
const DIFF_COLORS: Record<Difficulty, string> = {
  Beginner: 'text-forest-400 bg-forest-500/10 border-forest-500/20',
  Intermediate: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  Advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

const TOOLS_FEATURED = [
  { name: 'Make (Integromat)', icon: '⚙️', desc: 'Visual automation platform. Connect 2,000+ apps without code.', free: true, learnLink: '/courses?q=make' },
  { name: 'Zapier', icon: '⚡', desc: 'The easiest way to automate repetitive tasks between apps.', free: true, learnLink: '/courses?q=zapier' },
  { name: 'n8n', icon: '🔁', desc: 'Open-source workflow automation. Self-host or use their cloud.', free: true, learnLink: '/courses?q=n8n' },
  { name: 'OpenAI API', icon: '🧠', desc: 'Programmatic access to GPT-4o, DALL·E, Whisper, and more.', free: false, learnLink: '/courses?q=openai' },
  { name: 'WhatsApp Business API', icon: '💬', desc: 'Build bots and automated messaging for your business.', free: true, learnLink: '/courses?q=whatsapp' },
  { name: 'Airtable', icon: '📋', desc: 'Database meets spreadsheet. Perfect as a no-code backend.', free: true, learnLink: '/courses?q=airtable' },
]

export default function LabPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDiff, setActiveDiff] = useState<string>('All')
  const [searchQ, setSearchQ] = useState('')

  const filtered = ALL_LABS.filter(lab => {
    const matchCat = activeCategory === 'All' || lab.category === activeCategory
    const matchDiff = activeDiff === 'All' || lab.difficulty === activeDiff
    const matchSearch = lab.title.toLowerCase().includes(searchQ.toLowerCase()) || lab.desc.toLowerCase().includes(searchQ.toLowerCase())
    return matchCat && matchDiff && matchSearch
  })

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-20 bg-earth-900 border-b border-earth-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[300px] glow-orb bg-brand-500/8 -translate-y-1/2" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-6"><Terminal size={14} /> Automation Lab</span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Build real AI automations.<br />
              <span className="gradient-text">Step by step.</span>
            </h1>
            <p className="text-earth-400 text-xl mb-8 max-w-2xl mx-auto">
              Hands-on projects with real tools. Build something that works by the end of each lab — from 25 minutes to 2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register" className="btn-primary py-4 px-8 text-base">
                <PlayCircle size={18} /> Start a free lab
              </Link>
              <Link href="/pricing" className="btn-secondary py-4 px-8 text-base">
                Unlock all labs <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-earth-400">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-forest-400" /> {ALL_LABS.filter(l => l.free).length} free labs</span>
              <span className="flex items-center gap-2"><Zap size={14} className="text-brand-400" /> {ALL_LABS.length} total projects</span>
              <span className="flex items-center gap-2"><Users size={14} className="text-purple-400" /> 12,400+ completions</span>
              <span className="flex items-center gap-2"><Star size={14} className="text-amber-400" /> 4.9 avg rating</span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* SEARCH + FILTERS */}
          <section>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500" />
                <input
                  type="text"
                  placeholder="Search labs by tool, topic, or keyword..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="input-field pl-11 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-earth-500" />
                <span className="text-earth-500 text-sm">Difficulty:</span>
                {(['All', ...DIFFICULTIES]).map(d => (
                  <button key={d} onClick={() => setActiveDiff(d)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${activeDiff === d ? 'bg-brand-500/10 border-brand-500/40 text-brand-400' : 'border-earth-700 text-earth-500 hover:border-earth-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-4 py-2 rounded-xl border transition-all ${activeCategory === cat ? 'bg-brand-500/10 border-brand-500/40 text-brand-300' : 'border-earth-800 text-earth-500 hover:border-earth-700 hover:text-earth-300'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-earth-500">
                <Terminal size={40} className="mx-auto mb-4 opacity-30" />
                <p>No labs match your filters. Try adjusting.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(lab => (
                  <div key={lab.id} className="card-glow flex flex-col group">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{lab.icon}</span>
                      <div className="flex items-center gap-2">
                        {!lab.free && <Lock size={14} className="text-earth-500" />}
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${DIFF_COLORS[lab.difficulty]}`}>{lab.difficulty}</span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-brand-300 transition-colors leading-snug">{lab.title}</h3>
                    <p className="text-earth-500 text-sm leading-relaxed flex-1 mb-4">{lab.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {lab.tools.map(tool => (
                        <span key={tool} className="bg-earth-800 text-earth-400 text-xs px-2.5 py-1 rounded-lg border border-earth-700">{tool}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-earth-800">
                      <div className="flex items-center gap-3 text-xs text-earth-500">
                        <span className="flex items-center gap-1"><Clock size={11} /> {lab.time}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {lab.completions.toLocaleString()}</span>
                      </div>
                      {lab.free ? (
                        <Link href={`/lab/${lab.id}`} className="text-brand-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                          Start free <ChevronRight size={14} />
                        </Link>
                      ) : (
                        <Link href="/pricing" className="text-earth-500 text-sm flex items-center gap-1 hover:text-earth-300 transition-colors">
                          <Lock size={12} /> Premium
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* TOOLS DIRECTORY */}
          <section>
            <div className="text-center mb-12">
              <span className="section-tag mb-4"><Wrench size={14} /> Tools Directory</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Every tool we use in the lab</h2>
              <p className="text-earth-400 max-w-xl mx-auto">Master these tools and you can automate almost anything. Most have generous free tiers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS_FEATURED.map(tool => (
                <div key={tool.name} className="card group hover:border-brand-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="text-white font-semibold">{tool.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tool.free ? 'text-forest-400 bg-forest-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                      {tool.free ? 'Free tier' : 'Paid'}
                    </span>
                  </div>
                  <p className="text-earth-500 text-sm mb-4">{tool.desc}</p>
                  <Link href={tool.learnLink} className="text-brand-400 text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    <BookOpen size={13} /> Learn with it <ChevronRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* LEARNING PATH CTA */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'New to automation?', desc: 'Start with the free WhatsApp bot lab. 45 minutes, no experience needed.', cta: 'Start free lab', href: '/lab/whatsapp-bot', color: 'border-forest-500/30 bg-forest-500/5' },
              { icon: Layers, title: 'Ready to go deeper?', desc: 'Unlock all 12 premium labs and build a complete AI automation portfolio.', cta: 'View Premium', href: '/pricing', color: 'border-brand-500/30 bg-brand-500/5' },
              { icon: Rocket, title: 'Build for clients?', desc: 'Learn to package your lab skills as paid services and land your first client.', cta: 'AI Freelancer path', href: '/paths', color: 'border-purple-500/30 bg-purple-500/5' },
            ].map(card => {
              const Icon = card.icon
              return (
                <div key={card.title} className={`card border ${card.color}`}>
                  <Icon size={28} className="text-earth-300 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-earth-400 text-sm mb-6">{card.desc}</p>
                  <Link href={card.href} className="btn-secondary py-2.5 text-sm">
                    {card.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
