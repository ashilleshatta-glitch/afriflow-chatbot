'use client'

import { useState, useEffect, useCallback } from 'react'
import { dashboardApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface DashboardData {
  user: any
  stats: {
    xp: number
    xpLevel: number
    xpInCurrentLevel: number
    xpToNextLevel: number
    streak: number
    totalCourses: number
    completedCourses: number
    inProgressCourses: number
    certificates: number
    totalXpFromCourses: number
  }
  enrollments: any[]
  certificates: any[]
  currentCourse: any | null
  recentActivity: any[]
  weeklyActivity: any[]
  dailyActivity: Record<string, { count: number; xp: number }>
}

export function useDashboard() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const res = await dashboardApi.getData()
      setData(res.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, isLoading, error, refresh: fetchDashboard }
}
