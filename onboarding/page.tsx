'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Zap, ArrowRight, ArrowLeft, ChevronRight, CheckCircle,
  Briefcase, BookOpen, Rocket, Globe, Target, Users, Sparkles
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { AFRICAN_COUNTRIES } from '@/lib/data'
import toast from 'react-hot-toast'

const STEPS = ['Welcome', 'Experience', 'Goals', 'Country', 'Recommendation']

const EXPERIENCE_LEVELS = [
  { id: 'none', label: 'Complete beginner', desc: 'Never used AI tools before', icon: '🌱', color: 'border-forest-500/30 bg-forest-500/5' },
  { id: 'some', label: 'Some experience', desc: 'Used ChatGPT or similar a few times', icon: '🌿', color: 'border-blue-500/30 bg-blue-500/5' },
  { id: 'regular', label: 'Regular user', desc: 'Use AI tools weekly for work or study', icon: '🌳', color: 'border-purple-500/30 bg-purple-500/5' },
  { id: 'advanced', label: 'Advanced', desc: 'Build automations or use AI professionally', icon: '🏔️', color: 'border-brand-500/30 bg-brand-500/5' },
]

const GOALS = [
  { id: 'job', label: 'Land an AI job', desc: 'Get hired in an AI-related role', icon: Briefcase, color: 'text-blue-400' },
  { id: 'freelance', label: 'Freelance with AI', desc: 'Offer AI services to clients', icon: Rocket, color: 'text-purple-400' },
  { id: 'business', label: 'Grow my business', desc: 'Use AI to automate and scale', icon: Target, color: 'text-forest-400' },
  { id: 'skills', label: 'Learn new skills', desc: 'Stay relevant in the AI age', icon: BookOpen, color: 'text-cyan-400' },
  { id: 'build', label: 'Build AI products', desc: 'Create tools and startups with AI', icon: Sparkles, color: 'text-brand-400' },
  { id: 'teach', label: 'Teach AI to others', desc: 'Become an AI trainer or mentor', icon: Users, color: 'text-amber-400' },
]

const PATH_RECOMMENDATIONS: Record<string, { path: string; courses: string[]; desc: string; duration: string }> = {
  'none-job': { path: 'AI-Ready Worker', courses: ['AI for Complete Beginners in Africa', 'No-Code Automation with Zapier & Make'], desc: 'Start with fundamentals, then learn automation to stand out to employers.', duration: '30 days' },
  'none-freelance': { path: 'AI Freelancer', courses: ['AI for Complete Beginners in Africa', 'Build & Sell AI Services in Africa'], desc: 'Learn the basics, then discover how to package and sell AI services.', duration: '45 days' },
  'none-business': { path: 'AI Business Optimizer', courses: ['AI for Complete Beginners in Africa', 'AI for Business Strategy'], desc: 'Start with AI fundamentals, then apply them to your business.', duration: '30 days' },
  'none-skills': { path: 'AI Explorer', courses: ['AI for Complete Beginners in Africa'], desc: 'Build a solid foundation in AI with practical, Africa-focused content.', duration: '14 days' },
  'some-job': { path: 'AI-Ready Worker', courses: ['No-Code Automation with Zapier & Make', 'AI for Business Strategy'], desc: 'Upgrade your automation skills and learn AI strategy for the workplace.', duration: '30 days' },
  'some-freelance': { path: 'AI Freelancer', courses: ['Build & Sell AI Services in Africa', 'No-Code Automation with Zapier & Make'], desc: 'Turn your AI knowledge into a freelance income.', duration: '30 days' },
  'some-business': { path: 'AI Business Optimizer', courses: ['AI for Business Strategy', 'No-Code Automation with Zapier & Make'], desc: 'Automate your operations and build an AI-powered business.', duration: '30 days' },
  'regular-build': { path: 'AI Builder', courses: ['Build & Sell AI Services in Africa', 'AI Content Mastery'], desc: 'You have the skills — now build products and monetize.', duration: '30 days' },
  'advanced-build': { path: 'AI Leader', courses: ['Build & Sell AI Services in Africa', 'AI for Business Strategy'], desc: 'Lead AI projects and build products at scale.', duration: '21 days' },
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(0)
  const [experience, setExperience] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [country, setCountry] = useState(user?.country || '')

  const toggleGoal = (id: string) => {
    setGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const getRecommendation = () => {
    const key = `${experience}-${goals[0]}`
    return PATH_RECOMMENDATIONS[key] || PATH_RECOMMENDATIONS['none-skills'] || {
      path: 'AI Explorer',
      courses: ['AI for Complete Beginners in Africa'],
      desc: 'Start your AI journey with our most popular beginner course.',
      duration: '14 days',
    }
  }

  const canAdvance = () => {
    if (step === 1) return !!experience
    if (step === 2) return goals.length > 0
    if (step === 3) return !!country
    return true
  }

  const handleFinish = () => {
    toast.success('Welcome to AfriFlow AI! 🎉')
    router.push('/courses')
  }

  const recommendation = getRecommendation()

  return (
    <div className="min-h-screen bg-earth-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-earth-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              AfriFlow<span className="text-brand-400"> AI</span>
            </span>
          </Link>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-earth-500 hover:text-earth-300 text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-brand-500' : 'bg-earth-800'
              }`} />
            </div>
          ))}
        </div>
        <p className="text-earth-500 text-xs">Step {step + 1} of {STEPS.length}</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center animate-fade-in">
              <div className="text-7xl mb-6">🌍</div>
              <h1 className="font-display text-3xl font-bold text-white mb-4">
                Welcome to AfriFlow AI{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-earth-400 text-lg mb-8 leading-relaxed">
                Let&apos;s personalize your learning experience. We&apos;ll ask a few questions to recommend the best path for you.
              </p>
              <button onClick={() => setStep(1)} className="btn-primary py-3 px-8 text-lg">
                Let&apos;s Go <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                What&apos;s your AI experience?
              </h2>
              <p className="text-earth-400 mb-8">This helps us find the right starting point for you.</p>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setExperience(level.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      experience === level.id
                        ? 'border-brand-500 bg-brand-500/5'
                        : `${level.color} hover:border-earth-600`
                    }`}
                  >
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <p className="text-white font-medium">{level.label}</p>
                      <p className="text-earth-500 text-sm">{level.desc}</p>
                    </div>
                    {experience === level.id && (
                      <CheckCircle size={20} className="text-brand-400 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                What are your goals?
              </h2>
              <p className="text-earth-400 mb-8">Select up to 3 that matter most to you.</p>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(goal => {
                  const Icon = goal.icon
                  const selected = goals.includes(goal.id)
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-brand-500 bg-brand-500/5'
                          : 'border-earth-800 bg-earth-900 hover:border-earth-600'
                      }`}
                    >
                      <Icon size={20} className={selected ? 'text-brand-400' : goal.color} />
                      <div>
                        <p className="text-white text-sm font-medium">{goal.label}</p>
                        <p className="text-earth-500 text-xs mt-0.5">{goal.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-earth-600 text-xs mt-3">{goals.length}/3 selected</p>
            </div>
          )}

          {/* Step 3: Country */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Where are you based?
              </h2>
              <p className="text-earth-400 mb-8">We&apos;ll show you relevant opportunities and connect you with local community chapters.</p>
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-field pl-10 appearance-none cursor-pointer"
                >
                  <option value="">Select your country</option>
                  {AFRICAN_COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Recommendation */}
          {step === 4 && (
            <div className="animate-fade-in text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Your Recommended Path
              </h2>
              <p className="text-earth-400 mb-8">Based on your answers, here&apos;s where you should start:</p>

              <div className="bg-earth-900 border border-brand-500/30 rounded-2xl p-6 text-left mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-forest-500 rounded-xl flex items-center justify-center">
                    <Target size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{recommendation.path}</h3>
                    <p className="text-brand-400 text-sm">{recommendation.duration} to complete</p>
                  </div>
                </div>
                <p className="text-earth-400 text-sm mb-4">{recommendation.desc}</p>
                <div className="space-y-2">
                  <p className="text-earth-500 text-xs font-medium uppercase tracking-wider">Recommended courses:</p>
                  {recommendation.courses.map(c => (
                    <div key={c} className="flex items-center gap-2 text-sm text-earth-300">
                      <ChevronRight size={14} className="text-brand-400" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleFinish} className="btn-primary py-3 px-8 text-lg">
                Start Learning <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {step > 0 && step < 4 && (
        <div className="border-t border-earth-800 px-6 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 text-earth-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
              className="btn-primary py-2 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
