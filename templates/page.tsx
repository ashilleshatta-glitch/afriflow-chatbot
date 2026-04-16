'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import {
  Download, Lock, Star, ArrowRight, Search, Filter,
  Copy, CheckCircle, Zap, Eye, Users, ChevronRight, ExternalLink
} from 'lucide-react'
import Link from 'next/link'

const TEMPLATES = [
  { id: 'wa-faq-bot', title: 'WhatsApp Business FAQ Bot', category: 'Automation', downloads: 1240, rating: 4.9, ratingCount: 87, free: true, format: 'Make Blueprint', icon: '💬', desc: 'Complete Make scenario that handles 20+ common FAQ responses. Plug in your business info, import the blueprint, connect WhatsApp — live in 20 minutes.', tags: ['WhatsApp', 'Make', 'Customer Service'] },
  { id: 'freelance-proposal', title: 'AI Freelance Proposal Template', category: 'Business', downloads: 890, rating: 4.8, ratingCount: 62, free: true, format: 'Google Docs', icon: '📄', desc: '3-section proposal structure proven to win AI automation projects. Includes pricing table, scope, timeline, and terms. Editable in Google Docs.', tags: ['Freelancing', 'Proposals', 'Business'] },
  { id: 'content-calendar', title: 'AI Social Media Content Calendar', category: 'Creator', downloads: 2100, rating: 4.7, ratingCount: 134, free: true, format: 'Notion', icon: '📅', desc: '12-week social media plan with AI-generated post ideas. Includes caption prompts for ChatGPT and image prompt starters for Midjourney.', tags: ['Social Media', 'Content', 'Notion'] },
  { id: 'client-onboarding', title: 'Client Onboarding Automation', category: 'Automation', downloads: 670, rating: 4.9, ratingCount: 48, free: false, format: 'Zapier Blueprint', icon: '🚀', desc: 'Full Zapier workflow: client fills form → Airtable CRM updated → welcome email sent → calendar invite created → Slack notification. Everything automated.', tags: ['Zapier', 'Airtable', 'Onboarding'] },
  { id: 'agency-pricing', title: 'AI Agency Pricing Sheet', category: 'Business', downloads: 540, rating: 4.8, ratingCount: 41, free: false, format: 'Excel / Google Sheets', icon: '💰', desc: 'Done-for-you pricing table for AI services: chatbots, automation, content, consulting. Includes cost calculator and margin analysis.', tags: ['Pricing', 'Agency', 'Business'] },
  { id: 'lead-email-seq', title: 'Lead Capture + 5-Email Sequence', category: 'Marketing', downloads: 430, rating: 4.6, ratingCount: 35, free: false, format: 'Make Blueprint + Google Docs', icon: '🎯', desc: 'Make automation that captures leads from any form + 5 pre-written follow-up emails with delay logic. Proven 40% open rate sequence.', tags: ['Email', 'Marketing', 'Lead Gen'] },
  { id: 'church-bot', title: 'Church Member Follow-up Bot', category: 'Community', downloads: 380, rating: 4.9, ratingCount: 28, free: false, format: 'n8n Workflow', icon: '⛪', desc: 'n8n workflow that sends automated weekly devotionals, event reminders, and birthday wishes to church members via WhatsApp. Bible verse API integrated.', tags: ['WhatsApp', 'n8n', 'Church'] },
  { id: 'school-fees', title: 'School Fee Reminder Automation', category: 'Education', downloads: 290, rating: 4.7, ratingCount: 22, free: false, format: 'Make Blueprint', icon: '🎓', desc: 'Checks Google Sheets for outstanding fee balance, sends automated WhatsApp reminders to parents 7, 3, and 1 day before due date.', tags: ['Education', 'Make', 'Finance'] },
  { id: 'invoice-gen', title: 'Invoice Auto-Generator', category: 'Finance', downloads: 760, rating: 4.8, ratingCount: 54, free: false, format: 'Google Sheets + Zapier', icon: '🧾', desc: 'Add a row to your Google Sheet → professional PDF invoice created → emailed to client automatically. Includes your logo, payment terms, and line items.', tags: ['Invoice', 'Finance', 'Automation'] },
  { id: 'chatgpt-prompts', title: '100 African Business ChatGPT Prompts', category: 'AI Prompts', downloads: 3400, rating: 4.9, ratingCount: 198, free: true, format: 'Notion / PDF', icon: '��', desc: '100 battle-tested ChatGPT prompts for African businesses: marketing copy, business plans, customer replies, content creation, and more. Categorized by use case.', tags: ['ChatGPT', 'Prompts', 'Business'] },
  { id: 'sop-templates', title: 'AI SOP Builder (5 templates)', category: 'Operations', downloads: 510, rating: 4.7, ratingCount: 38, free: false, format: 'Notion', icon: '📋', desc: '5 Standard Operating Procedure templates for AI-enhanced workflows: customer service, content production, sales follow-up, HR onboarding, and weekly reporting.', tags: ['SOP', 'Operations', 'Notion'] },
  { id: 'n8n-agent', title: 'AI Research Agent (n8n)', category: 'AI Agents', downloads: 190, rating: 4.8, ratingCount: 14, free: false, format: 'n8n Workflow', icon: '🤯', desc: 'Autonomous n8n agent that takes a research topic → searches the web → reads top 5 pages → writes a 500-word summary → sends to your email. Fully automated.', tags: ['n8n', 'AI Agent', 'Research'] },
]

const CATEGORIES = ['All', 'Automation', 'Business', 'Marketing', 'AI Prompts', 'Creator', 'Finance', 'Education', 'Community', 'Operations', 'AI Agents']

type SortKey = 'downloads' | 'rating' | 'newest'
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'downloads', label: 'Most Downloaded' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'newest', label: 'Newest' },
]

export default function TemplatesPage() {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<SortKey>('downloads')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = TEMPLATES
    .filter(t => {
      const matchCat = category === 'All' || t.category === category
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSearch
    })
    .sort((a, b) => {
      if (sort === 'downloads') return b.downloads - a.downloads
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://afriflowai.com/templates/${id}`)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* HERO */}
        <section className="relative py-20 bg-earth-900 border-b border-earth-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] glow-orb bg-brand-500/8" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-6"><Download size={14} /> Templates & Blueprints</span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Don&apos;t start from scratch.<br />
              <span className="gradient-text">Download & deploy.</span>
            </h1>
            <p className="text-earth-400 text-xl mb-8 max-w-2xl mx-auto">
              Ready-made automation blueprints, AI prompt packs, business templates, and workflow SOPs. Copy, import, and go live in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-earth-400">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-forest-400" /> {TEMPLATES.filter(t => t.free).length} free templates</span>
              <span className="flex items-center gap-2"><Download size={14} className="text-brand-400" /> {TEMPLATES.reduce((s, t) => s + t.downloads, 0).toLocaleString()}+ downloads</span>
              <span className="flex items-center gap-2"><Star size={14} className="text-amber-400" /> All rated 4.6+</span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* SEARCH + FILTERS */}
          <section>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500" />
                <input type="text" placeholder="Search templates by name, category, or tool..."
                  value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11 w-full" />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter size={15} className="text-earth-500" />
                {SORT_OPTIONS.map(s => (
                  <button key={s.key} onClick={() => setSort(s.key)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-all ${sort === s.key ? 'bg-brand-500/10 border-brand-500/40 text-brand-400' : 'border-earth-700 text-earth-500 hover:border-earth-600'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`text-sm px-4 py-2 rounded-xl border transition-all ${category === cat ? 'bg-brand-500/10 border-brand-500/40 text-brand-300' : 'border-earth-800 text-earth-500 hover:border-earth-700 hover:text-earth-300'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-earth-600 text-sm mb-6">{filtered.length} template{filtered.length !== 1 ? 's' : ''} found</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(t => (
                <div key={t.id} className="card-glow flex flex-col group">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{t.icon}</span>
                    <div className="flex items-center gap-2">
                      {t.free
                        ? <span className="text-xs text-forest-400 bg-forest-500/10 px-2.5 py-1 rounded-full border border-forest-500/20">Free</span>
                        : <span className="text-xs text-earth-500 bg-earth-800 px-2.5 py-1 rounded-full border border-earth-700 flex items-center gap-1"><Lock size={10} /> Premium</span>
                      }
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1.5 group-hover:text-brand-300 transition-colors leading-snug">{t.title}</h3>
                    <p className="text-earth-500 text-sm leading-relaxed mb-3">{t.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.tags.map(tag => (
                        <span key={tag} className="bg-earth-800 text-earth-400 text-xs px-2.5 py-0.5 rounded-lg border border-earth-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-earth-800 mb-4">
                    <div className="flex items-center gap-3 text-xs text-earth-500">
                      <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" /> {t.rating} ({t.ratingCount})</span>
                      <span className="flex items-center gap-1"><Download size={11} /> {t.downloads.toLocaleString()}</span>
                    </div>
                    <span className="text-xs bg-earth-800 text-earth-400 px-2 py-0.5 rounded border border-earth-700">{t.format}</span>
                  </div>
                  <div className="flex gap-2">
                    {t.free ? (
                      <button className="btn-primary flex-1 justify-center py-2.5 text-sm">
                        <Download size={14} /> Download free
                      </button>
                    ) : (
                      <Link href="/pricing" className="btn-secondary flex-1 justify-center py-2.5 text-sm">
                        <Lock size={13} /> Unlock with Premium
                      </Link>
                    )}
                    <button
                      onClick={() => handleCopyLink(t.id)}
                      className="card px-3 py-2.5 text-earth-500 hover:text-earth-300 transition-colors"
                      title="Copy link"
                    >
                      {copied === t.id ? <CheckCircle size={14} className="text-forest-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTRIBUTE BANNER */}
          <section className="card border-dashed text-center py-12">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Have a template to share?</h3>
            <p className="text-earth-400 mb-6 max-w-lg mx-auto">
              Submit your automation blueprint, prompt pack, or business template. Accepted contributors earn revenue share on premium downloads.
            </p>
            <a href="mailto:templates@afriflowai.com" className="btn-secondary inline-flex">
              Submit a template <ExternalLink size={14} />
            </a>
          </section>

          {/* UPSELL */}
          <section className="relative overflow-hidden rounded-3xl bg-earth-900 border border-earth-800 p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] glow-orb bg-brand-500/8" />
            <div className="relative">
              <span className="section-tag mb-6"><Zap size={14} /> Get All Templates</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                Unlock every template with Premium
              </h2>
              <p className="text-earth-400 text-lg mb-8 max-w-xl mx-auto">
                {TEMPLATES.filter(t => !t.free).length} premium templates + all courses + AfriAI Coach. Less than a coffee per day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing" className="btn-primary py-4 px-10 text-base">
                  <Download size={18} /> Get all templates — $15/mo
                </Link>
                <Link href="/pricing" className="btn-secondary py-4 px-10 text-base">
                  See all plans <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
