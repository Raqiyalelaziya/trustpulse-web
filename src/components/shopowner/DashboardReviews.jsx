// src/components/shopowner/DashboardReviews.jsx
import { ShieldCheck, Star } from 'lucide-react';
import StarRating from '@/components/StarRating';

export default function DashboardReviews({ reviews }) {
  const sorted = [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-extrabold">Reviews</h1>

      {sorted.length === 0 ? (
        <div className="bg-background rounded-2xl border border-border/50 p-12 text-center">
          <Star className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
          <p className="text-muted-foreground">No reviews yet. Share your shop link to get your first review!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((review) => (
            <div key={review.id} className="bg-background rounded-xl border border-border/50 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {(review.reviewer_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.reviewer_name || `User #${review.user_id}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(review.is_verified || review.verified) && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {review.review_text || review.comment}
              </p>
              {review.evidence_url && (
                <a
                  href={review.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View evidence →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
