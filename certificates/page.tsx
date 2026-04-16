'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Award, Shield, CheckCircle, ArrowRight, Star, Download,
  ExternalLink, Share2, BadgeCheck, Calendar, Zap, BookOpen,
  Copy, Check,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CertificateVerifier from '@/components/CertificateVerifier'
import LazyAfriAICoach from '@/components/LazyAfriAICoach'
import { certificatesApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const CERTIFICATES = [
  {
    id: 'ai-foundations',
    title: 'AI Foundations Certificate',
    school: 'AI Foundations',
    description: 'Demonstrates understanding of core AI concepts, prompt engineering, and practical AI tool usage.',
    requirements: ['Complete all 8 foundation lessons', 'Pass final assessment (80%+)', 'Build a mini-project'],
    skills: ['AI fundamentals', 'Prompt engineering', 'ChatGPT & Claude', 'Critical thinking with AI'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🧠',
    earners: 1240,
    isFree: true,
  },
  {
    id: 'automation-specialist',
    title: 'AI Automation Specialist',
    school: 'AI Automation',
    description: 'Proves ability to build real-world business automations using no-code tools like Zapier, Make, and n8n.',
    requirements: ['Complete automation school (10 lessons)', 'Build 3 working automations', 'Pass skills assessment'],
    skills: ['Zapier', 'Make', 'n8n', 'API integrations', 'WhatsApp automation'],
    color: 'from-brand-500 to-yellow-500',
    icon: '⚡',
    earners: 890,
    isFree: false,
  },
  {
    id: 'ai-business-ready',
    title: 'AI Business Ready',
    school: 'AI for Business',
    description: 'Validates ability to apply AI tools to real business operations — from marketing to customer service.',
    requirements: ['Complete business AI course', 'Implement AI in a real business scenario', 'Submit case study'],
    skills: ['Business AI strategy', 'Customer service AI', 'AI marketing', 'ROI measurement'],
    color: 'from-forest-500 to-teal-500',
    icon: '🏢',
    earners: 670,
    isFree: false,
  },
  {
    id: 'ai-freelancer',
    title: 'Certified AI Freelancer',
    school: 'AI Creator & Income',
    description: 'Certifies you can package, price, and sell AI services professionally. Recognized by AfriFlow partner companies.',
    requirements: ['Complete freelancer path', 'Land at least 1 client (or mock project)', 'Build a service portfolio'],
    skills: ['Service packaging', 'Client acquisition', 'Pricing strategy', 'Proposal writing'],
    color: 'from-purple-500 to-pink-500',
    icon: '💼',
    earners: 430,
    isFree: false,
  },
  {
    id: 'python-ai-builder',
    title: 'Python AI Builder',
    school: 'AI Builder',
    description: 'Demonstrates ability to write Python code for AI automation, API integrations, and chatbot development.',
    requirements: ['Complete Python AI course', 'Build 2 Python projects', 'Pass coding assessment'],
    skills: ['Python', 'OpenAI API', 'LangChain', 'FastAPI', 'Chatbot development'],
    color: 'from-red-500 to-orange-500',
    icon: '🐍',
    earners: 310,
    isFree: false,
  },
  {
    id: 'ai-career-ready',
    title: 'AI Career Ready',
    school: 'AI Career',
    description: 'Proves you are job-ready with AI skills, an AI-enhanced CV, portfolio, and interview preparation.',
    requirements: ['Complete career path', 'Build AI portfolio', 'Complete mock interview', 'Optimize LinkedIn profile'],
    skills: ['AI-enhanced CV', 'Portfolio building', 'Interview skills', 'LinkedIn optimization'],
    color: 'from-indigo-500 to-blue-500',
    icon: '🎯',
    earners: 560,
    isFree: false,
  },
]

const GRADE_LABELS: Record<string, string> = { distinction: 'Distinction', merit: 'Merit', pass: 'Pass' }
const GRADE_COLORS: Record<string, string> = {
  distinction: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  merit: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  pass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function MyCertCard({ cert }: { cert: any }) {
  const [copied, setCopied] = useState(false)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afriflowai.com'
  const verifyUrl = `${siteUrl}/verify/${cert.certificateId}`
  const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date()
  const expiringSoon =
    !isExpired && cert.expiryDate &&
    new Date(cert.expiryDate).getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(verifyUrl)}&title=${encodeURIComponent(`${cert.courseTitle} — AfriFlow AI Certificate`)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`🎓 I just earned the "${cert.courseTitle}" certificate from AfriFlow AI!\n\nVerify: ${verifyUrl}`)}`

  function copyId() {
    navigator.clipboard.writeText(cert.certificateId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-500/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-bold text-base leading-snug">{cert.courseTitle}</h3>
          <p className="text-brand-400 text-sm capitalize mt-0.5">{cert.courseSchool} School</p>
        </div>
        <BadgeCheck className={`w-7 h-7 flex-shrink-0 ${isExpired ? 'text-red-400' : 'text-emerald-400'}`} />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${GRADE_COLORS[cert.grade] || 'text-white/60 border-white/10 bg-white/5'}`}>
          <Award className="w-3 h-3" />
          {GRADE_LABELS[cert.grade] || cert.grade}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border text-white/60 border-white/10 bg-white/5">
          Score {cert.score}%
        </span>
        {cert.projectsCompleted > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border text-sky-300 border-sky-400/20 bg-sky-400/10">
            <BookOpen className="w-3 h-3" />
            {cert.projectsCompleted} project{cert.projectsCompleted > 1 ? 's' : ''}
          </span>
        )}
        {cert.automationsBuilt > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border text-purple-300 border-purple-400/20 bg-purple-400/10">
            <Zap className="w-3 h-3" />
            {cert.automationsBuilt} automation{cert.automationsBuilt > 1 ? 's' : ''}
          </span>
        )}
        {isExpired && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border text-red-300 border-red-400/20 bg-red-400/10">Expired</span>}
        {expiringSoon && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border text-orange-300 border-orange-400/20 bg-orange-400/10">Expiring soon</span>}
      </div>

      {cert.skills && cert.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cert.skills.slice(0, 4).map((s: string) => (
            <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">{s}</span>
          ))}
          {cert.skills.length > 4 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">+{cert.skills.length - 4} more</span>
          )}
        </div>
      )}

      <div className="flex gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Issued {formatDate(cert.issuedAt)}</span>
        {cert.expiryDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Expires {formatDate(cert.expiryDate)}</span>}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
        <span className="font-mono text-xs text-white/50 flex-1 truncate">{cert.certificateId}</span>
        <button onClick={copyId} className="text-white/40 hover:text-white transition-colors flex-shrink-0">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Link href={`/verify/${cert.certificateId}`} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition-colors">
          <Shield className="w-3.5 h-3.5" /> Verify
        </Link>
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#58a6ff] text-xs font-semibold border border-[#0A66C2]/30 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-300 text-xs font-semibold border border-green-500/20 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <a href={`/verify/${cert.certificateId}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-semibold border border-white/10 transition-colors">
          <Download className="w-3.5 h-3.5" /> Save
        </a>
      </div>
    </div>
  )
}

export default function CertificatesPage() {
  const { user } = useAuth()
  const [myCerts, setMyCerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'mine' | 'all'>('mine')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    certificatesApi.list()
      .then((res) => setMyCerts(res.data?.certificates || []))
      .catch(() => setMyCerts([]))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">

        {/* Hero */}
        <div className="relative py-20 bg-earth-900 border-b border-earth-800">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-4"><Award size={14} /> AfriFlow Verified</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Your AI <span className="gradient-text">Talent Passport</span>
            </h1>
            <p className="text-earth-400 text-lg mb-6 max-w-2xl mx-auto">
              Earn tamper-proof, employer-verified certificates in AI, automation, and digital skills. Share instantly on LinkedIn and WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-earth-500">
              {['Employer-recognized', 'Shareable on LinkedIn', 'Tamper-proof verification', 'Skills-based assessment'].map(f => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-forest-400" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-earth-800 bg-earth-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: '6', label: 'Certificates available' },
                { value: '4,100+', label: 'Certificates earned' },
                { value: '92%', label: 'Completion rate' },
                { value: '40+', label: 'Partner employers' },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-earth-500 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Tabs — logged in only */}
          {user && (
            <div className="flex gap-2 mb-8 p-1 bg-earth-900 border border-earth-800 rounded-xl w-fit">
              {(['mine', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-earth-400 hover:text-white'}`}
                >
                  {t === 'mine' ? `My Certificates${myCerts.length > 0 ? ` (${myCerts.length})` : ''}` : 'All Certificates'}
                </button>
              ))}
            </div>
          )}

          {/* My Certificates */}
          {user && tab === 'mine' && (
            <div className="mb-16">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map(i => <div key={i} className="card rounded-2xl p-6 animate-pulse h-64" />)}
                </div>
              ) : myCerts.length === 0 ? (
                <div className="card rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">🎓</div>
                  <h3 className="text-white font-bold text-xl mb-2">No certificates yet</h3>
                  <p className="text-earth-400 mb-6">Complete a course to earn your first verified certificate.</p>
                  <Link href="/courses" className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
                    Browse Courses <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCerts.map((c) => <MyCertCard key={c._id || c.certificateId} cert={c} />)}
                </div>
              )}
            </div>
          )}

          {/* All Certificates catalogue */}
          {(!user || tab === 'all') && (
            <>
              <div className="card mb-10">
                <div className="flex flex-col sm:flex-row items-center gap-5 mb-4">
                  <div className="w-12 h-12 bg-forest-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield size={22} className="text-forest-400" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-white font-semibold mb-1">Verify a certificate</h3>
                    <p className="text-earth-400 text-sm">Enter a certificate ID to instantly verify its authenticity.</p>
                  </div>
                  <Link href="/employers" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex-shrink-0 flex items-center gap-1 transition-colors">
                    Bulk verify <ArrowRight size={13} />
                  </Link>
                </div>
                <CertificateVerifier />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CERTIFICATES.map((cert) => (
                  <div key={cert.id} className="card-glow flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${cert.color} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>{cert.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg">{cert.title}</h3>
                        <p className="text-earth-500 text-sm">{cert.school}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${cert.isFree ? 'bg-forest-500/10 text-forest-400 border-forest-500/20' : 'bg-brand-500/10 text-brand-400 border-brand-500/20'}`}>
                        {cert.isFree ? 'Free' : 'Premium'}
                      </span>
                    </div>
                    <p className="text-earth-400 text-sm leading-relaxed mb-4">{cert.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-earth-800 text-earth-400 rounded-md border border-earth-700">{s}</span>
                      ))}
                    </div>
                    <div className="mb-4">
                      <p className="text-earth-500 text-xs font-medium uppercase tracking-wider mb-2">Requirements</p>
                      <ul className="space-y-1.5">
                        {cert.requirements.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-earth-400">
                            <CheckCircle size={13} className="text-earth-600 mt-0.5 flex-shrink-0" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-earth-800">
                      <span className="text-earth-600 text-xs flex items-center gap-1"><Star size={11} /> {cert.earners.toLocaleString()} earned</span>
                      <Link href={cert.isFree ? '/courses' : '/pricing'} className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors">
                        {cert.isFree ? 'Start earning' : 'Unlock with Premium'} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-10 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Stand out on LinkedIn</h2>
            <p className="text-earth-400 mb-6 max-w-xl mx-auto">
              AfriFlow AI certificates come with a shareable badge and unique verification link. Add them to your LinkedIn profile in one click.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!user && (
                <Link href="/auth/register" className="btn-primary py-3 px-8 inline-flex items-center gap-2">
                  Start Earning Certificates <ArrowRight size={16} />
                </Link>
              )}
              <Link href="/employers" className="btn-secondary py-3 px-8 inline-flex items-center gap-2">
                Employer Portal <ExternalLink size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
      <LazyAfriAICoach />
    </div>
  )
}

