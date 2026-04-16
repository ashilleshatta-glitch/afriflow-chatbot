'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  country: string
  role: string
  subscriptionTier: string
  xp: number
  streak: number
  bio?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string; country?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('afriflow-token')
      const savedUser = localStorage.getItem('afriflow-user')
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch {
      // Invalid stored data
      localStorage.removeItem('afriflow-token')
      localStorage.removeItem('afriflow-user')
    }
    setIsLoading(false)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('afriflow-token', token)
      localStorage.setItem('afriflow-user', JSON.stringify(user))
    }
  }, [token, user])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password)
      const { token: newToken, user: userData } = res.data
      setToken(newToken)
      setUser(userData)
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed'
      return { success: false, error: message }
    }
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string; country?: string }) => {
    try {
      const res = await authApi.register(data)
      const { token: newToken, user: userData } = res.data
      setToken(newToken)
      setUser(userData)
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed'
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('afriflow-token')
    localStorage.removeItem('afriflow-user')
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const res = await authApi.getProfile()
      const userData = res.data.user
      setUser({
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        country: userData.country,
        role: userData.role,
        subscriptionTier: userData.subscriptionTier,
        xp: userData.xp,
        streak: userData.streak,
        bio: userData.bio,
        avatar: userData.avatar,
      })
    } catch {
      // Token might be invalid
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
