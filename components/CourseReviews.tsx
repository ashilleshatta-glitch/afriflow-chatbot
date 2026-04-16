'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, MessageSquare, User, Send, Loader2 } from 'lucide-react'
import { reviewsApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface Review {
  _id: string
  userName: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: string
}

export default function CourseReviews({ courseSlug }: { courseSlug: string }) {
  const { isAuthenticated, user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [courseSlug])

  const fetchReviews = async () => {
    try {
      const res = await reviewsApi.list(courseSlug)
      setReviews(res.data.reviews)
      setAvgRating(res.data.avgRating)
      setTotalReviews(res.data.total)
    } catch {
      // Silent fail — reviews are optional
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) {
      toast.error('Please select a rating')
      return
    }
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      await reviewsApi.create({ courseSlug, rating, title, content })
      toast.success('Review submitted! +30 XP ⚡')
      setShowForm(false)
      setRating(0)
      setTitle('')
      setContent('')
      fetchReviews()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit review')
    }
    setSubmitting(false)
  }

  const renderStars = (value: number, size: number = 14) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={size}
          className={s <= value ? 'text-amber-400' : 'text-earth-700'}
          fill={s <= value ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => Math.round(rev.rating) === r).length,
    pct: totalReviews > 0 ? (reviews.filter(rev => Math.round(rev.rating) === r).length / totalReviews) * 100 : 0,
  }))

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-display font-bold text-2xl flex items-center gap-2">
          <MessageSquare size={20} className="text-brand-400" />
          Reviews
          {totalReviews > 0 && (
            <span className="text-earth-500 text-base font-normal">({totalReviews})</span>
          )}
        </h2>
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary py-2 text-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating summary */}
      {totalReviews > 0 && (
        <div className="bg-earth-900 border border-earth-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-1">{avgRating}</div>
              {renderStars(Math.round(avgRating), 18)}
              <p className="text-earth-500 text-sm mt-1">{totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {ratingDistribution.map(rd => (
                <div key={rd.stars} className="flex items-center gap-3">
                  <span className="text-earth-400 text-xs w-8">{rd.stars}★</span>
                  <div className="flex-1 bg-earth-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${rd.pct}%` }}
                    />
                  </div>
                  <span className="text-earth-500 text-xs w-8 text-right">{rd.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-earth-900 border border-brand-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-semibold">Write your review</h3>

          {/* Star rating input */}
          <div>
            <label className="text-earth-400 text-sm mb-2 block">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  className="p-1 transition-transform hover:scale-125"
                  aria-label={`Rate ${s} stars`}
                >
                  <Star
                    size={28}
                    className={s <= (hoverRating || rating) ? 'text-amber-400' : 'text-earth-600'}
                    fill={s <= (hoverRating || rating) ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-earth-400 text-sm ml-2">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-earth-400 text-sm mb-1 block">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="input-field"
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-earth-400 text-sm mb-1 block">Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what you learned, what stood out, and who this course is great for..."
              className="input-field min-h-[100px] resize-y"
              maxLength={1000}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary py-2.5 text-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-earth-500 hover:text-earth-300 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-earth-900 border border-earth-800 rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-earth-800 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-earth-800 rounded mb-1" />
                  <div className="h-3 w-20 bg-earth-800/60 rounded" />
                </div>
              </div>
              <div className="h-4 w-48 bg-earth-800 rounded mb-2" />
              <div className="h-3 w-full bg-earth-800/40 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-earth-900 border border-earth-800 rounded-xl p-8 text-center">
          <MessageSquare size={32} className="text-earth-600 mx-auto mb-3" />
          <p className="text-earth-400">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-earth-900 border border-earth-800 rounded-xl p-5 hover:border-earth-700 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500/20 to-forest-500/20 border border-earth-700 rounded-full flex items-center justify-center text-sm font-bold text-brand-400">
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-earth-600 text-xs">{timeAgo(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="text-white text-sm font-semibold mb-1">{review.title}</h4>
              <p className="text-earth-400 text-sm leading-relaxed">{review.content}</p>
              {review.helpful > 0 && (
                <div className="mt-3 flex items-center gap-1 text-earth-600 text-xs">
                  <ThumbsUp size={12} /> {review.helpful} found this helpful
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
