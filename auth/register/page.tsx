'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, User, Mail, Lock, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { AFRICAN_COUNTRIES } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    country: 'Ghana',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setIsLoading(true)
    try {
      const result = await register(form)
      if (!result.success) throw new Error(result.error || 'Registration failed')
      toast.success('Welcome to AfriFlow AI! 🎉')
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
        <h1 className="font-display text-3xl font-bold text-white mb-2">Start your AI journey</h1>
        <p className="text-earth-400">Join 24,000+ Africans learning and earning with AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-earth-300 mb-2">Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500" />
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
              className="input-field pl-10"
            />
          </div>
        </div>

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
          <label className="block text-sm font-medium text-earth-300 mb-2">Country</label>
          <div className="relative">
            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500" />
            <select
              value={form.country}
              onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
              className="input-field pl-10 appearance-none"
            >
              {AFRICAN_COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-300 mb-2">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="At least 6 characters"
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

        <div className="flex items-start gap-2 pt-1">
          <input type="checkbox" required className="mt-0.5 rounded border-earth-700 bg-earth-800" />
          <p className="text-sm text-earth-400">
            I agree to the{' '}
            <Link href="/terms" className="text-brand-400 hover:text-brand-300">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-brand-400 hover:text-brand-300">Privacy Policy</Link>
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary justify-center py-3.5 text-base mt-2"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Free Account →'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-earth-500 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
