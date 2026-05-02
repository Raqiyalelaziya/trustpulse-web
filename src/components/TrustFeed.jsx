import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Star, BadgeCheck, Store } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrustFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const reviews = await base44.entities.Review.list('-created_date', 8);
      setItems(reviews);
    }
    load();

    const unsub = base44.entities.Review.subscribe((event) => {
      if (event.type === 'create') {
        setItems((prev) => [event.data, ...prev].slice(0, 8));
      }
    });
    return unsub;
  }, []);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <h2 className="font-heading text-2xl font-bold">Live Trust Feed</h2>
      </div>
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {items.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border/50 rounded-xl px-4 py-3 flex items-start gap-3"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">
                  {(review.reviewer_name || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{review.reviewer_name || 'Anonymous'}</span>
                  {review.reviewer_verified && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-blue-600">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Store className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{review.shop_name || 'A shop'}</span>
                  {review.verified && (
                    <ShieldCheck className="h-3 w-3 text-trust-high shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{review.comment}</p>
              </div>
              <span className="text-xs text-muted-foreground/50 shrink-0">
                {review.created_date ? formatDistanceToNow(new Date(review.created_date), { addSuffix: true }) : ''}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}