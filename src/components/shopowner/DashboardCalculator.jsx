import { useState } from 'react';

function calcScore(r, n, a, p) {
  const cr = ((r - 1) / 4) * 100 * 0.4;
  const cn = (n / 50) * 100 * 0.3;
  const ca = (a / 365) * 100 * 0.2;
  const cp = p * 0.1;
  return { total: Math.round(cr + cn + ca + cp), cr: Math.round(cr), cn: Math.round(cn), ca: Math.round(ca), cp: Math.round(cp) };
}

function ScoreLabel({ total }) {
  if (total >= 80) return <div className="text-center py-2.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary">Excellent — highly trusted shop</div>;
  if (total >= 60) return <div className="text-center py-2.5 rounded-lg text-sm font-semibold bg-primary/5 text-primary">Good — trusted shop</div>;
  if (total >= 40) return <div className="text-center py-2.5 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700">Fair — needs improvement</div>;
  return <div className="text-center py-2.5 rounded-lg text-sm font-semibold bg-destructive/10 text-destructive">Low — trust score needs attention</div>;
}

function ResultBar({ label, value, max, colorClass }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground w-36 shrink-0">{label}</span>
      <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${colorClass}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
      <span className="font-semibold w-6 text-right">{value}</span>
    </div>
  );
}

export default function DashboardCalculator({ shop, reviews }) {
  const [sliders, setSliders] = useState({
    r: shop?.average_rating || 4.3,
    n: Math.min(shop?.review_count || 28, 50),
    a: 290,
    p: 60,
  });

  const { total, cr, cn, ca, cp } = calcScore(sliders.r, sliders.n, sliders.a, sliders.p);

  function update(key, val) {
    setSliders(s => ({ ...s, [key]: parseFloat(val) }));
  }

  const sliderConfig = [
    { key: 'r', label: 'Average rating', weight: '40%', min: 1, max: 5, step: 0.1, display: `${sliders.r.toFixed(1)} / 5` },
    { key: 'n', label: 'Number of reviews', weight: '30%, max 50', min: 0, max: 50, step: 1, display: `${sliders.n} reviews` },
    { key: 'a', label: 'Account age', weight: '20%, max 365 days', min: 0, max: 365, step: 1, display: `${sliders.a} days` },
    { key: 'p', label: 'Profile completeness', weight: '10%', min: 0, max: 100, step: 1, display: `${sliders.p}%` },
  ];

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-heading text-xl font-extrabold">Trust score calculator</h1>
        <p className="text-sm text-muted-foreground">Adjust sliders to see how each factor affects the score in real time</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
        {/* Sliders */}
        {sliderConfig.map((s) => (
          <div key={s.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {s.label} <span className="text-xs text-muted-foreground font-normal">(weight: {s.weight})</span>
              </span>
              <span className="font-bold text-primary">{s.display}</span>
            </div>
            <input
              type="range"
              min={s.min} max={s.max} step={s.step}
              value={sliders[s.key]}
              onChange={(e) => update(s.key, e.target.value)}
              className="w-full accent-primary h-2 cursor-pointer"
            />
          </div>
        ))}

        <hr className="border-border" />

        {/* Score result */}
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full border-[6px] border-primary flex flex-col items-center justify-center shrink-0 bg-card">
            <span className="font-extrabold text-xl text-primary font-heading">{total}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
          <div className="flex-1 space-y-2">
            <ResultBar label="Rating contribution"  value={cr} max={40} colorClass="bg-primary" />
            <ResultBar label="Review contribution"  value={cn} max={30} colorClass="bg-primary" />
            <ResultBar label="Age contribution"     value={ca} max={20} colorClass="bg-primary" />
            <ResultBar label="Profile contribution" value={cp} max={10} colorClass="bg-amber-400" />
          </div>
        </div>

        <ScoreLabel total={total} />
      </div>

      <div className="bg-primary/5 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
        <strong className="text-primary">How the formula works:</strong><br />
        Each factor is normalized to a 0–100 scale, then multiplied by its weight.<br /><br />
        <strong>Formula:</strong> (Rating − 1) / 4 × 100 × 0.4 + (Reviews / 50) × 100 × 0.3 + (Age / 365) × 100 × 0.2 + Profile% × 0.1
      </div>
    </div>
  );
}