'use client'

import { useState, useEffect, useCallback } from 'react'
import { enrollmentsApi, progressApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export function useEnrollment(courseSlug?: string) {
  const { isAuthenticated, updateUser, user } = useAuth()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<any[]>([])

  // Check enrollment status for a specific course
  const checkEnrollment = useCallback(async () => {
    if (!isAuthenticated || !courseSlug) {
      setIsLoading(false)
      return
    }
    try {
      const res = await progressApi.getCourseProgress(courseSlug)
      setIsEnrolled(res.data.enrolled)
      setEnrollment(res.data)
    } catch {
      setIsEnrolled(false)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, courseSlug])

  // Fetch all enrollments
  const fetchEnrollments = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await enrollmentsApi.list()
      setEnrollments(res.data.enrollments)
    } catch {
      // Ignore
    }
  }, [isAuthenticated])

  // Enroll in a course
  const enroll = useCallback(async () => {
    if (!courseSlug) return { success: false }
    try {
      const res = await enrollmentsApi.enroll(courseSlug)
      setIsEnrolled(true)
      setEnrollment(res.data.enrollment)
      if (user) {
        updateUser({ xp: user.xp + (res.data.xpAwarded || 0) })
      }
      return { success: true, data: res.data }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Enrollment failed' }
    }
  }, [courseSlug, user, updateUser])

  // Unenroll
  const unenroll = useCallback(async () => {
    if (!courseSlug) return { success: false }
    try {
      await enrollmentsApi.unenroll(courseSlug)
      setIsEnrolled(false)
      setEnrollment(null)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Unenroll failed' }
    }
  }, [courseSlug])

  // Complete a lesson
  const completeLesson = useCallback(async (lessonId: string) => {
    if (!courseSlug) return { success: false }
    try {
      const res = await progressApi.completeLesson(courseSlug, lessonId)
      setEnrollment(res.data.enrollment)
      if (user) {
        updateUser({ xp: user.xp + (res.data.xpAwarded || 0) })
      }
      return { success: true, data: res.data }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to complete lesson' }
    }
  }, [courseSlug, user, updateUser])

  useEffect(() => {
    if (courseSlug) {
      checkEnrollment()
    } else {
      fetchEnrollments()
    }
  }, [checkEnrollment, fetchEnrollments, courseSlug])

  return {
    isEnrolled,
    enrollment,
    enrollments,
    isLoading,
    enroll,
    unenroll,
    completeLesson,
    refresh: courseSlug ? checkEnrollment : fetchEnrollments,
  }
}
