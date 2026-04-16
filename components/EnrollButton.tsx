'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Play, BookOpen, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useEnrollment } from '@/hooks/useEnrollment'

interface EnrollButtonProps {
  courseSlug: string
  isFree: boolean
  price: number
}

export default function EnrollButton({ courseSlug, isFree, price }: EnrollButtonProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { isEnrolled, enrollment, enroll, isLoading } = useEnrollment(courseSlug)
  const [enrolling, setEnrolling] = useState(false)

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/register')
      return
    }

    setEnrolling(true)
    const result = await enroll()
    setEnrolling(false)

    if (result.success) {
      toast.success(`Enrolled! +${result.data?.xpAwarded || 25} XP earned 🎉`)
    } else {
      toast.error(result.error || 'Enrollment failed')
    }
  }

  if (isLoading) {
    return (
      <button disabled className="btn-primary w-full justify-center py-3.5 text-base mb-3 opacity-50">
        <Loader2 size={17} className="animate-spin" /> Loading...
      </button>
    )
  }

  if (isEnrolled) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => router.push(`/courses/${courseSlug}/lessons/1`)}
          className="btn-primary w-full justify-center py-3.5 text-base"
        >
          <Play size={17} fill="white" />
          {enrollment?.progress > 0 ? 'Continue Learning' : 'Start Learning'}
        </button>
        {enrollment?.progress > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs text-earth-400 mb-1">
              <span>{enrollment.progress}% complete</span>
              <span>{enrollment.completedLessons?.length || 0}/{enrollment.totalLessons || 8} lessons</span>
            </div>
            <div className="w-full bg-earth-700 rounded-full h-1.5">
              <div className="progress-bar h-1.5 transition-all duration-700" style={{ width: `${enrollment.progress}%` }} />
            </div>
          </div>
        )}
        <p className="text-forest-400 text-xs text-center flex items-center justify-center gap-1">
          <CheckCircle size={12} /> Enrolled
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={enrolling}
      className="btn-primary w-full justify-center py-3.5 text-base mb-3"
    >
      {enrolling ? (
        <><Loader2 size={17} className="animate-spin" /> Enrolling...</>
      ) : (
        <>{isFree ? 'Enroll Free' : 'Enroll Now'} <ArrowRight size={17} /></>
      )}
    </button>
  )
}
