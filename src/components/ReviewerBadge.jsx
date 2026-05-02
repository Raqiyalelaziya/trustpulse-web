import { cn } from '@/lib/utils';
import { Crown, Star, Flame, ThumbsUp } from 'lucide-react';

// Badge tiers based on total_reviews + total_likes_received
const BADGES = [
  {
    id: 'top_contributor',
    label: 'Top Contributor',
    icon: Crown,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    // 50+ reviews OR 200+ likes
    check: (reviews, likes) => reviews >= 50 || likes >= 200,
  },
  {
    id: 'expert_reviewer',
    label: 'Expert Reviewer',
    icon: Star,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    // 20+ reviews OR 80+ likes
    check: (reviews, likes) => reviews >= 20 || likes >= 80,
  },
  {
    id: 'helpful',
    label: 'Helpful',
    icon: ThumbsUp,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    // 5+ reviews OR 20+ likes
    check: (reviews, likes) => reviews >= 5 || likes >= 20,
  },
  {
    id: 'rising_star',
    label: 'Rising Star',
    icon: Flame,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    // 1+ reviews
    check: (reviews) => reviews >= 1,
  },
];

export function getReviewerBadge(totalReviews = 0, totalLikes = 0) {
  return BADGES.find((b) => b.check(totalReviews, totalLikes)) || null;
}

export default function ReviewerBadge({ totalReviews = 0, totalLikes = 0, size = 'sm' }) {
  const badge = getReviewerBadge(totalReviews, totalLikes);
  if (!badge) return null;

  const Icon = badge.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        badge.color,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      )}
    >
      <Icon className="h-3 w-3" />
      {badge.label}
    </span>
  );
}