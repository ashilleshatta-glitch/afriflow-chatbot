'use client'

import { useState, useCallback } from 'react'
import { bookmarksApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export function useBookmark(courseSlug?: string) {
  const { isAuthenticated } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setIsLoading(true)
      const res = await bookmarksApi.list()
      setBookmarks(res.data.bookmarks)
      if (courseSlug) {
        setIsBookmarked(res.data.bookmarks.some((b: any) => b.courseSlug === courseSlug))
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, courseSlug])

  const toggle = useCallback(async (slug?: string) => {
    const targetSlug = slug || courseSlug
    if (!targetSlug || !isAuthenticated) return
    try {
      const res = await bookmarksApi.toggle(targetSlug)
      setIsBookmarked(res.data.bookmarked)
      await fetchBookmarks()
      return res.data
    } catch {
      return null
    }
  }, [courseSlug, isAuthenticated, fetchBookmarks])

  return { isBookmarked, bookmarks, isLoading, toggle, fetchBookmarks }
}
