import { Link } from 'react-router-dom';
import { MessageSquare, Store } from 'lucide-react';
import StarRating from './StarRating';
import TrustBadge from './TrustBadge';

const categoryImages = {
  Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  Beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  Electronics: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80',
  Accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  Home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
  Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  Perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80',
  Handmade: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80',
  Health: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  Books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  Other: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
};

export default function ShopCard({ shop }) {
  const bgImage = categoryImages[shop.category] || categoryImages.Other;

  return (
    <Link to={`/shop/${shop.id}`} className="group block">
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <div className="h-36 relative overflow-hidden flex items-center justify-center">
          <img src={bgImage} alt={shop.category} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          {/* Platform badge - small, top-right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {shop.platform}
            </span>
          </div>
          {/* Shop icon - big and centered */}
          {shop.shop_icon ? (
            <img src={shop.shop_icon} alt={shop.name} className="h-20 w-20 rounded-2xl object-cover shadow-xl z-10 border-2 border-white/40" />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center z-10 border-2 border-white/20">
              <Store className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                {shop.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{shop.category}</p>
            </div>
            <TrustBadge level={shop.trust_level} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(shop.average_rating || 0)} size="sm" />
              <span className="text-sm font-semibold text-card-foreground">
                {(shop.average_rating || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-xs">{shop.review_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}