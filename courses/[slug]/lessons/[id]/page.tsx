'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Play, Pause, ChevronLeft, ChevronRight, CheckCircle,
  Lock, Clock, BookOpen, Award, Menu, X, Zap,
  ThumbsUp, Download, Share2, MessageSquare, Loader2
} from 'lucide-react'
import AfriAICoach from '@/components/LazyAfriAICoach'
import { SAMPLE_COURSES } from '@/lib/data'
import { getLessonsForCourse } from '@/lib/lessonData'
import { notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { progressApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function LessonPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const course = SAMPLE_COURSES.find(c => c.slug === params.slug)
  if (!course) notFound()

  const lessons = getLessonsForCourse(params.slug)
  if (!lessons.length) notFound()

  const currentLesson = lessons.find(l => l.id === params.id)
  if (!currentLesson) notFound()

  const currentIndex = lessons.findIndex(l => l.id === params.id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const completedCount = lessons.filter(l => l.completed).length
  const progress = Math.round((completedCount / lessons.length) * 100)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [completing, setCompleting] = useState(false)
  const { isAuthenticated, updateUser, user } = useAuth()

  // Fetch progress from API
  useEffect(() => {
    if (!isAuthenticated) return
    progressApi.getCourseProgress(params.slug).then(res => {
      if (res.data.enrolled && res.data.completedLessons) {
        setCompletedIds(res.data.completedLessons)
      }
    }).catch(() => {})
  }, [isAuthenticated, params.slug])

  const handleCompleteLesson = useCallback(async () => {
    if (!isAuthenticated) { toast.error('Sign in to track progress'); return }
    setCompleting(true)
    try {
      const res = await progressApi.completeLesson(params.slug, `lesson-${currentLesson.id}`)
      setCompletedIds(prev => [...prev, `lesson-${currentLesson.id}`])
      if (res.data.xpAwarded > 0) {
        toast.success(`+${res.data.xpAwarded} XP earned! ${res.data.courseCompleted ? '🎉 Course completed!' : ''}`)
        if (user) updateUser({ xp: user.xp + res.data.xpAwarded })
      }
    } catch {
      toast.error('Failed to mark as complete')
    } finally {
      setCompleting(false)
    }
  }, [isAuthenticated, params.slug, currentLesson.id, user, updateUser])

  const isLessonCompleted = (lessonId: string) => completedIds.includes(`lesson-${lessonId}`)

  /* Simple markdown renderer */
  function renderMarkdown(text: string) {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### '))
          return <h3 key={i} className="text-white font-semibold text-lg mt-6 mb-2">{line.slice(4)}</h3>
        if (line.startsWith('## '))
          return <h2 key={i} className="text-white font-display font-bold text-xl mt-8 mb-3">{line.slice(3)}</h2>
        if (line.startsWith('# '))
          return <h1 key={i} className="text-white font-display font-bold text-2xl mt-4 mb-4">{line.slice(2)}</h1>

        // Blockquote
        if (line.startsWith('> '))
          return (
            <blockquote key={i} className="border-l-2 border-brand-500 pl-4 my-4 text-earth-300 text-sm italic">
              {renderInline(line.slice(2))}
            </blockquote>
          )

        // Table (simplified)
        if (line.startsWith('|') && line.includes('|'))
          return (
            <div key={i} className="text-earth-400 text-sm font-mono bg-earth-800/50 px-3 py-1 rounded">
              {line}
            </div>
          )

        // List items
        if (line.startsWith('- '))
          return (
            <li key={i} className="flex items-start gap-2 text-earth-300 text-sm ml-4 mb-1">
              <span className="text-brand-400 mt-1.5">•</span>
              {renderInline(line.slice(2))}
            </li>
          )
        if (/^\d+\.\s/.test(line))
          return (
            <li key={i} className="text-earth-300 text-sm ml-4 mb-1 list-decimal list-inside">
              {renderInline(line.replace(/^\d+\.\s/, ''))}
            </li>
          )

        // Empty line
        if (line.trim() === '') return <div key={i} className="h-3" />

        // Normal paragraph
        return <p key={i} className="text-earth-400 text-sm leading-relaxed mb-2">{renderInline(line)}</p>
      })
  }

  function renderInline(text: string) {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-earth-200 font-medium">{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="min-h-screen bg-earth-950 flex">
      {/* ─── Sidebar ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-earth-950/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-earth-900 border-r border-earth-800 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-earth-800">
          <div className="flex items-center justify-between mb-3">
            <Link href={`/courses/${course.slug}`} className="text-earth-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
              <ChevronLeft size={14} /> Back to course
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-earth-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <h2 className="text-white font-semibold text-sm leading-snug truncate">{course.title}</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-earth-500 mb-1">
              <span>{completedCount}/{lessons.length} lessons</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-earth-800 rounded-full h-1.5">
              <div className="progress-bar h-1.5 transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {lessons.map((lesson, i) => {
            const isCurrent = lesson.id === params.id
            return (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}/lessons/${lesson.id}`}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isCurrent
                    ? 'bg-brand-500/10 text-brand-400 font-medium'
                    : lesson.completed
                      ? 'text-earth-400 hover:bg-earth-800'
                      : !lesson.isFree
                        ? 'text-earth-600 hover:bg-earth-800'
                        : 'text-earth-400 hover:bg-earth-800'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {(lesson.completed || isLessonCompleted(lesson.id)) ? (
                    <CheckCircle size={16} className="text-forest-400" />
                  ) : isCurrent ? (
                    <Play size={16} className="text-brand-400" fill="currentColor" />
                  ) : !lesson.isFree ? (
                    <Lock size={14} className="text-earth-700" />
                  ) : (
                    <span className="text-earth-600 text-xs w-4 text-center">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{lesson.title}</p>
                  <p className="text-earth-600 text-xs mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {lesson.duration}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Certificate progress */}
        <div className="p-3 border-t border-earth-800">
          <div className="bg-earth-800/50 rounded-xl p-3 text-center">
            <Award size={16} className="text-amber-400 mx-auto mb-1" />
            <p className="text-earth-400 text-xs">Complete all lessons to earn your certificate</p>
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="bg-earth-900/80 backdrop-blur-md border-b border-earth-800 sticky top-0 z-30">
          <div className="flex items-center justify-between h-12 px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-earth-400 hover:text-white">
                <Menu size={18} />
              </button>
              <span className="text-earth-500 text-xs">
                Lesson {currentIndex + 1} of {lessons.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 bg-earth-800 rounded-lg flex items-center justify-center text-earth-400 hover:text-white transition-colors" title="Share">
                <Share2 size={14} />
              </button>
              <button className="w-8 h-8 bg-earth-800 rounded-lg flex items-center justify-center text-earth-400 hover:text-white transition-colors" title="Download notes">
                <Download size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Video placeholder */}
        <div className="bg-earth-900 border-b border-earth-800">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-earth-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 bg-brand-500 hover:bg-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-white" fill="white" />
                  ) : (
                    <Play size={24} className="text-white ml-1" fill="white" />
                  )}
                </button>
                <p className="text-earth-400 text-sm">
                  {isPlaying ? 'Playing...' : 'Video lesson'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-earth-700">
                <div className="bg-brand-500 h-1 w-0 transition-all duration-700" style={{ width: isPlaying ? '35%' : '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Lesson content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 text-sm text-earth-500 mb-2">
              <span className="capitalize">{course.school} School</span>
              <span className="text-earth-700">·</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {currentLesson.duration}</span>
              {currentLesson.isFree && (
                <>
                  <span className="text-earth-700">·</span>
                  <span className="text-forest-400">Free</span>
                </>
              )}
            </div>
          </div>

          {/* Markdown content */}
          <article className="prose-afriflow">
            {renderMarkdown(currentLesson.content)}
          </article>

          {/* Actions */}
          <div className="mt-10 pt-6 border-t border-earth-800">
            {/* Mark complete */}
            {isAuthenticated && (
              <div className="mb-6">
                {isLessonCompleted(currentLesson.id) ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-forest-500/10 border border-forest-500/20 text-forest-400 rounded-xl text-sm">
                    <CheckCircle size={16} /> Lesson completed ✓
                  </div>
                ) : (
                  <button
                    onClick={handleCompleteLesson}
                    disabled={completing}
                    className="btn-primary py-3 w-full justify-center text-sm"
                  >
                    {completing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    {completing ? 'Marking...' : 'Mark as Complete (+50 XP)'}
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-earth-800 hover:bg-earth-700 text-earth-400 hover:text-white rounded-xl text-sm transition-all border border-earth-700">
                <ThumbsUp size={14} /> Helpful
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-earth-800 hover:bg-earth-700 text-earth-400 hover:text-white rounded-xl text-sm transition-all border border-earth-700">
                <MessageSquare size={14} /> Ask AfriAI Coach
              </button>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.id}`}
                  className="btn-secondary text-sm py-2.5"
                >
                  <ChevronLeft size={14} /> Previous
                </Link>
              ) : <div />}
              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.id}`}
                  className="btn-primary text-sm py-2.5"
                >
                  Next lesson <ChevronRight size={14} />
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary text-sm py-2.5"
                >
                  <Award size={14} /> Complete Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <AfriAICoach />
    </div>
  )
}
