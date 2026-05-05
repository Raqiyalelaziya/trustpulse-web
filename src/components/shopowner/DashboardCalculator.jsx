// src/components/shopowner/DashboardCalculator.jsx
import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Slider({ label, value, onChange, min = 0, max = 100, step = 1, description }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold text-primary">{value}</span>
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

export default function DashboardCalculator({ shop, reviews }) {
  const avgRatingRaw  = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;

  const [rating,      setRating]      = useState(Math.round(avgRatingRaw * 10) / 10);
  const [reviewCount, setReviewCount] = useState(reviews.length);
  const [ageMonths,   setAgeMonths]   = useState(6);
  const [profilePct,  setProfilePct]  = useState(shop.profile_completeness || 50);

  // Formula: Rating×40 + ReviewCount×30 + Age×20 + Profile×10
  // Normalised values: rating/5, reviewCount/100, ageMonths/36, profilePct/100
  const ratingNorm  = Math.min(rating / 5, 1)       * 40;
  const reviewNorm  = Math.min(reviewCount / 100, 1) * 30;
  const ageNorm     = Math.min(ageMonths / 36, 1)    * 20;
  const profileNorm = (profilePct / 100)             * 10;

  const total = Math.round(ratingNorm + reviewNorm + ageNorm + profileNorm);
  const trustLevel = total >= 75 ? 'High' : total >= 50 ? 'Medium' : total >= 25 ? 'Low' : 'New';
  const barColor   = total >= 75 ? 'bg-green-500' : total >= 50 ? 'bg-amber-500' : 'bg-red-400';

  const tips = [
    reviewCount < 10  && 'Get more reviews — even 10 reviews can add 15+ trust points.',
    rating < 4        && 'Improving your average rating from 3 → 4 stars adds ~8 trust points.',
    profilePct < 80   && 'Complete your shop profile to gain up to 5 more trust points.',
    ageMonths < 12    && 'Trust score naturally grows as your shop ages.',
  ].filter(Boolean);

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Calculator className="h-6 w-6 text-primary" />
        <h1 className="font-heading text-2xl font-extrabold">Trust Score Calculator</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Simulate how changes affect your trust score using the TrustPulse formula.
      </p>

      {/* Sliders */}
      <div className="bg-background rounded-2xl border border-border/50 p-5 space-y-6">
        <Slider
          label="Average Rating (out of 5)"
          value={rating}
          onChange={setRating}
          min={0} max={5} step={0.1}
          description="Worth 40% of trust score"
        />
        <Slider
          label="Review Count"
          value={reviewCount}
          onChange={setReviewCount}
          min={0} max={200}
          description="Worth 30% of trust score (capped at 100)"
        />
        <Slider
          label="Account Age (months)"
          value={ageMonths}
          onChange={setAgeMonths}
          min={0} max={36}
          description="Worth 20% of trust score (max at 3 years)"
        />
        <Slider
          label="Profile Completeness (%)"
          value={profilePct}
          onChange={setProfilePct}
          min={0} max={100}
          description="Worth 10% of trust score"
        />
      </div>

      {/* Result */}
      <div className="bg-background rounded-2xl border border-border/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold">Estimated Trust Score</h2>
          <span className={`font-heading text-3xl font-extrabold ${
            total >= 75 ? 'text-green-600' : total >= 50 ? 'text-amber-600' : 'text-red-500'
          }`}>{total}%</span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${total}%` }} />
        </div>
        <p className="text-sm text-muted-foreground">
          Trust Level: <strong className="text-foreground">{trustLevel}</strong>
          {shop.trust_score !== undefined && (
            <span> · Current actual score: <strong>{shop.trust_score}%</strong></span>
          )}
        </p>

        {/* Score breakdown */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { label: 'Rating',   value: Math.round(ratingNorm),  color: 'bg-accent' },
            { label: 'Reviews',  value: Math.round(reviewNorm),  color: 'bg-primary' },
            { label: 'Age',      value: Math.round(ageNorm),     color: 'bg-blue-400' },
            { label: 'Profile',  value: Math.round(profileNorm), color: 'bg-green-400' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-lg font-bold font-heading">{item.value}</div>
              <div className={`h-1 rounded-full ${item.color} mt-1`} style={{ opacity: 0.7 }} />
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-semibold text-sm">Tips to improve your score</h2>
          </div>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary font-bold shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
