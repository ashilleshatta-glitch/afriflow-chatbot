import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Building2, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Jobs — AfriFlow AI | Find AI Careers in Africa',
  description: 'Browse AI and automation job opportunities across Africa. Remote and on-site roles in Ghana, Nigeria, Kenya, South Africa, and more.',
  openGraph: {
    title: 'AI Jobs — AfriFlow AI',
    description: 'AI careers and automation jobs across Africa. Find your next opportunity.',
  },
}

const JOBS = [
  {
    title: 'AI Automation Specialist',
    company: 'TechWave Solutions',
    location: '🇬🇭 Accra, Ghana',
    type: 'Full-time',
    salary: '$800–1,500/mo',
    posted: '2 days ago',
    tags: ['Zapier', 'Make', 'WhatsApp API', 'No-Code'],
    description: 'Help SME clients automate their business workflows using no-code tools. Build WhatsApp bots, email sequences, and CRM integrations.',
    remote: true,
    level: 'Entry-level',
    icon: '⚡',
  },
  {
    title: 'AI Content Strategist',
    company: 'MediaHouse Africa',
    location: '🇳🇬 Lagos, Nigeria',
    type: 'Full-time',
    salary: '$600–1,200/mo',
    posted: '1 day ago',
    tags: ['ChatGPT', 'Content Strategy', 'Social Media', 'SEO'],
    description: 'Lead AI-powered content creation for our pan-African media clients. Use AI tools to produce high-quality content at scale.',
    remote: false,
    level: 'Mid-level',
    icon: '✍️',
  },
  {
    title: 'AI Consultant (Freelance)',
    company: 'Multiple Clients',
    location: '🌍 Remote (Africa)',
    type: 'Freelance',
    salary: '$50–150/project',
    posted: '3 days ago',
    tags: ['Consulting', 'AI Strategy', 'Training', 'Automation'],
    description: 'Consult with African businesses on AI adoption. Conduct AI audits, recommend tools, and train teams on implementation.',
    remote: true,
    level: 'Mid-level',
    icon: '📊',
  },
  {
    title: 'WhatsApp Bot Developer',
    company: 'ChatConnect Ltd',
    location: '🇰🇪 Nairobi, Kenya',
    type: 'Contract',
    salary: '$1,000–2,000/mo',
    posted: '5 days ago',
    tags: ['WhatsApp API', 'Node.js', 'Twilio', 'Make'],
    description: 'Build and maintain WhatsApp chatbots for e-commerce and customer support. Experience with Twilio or Manychat preferred.',
    remote: true,
    level: 'Mid-level',
    icon: '💬',
  },
  {
    title: 'AI Training Facilitator',
    company: 'AfriLearn Institute',
    location: '🇷🇼 Kigali, Rwanda',
    type: 'Part-time',
    salary: '$400–800/mo',
    posted: '1 week ago',
    tags: ['Training', 'Curriculum', 'AI Basics', 'Facilitation'],
    description: 'Deliver in-person and online AI training workshops for youth and professionals. Create engaging learning experiences around AI tools.',
    remote: false,
    level: 'Entry-level',
    icon: '🎓',
  },
  {
    title: 'AI Product Manager',
    company: 'FinTech Innovations',
    location: '🇿🇦 Cape Town, South Africa',
    type: 'Full-time',
    salary: '$2,000–3,500/mo',
    posted: '4 days ago',
    tags: ['Product Management', 'AI/ML', 'Fintech', 'Agile'],
    description: 'Lead AI-powered product features for our mobile banking app. Work with engineering to ship AI-driven fraud detection and personalization.',
    remote: false,
    level: 'Senior',
    icon: '🏦',
  },
  {
    title: 'AI Data Annotator',
    company: 'DataLabel Africa',
    location: '🇪🇹 Addis Ababa, Ethiopia',
    type: 'Full-time',
    salary: '$300–600/mo',
    posted: '6 days ago',
    tags: ['Data Labeling', 'NLP', 'Quality Assurance', 'African Languages'],
    description: 'Annotate and label training data for African language AI models. No coding required — training provided.',
    remote: true,
    level: 'Entry-level',
    icon: '🏷️',
  },
  {
    title: 'AI Agency Founder (Opportunity)',
    company: 'Self-Employed',
    location: '🌍 Any African Country',
    type: 'Freelance',
    salary: '$1,000–5,000/mo',
    posted: 'Ongoing',
    tags: ['Entrepreneurship', 'AI Services', 'Client Acquisition', 'Automation'],
    description: 'Start your own AI services agency. AfriFlow AI graduates are launching agencies across Africa. Complete the AI Freelancer path to get started.',
    remote: true,
    level: 'Entry-level',
    icon: '🚀',
  },
]

const FILTERS = {
  types: ['All', 'Full-time', 'Part-time', 'Freelance', 'Contract'],
  levels: ['All', 'Entry-level', 'Mid-level', 'Senior'],
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-20 bg-earth-900 border-b border-earth-800">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-4"><Briefcase size={14} /> Job Board</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              AI jobs made for <span className="gradient-text">Africa</span>
            </h1>
            <p className="text-earth-400 text-lg mb-8 max-w-2xl mx-auto">
              Find AI roles, freelance gigs, and opportunities across the continent.
              New positions added weekly — many don&apos;t require coding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { value: `${JOBS.length}+`, label: 'Open positions' },
                { value: '6+', label: 'Countries' },
                { value: '60%', label: 'Remote-friendly' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-xl font-bold text-white">{s.value}</p>
                  <p className="text-earth-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-earth-500 text-sm flex items-center gap-1.5">
              <Filter size={14} /> Filter:
            </span>
            {FILTERS.types.map(t => (
              <span
                key={t}
                className="px-3 py-1.5 bg-earth-800 text-earth-400 hover:text-white text-xs rounded-lg cursor-pointer transition-all border border-earth-700 hover:border-earth-600"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Job listings */}
          <div className="space-y-4">
            {JOBS.map((job, i) => (
              <div key={i} className="card-glow group hover:border-earth-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-earth-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {job.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-brand-300 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-earth-500">
                          <span className="flex items-center gap-1">
                            <Building2 size={12} /> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {job.location}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-earth-800 text-earth-400 rounded-lg border border-earth-700 flex-shrink-0">
                        {job.posted}
                      </span>
                    </div>

                    <p className="text-earth-400 text-sm leading-relaxed mt-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-earth-800 text-earth-500 rounded border border-earth-700">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-earth-800">
                      <div className="flex items-center gap-4 text-xs text-earth-500">
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} /> {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {job.type}
                        </span>
                        <span className="px-2 py-0.5 bg-earth-800 rounded text-earth-400 border border-earth-700">
                          {job.level}
                        </span>
                        {job.remote && (
                          <span className="px-2 py-0.5 bg-forest-500/10 text-forest-400 rounded border border-forest-500/20">
                            Remote
                          </span>
                        )}
                      </div>
                      <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
                        Apply <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Post a job CTA */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-white font-semibold text-lg mb-2">Hiring AI talent?</h3>
              <p className="text-earth-400 text-sm mb-4 leading-relaxed">
                Post your AI job listing to reach 24,000+ trained African AI professionals.
              </p>
              <a href="mailto:jobs@afriflowai.com" className="btn-primary text-sm py-2.5">
                Post a Job <ArrowRight size={14} />
              </a>
            </div>
            <div className="rounded-2xl border border-forest-500/20 bg-forest-500/5 p-8">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-white font-semibold text-lg mb-2">Not job-ready yet?</h3>
              <p className="text-earth-400 text-sm mb-4 leading-relaxed">
                Take our &quot;AI-Ready Worker&quot; path and be job-ready in 30 days with a certificate.
              </p>
              <Link href="/paths" className="btn-secondary text-sm py-2.5">
                View Learning Paths <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
