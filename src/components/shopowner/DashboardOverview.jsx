import { Star, MessageSquare, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

function computeTrustScore(shop, reviews) {
  const avgRating = shop.average_rating || 0;
  const reviewCount = Math.min(shop.review_count || 0, 50);
  const cr = ((avgRating - 1) / 4) * 100 * 0.4;
  const cn = (reviewCount / 50) * 100 * 0.3;
  const ca = 16; // fixed age contribution for display
  const cp = 6;  // fixed profile contribution for display
  return { total: Math.round(cr + cn + ca + cp), cr: Math.round(cr), cn: Math.round(cn), ca, cp };
}

function ScoreBar({ label, value, max, colorClass }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-muted-foreground flex-1">{label}</span>
      <div className="h-2 w-28 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
      <span className={`font-semibold w-10 text-right ${colorClass.includes('primary') ? 'text-primary' : 'text-amber-600'}`}>
        {value}/{max}
      </span>
    </div>
  );
}

export default function DashboardOverview({ shop, reviews, onNavigate }) {
  const { total, cr, cn, ca, cp } = computeTrustScore(shop, reviews);
  const recentReviews = reviews.slice(0, 2);

  const stats = [
    { label: 'Trust score',      value: total,                             colorClass: 'text-primary' },
    { label: 'Total reviews',    value: shop.review_count || 0,            colorClass: 'text-foreground' },
    { label: 'Avg. rating',      value: `${(shop.average_rating||0).toFixed(1)} ★`, colorClass: 'text-amber-600' },
    { label: 'Open complaints',  value: 2,                                 colorClass: 'text-destructive' },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-heading text-xl font-extrabold">Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {shop.name}</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-primary/5 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold font-heading ${s.colorClass}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trust score breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Trust score breakdown</h2>
        <div className="flex items-start gap-5">
          {/* Ring */}
          <div className="h-20 w-20 rounded-full border-[6px] border-primary flex flex-col items-center justify-center shrink-0 bg-card">
            <span className="font-extrabold text-xl text-primary font-heading">{total}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
          <div className="flex-1 space-y-2.5">
            <ScoreBar label="Avg. rating × 40%" value={cr} max={40} colorClass="bg-primary" />
            <ScoreBar label="Review count × 30%" value={cn} max={30} colorClass="bg-primary" />
            <ScoreBar label="Account age × 20%" value={ca} max={20} colorClass="bg-primary" />
            <ScoreBar label="Profile completeness × 10%" value={cp} max={10} colorClass="bg-amber-400" />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 text-xs text-amber-800">
          <strong>Improvement tip:</strong> complete your shop profile — add your trade license and description to gain up to <strong>+4 points</strong>.
        </div>
      </div>

      {/* Recent reviews */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Recent reviews</h2>
          <button onClick={() => onNavigate('reviews')} className="text-xs text-primary hover:underline flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        {recentReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No reviews yet.</p>
        ) : (
          recentReviews.map((r) => (
            <div key={r.id} className="border border-border/60 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {(r.reviewer_name || 'U')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.reviewer_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">User trust: {r.reviewer_trust_level || '—'}</p>
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
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}