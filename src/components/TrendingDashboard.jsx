import { Link } from 'react-router-dom';
import { TrendingUp, Star, MessageSquare, ShieldCheck, Flame, ArrowRight, Crown, Medal, Award } from 'lucide-react';

const rankConfig = [
  {
    rank: 1,
    label: '👑 #1 Trending',
    icon: Crown,
    glow: 'shadow-[0_0_40px_rgba(100,140,100,0.35)]',
    border: 'border-primary/70',
    badge: 'bg-gradient-to-r from-primary to-primary/80',
    ribbon: 'from-primary to-primary/70',
    rankBg: 'bg-primary',
  },
  {
    rank: 2,
    label: '🥈 #2 Hot',
    icon: Medal,
    glow: 'shadow-[0_0_24px_rgba(100,140,100,0.2)]',
    border: 'border-primary/50',
    badge: 'bg-gradient-to-r from-primary/80 to-primary/60',
    ribbon: 'from-primary/80 to-primary/60',
    rankBg: 'bg-primary/80',
  },
  {
    rank: 3,
    label: '🥉 #3 Rising',
    icon: Award,
    glow: 'shadow-[0_0_20px_rgba(100,140,100,0.18)]',
    border: 'border-primary/40',
    badge: 'bg-gradient-to-r from-primary/60 to-primary/40',
    ribbon: 'from-primary/60 to-primary/40',
    rankBg: 'bg-primary/60',
  },
];

function TrustPill({ level }) {
  const colors = {
    High: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-red-100 text-red-700',
    New: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[level] || colors.New}`}>
      {level} Trust
    </span>
  );
}

function HeroSpotlight({ shop }) {
  const cfg = rankConfig[0];
  const initials = shop.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <Link to={`/shop/${shop.id}`} className="group block">
      <div className={`relative min-h-[260px] md:min-h-[320px] rounded-3xl overflow-hidden border-2 ${cfg.border} ${cfg.glow} transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_rgba(217,119,6,0.45)]`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(120,22%,28%)]/90 via-[hsl(125,18%,38%)]/80 to-[hsl(130,14%,50%)]/80" />
        {/* Animated glow orbs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Rank ribbon */}
        <div className="absolute top-0 left-0 bg-gradient-to-br from-[hsl(120,22%,36%)] to-[hsl(130,18%,48%)] px-5 py-2 rounded-br-2xl flex items-center gap-2 shadow-lg z-20">
          <Flame className="h-4 w-4 text-white animate-pulse" />
          <span className="text-white font-extrabold text-sm tracking-wide">#1 TRENDING</span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-5 pt-12 md:p-8 md:pt-14 text-center space-y-3 md:space-y-4">
          {/* Shop icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-amber-400/30 blur-xl scale-110" />
            {shop.shop_icon ? (
              <img src={shop.shop_icon} alt={shop.name} className="h-28 w-28 rounded-3xl object-cover border-4 border-white/30 shadow-2xl relative z-10" />
            ) : (
              <div className="h-28 w-28 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl relative z-10">
                <span className="font-heading font-extrabold text-white text-5xl">{initials}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-white text-xl md:text-3xl group-hover:text-amber-200 transition-colors drop-shadow-lg">
              {shop.name}
            </h3>
            <p className="text-white/70 text-sm">{shop.category} · {shop.platform}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              <span className="text-white font-bold text-sm">{(shop.average_rating || 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MessageSquare className="h-4 w-4 text-white/80" />
              <span className="text-white text-sm font-medium">{shop.review_count || 0} reviews</span>
            </div>
            {shop.verified_review_count > 0 && (
              <div className="flex items-center gap-1.5 bg-emerald-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span className="text-emerald-200 text-sm font-medium">{shop.verified_review_count} verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-amber-200 text-sm font-semibold group-hover:gap-3 transition-all">
            View Shop <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function RankedCard({ shop, rank }) {
  const cfg = rankConfig[rank - 1];
  const RankIcon = cfg?.icon || TrendingUp;
  const initials = shop.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <Link to={`/shop/${shop.id}`} className="group block">
      <div className={`relative rounded-2xl overflow-hidden border-2 ${cfg?.border || 'border-border/50'} ${cfg?.glow || ''} bg-card transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1`}>
        {/* Top bar gradient */}
        <div className={`h-2 w-full bg-gradient-to-r ${cfg?.ribbon || 'from-primary to-accent'}`} />

        <div className="p-5 flex items-start gap-4">
          {/* Rank badge */}
          <div className={`${cfg?.rankBg || 'bg-primary'} text-white font-extrabold text-lg w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md`}>
            {rank}
          </div>

          {/* Shop icon */}
          {shop.shop_icon ? (
            <img src={shop.shop_icon} alt={shop.name} className="h-14 w-14 rounded-xl object-cover shadow-md shrink-0 border border-border/50" />
          ) : (
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${cfg?.ribbon || 'from-primary to-accent'} flex items-center justify-center shrink-0 shadow-md`}>
              <span className="font-heading font-extrabold text-white text-xl">{initials}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-heading font-bold text-base group-hover:text-primary transition-colors truncate">{shop.name}</h3>
                <p className="text-xs text-muted-foreground">{shop.category} · {shop.platform}</p>
              </div>
              <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full text-white ${cfg?.badge || 'bg-primary'}`}>
                #{rank}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span className="text-sm font-bold">{(shop.average_rating || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="text-xs">{shop.review_count || 0}</span>
              </div>
              <TrustPill level={shop.trust_level} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LeaderboardRow({ shop, rank }) {
  const initials = shop.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Link to={`/shop/${shop.id}`} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all">
      <span className="text-xl w-8 text-center">{medals[rank - 1] || `#${rank}`}</span>
      {shop.shop_icon ? (
        <img src={shop.shop_icon} alt={shop.name} className="h-10 w-10 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="font-heading font-bold text-primary text-sm">{initials}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{shop.name}</p>
        <p className="text-xs text-muted-foreground">{shop.category}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
        <span className="text-sm font-bold">{(shop.average_rating || 0).toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground shrink-0">
        <MessageSquare className="h-3 w-3" />
        <span className="text-xs">{shop.review_count || 0}</span>
      </div>
    </Link>
  );
}

export default function TrendingDashboard({ shops, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-64 bg-muted rounded-3xl animate-pulse" />
          <div className="h-36 bg-muted rounded-2xl animate-pulse" />
          <div className="h-36 bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!shops || shops.length === 0) return null;

  const top3 = shops.slice(0, 3);
  const rest = shops.slice(3);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
            <Flame className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-extrabold">Trending Now</h2>
            <p className="text-xs text-muted-foreground">Live rankings by community activity</p>
          </div>
        </div>
        <Link to="/search" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
          See all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile: stack everything vertically. Desktop: hero left, ranked right */}
      <div className="flex flex-col gap-5 md:grid md:grid-cols-3 md:items-start">
        {/* Hero #1 spotlight — takes 2 cols on desktop */}
        {top3[0] && (
          <div className="md:col-span-2">
            <HeroSpotlight shop={top3[0]} />
          </div>
        )}

        {/* #2, #3 and leaderboard */}
        <div className="flex flex-col gap-5">
          {top3.slice(1).map((shop, i) => (
            <RankedCard key={shop.id} shop={shop} rank={i + 2} />
          ))}

          {rest.length > 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Also Trending</p>
              {rest.slice(0, 3).map((shop, i) => (
                <LeaderboardRow key={shop.id} shop={shop} rank={i + 4} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}