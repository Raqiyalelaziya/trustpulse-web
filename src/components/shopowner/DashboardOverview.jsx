// src/components/shopowner/DashboardOverview.jsx
import { Star, MessageSquare, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';

export default function DashboardOverview({ shop, reviews, onNavigate }) {
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  const verifiedCount = reviews.filter((r) => r.is_verified || r.verified).length;
  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  const trustScore = shop.trust_score || 0;
  const trustColor =
    trustScore >= 75 ? 'text-green-600 bg-green-50' :
    trustScore >= 50 ? 'text-amber-600 bg-amber-50' :
    'text-red-600 bg-red-50';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold">{shop.name}</h1>
        <p className="text-sm text-muted-foreground">{shop.category} · {shop.platform}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trust Score',      value: `${trustScore}%`,  icon: TrendingUp,   color: 'text-primary' },
          { label: 'Avg Rating',       value: avgRating,          icon: Star,         color: 'text-amber-500' },
          { label: 'Total Reviews',    value: reviews.length,     icon: MessageSquare,color: 'text-blue-500' },
          { label: 'Verified Reviews', value: verifiedCount,      icon: ShieldCheck,  color: 'text-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-background rounded-2xl border border-border/50 p-4 text-center">
            <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-extrabold font-heading">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trust Score Bar */}
      <div className="bg-background rounded-2xl border border-border/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold">Trust Score</h2>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${trustColor}`}>
            {trustScore}%
          </span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              trustScore >= 75 ? 'bg-green-500' :
              trustScore >= 50 ? 'bg-amber-500' : 'bg-red-400'
            }`}
            style={{ width: `${trustScore}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
          <div><p className="font-medium">Ratings (40%)</p><p>{Math.round(trustScore * 0.4)}pts</p></div>
          <div><p className="font-medium">Reviews (30%)</p><p>{Math.round(trustScore * 0.3)}pts</p></div>
          <div><p className="font-medium">Account age (20%)</p><p>{Math.round(trustScore * 0.2)}pts</p></div>
          <div><p className="font-medium">Profile (10%)</p><p>{Math.round(trustScore * 0.1)}pts</p></div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-background rounded-2xl border border-border/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold">Recent Reviews</h2>
          <Button size="sm" variant="ghost" className="gap-1 text-primary" onClick={() => onNavigate('reviews')}>
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        {recentReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="border border-border/50 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{review.reviewer_name || `User #${review.user_id}`}</p>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {review.review_text || review.comment}
                </p>
                {(review.is_verified || review.verified) && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
