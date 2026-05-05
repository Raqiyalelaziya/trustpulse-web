import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Star } from 'lucide-react';
import TrustBadge from './TrustBadge';

const categoryImages = {
  Fashion:     'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  Beauty:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  Electronics: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80',
  Accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  Home:        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
  Food:        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  Perfume:     'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80',
  Handmade:    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80',
  Health:      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80',
  Sports:      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  Books:       'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  Other:       'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
};

const categoryGradients = {
  Fashion:     'from-pink-600 to-rose-700',
  Beauty:      'from-purple-600 to-violet-700',
  Electronics: 'from-blue-600 to-indigo-700',
  Accessories: 'from-amber-500 to-orange-600',
  Home:        'from-teal-500 to-emerald-600',
  Food:        'from-orange-500 to-red-600',
  Perfume:     'from-violet-600 to-purple-700',
  Handmade:    'from-yellow-500 to-amber-600',
  Health:      'from-emerald-500 to-green-600',
  Sports:      'from-sky-500 to-blue-600',
  Books:       'from-indigo-500 to-blue-700',
  Other:       'from-slate-500 to-slate-700',
};

const trustColor = (score) => {
  if (score >= 75) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (score >= 50) return { bar: 'bg-amber-500',   text: 'text-amber-600',   bg: 'bg-amber-50' }
  if (score >= 25) return { bar: 'bg-blue-500',    text: 'text-blue-600',    bg: 'bg-blue-50' }
  return               { bar: 'bg-slate-400',   text: 'text-slate-500',   bg: 'bg-slate-50' }
}

export default function ShopCard({ shop }) {
  const bgImage  = categoryImages[shop.category]  || categoryImages.Other
  const gradient = categoryGradients[shop.category] || categoryGradients.Other
  const score    = shop.trust_score || 0
  const colors   = trustColor(score)
  const initials = shop.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'
  const avgRating = parseFloat(shop.average_rating || 0)

  return (
    // ✅ Fixed: /shops/:id
    <Link to={`/shops/${shop.id}`} className="group block">
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">

        {/* Banner */}
        <div className="h-32 relative overflow-hidden">
          <img
            src={bgImage}
            alt={shop.category}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
          <div className="absolute inset-0 bg-black/20" />

          {/* Platform pill */}
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-semibold text-white/90 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              {shop.platform}
            </span>
          </div>

          {/* License verified badge */}
          {shop.license_verified ? (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-semibold text-white flex items-center gap-1 bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-2.5 w-2.5" /> Verified
              </span>
            </div>
          ) : null}

          {/* Shop avatar */}
          <div className="absolute -bottom-5 left-4">
            <div className={`h-12 w-12 rounded-xl border-2 border-card shadow-lg flex items-center justify-center bg-gradient-to-br ${gradient} overflow-hidden`}>
              {shop.shop_icon
                ? <img src={shop.shop_icon} alt={shop.name} className="w-full h-full object-cover" />
                : <span className="text-sm font-black text-white">{initials}</span>
              }
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-7 px-4 pb-4 space-y-3">

          {/* Name + badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-card-foreground truncate group-hover:text-primary transition-colors leading-tight">
                {shop.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{shop.category}</p>
            </div>
            <TrustBadge level={shop.trust_level} size="sm" />
          </div>

          {/* Rating row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`}
                />
              ))}
              <span className="text-xs font-semibold text-foreground ml-0.5">
                {avgRating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span className="text-xs">{shop.review_count || 0}</span>
            </div>
          </div>

          {/* Trust score bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Trust Score</span>
              <span className={`text-xs font-black ${colors.text}`}>{score}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
