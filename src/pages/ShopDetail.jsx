import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ExternalLink, PlusCircle, MessageSquare, ShieldCheck, Search, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';
import ReviewCard from '../components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ShopDetail() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewSort, setReviewSort] = useState('recent');
  const [reviewMinRating, setReviewMinRating] = useState('Any');
  const [reviewVerifiedOnly, setReviewVerifiedOnly] = useState(false);
  const [reviewRecency, setReviewRecency] = useState('Any time');
  const [showReviewFilters, setShowReviewFilters] = useState(false);
  const [reviewerStatsMap, setReviewerStatsMap] = useState({});

  async function loadData() {
    const [shopData, reviewsData] = await Promise.all([
      base44.entities.Shop.filter({ id }, '-created_date', 1),
      base44.entities.Review.filter({ shop_id: id }, '-created_date', 50),
    ]);
    setShop(shopData[0] || null);
    setReviews(reviewsData);

    // Build reviewer stats map from User entity
    const emails = [...new Set(reviewsData.map((r) => r.reviewer_email).filter(Boolean))];
    if (emails.length > 0) {
      const usersData = await base44.entities.User.list('-created_date', 200);
      const map = {};
      usersData.forEach((u) => { if (emails.includes(u.email)) map[u.email] = u; });
      setReviewerStatsMap(map);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    base44.auth.me().then(setUser).catch(() => {});
  }, [id]);

  // Track viewed category for recommendations
  useEffect(() => {
    if (shop?.category) {
      const viewed = JSON.parse(localStorage.getItem('tp_viewed_categories') || '[]');
      const updated = [shop.category, ...viewed.filter((c) => c !== shop.category)].slice(0, 6);
      localStorage.setItem('tp_viewed_categories', JSON.stringify(updated));
    }
  }, [shop?.category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-card rounded-2xl animate-pulse" />
        <div className="h-32 bg-card rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Shop not found</p>
        <Link to="/" className="text-primary hover:underline text-sm mt-2 block">Back to home</Link>
      </div>
    );
  }

  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
    percent: reviews.length > 0 ? (reviews.filter((rev) => rev.rating === r).length / reviews.length) * 100 : 0,
  }));

  const categoryColors = {
    Fashion: 'from-pink-400 to-rose-500',
    Beauty: 'from-purple-400 to-pink-500',
    Electronics: 'from-blue-400 to-indigo-500',
    Accessories: 'from-yellow-400 to-orange-500',
    Home: 'from-green-400 to-teal-500',
    Food: 'from-orange-400 to-red-500',
    Perfume: 'from-violet-400 to-purple-600',
    Handmade: 'from-amber-400 to-yellow-600',
    Health: 'from-emerald-400 to-green-600',
    Sports: 'from-sky-400 to-blue-600',
    Books: 'from-indigo-400 to-blue-700',
    Other: 'from-slate-400 to-slate-600',
  };

  const gradient = categoryColors[shop.category] || categoryColors.Other;
  const initials = shop.name
    ? shop.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="space-y-8">
      {/* Shop Header */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent)]" />
        {/* Platform badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-xs font-medium text-white/90 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {shop.platform}
          </span>
        </div>
        <div className="p-6 md:p-10 flex items-center gap-6">
          {/* Shop Logo */}
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl border-2 border-white/30 shrink-0 shadow-xl overflow-hidden bg-white/20 flex items-center justify-center">
            {shop.shop_icon ? (
              <img src={shop.shop_icon} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading font-extrabold text-white text-4xl md:text-5xl">{initials}</span>
            )}
          </div>
          <div className="flex-1">
            <TrustBadge level={shop.trust_level} size="sm" />
            <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-white mt-1">{shop.name}</h1>
            <span className="text-sm text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block mt-1">{shop.category}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Reviews ({reviews.length})
            </h2>
            <Link to={`/add-review?shop=${id}`}>
              <Button className="rounded-xl gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Review
              </Button>
            </Link>
          </div>

          {reviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search reviews..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Select value={reviewSort} onValueChange={setReviewSort}>
                  <SelectTrigger className="w-44 rounded-xl">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setShowReviewFilters((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors ${
                    showReviewFilters || reviewMinRating !== 'Any' || reviewVerifiedOnly || reviewRecency !== 'Any time'
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
              {showReviewFilters && (
                <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-wrap gap-3 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Min Rating</label>
                    <Select value={reviewMinRating} onValueChange={setReviewMinRating}>
                      <SelectTrigger className="w-28 rounded-xl h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Any', '2+', '3+', '4+', '4.5+'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Recency</label>
                    <Select value={reviewRecency} onValueChange={setReviewRecency}>
                      <SelectTrigger className="w-36 rounded-xl h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Any time', 'Last 7 days', 'Last 30 days', 'Last 3 months'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewVerifiedOnly((v) => !v)}
                    className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors ${
                      reviewVerifiedOnly
                        ? 'bg-trust-high/10 border-trust-high/40 text-trust-high'
                        : 'border-border text-muted-foreground hover:border-trust-high/30'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" /> Verified Only
                  </button>
                  {(reviewMinRating !== 'Any' || reviewVerifiedOnly || reviewRecency !== 'Any time') && (
                    <button
                      onClick={() => { setReviewMinRating('Any'); setReviewVerifiedOnly(false); setReviewRecency('Any time'); }}
                      className="flex items-center gap-1 text-xs text-primary hover:underline h-9"
                    >
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this shop!</p>
              <Link to={`/add-review?shop=${id}`}>
                <Button className="mt-4 rounded-xl">Write a Review</Button>
              </Link>
            </div>
          ) : (() => {
            let filtered = [...reviews];

            if (reviewSearch.trim()) {
              const q = reviewSearch.toLowerCase();
              filtered = filtered.filter((r) =>
                r.comment?.toLowerCase().includes(q) ||
                r.reviewer_name?.toLowerCase().includes(q)
              );
            }

            // Min rating filter
            if (reviewMinRating !== 'Any') {
              const threshold = parseFloat(reviewMinRating);
              filtered = filtered.filter((r) => (r.rating || 0) >= threshold);
            }

            // Verified only
            if (reviewVerifiedOnly) {
              filtered = filtered.filter((r) => r.verified);
            }

            // Recency
            if (reviewRecency !== 'Any time') {
              const days = reviewRecency === 'Last 7 days' ? 7 : reviewRecency === 'Last 30 days' ? 30 : 90;
              const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
              filtered = filtered.filter((r) => r.created_date && new Date(r.created_date).getTime() >= cutoff);
            }

            if (reviewSort === 'highest') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            else if (reviewSort === 'helpful') filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            else filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            return filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reviews match "{reviewSearch}"</p>
            ) : (
              <div className="space-y-4">
                {filtered.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUser={user}
                    onUpdate={loadData}
                    reviewerStats={reviewerStatsMap[review.reviewer_email]}
                  />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Right - Stats */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
            <h3 className="font-heading font-semibold">Rating Overview</h3>
            <div className="text-center space-y-2">
              <p className="text-5xl font-extrabold font-heading text-foreground">
                {(shop.average_rating || 0).toFixed(1)}
              </p>
              <StarRating rating={Math.round(shop.average_rating || 0)} size="lg" />
              <p className="text-sm text-muted-foreground">{shop.review_count || 0} reviews</p>
            </div>
            <div className="space-y-2">
              {ratingDist.map((d) => (
                <div key={d.rating} className="flex items-center gap-3">
                  <span className="text-sm w-3 text-muted-foreground">{d.rating}</span>
                  <Progress value={d.percent} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
            <h3 className="font-heading font-semibold">Shop Info</h3>
            {shop.description && (
              <p className="text-sm text-muted-foreground">{shop.description}</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Verified Reviews</span>
                <span className="font-medium flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-trust-high" />
                  {shop.verified_review_count || 0}
                </span>
              </div>
            </div>
            {shop.profile_url && (
              <a
                href={shop.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Shop
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}