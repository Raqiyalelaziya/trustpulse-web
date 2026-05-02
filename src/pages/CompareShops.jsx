import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Search, X, BarChart3, ShieldCheck, MessageSquare, Star, Store, Plus, Trophy, ExternalLink } from 'lucide-react';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_SHOPS = 3;

const categoryImages = {
  Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80',
  Beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&q=80',
  Electronics: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&q=80',
  Accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=80',
  Home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&q=80',
  Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
  Perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&q=80',
  Handmade: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&q=80',
  Health: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&q=80',
  Books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80',
  Other: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80',
};

const trustOrder = { High: 3, Medium: 2, Low: 1, New: 0 };

// --- Shop Picker ---
function ShopPicker({ onSelect, selectedIds }) {
  const [query, setQuery] = useState('');
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Shop.list('-average_rating', 100).then((data) => {
      setAllShops(data);
      setLoading(false);
    });
  }, []);

  const filtered = query.trim()
    ? allShops.filter(
        (s) =>
          !selectedIds.includes(s.id) &&
          (s.name?.toLowerCase().includes(query.toLowerCase()) ||
            s.category?.toLowerCase().includes(query.toLowerCase()))
      )
    : allShops.filter((s) => !selectedIds.includes(s.id)).slice(0, 8);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shops to compare..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No shops found</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filtered.map((shop) => (
            <button
              key={shop.id}
              onClick={() => { onSelect(shop); setQuery(''); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                <img src={categoryImages[shop.category] || categoryImages.Other} alt={shop.category} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{shop.name}</p>
                <p className="text-xs text-muted-foreground">{shop.category} · {shop.platform}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Star className="h-3 w-3 fill-accent text-accent" />
                {(shop.average_rating || 0).toFixed(1)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Rating Bar ---
function RatingBar({ value, max, color = 'bg-primary' }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-secondary rounded-full h-2 mt-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`h-2 rounded-full ${color}`}
      />
    </div>
  );
}

// --- Winner Banner ---
function WinnerBanner({ shops }) {
  const scores = shops.map((s) => ({
    shop: s,
    score:
      (s.average_rating || 0) * 20 +
      Math.min((s.review_count || 0), 50) * 0.5 +
      (trustOrder[s.trust_level] ?? 0) * 5 +
      Math.min((s.verified_review_count || 0), 30) * 1,
  }));
  const winner = scores.sort((a, b) => b.score - a.score)[0].shop;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/30 rounded-2xl p-5 flex items-center gap-4"
    >
      <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
        <Trophy className="h-6 w-6 text-accent" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Overall Winner</p>
        <p className="font-heading font-extrabold text-lg">{winner.name}</p>
        <p className="text-xs text-muted-foreground">{winner.category} · {winner.platform}</p>
      </div>
      <Link to={`/shop/${winner.id}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium shrink-0">
        View Shop <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}

// --- Review Highlights ---
function ReviewHighlights({ shopId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    base44.entities.Review.filter({ shop_id: shopId }, '-likes', 3).then(setReviews);
  }, [shopId]);

  if (reviews.length === 0) return <p className="text-xs text-muted-foreground text-center py-2">No reviews yet</p>;

  return (
    <div className="space-y-2">
      {reviews.map((r) => (
        <div key={r.id} className="bg-secondary/50 rounded-xl p-3 text-left">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-2.5 w-2.5 ${i < r.rating ? 'fill-accent text-accent' : 'text-muted-foreground/20'}`} />
              ))}
            </div>
            {r.verified && <ShieldCheck className="h-3 w-3 text-trust-high" />}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">"{r.comment}"</p>
          <p className="text-xs text-muted-foreground/50 mt-1">{r.reviewer_name || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  );
}

// --- Comparison Rows ---
const rows = [
  {
    label: 'Category',
    render: (shop) => <span className="text-sm font-medium">{shop.category}</span>,
  },
  {
    label: 'Platform',
    render: (shop) => <span className="text-sm font-medium">{shop.platform}</span>,
  },
  {
    label: 'Average Rating',
    isBest: (shop, shops) => {
      const best = Math.max(...shops.map((s) => s.average_rating || 0));
      return shops.length >= 2 && (shop.average_rating || 0) === best && best > 0;
    },
    render: (shop, shops) => {
      const max = Math.max(...shops.map((s) => s.average_rating || 0));
      return (
        <div className="space-y-1">
          <span className="text-xl font-extrabold font-heading block">{(shop.average_rating || 0).toFixed(1)}</span>
          <StarRating rating={Math.round(shop.average_rating || 0)} size="sm" />
          <RatingBar value={shop.average_rating || 0} max={5} color="bg-accent" />
        </div>
      );
    },
  },
  {
    label: 'Total Reviews',
    isBest: (shop, shops) => {
      const best = Math.max(...shops.map((s) => s.review_count || 0));
      return shops.length >= 2 && (shop.review_count || 0) === best && best > 0;
    },
    render: (shop, shops) => {
      const max = Math.max(...shops.map((s) => s.review_count || 0));
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-center">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold">{shop.review_count || 0}</span>
          </div>
          <RatingBar value={shop.review_count || 0} max={max || 1} color="bg-primary" />
        </div>
      );
    },
  },
  {
    label: 'Verified Reviews',
    isBest: (shop, shops) => {
      const best = Math.max(...shops.map((s) => s.verified_review_count || 0));
      return shops.length >= 2 && (shop.verified_review_count || 0) === best && best > 0;
    },
    render: (shop, shops) => {
      const max = Math.max(...shops.map((s) => s.verified_review_count || 0));
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-center">
            <ShieldCheck className="h-4 w-4 text-trust-high" />
            <span className="text-lg font-bold">{shop.verified_review_count || 0}</span>
          </div>
          <RatingBar value={shop.verified_review_count || 0} max={max || 1} color="bg-trust-high" />
        </div>
      );
    },
  },
  {
    label: 'Trust Level',
    isBest: (shop, shops) => {
      const best = Math.max(...shops.map((s) => trustOrder[s.trust_level] ?? 0));
      return shops.length >= 2 && (trustOrder[shop.trust_level] ?? 0) === best;
    },
    render: (shop) => <TrustBadge level={shop.trust_level} size="sm" />,
  },
  {
    label: 'Top Reviews',
    render: (shop) => <ReviewHighlights shopId={shop.id} />,
  },
];

// --- Main Page ---
export default function CompareShops() {
  const [selectedShops, setSelectedShops] = useState([]);

  function addShop(shop) {
    if (selectedShops.length >= MAX_SHOPS) return;
    setSelectedShops((prev) => [...prev, shop]);
  }

  function removeShop(id) {
    setSelectedShops((prev) => prev.filter((s) => s.id !== id));
  }

  const canAddMore = selectedShops.length < MAX_SHOPS;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Compare Shops
        </h1>
        <p className="text-muted-foreground mt-1">Select up to 3 shops to compare side-by-side</p>
      </div>

      {/* Selected shops pills */}
      {selectedShops.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {selectedShops.map((shop) => (
            <div key={shop.id} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium">
              <Store className="h-3.5 w-3.5" />
              {shop.name}
              <button onClick={() => removeShop(shop.id)} className="hover:text-destructive transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {canAddMore && (
            <span className="text-xs text-muted-foreground self-center">+ {MAX_SHOPS - selectedShops.length} more</span>
          )}
        </div>
      )}

      {/* Shop picker */}
      {canAddMore && <ShopPicker onSelect={addShop} selectedIds={selectedShops.map((s) => s.id)} />}

      {/* Winner Banner */}
      <AnimatePresence>
        {selectedShops.length >= 2 && <WinnerBanner shops={selectedShops} />}
      </AnimatePresence>

      {/* Comparison Table */}
      {selectedShops.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr>
                <th className="text-left text-sm font-semibold text-muted-foreground py-3 pr-4 w-36 pl-3">Metric</th>
                {selectedShops.map((shop) => (
                  <th key={shop.id} className="py-3 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-secondary shadow-md border border-border/50">
                        <img
                          src={shop.shop_icon || categoryImages[shop.category] || categoryImages.Other}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Link to={`/shop/${shop.id}`} className="font-heading font-bold text-sm hover:text-primary transition-colors text-center leading-tight">
                        {shop.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-secondary/30' : ''}>
                  <td className="py-4 pr-4 text-sm font-medium text-muted-foreground rounded-l-xl pl-3 align-top pt-5">
                    {row.label}
                  </td>
                  {selectedShops.map((shop) => {
                    const best = row.isBest ? row.isBest(shop, selectedShops) : false;
                    return (
                      <td
                        key={shop.id}
                        className={`py-4 px-4 text-center align-top rounded-xl transition-colors ${best ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''}`}
                      >
                        {row.render(shop, selectedShops)}
                        {best && (
                          <div className="mt-1.5">
                            <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">★ Best</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedShops.length === 1 && (
        <div className="text-center py-12 text-muted-foreground">
          <Plus className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>Add at least one more shop to start comparing</p>
        </div>
      )}

      {selectedShops.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Search and select shops above to compare them</p>
        </div>
      )}
    </div>
  );
}