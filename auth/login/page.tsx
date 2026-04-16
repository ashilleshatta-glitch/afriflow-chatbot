'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await login(form.email, form.password)
      if (!result.success) throw new Error(result.error || 'Login failed')
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-earth-400">Sign in to continue your AI journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-earth-300 mb-2">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500" />
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-300 mb-2">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-earth-700 bg-earth-800" />
            <span className="text-sm text-earth-400">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-brand-400 hover:text-brand-300">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary justify-center py-3.5 text-base"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign in →'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-earth-500 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign up free
          </Link>
        </p>
      </div>

      {/* Demo account */}
      <div className="mt-6 p-4 bg-earth-800/50 border border-earth-700 rounded-xl">
        <p className="text-xs text-earth-500 mb-2 font-medium">Demo account</p>
        <button
          type="button"
          onClick={() => setForm({ email: 'demo@afriflowai.com', password: 'demo1234' })}
          className="text-xs text-brand-400 hover:text-brand-300"
        >
          Click to fill demo credentials →
        </button>
      </div>
    </div>
  )
}
