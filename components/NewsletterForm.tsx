'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { newsletterApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface NewsletterFormProps {
  source?: string
  className?: string
}

export default function NewsletterForm({ source = 'website', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const res = await newsletterApi.subscribe(email, undefined, source)
      setSubscribed(true)
      toast.success(res.data.message || 'Subscribed! 🚀')
      setEmail('')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Subscription failed')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className={`flex items-center justify-center gap-2 text-forest-400 py-3 ${className}`}>
        <CheckCircle size={18} />
        <span className="font-medium">You&apos;re subscribed! Check your inbox. 🎉</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="input-field flex-1 py-3"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary py-3 px-6 whitespace-nowrap"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <>Subscribe <ArrowRight size={14} /></>}
      </button>
    </form>
  )
}
