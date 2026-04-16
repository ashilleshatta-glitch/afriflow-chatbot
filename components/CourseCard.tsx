import Link from 'next/link'
import { Star, Clock, Users, Lock, Play, TrendingUp } from 'lucide-react'

interface CourseCardProps {
  course: {
    _id?: string
    slug: string
    title: string
    description: string
    school: string
    level: string
    isFree: boolean
    isPremium: boolean
    price: number
    duration: number
    enrolledCount: number
    rating: number
    toolsCovered?: string[]
    instructorName?: string
  }
  /** 0-100 progress percentage. If set, shows an animated progress ring. */
  progress?: number
  /** If true, render a shimmer skeleton instead of real content. */
  skeleton?: boolean
}

const schoolColors: Record<string, { text: string; bg: string; glow: string }> = {
  foundations: { text: 'text-blue-400', bg: 'bg-blue-400/10', glow: 'hover:shadow-blue-500/15 hover:border-blue-500/30' },
  automation:  { text: 'text-brand-400', bg: 'bg-brand-400/10', glow: 'hover:shadow-brand-500/15 hover:border-brand-500/30' },
  business:    { text: 'text-forest-400', bg: 'bg-forest-400/10', glow: 'hover:shadow-forest-500/15 hover:border-forest-500/30' },
  creator:     { text: 'text-purple-400', bg: 'bg-purple-400/10', glow: 'hover:shadow-purple-500/15 hover:border-purple-500/30' },
  builder:     { text: 'text-red-400', bg: 'bg-red-400/10', glow: 'hover:shadow-red-500/15 hover:border-red-500/30' },
  career:      { text: 'text-indigo-400', bg: 'bg-indigo-400/10', glow: 'hover:shadow-indigo-500/15 hover:border-indigo-500/30' },
  community:   { text: 'text-amber-400', bg: 'bg-amber-400/10', glow: 'hover:shadow-amber-500/15 hover:border-amber-500/30' },
}

const schoolNames: Record<string, string> = {
  foundations: 'AI Foundations',
  automation: 'AI Automation',
  business: 'AI for Business',
  creator: 'Creator & Income',
  builder: 'AI Builder',
  career: 'AI Career',
  community: 'Community',
}

/* ─── Shimmer skeleton ─── */
function CardSkeleton() {
  return (
    <div className="bg-earth-900 border border-earth-800 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative h-48 bg-earth-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-earth-700/30 to-transparent animate-shimmer-slide" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="w-24 h-5 bg-earth-800 rounded-full" />
        <div className="w-full h-4 bg-earth-800 rounded" />
        <div className="w-3/4 h-4 bg-earth-800 rounded" />
        <div className="flex-1" />
        <div className="flex gap-2">
          <div className="w-12 h-5 bg-earth-800 rounded" />
          <div className="w-12 h-5 bg-earth-800 rounded" />
          <div className="w-16 h-5 bg-earth-800 rounded" />
        </div>
      </div>
    </div>
  )
}

/* ─── SVG Progress Ring ─── */
function ProgressRing({ pct }: { pct: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg width="44" height="44" className="absolute top-3 right-3 drop-shadow-md" aria-label={`${pct}% complete`}>
      <circle cx="22" cy="22" r={r} fill="#0C0A09" fillOpacity={0.75} stroke="#292524" strokeWidth="3" />
      <circle
        cx="22" cy="22" r={r}
        fill="none"
        stroke="#FF7A00"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 22 22)"
        className="transition-all duration-700 ease-out"
      />
      <text x="22" y="23" textAnchor="middle" dominantBaseline="middle" className="fill-white text-[10px] font-bold">
        {pct}%
      </text>
    </svg>
  )
}

export default function CourseCard({ course, progress, skeleton }: CourseCardProps) {
  if (skeleton) return <CardSkeleton />

  const colors = schoolColors[course.school] || schoolColors.automation
  const hours = Math.floor(course.duration / 60)
  const mins = course.duration % 60

  // Fake "enrolled this week" social proof — derived from enrolledCount
  const enrolledThisWeek = Math.max(12, Math.floor(course.enrolledCount * 0.04))

  return (
    <Link href={`/courses/${course.slug}`} className="block group">
      <div className={`bg-earth-900 border border-earth-800 rounded-2xl overflow-hidden
        hover:-translate-y-1.5 hover:shadow-xl ${colors.glow}
        transition-all duration-300 h-full flex flex-col`}
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-earth-800 to-earth-900 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {course.school === 'foundations' ? '🧠' :
               course.school === 'automation' ? '⚡' :
               course.school === 'business' ? '🏢' :
               course.school === 'creator' ? '💰' :
               course.school === 'builder' ? '🔧' :
               course.school === 'career' ? '🎯' : '🌍'}
            </div>
          </div>
          <div className="absolute inset-0 bg-grid opacity-30" />

          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-earth-950/80 text-earth-300 capitalize border border-earth-700">
              {course.level}
            </span>
          </div>

          {/* Progress ring OR Price badge */}
          {typeof progress === 'number' && progress > 0 ? (
            <ProgressRing pct={progress} />
          ) : (
            <div className="absolute top-3 right-3">
              {course.isFree ? (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-forest-500/20 text-forest-400 border border-forest-500/30">
                  FREE
                </span>
              ) : (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-earth-950/80 text-earth-300 border border-earth-700">
                  ${course.price}
                </span>
              )}
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-earth-950/40">
            <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
              <Play size={20} className="text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Social proof badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-earth-950/80 backdrop-blur-sm border border-earth-700 rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TrendingUp size={10} className="text-forest-400" />
            <span className="text-[10px] text-earth-300 font-medium">{enrolledThisWeek} enrolled this week</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* School tag */}
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit ${colors.text} ${colors.bg}`}>
            {schoolNames[course.school] || course.school}
          </span>

          <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-brand-300 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-earth-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          {/* Tools */}
          {course.toolsCovered && course.toolsCovered.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {course.toolsCovered.slice(0, 3).map((tool) => (
                <span key={tool} className="text-xs px-2 py-0.5 bg-earth-800 text-earth-400 rounded-md">
                  {tool}
                </span>
              ))}
              {course.toolsCovered.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-earth-800 text-earth-500 rounded-md">
                  +{course.toolsCovered.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-earth-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={13} fill="currentColor" />
                <span className="text-xs font-medium">{course.rating?.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-earth-500">
                <Users size={13} />
                <span className="text-xs">{course.enrolledCount?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-earth-500">
                <Clock size={13} />
                <span className="text-xs">{hours}h{mins > 0 ? ` ${mins}m` : ''}</span>
              </div>
            </div>
            {course.isPremium && (
              <Lock size={13} className="text-brand-500" />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
