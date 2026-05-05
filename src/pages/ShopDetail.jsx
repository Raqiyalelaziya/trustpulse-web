import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { api } from '../api';
import {
  ExternalLink, PlusCircle, MessageSquare, ShieldCheck,
  Search, ArrowUpDown, SlidersHorizontal, X, Star,
  TrendingUp, Calendar, Award, ChevronRight,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';
import ReviewCard from '../components/ReviewCard';
import { Button } from '@/components/ui/button';

// ── Animated score ring ───────────────────────────────────────────────────────
function TrustRing({ score, size = 140 }) {
  const stroke = 9
  const r      = (size - stroke) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (Math.min(score, 100) / 100) * circ
  const color  = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : score >= 25 ? '#3b82f6' : '#94a3b8'
  const label  = score >= 75 ? 'High' : score >= 50 ? 'Medium' : score >= 25 ? 'Low' : 'New'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white leading-none">{score}%</span>
        <span className="text-[11px] text-white/60 uppercase tracking-widest mt-0.5">Trust</span>
        <span className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full" style={{ background: `${color}30`, color }}>
          {label}
        </span>
      </div>
    </div>
  )
}

// ── Animated bar ─────────────────────────────────────────────────────────────
function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

const categoryGradients = {
  Fashion:     'from-pink-600 via-rose-700 to-red-800',
  Beauty:      'from-purple-600 via-violet-700 to-purple-800',
  Electronics: 'from-blue-600 via-indigo-700 to-blue-900',
  Accessories: 'from-amber-600 via-orange-700 to-orange-800',
  Home:        'from-teal-600 via-emerald-700 to-green-800',
  Food:        'from-orange-500 via-red-600 to-red-800',
  Perfume:     'from-violet-600 via-purple-700 to-indigo-800',
  Handmade:    'from-yellow-600 via-amber-700 to-orange-800',
  Health:      'from-emerald-600 via-green-700 to-teal-800',
  Sports:      'from-sky-600 via-blue-700 to-blue-900',
  Books:       'from-indigo-600 via-blue-700 to-slate-800',
  Other:       'from-slate-600 via-slate-700 to-slate-800',
}

const categoryEmoji = {
  Fashion: '👗', Beauty: '💄', Electronics: '📱', Accessories: '👜',
  Home: '🏠', Food: '🍽️', Perfume: '🌸', Handmade: '🤝',
  Health: '💚', Sports: '⚽', Books: '📚', Other: '🏪',
}

export default function ShopDetail() {
  const { id } = useParams();
  const [shop,              setShop]              = useState(null);
  const [reviews,           setReviews]           = useState([]);
  const [user,              setUser]              = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [reviewSearch,      setReviewSearch]      = useState('');
  const [reviewSort,        setReviewSort]        = useState('recent');
  const [reviewMinRating,   setReviewMinRating]   = useState('Any');
  const [reviewVerifiedOnly,setReviewVerifiedOnly]= useState(false);
  const [showFilters,       setShowFilters]       = useState(false);
  const [trustBreakdown,    setTrustBreakdown]    = useState(null);

  async function loadData() {
    const [shopData, reviewsData] = await Promise.all([
      api.getShop(id),
      base44.entities.Review.filter({ shop_id: id }, '-created_at', 50),
    ]);
    setShop(shopData);
    setReviews(reviewsData);

    // Load trust breakdown if endpoint available
    try {
      const res = await fetch(`https://trustpulse-api.onrender.com/trust/shop/${id}`)
      if (res.ok) setTrustBreakdown(await res.json())
    } catch { /* not critical */ }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    base44.auth.me().then(setUser).catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="h-56 bg-card rounded-3xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-card rounded-2xl animate-pulse col-span-2" />
          <div className="h-32 bg-card rounded-2xl animate-pulse" />
        </div>
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

  const gradient      = categoryGradients[shop.category] || categoryGradients.Other
  const emoji         = categoryEmoji[shop.category] || '🏪'
  const score         = shop.trust_score || 0
  const avgRating     = parseFloat(shop.average_rating || 0)
  const reviewCount   = shop.review_count || reviews.length
  const verifiedCount = shop.verified_review_count || reviews.filter(r => r.is_verified || r.verified).length
  const initials      = shop.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    rating:  r,
    count:   reviews.filter((rev) => rev.rating === r).length,
    percent: reviews.length > 0
      ? (reviews.filter((rev) => rev.rating === r).length / reviews.length) * 100
      : 0,
  }));

  // Filter + sort reviews
  let filtered = [...reviews]
  if (reviewSearch.trim()) {
    const q = reviewSearch.toLowerCase()
    filtered = filtered.filter(r =>
      (r.review_text || r.comment || '').toLowerCase().includes(q) ||
      (r.reviewer_name || '').toLowerCase().includes(q)
    )
  }
  if (reviewMinRating !== 'Any') {
    filtered = filtered.filter(r => (r.rating || 0) >= parseFloat(reviewMinRating))
  }
  if (reviewVerifiedOnly) {
    filtered = filtered.filter(r => r.is_verified || r.verified)
  }
  if (reviewSort === 'highest')  filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  else if (reviewSort === 'helpful') filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  else filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

  const hasActiveFilters = reviewMinRating !== 'Any' || reviewVerifiedOnly

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${gradient} min-h-[220px]`}>
        {/* Atmospheric overlays */}
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'radial-gradient(ellipse at 10% 50%, rgba(255,255,255,0.2), transparent 60%)' }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />

        {/* Platform pill */}
        <div className="absolute top-5 right-5">
          <span className="text-xs font-semibold text-white/90 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {shop.platform}
          </span>
        </div>

        <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          {/* Logo */}
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl border-2 border-white/30 shrink-0 shadow-2xl overflow-hidden bg-black/20 backdrop-blur-sm flex items-center justify-center">
            {shop.shop_icon
              ? <img src={shop.shop_icon} alt={shop.name} className="w-full h-full object-cover" />
              : <span className="font-black text-white text-3xl">{initials}</span>
            }
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-lg">{emoji}</span>
              <span className="text-xs font-semibold text-white/70 bg-white/15 px-3 py-1 rounded-full">
                {shop.category}
              </span>
              <TrustBadge level={shop.trust_level} size="sm" />
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-sm">
              {shop.name}
            </h1>
            {shop.description && (
              <p className="text-white/60 text-sm mt-2 max-w-md line-clamp-2">{shop.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= Math.round(avgRating) ? 'fill-yellow-300 text-yellow-300' : 'text-white/20'}`} />
                ))}
                <span className="text-white/80 text-sm font-semibold ml-1">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-white/50 text-sm">{reviewCount} reviews</span>
              {verifiedCount > 0 && (
                <span className="flex items-center gap-1 text-emerald-300 text-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />{verifiedCount} verified
                </span>
              )}
            </div>
          </div>

          {/* Trust Ring */}
          <div className="shrink-0 hidden md:block">
            <TrustRing score={score} size={140} />
          </div>
        </div>
      </div>

      {/* ── Mobile trust score ────────────────────────────────────────── */}
      <div className="md:hidden bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
          <span className="text-xl font-black text-white">{score}%</span>
        </div>
        <div>
          <p className="font-bold">Trust Score</p>
          <p className="text-sm text-muted-foreground">
            {score >= 75 ? 'Highly trusted shop ✓' : score >= 50 ? 'Generally trusted' : 'Building trust'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Reviews panel ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Reviews
              <span className="text-sm font-normal text-muted-foreground">({reviews.length})</span>
            </h2>
            <Link to={`/add-review?shop=${id}`}>
              <Button className="rounded-xl gap-2 shadow-sm">
                <PlusCircle className="h-4 w-4" />
                Add Review
              </Button>
            </Link>
          </div>

          {/* Search + filters */}
          {reviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search reviews…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                  />
                </div>
                <Select value={reviewSort} onValueChange={setReviewSort}>
                  <SelectTrigger className="w-40 rounded-xl">
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
                  onClick={() => setShowFilters(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors ${
                    showFilters || hasActiveFilters
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              </div>

              {showFilters && (
                <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-wrap gap-3 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Min Rating</label>
                    <Select value={reviewMinRating} onValueChange={setReviewMinRating}>
                      <SelectTrigger className="w-28 rounded-xl h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Any','2+','3+','4+','4.5+'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={() => setReviewVerifiedOnly(v => !v)}
                    className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors ${
                      reviewVerifiedOnly
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600'
                        : 'border-border text-muted-foreground hover:border-emerald-500/30'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" /> Verified Only
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={() => { setReviewMinRating('Any'); setReviewVerifiedOnly(false) }}
                      className="flex items-center gap-1 text-xs text-primary hover:underline h-9"
                    >
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border/50 p-12 text-center space-y-3">
              <div className="text-4xl">✍️</div>
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm text-muted-foreground">Be the first to review this shop!</p>
              <Link to={`/add-review?shop=${id}`}>
                <Button className="mt-2 rounded-xl">Write a Review</Button>
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No reviews match your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUser={user}
                  onUpdate={loadData}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Rating overview */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-5">
            <h3 className="font-heading font-bold text-base">Rating Overview</h3>
            <div className="text-center space-y-2">
              <p className="text-5xl font-black font-heading">{avgRating.toFixed(1)}</p>
              <StarRating rating={Math.round(avgRating)} size="lg" />
              <p className="text-sm text-muted-foreground">{reviewCount} reviews</p>
            </div>
            <div className="space-y-2">
              {ratingDist.map((d) => (
                <div key={d.rating} className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground w-2">{d.rating}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${d.percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-5 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Score breakdown */}
          <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} p-5 space-y-4`}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
            />
            <div className="relative">
              <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Trust Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Ratings',   value: score * 0.4, max: 40,  color: '#fbbf24' },
                  { label: 'Reviews',   value: score * 0.3, max: 30,  color: '#60a5fa' },
                  { label: 'Age',       value: score * 0.2, max: 20,  color: '#a78bfa' },
                  { label: 'Profile',   value: score * 0.1, max: 10,  color: '#34d399' },
                ].map(({ label, value, max, color }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs text-white/80">
                      <span>{label}</span>
                      <span className="font-bold" style={{ color }}>{Math.round(value)}/{max}</span>
                    </div>
                    <Bar value={value} max={max} color={color} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shop info */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4">
            <h3 className="font-heading font-bold text-base">Shop Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Reviews
                </span>
                <span className="font-semibold">{verifiedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" /> Trust Score
                </span>
                <span className="font-semibold">{score}%</span>
              </div>
              {shop.license_verified && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" /> License
                  </span>
                  <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">Verified ✓</span>
                </div>
              )}
            </div>
            {shop.profile_url && (
              <a
                href={shop.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full text-sm text-primary font-medium hover:underline mt-2 pt-3 border-t border-border/50"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Visit Shop
                </span>
                <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
