import { useState } from 'react';
import { ThumbsUp, ShieldCheck, Flag, Share2, MessageCircle, BadgeCheck, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BASE_URL = 'https://trustpulse-api.onrender.com';
const getToken = () => localStorage.getItem('trustpulse_token');

function ShareModal({ review, onClose }) {
  const text = review.review_text || review.comment || '';
  const shareText = `⭐ ${review.rating}/5 — "${text.slice(0, 100)}${text.length > 100 ? '...' : ''}" — Review from TrustPulse UAE`;
  const encoded = encodeURIComponent(shareText);
  const options = [
    { label: 'WhatsApp',  color: 'bg-green-500', url: `https://wa.me/?text=${encoded}` },
    { label: 'X/Twitter', color: 'bg-black',     url: `https://twitter.com/intent/tweet?text=${encoded}` },
    { label: 'Facebook',  color: 'bg-blue-600',  url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encoded}` },
    { label: 'Copy Link', color: 'bg-primary',   action: () => { navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`); toast.success('Copied!'); onClose(); } },
  ];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold">Share Review</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-sm text-muted-foreground italic line-clamp-2">"{text.slice(0, 80)}"</div>
        <div className="flex items-center gap-2 text-xs text-primary"><BadgeCheck className="h-4 w-4" /> Shared by a Verified TrustPulse Reviewer</div>
        <div className="grid grid-cols-2 gap-3">
          {options.map(opt => (
            <button key={opt.label} onClick={() => { if (opt.action) opt.action(); else { window.open(opt.url, '_blank'); onClose(); } }}
              className={cn('text-white rounded-xl py-2.5 text-sm font-medium hover:opacity-80 transition-opacity', opt.color)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsSection({ reviewId, currentUser }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(0);

  async function loadComments() {
    try {
      const res = await fetch(`${BASE_URL}/comments?review_id=${reviewId}`);
      if (res.ok) { const data = await res.json(); setComments(Array.isArray(data) ? data : []); setCount(Array.isArray(data) ? data.length : 0); }
    } catch { }
    setLoaded(true);
  }

  function toggle() { if (!open && !loaded) loadComments(); setOpen(v => !v); }

  async function submitComment() {
    if (!text.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ review_id: String(reviewId), commenter_name: currentUser.full_name || 'Anonymous', commenter_email: currentUser.email || '', comment_text: text.trim() }),
      });
      if (res.ok) { setText(''); await loadComments(); toast.success('Comment added!'); }
      else toast.error('Could not add comment');
    } catch { toast.error('Could not add comment'); }
    setSubmitting(false);
  }

  return (
    <div className="space-y-2">
      <button onClick={toggle} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
        <MessageCircle className="h-3.5 w-3.5" />
        {count > 0 ? `${count} Comment${count !== 1 ? 's' : ''}` : 'Comment'}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 space-y-3 pl-2 border-l-2 border-border/40">
          {!loaded && <div className="h-4 w-24 bg-secondary rounded animate-pulse" />}
          {loaded && comments.length === 0 && <p className="text-xs text-muted-foreground italic">No comments yet — be the first!</p>}
          {comments.map((c, i) => (
            <div key={c.id || i} className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">{(c.commenter_name || '?')[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 bg-secondary/40 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-foreground">{c.commenter_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.comment_text}</p>
              </div>
            </div>
          ))}
          {currentUser ? (
            <div className="flex gap-2 mt-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-[10px] font-bold text-primary">{(currentUser.full_name || '?')[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 flex gap-1.5">
                <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitComment()}
                  placeholder="Add a comment…" className="flex-1 bg-secondary/40 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 border border-border/30 transition-all" />
                <button onClick={submitComment} disabled={submitting || !text.trim()} className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0">
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : <p className="text-xs text-muted-foreground italic">Log in to comment</p>}
        </div>
      )}
    </div>
  );
}

export default function ReviewCard({ review, currentUser, onUpdate }) {
  // ✅ All hooks declared first — React rules compliant
  const [liked,     setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(review?.likes || 0);
  const [liking,    setLiking]    = useState(false);
  const [showShare, setShowShare] = useState(false);

  // ✅ Guard AFTER hooks
  if (!review) return null;

  const reviewText   = review.review_text || review.comment || '';
  const isVerified   = review.is_verified || review.verified || false;
  const reviewerName = review.reviewer_name || 'Anonymous';
  const createdAt    = review.created_at || review.created_date || null;
  const canShare     = review.reviewer_verified || isVerified;
  const dateStr      = createdAt ? new Date(createdAt).toLocaleDateString('en-AE', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  async function handleLike() {
    if (liking) return;
    if (!currentUser) { toast.error('Please log in to like reviews'); return; }
    setLiking(true);
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(newLiked);
    setLikeCount(newCount);
    try {
      await fetch(`${BASE_URL}/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ likes: newCount }),
      });
      onUpdate?.();
    } catch { }
    setLiking(false);
  }

  async function handleReport() {
    if (!currentUser) { toast.error('Please log in to report reviews'); return; }
    try {
      await fetch(`${BASE_URL}/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ reported: true }),
      });
      toast.success('Review reported');
      onUpdate?.();
    } catch { toast.error('Could not report review'); }
  }

  return (
    <>
      {showShare && <ShareModal review={review} onClose={() => setShowShare(false)} />}
      <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4 hover:shadow-md transition-all hover:border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
              <span className="text-sm font-black text-primary">{reviewerName[0].toUpperCase()}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{reviewerName}</p>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-2.5 w-2.5" /> VERIFIED
                  </span>
                )}
                {(review.reviewer_trust >= 75 || review.reviewer_verified) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <BadgeCheck className="h-2.5 w-2.5" /> TRUSTED
                  </span>
                )}
              </div>
              {dateStr && <p className="text-xs text-muted-foreground mt-0.5">{dateStr}</p>}
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <div className={cn('rounded-xl p-3.5 text-sm leading-relaxed', reviewText ? 'bg-secondary/30 text-foreground/80 border border-border/30' : 'text-muted-foreground italic')}>
          {reviewText || 'No review text provided'}
        </div>
        {review.evidence_url && (
          <a href={review.evidence_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
            📎 View evidence
          </a>
        )}
        <div className="border-t border-border/40" />
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={handleLike} disabled={liking}
            className={cn('flex items-center gap-1.5 text-xs font-medium transition-all px-2.5 py-1.5 rounded-lg',
              liked ? 'text-primary bg-primary/10 border border-primary/20' : 'text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent')}>
            <ThumbsUp className={cn('h-3.5 w-3.5', liked && 'fill-primary')} />
            {likeCount > 0 ? likeCount : 'Like'}
          </button>
          <CommentsSection reviewId={review.id} currentUser={currentUser} />
          {canShare && (
            <button onClick={() => setShowShare(true)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary/50">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          )}
          {currentUser && (
            <button onClick={handleReport} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto px-2 py-1.5 rounded-lg hover:bg-destructive/5">
              <Flag className="h-3.5 w-3.5" /> Report
            </button>
          )}
        </div>
      </div>
    </>
  );
}
