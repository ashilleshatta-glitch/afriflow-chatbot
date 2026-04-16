import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import EnrollButton from '@/components/EnrollButton'
import CourseReviews from '@/components/CourseReviews'
import { SAMPLE_COURSES } from '@/lib/data'
import { getLessonsForCourse } from '@/lib/lessonData'
import { Star, Clock, Users, CheckCircle, Play, Lock, ArrowRight, Award, Globe } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return SAMPLE_COURSES.map(c => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const course = SAMPLE_COURSES.find(c => c.slug === params.slug)
  if (!course) return { title: 'Course Not Found — AfriFlow AI' }
  return {
    title: `${course.title} — AfriFlow AI`,
    description: course.description || `Learn ${course.title} on AfriFlow AI. Practical, Africa-focused AI education.`,
    openGraph: {
      title: course.title,
      description: course.description || `Enroll in ${course.title} on AfriFlow AI.`,
    },
  }
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = SAMPLE_COURSES.find(c => c.slug === params.slug)
  if (!course) notFound()

  const hours = Math.floor(course.duration / 60)

  const courseLessons = getLessonsForCourse(course.slug)

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative bg-earth-900 border-b border-earth-800 py-16">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-brand-400 text-sm font-medium capitalize">{course.school} School</span>
                  <span className="text-earth-600">·</span>
                  <span className="text-earth-500 text-sm capitalize">{course.level}</span>
                  {course.africanFocused && (
                    <>
                      <span className="text-earth-600">·</span>
                      <span className="flex items-center gap-1 text-forest-400 text-sm">
                        <Globe size={12} /> Africa-focused
                      </span>
                    </>
                  )}
                </div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-earth-400 text-lg leading-relaxed mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star size={16} fill="currentColor" />
                    <span className="font-medium text-white">{course.rating}</span>
                    <span className="text-earth-500">({course.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-earth-400">
                    <Users size={15} />
                    <span>{course.enrolledCount.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-earth-400">
                    <Clock size={15} />
                    <span>{hours} hours</span>
                  </div>
                </div>

                <p className="text-earth-500 text-sm">
                  Instructor: <span className="text-earth-300 font-medium">AfriFlow Team</span>
                </p>
              </div>

              {/* Enrollment card */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-earth-800 border border-earth-700 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="h-40 bg-gradient-to-br from-earth-700 to-earth-900 flex items-center justify-center text-7xl relative">
                    {course.school === 'foundations' ? '🧠' :
                     course.school === 'automation' ? '⚡' :
                     course.school === 'business' ? '🏢' :
                     course.school === 'creator' ? '💰' : '🔧'}
                    <button className="absolute inset-0 flex items-center justify-center bg-earth-950/40 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center">
                        <Play size={22} className="text-white ml-1" fill="white" />
                      </div>
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline gap-2 mb-6">
                      {course.isFree ? (
                        <span className="text-3xl font-bold text-forest-400">Free</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-white">${course.price}</span>
                          <span className="text-earth-500 text-sm line-through">${Math.round(course.price * 1.5)}</span>
                        </>
                      )}
                    </div>
                    <EnrollButton courseSlug={course.slug} isFree={course.isFree} price={course.price} />
                    <p className="text-earth-600 text-xs text-center mb-4">30-day money-back guarantee</p>
                    <div className="space-y-2 text-sm text-earth-400">
                      {[
                        `${courseLessons.length} lessons`,
                        `${hours} hours of content`,
                        'Downloadable templates',
                        'Certificate of completion',
                        'Lifetime access',
                      ].map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-forest-400" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* What you'll learn */}
              <div>
                <h2 className="text-white font-display font-bold text-2xl mb-6">What you&apos;ll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-forest-400 mt-0.5 flex-shrink-0" />
                      <span className="text-earth-300 text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="text-white font-display font-bold text-2xl mb-6">Course curriculum</h2>
                <div className="space-y-2">
                  {courseLessons.map((lesson, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-earth-900 border border-earth-800 rounded-xl hover:border-earth-700 transition-all">
                      <div className="w-8 h-8 bg-earth-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        {lesson.isFree ? (
                          <Play size={14} className="text-brand-400" />
                        ) : (
                          <Lock size={14} className="text-earth-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-earth-200 text-sm font-medium">{lesson.title}</p>
                        {lesson.isFree && (
                          <span className="text-xs text-forest-400">Preview available</span>
                        )}
                      </div>
                      <span className="text-earth-500 text-xs">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h2 className="text-white font-display font-bold text-2xl mb-4">Tools you&apos;ll master</h2>
                <div className="flex flex-wrap gap-3">
                  {course.toolsCovered.map(tool => (
                    <span key={tool} className="px-4 py-2 bg-earth-900 border border-earth-700 text-earth-300 rounded-xl text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <CourseReviews courseSlug={course.slug} />
            </div>

            {/* Requirements sidebar */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Award size={16} className="text-brand-400" /> Certificate
                </h3>
                <p className="text-earth-400 text-sm mb-4">
                  Complete this course to earn your official AfriFlow AI certificate. Shareable on LinkedIn and recognized by employers.
                </p>
                <div className="border border-earth-700 rounded-xl p-4 text-center">
                  <Award size={32} className="text-brand-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">AfriFlow AI</p>
                  <p className="text-earth-500 text-xs">Certificate of Completion</p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-white font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 bg-earth-800 text-earth-400 rounded-lg border border-earth-700">
                      {tag}
                    </span>
                  ))}
                </div>
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
