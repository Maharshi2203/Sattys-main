'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, ThumbsDown, CheckCircle2, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import type { Review, ReviewStats } from '@/lib/types'

interface ReviewSectionProps {
  productId: number
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'highest'>('helpful')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    rating: 0,
    title: '',
    comment: ''
  })
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [productId, sortBy])

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&sortBy=${sortBy}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.user_name || !formData.rating) {
      toast.error('Please enter your name and rating')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, product_id: productId })
      })

      if (res.ok) {
        toast.success('Review submitted successfully!')
        setShowModal(false)
        setFormData({ user_name: '', user_email: '', rating: 0, title: '', comment: '' })
        fetchReviews()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit review')
      }
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleHelpful(reviewId: number) {
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful_increment: true })
      })
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
      ))
    } catch { }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
  }

  const ratingLabels = ['Poor', 'Average', 'Good', 'Very Good', 'Excellent']
  const ratingColors = ['bg-rose-500', 'bg-amber-400', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500']

  if (loading) {
    return (
      <div className="space-y-12 py-12 border-t border-border/50">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="lg:w-2/3 space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-12 py-12 border-t border-border/50">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-foreground">Ratings & Reviews</h2>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
                Based on {stats?.total || 0} verified curators
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center space-y-1">
                <div className="text-6xl font-display font-black text-foreground">
                  {stats?.average?.toFixed(1) || '0.0'}
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= Math.round(stats?.average || 0) ? 'fill-current' : 'fill-current opacity-30'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {[5, 4, 3, 2, 1].map((rating, idx) => {
                  const count = stats?.distribution[rating as keyof typeof stats.distribution] || 0
                  const percentage = stats?.total ? (count / stats.total) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-16">
                        {ratingLabels[rating - 1]}
                      </span>
                      <Progress value={percentage} className="h-1.5 flex-1 bg-muted" indicatorClassName={ratingColors[rating - 1]} />
                      <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest border-border text-xs gap-2"
            >
              Rate This Product
            </Button>
          </div>

          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Curated Testimonials</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSortBy('helpful')}
                  className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'helpful' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Most Helpful
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'recent' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Recent
                </button>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pb-8 border-b border-border/30 last:border-0 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1 text-white px-1.5 py-0.5 rounded text-[10px] font-black ${review.rating >= 4 ? 'bg-emerald-600' : review.rating >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                        {review.rating} <Star className="w-2.5 h-2.5 fill-current" />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {formatDate(review.created_at)}
                      </span>
                    </div>

                    {review.title && (
                      <h4 className="font-bold text-foreground">{review.title}</h4>
                    )}

                    <p className="text-sm font-medium leading-relaxed text-foreground/80">{review.comment}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground uppercase">
                          {review.user_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest">{review.user_name}</span>
                            {review.is_verified_purchase && (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">Verified Curator</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="flex items-center gap-1.5 text-muted-foreground hover:text-[#C8102B] transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">{review.helpful_count}</span>
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${star <= (hoverRating || formData.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-sm text-amber-600 font-medium">{ratingLabels[formData.rating - 1]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Name *</label>
                  <input
                    type="text"
                    value={formData.user_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email (optional)</label>
                  <input
                    type="email"
                    value={formData.user_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Review Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Sum up your experience"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Review</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !formData.rating || !formData.user_name}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
