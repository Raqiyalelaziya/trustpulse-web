import { Star } from 'lucide-react';

export default function DashboardReviews({ reviews }) {
  const verified = reviews.filter(r => r.verified).length;
  const pending = reviews.length - verified;

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="font-heading text-xl font-extrabold">Reviews</h1>
        <p className="text-sm text-muted-foreground">All customer reviews for your shop</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{verified} verified</span>
        <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1 rounded-full">{pending} pending</span>
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{reviews.length} total</span>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          No reviews yet for your shop.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {(r.reviewer_name || 'U')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.reviewer_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                      User trust: {r.reviewer_trust_level || '—'}
                      {r.proof_image_url ? ' · Screenshot attached' : ' · No screenshot'}
                    </p>
                  </div>
                </div>
                {r.verified
                  ? <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Verified</span>
                  : <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>}
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-accent text-accent' : 'text-muted-foreground/20'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{r.rating}/5</span>
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}