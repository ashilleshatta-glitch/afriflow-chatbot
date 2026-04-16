'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import { getLabById } from '@/lib/labData'
import type { Lab, LabStep } from '@/lib/labData'
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle, Clock, Wrench,
  ExternalLink, AlertTriangle, Lightbulb, Copy, Check, ArrowLeft,
  PlayCircle, Trophy, Lock, BookOpen, ChevronDown, ChevronUp
} from 'lucide-react'

/* ─────────── helpers ─────────── */
function difficultyColor(d: string) {
  if (d === 'Beginner') return 'text-green-400 bg-green-500/10 border-green-500/30'
  if (d === 'Intermediate') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
  return 'text-red-400 bg-red-500/10 border-red-500/30'
}

/* ─────────── code block component ─────────── */
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative group rounded-lg border border-earth-700 bg-earth-950 my-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-earth-800/50 border-b border-earth-700">
        <span className="text-xs text-earth-400 font-mono uppercase">{lang || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-earth-400 hover:text-brand-500 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-earth-200 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* ─────────── step card component ─────────── */
function StepContent({
  step,
  stepIndex,
  completed,
  onComplete,
}: {
  step: LabStep
  stepIndex: number
  completed: boolean
  onComplete: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Step header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-500 font-bold text-sm">
          {stepIndex + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-white">{step.title}</h2>
          <div className="flex items-center gap-3 mt-2 text-sm text-earth-400">
            <span className="flex items-center gap-1"><Clock size={14} /> {step.duration}</span>
            {completed && <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> Completed</span>}
          </div>
        </div>
      </div>

      {/* Main content — render markdown-like text */}
      <div className="prose-custom text-earth-300 leading-relaxed whitespace-pre-line">
        {step.content.split('\n').map((line, i) => {
          // Bold
          const boldParsed = line.replace(/\*\*(.+?)\*\*/g, '<b class="text-white font-semibold">$1</b>')
          // Inline code
          const codeParsed = boldParsed.replace(/`([^`]+)`/g, '<code class="bg-earth-800 text-brand-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
          return (
            <p
              key={i}
              className={`${line.trim() === '' ? 'h-3' : 'mb-1'}`}
              dangerouslySetInnerHTML={{ __html: codeParsed }}
            />
          )
        })}
      </div>

      {/* Code block */}
      {step.code && <CodeBlock code={step.code} lang={step.codeLang} />}

      {/* Tip callout */}
      {step.tip && (
        <div className="flex gap-3 p-4 rounded-lg bg-brand-500/10 border border-brand-500/30">
          <Lightbulb size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brand-400 mb-1">Pro Tip</p>
            <p className="text-sm text-earth-300">{step.tip}</p>
          </div>
        </div>
      )}

      {/* Warning callout */}
      {step.warning && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">Warning</p>
            <p className="text-sm text-earth-300">{step.warning}</p>
          </div>
        </div>
      )}

      {/* Checkpoint */}
      {step.checkpoint && (
        <div className="flex gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-400 mb-1">Checkpoint — What You Should See</p>
            <p className="text-sm text-earth-300">{step.checkpoint}</p>
          </div>
        </div>
      )}

      {/* Tool link */}
      {step.toolLink && (
        <a
          href={step.toolLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-earth-800 border border-earth-700 text-brand-400 hover:bg-earth-700 hover:text-brand-500 transition-colors text-sm font-medium"
        >
          <ExternalLink size={16} /> {step.toolLink.label}
        </a>
      )}

      {/* Complete button */}
      <div className="pt-4 border-t border-earth-800">
        <button
          onClick={onComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
            completed
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25'
          }`}
        >
          {completed ? (
            <><CheckCircle size={18} /> Step Completed</>
          ) : (
            <><Circle size={18} /> Mark Step as Complete</>
          )}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Main Page                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function LabRunnerPage() {
  const params = useParams()
  const id = params.id as string
  const lab = getLabById(id)

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showOutcomes, setShowOutcomes] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  // Persist progress in localStorage
  useEffect(() => {
    if (!lab) return
    const saved = localStorage.getItem(`lab-progress-${id}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompletedSteps(new Set(parsed.completed || []))
        setCurrentStep(parsed.currentStep ?? 0)
      } catch { /* ignore */ }
    }
  }, [id, lab])

  useEffect(() => {
    if (!lab) return
    localStorage.setItem(
      `lab-progress-${id}`,
      JSON.stringify({ completed: Array.from(completedSteps), currentStep })
    )
  }, [completedSteps, currentStep, id, lab])

  // Scroll to top of content when step changes
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  if (!lab) return notFound()

  const totalSteps = lab.steps.length
  const progress = Math.round((completedSteps.size / totalSteps) * 100)
  const isComplete = completedSteps.size === totalSteps

  function toggleComplete(step: number) {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(step)) next.delete(step)
      else next.add(step)
      return next
    })
  }

  function goNext() {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1)
  }
  function goPrev() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-earth-950 text-white">
      <Navbar />

      {/* Top bar with breadcrumb and progress */}
      <div className="sticky top-0 z-30 bg-earth-900/95 backdrop-blur-sm border-b border-earth-800">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: back link */}
            <Link
              href="/lab"
              className="flex items-center gap-2 text-sm text-earth-400 hover:text-brand-500 transition-colors"
            >
              <ArrowLeft size={16} /> All Labs
            </Link>

            {/* Center: title */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-lg">{lab.icon}</span>
              <span className="font-semibold text-white text-sm truncate max-w-xs">{lab.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColor(lab.difficulty)}`}>
                {lab.difficulty}
              </span>
            </div>

            {/* Right: progress */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-earth-400">
                {completedSteps.size}/{totalSteps} steps
              </div>
              <div className="w-24 h-2 bg-earth-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-forest-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-brand-400">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-screen-2xl mx-auto" style={{ height: 'calc(100vh - 120px)' }}>
        {/* ───────── Sidebar ───────── */}
        <aside
          className={`${
            sidebarOpen ? 'w-72 xl:w-80' : 'w-0'
          } flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-earth-800 bg-earth-900/50`}
        >
          <div className="w-72 xl:w-80 h-full overflow-y-auto pb-20">
            {/* Lab info */}
            <div className="p-5 border-b border-earth-800">
              <div className="flex items-center gap-2 text-sm text-earth-400 mb-2">
                <Clock size={14} /> {lab.time} total
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {lab.tools.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-earth-800 border border-earth-700 rounded text-xs text-earth-300">
                    {t}
                  </span>
                ))}
              </div>
              {/* Prerequisites */}
              {lab.prerequisites.length > 0 && (
                <div className="text-xs text-earth-500 space-y-1 mt-3">
                  <p className="font-semibold text-earth-400">Prerequisites:</p>
                  {lab.prerequisites.map((p, i) => (
                    <p key={i} className="flex items-start gap-1.5">
                      <span className="text-brand-500 mt-px">•</span> {p}
                    </p>
                  ))}
                </div>
              )}
              {/* Outcomes toggle */}
              <button
                onClick={() => setShowOutcomes(!showOutcomes)}
                className="flex items-center gap-1.5 mt-3 text-xs text-brand-400 hover:text-brand-500 transition-colors"
              >
                <Trophy size={12} />
                What you&apos;ll build
                {showOutcomes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {showOutcomes && (
                <div className="mt-2 space-y-1 text-xs text-earth-400">
                  {lab.outcomes.map((o, i) => (
                    <p key={i} className="flex items-start gap-1.5">
                      <CheckCircle size={12} className="text-green-400 flex-shrink-0 mt-0.5" /> {o}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Step list */}
            <nav className="p-3">
              <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider mb-3 px-2">
                Steps ({totalSteps})
              </p>
              <ul className="space-y-1">
                {lab.steps.map((step, idx) => {
                  const done = completedSteps.has(idx)
                  const active = idx === currentStep
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => setCurrentStep(idx)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                          active
                            ? 'bg-brand-500/15 text-white border border-brand-500/30'
                            : 'text-earth-400 hover:bg-earth-800/50 hover:text-earth-200 border border-transparent'
                        }`}
                      >
                        <span className="flex-shrink-0 mt-0.5">
                          {done ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : active ? (
                            <PlayCircle size={16} className="text-brand-500" />
                          ) : (
                            <Circle size={16} className="text-earth-600" />
                          )}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`block truncate ${active ? 'font-medium' : ''}`}>
                            {step.title}
                          </span>
                          <span className="block text-xs text-earth-500 mt-0.5">{step.duration}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* ───────── Main content ───────── */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 left-4 z-40 lg:hidden bg-earth-800 border border-earth-700 text-earth-300 rounded-full p-2 hover:bg-earth-700 transition-colors"
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <BookOpen size={20} />}
          </button>

          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* If lab is complete — celebration */}
            {isComplete && (
              <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-brand-500/10 border border-green-500/30 text-center">
                <Trophy size={40} className="mx-auto text-brand-500 mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">Lab Complete!</h3>
                <p className="text-earth-300 text-sm">
                  You&apos;ve completed all {totalSteps} steps of &ldquo;{lab.title}&rdquo;. Well done!
                </p>
                <Link
                  href="/lab"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-brand-500 text-white rounded-lg font-semibold text-sm hover:bg-brand-600 transition-colors"
                >
                  Explore More Labs <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {/* Current step */}
            <StepContent
              step={lab.steps[currentStep]}
              stepIndex={currentStep}
              completed={completedSteps.has(currentStep)}
              onComplete={() => toggleComplete(currentStep)}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-earth-800">
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-earth-800 text-earth-300 hover:bg-earth-700 border border-earth-700"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span className="text-sm text-earth-500">
                Step {currentStep + 1} of {totalSteps}
              </span>

              <button
                onClick={goNext}
                disabled={currentStep === totalSteps - 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-brand-500 text-white hover:bg-brand-600"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
      <AfriAICoach />
    </div>
  )
}
