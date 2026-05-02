import { useState } from 'react';
import { ThumbsUp, ShieldCheck, Flag, Share2, MessageCircle, BadgeCheck, X, Send } from 'lucide-react';
import ProofImageCarousel from './ProofImageCarousel';
import { base44 } from '@/api/base44Client';
import StarRating from './StarRating';
import UserTrustBadge from './UserTrustBadge';
import ReviewerBadge from './ReviewerBadge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { toast } from 'sonner';

function ShareModal({ review, onClose }) {
  const text = `⭐ ${review.rating}/5 — "${review.comment?.slice(0, 100)}..." — Review from TrustPulse`;
  const encoded = encodeURIComponent(text);
  const options = [
    { label: 'WhatsApp', color: 'bg-green-500', url: `https://wa.me/?text=${encoded}` },
    { label: 'X / Twitter', color: 'bg-black', url: `https://twitter.com/intent/tweet?text=${encoded}` },
    { label: 'Facebook', color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encoded}` },
    { label: 'Copy Link', color: 'bg-primary', action: () => { navigator.clipboard.writeText(`${text}\n\n${window.location.href}`); toast.success('Copied to clipboard!'); onClose(); } },
  ];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold">Share Review</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-sm text-muted-foreground italic">
          "{review.comment?.slice(0, 80)}..."
        </div>
        <div className="flex items-center gap-2 text-xs text-primary">
          <BadgeCheck className="h-4 w-4" />
          Shared by a Verified TrustPulse Reviewer
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { if (opt.action) { opt.action(); } else { window.open(opt.url, '_blank'); onClose(); } }}
              className={cn('text-white rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80', opt.color)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsSection({ reviewId, currentUser, initialCount }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    const data = await base44.entities.Comment.filter({ review_id: reviewId }, '-created_date', 20);
    setComments(data);
    setLoaded(true);
  }

  function toggle() {
    if (!open && !loaded) loadComments();
    setOpen(!open);
  }

  async function submitComment() {
    if (!text.trim() || !currentUser) return;
    setSubmitting(true);
    await base44.entities.Comment.create({
      review_id: reviewId,
      commenter_name: currentUser.full_name || 'Anonymous',
      commenter_email: currentUser.email,
      comment_text: text.trim(),
    });
    // Update comments_count on review
    await base44.entities.Review.update(reviewId, {
      comments_count: (initialCount || 0) + 1,
    });
    setText('');
    await loadComments();
    setSubmitting(false);
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {open ? 'Hide' : `${initialCount || 0} Comment${(initialCount || 0) !== 1 ? 's' : ''}`}
      </button>
      {open && (
        <div className="mt-3 space-y-3 pt-3 border-t border-border/50">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{(c.commenter_name || '?')[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 bg-secondary/50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold">{c.commenter_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.comment_text}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{(currentUser.full_name || '?')[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Add a comment..."
                  className="flex-1 bg-secondary/50 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button onClick={submitComment} disabled={submitting || !text.trim()} className="p-2 bg-primary text-white rounded-xl disabled:opacity-50">
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewCard({ review, currentUser, onUpdate, reviewerStats }) {
  const [liking, setLiking] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const currentUserEmail = currentUser?.email;
  const isLiked = (review.liked_by || []).includes(currentUserEmail);
  const canShare = review.reviewer_verified;

  async function handleLike() {
    if (liking || !currentUserEmail) return;
    setLiking(true);
    const likedBy = review.liked_by || [];
    const newLikedBy = isLiked
      ? likedBy.filter((e) => e !== currentUserEmail)
      : [...likedBy, currentUserEmail];
    await base44.entities.Review.update(review.id, {
      likes: newLikedBy.length,
      liked_by: newLikedBy,
    });
    onUpdate?.();
    setLiking(false);
  }

  async function handleReport() {
    const reportedBy = review.reported_by || [];
    if (reportedBy.includes(currentUserEmail)) return;
    await base44.entities.Review.update(review.id, {
      reported: true,
      reported_by: [...reportedBy, currentUserEmail],
    });
    toast.success('Review reported');
    onUpdate?.();
  }

  return (
    <>
      {showShare && <ShareModal review={review} onClose={() => setShowShare(false)} />}
      <div className="bg-card rounded-xl border border-border/50 p-5 space-y-3 transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {(review.reviewer_name || '?')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-card-foreground">{review.reviewer_name || 'Anonymous'}</p>
                {review.reviewer_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <BadgeCheck className="h-3 w-3" /> Verified User
                  </span>
                )}
                {reviewerStats && (
                  <ReviewerBadge
                    totalReviews={reviewerStats.total_reviews || 0}
                    totalLikes={reviewerStats.total_likes_received || 0}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {review.created_date ? format(new Date(review.created_date), 'MMM d, yyyy') : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-trust-high bg-trust-high/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3" /> Verified Review
              </span>
            )}
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>

        <p className="text-sm text-card-foreground/80 leading-relaxed">{review.comment}</p>

        {(review.proof_image_urls?.length > 0 || review.proof_image_url) && (
          <ProofImageCarousel
            images={review.proof_image_urls?.length > 0 ? review.proof_image_urls : [review.proof_image_url]}
          />
        )}

        <div className="flex items-center gap-4 pt-1 flex-wrap">
          <button
            onClick={handleLike}
            disabled={liking}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors',
              isLiked ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <ThumbsUp className={cn('h-3.5 w-3.5', isLiked && 'fill-primary')} />
            {review.likes || 0}
          </button>

          <CommentsSection reviewId={review.id} currentUser={currentUser} initialCount={review.comments_count} />

          {canShare && (
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          )}

          {currentUserEmail && currentUserEmail !== review.created_by && (
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
  );
}