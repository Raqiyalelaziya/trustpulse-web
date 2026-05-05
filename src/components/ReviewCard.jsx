import { useState } from 'react';
import { ThumbsUp, ShieldCheck, Flag, Share2, MessageCircle, BadgeCheck, X, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ review, onClose }) {
  const text = review.review_text || review.comment || ''
  const shareText = `⭐ ${review.rating}/5 — "${text.slice(0, 100)}${text.length > 100 ? '...' : ''}" — Review from TrustPulse UAE`
  const encoded = encodeURIComponent(shareText)

  const options = [
    {
      label: 'WhatsApp',
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encoded}`,
    },
    {
      label: 'X / Twitter',
      color: 'bg-black',
      url: `https://twitter.com/intent/tweet?text=${encoded}`,
    },
    {
      label: 'Facebook',
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encoded}`,
    },
    {
      label: 'Copy Link',
      color: 'bg-primary',
      action: () => {
        navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`)
        toast.success('Copied to clipboard!')
        onClose()
      },
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold">Share Review</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-sm text-muted-foreground italic">
          "{text.slice(0, 80)}{text.length > 80 ? '...' : ''}"
        </div>
        <div className="flex items-center gap-2 text-xs text-primary">
          <BadgeCheck className="h-4 w-4" />
          Shared by a Verified TrustPulse Reviewer
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                if (opt.action) { opt.action() }
                else { window.open(opt.url, '_blank'); onClose() }
              }}
              className={cn('text-white rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80', opt.color)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Comments Section ──────────────────────────────────────────────────────────
function CommentsSection({ reviewId, currentUser, initialCount }) {
  const [open,       setOpen]       = useState(false)
  const [comments,   setComments]   = useState([])
  const [text,       setText]       = useState('')
  const [loaded,     setLoaded]     = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function loadComments() {
    const data = await base44.entities.Comment.filter({ review_id: reviewId }, '-created_at', 20)
    setComments(data)
    setLoaded(true)
  }

  function toggle() {
    if (!open && !loaded) loadComments()
    setOpen(!open)
  }

  async function submitComment() {
    if (!text.trim() || !currentUser) return
    setSubmitting(true)
    await base44.entities.Comment.create({
      review_id:      reviewId,
      commenter_name: currentUser.full_name || currentUser.display_name || 'Anonymous',
      commenter_email:currentUser.email,
      comment_text:   text.trim(),
    })
    setText('')
    await loadComments()
    setSubmitting(false)
    toast.success('Comment added!')
  }

  const count = comments.length || initialCount || 0

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {open ? 'Hide' : `${count} Comment${count !== 1 ? 's' : ''}`}
      </button>

      {open && (
        <div className="mt-3 space-y-3 pt-3 border-t border-border/50">
          {comments.length === 0 && loaded && (
            <p className="text-xs text-muted-foreground text-center py-2">No comments yet — be the first!</p>
          )}
          {comments.map((c, i) => (
            <div key={c.id || i} className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">
                  {(c.commenter_name || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 bg-secondary/50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold">{c.commenter_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.comment_text}</p>
              </div>
            </div>
          ))}

          {currentUser ? (
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">
                  {(currentUser.full_name || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Add a comment…"
                  className="flex-1 bg-secondary/50 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={submitComment}
                  disabled={submitting || !text.trim()}
                  className="p-2 bg-primary text-white rounded-xl disabled:opacity-50"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center">Log in to comment</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main ReviewCard ───────────────────────────────────────────────────────────
export default function ReviewCard({ review, currentUser, onUpdate }) {
  const [liking,    setLiking]    = useState(false)
  const [liked,     setLiked]     = useState(false)
  const [likeCount, setLikeCount] = useState(review.likes || 0)
  const [showShare, setShowShare] = useState(false)

  // Field name normalisation — handles both API styles
  const reviewText   = review.review_text || review.comment || ''
  const isVerified   = review.is_verified || review.verified || false
  const reviewerName = review.reviewer_name || 'Anonymous'
  const createdAt    = review.created_at || review.created_date || null
  const canShare     = review.reviewer_verified || isVerified

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString('en-AE', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  async function handleLike() {
    if (liking || !currentUser) {
      if (!currentUser) toast.error('Please log in to like reviews')
      return
    }
    setLiking(true)
    setLiked((prev) => !prev)
    setLikeCount((prev) => liked ? prev - 1 : prev + 1)
    try {
      await base44.entities.Review.update(review.id, {
        likes: liked ? Math.max(0, likeCount - 1) : likeCount + 1,
      })
      onUpdate?.()
    } catch { /* optimistic update already applied */ }
    setLiking(false)
  }

  async function handleReport() {
    if (!currentUser) { toast.error('Please log in to report reviews'); return }
    try {
      await base44.entities.Review.update(review.id, { reported: true })
      toast.success('Review reported')
      onUpdate?.()
    } catch {
      toast.error('Could not report review')
    }
  }

  return (
    <>
      {showShare && <ShareModal review={review} onClose={() => setShowShare(false)} />}

      <div className="bg-card rounded-xl border border-border/50 p-5 space-y-3 transition-all hover:shadow-md">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {reviewerName[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{reviewerName}</p>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
                {(review.reviewer_trust >= 75 || review.reviewer_verified) && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <BadgeCheck className="h-3 w-3" /> Trusted User
                  </span>
                )}
              </div>
              {dateStr && <p className="text-xs text-muted-foreground">{dateStr}</p>}
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        {/* Review text */}
        {reviewText ? (
          <p className="text-sm text-foreground/80 leading-relaxed">{reviewText}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No review text</p>
        )}

        {/* Evidence link */}
        {review.evidence_url && (
          <a
            href={review.evidence_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            📎 View evidence
          </a>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1 flex-wrap">
          <button
            onClick={handleLike}
            disabled={liking}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors',
              liked ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <ThumbsUp className={cn('h-3.5 w-3.5', liked && 'fill-primary')} />
            {likeCount}
          </button>

          <CommentsSection
            reviewId={review.id}
            currentUser={currentUser}
            initialCount={review.comments_count || 0}
          />

          {canShare && (
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          )}

          {currentUser && (
            <button
              onClick={handleReport}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </button>
          )}
        </div>
      </div>
    </>
  )
}
