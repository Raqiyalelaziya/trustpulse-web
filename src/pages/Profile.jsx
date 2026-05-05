import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Award, Star, ShieldCheck, MessageSquare, Zap, LogOut,
  Trophy, Target, BadgeCheck, Edit2, Check, X,
} from 'lucide-react';
import StarRating from '../components/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

// ─── Badge system (based on trust_score) ─────────────────────────────────────
const badges = [
  { name: 'Newcomer',        icon: Star,         minScore: 0,   color: 'text-gray-500 bg-gray-100' },
  { name: 'Active Reviewer', icon: MessageSquare, minScore: 25,  color: 'text-blue-500 bg-blue-100' },
  { name: 'Trusted Reviewer',icon: ShieldCheck,   minScore: 50,  color: 'text-green-500 bg-green-100' },
  { name: 'Top Reviewer',    icon: Trophy,        minScore: 75,  color: 'text-amber-500 bg-amber-100' },
  { name: 'Elite Reviewer',  icon: Award,         minScore: 90,  color: 'text-purple-500 bg-purple-100' },
];

function getBadge(score) {
  const earned = badges.filter((b) => score >= b.minScore);
  return earned[earned.length - 1] || badges[0];
}

function getNextBadge(score) {
  return badges.find((b) => score < b.minScore);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Profile() {
  const [user,          setUser]          = useState(null);
  const [reviews,       setReviews]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [editingName,   setEditingName]   = useState(false);
  const [nameInput,     setNameInput]     = useState('');
  const { lang } = useLang();

  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await base44.auth.me();
        setNameInput(userData.full_name || userData.display_name || '');

        // Load user's reviews (filtered by user_id)
        const userReviews = await base44.entities.Review.filter(
          { created_by: userData.email },
          '-created_at',
          50,
        );
        setReviews(userReviews);
        setUser(userData);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function saveName() {
    const newName = nameInput.trim();
    if (!newName) return;
    await base44.auth.updateMe({ full_name: newName, display_name: newName });
    setUser((prev) => ({ ...prev, full_name: newName, display_name: newName }));
    setEditingName(false);
    toast.success('Name updated!');
  }

  // ─── Loading / error states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Could not load profile. Please <Link to="/login" className="text-primary underline">log in again</Link>.
      </div>
    );
  }

  // ─── Derived values ─────────────────────────────────────────────────────
  const score       = user.trust_score || 0;
  const currentBadge = getBadge(score);
  const nextBadge    = getNextBadge(score);
  const progress     = nextBadge
    ? ((score - currentBadge.minScore) / (nextBadge.minScore - currentBadge.minScore)) * 100
    : 100;
  const CurrentBadgeIcon = currentBadge.icon;
  const verifiedCount    = reviews.filter((r) => r.is_verified || r.verified).length;

  const displayName = user.full_name || user.display_name || user.email || 'User';
  const initials    = displayName[0]?.toUpperCase() || '?';

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ── Profile Header ────────────────────────────────────────────── */}
      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-accent/50 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">

            {/* Avatar */}
            <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-primary font-heading">{initials}</span>
            </div>

            {/* Name + email */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      className="h-8 text-base rounded-lg px-2 w-44 font-heading font-extrabold"
                      placeholder="Your name"
                    />
                    <button onClick={saveName}              className="p-1 text-green-600"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingName(false)} className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-heading text-2xl font-extrabold">{displayName}</h1>
                    <button onClick={() => setEditingName(true)} className="p-0.5 text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {score >= 75 && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  score >= 75 ? 'bg-blue-50 text-blue-600' :
                  score >= 50 ? 'bg-amber-50 text-amber-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {user.trust_level || 'Normal'} Trust
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Role: <span className="capitalize font-medium">{user.role || 'user'}</span>
              </p>
            </div>

            <Button
              variant="ghost" size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => base44.auth.logout('/')}
            >
              <LogOut className="h-4 w-4" />
              {t(lang, 'logout') || 'Logout'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trust Score',       value: `${score}%`,      icon: Zap,          color: 'text-accent' },
          { label: 'Reviews',           value: reviews.length,    icon: MessageSquare, color: 'text-primary' },
          { label: 'Verified Reviews',  value: verifiedCount,     icon: ShieldCheck,  color: 'text-green-500' },
          { label: 'Profile Complete',  value: `${user.profile_completeness || 0}%`, icon: Target, color: 'text-amber-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border/50 p-5 text-center">
            <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-extrabold font-heading">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Trust Score Breakdown ─────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h2 className="font-heading font-semibold flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-blue-600" />
          Trust Score Breakdown
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Rating quality',      pct: score * 0.4,  color: 'bg-accent' },
            { label: 'Review count',        pct: score * 0.3,  color: 'bg-primary' },
            { label: 'Account age',         pct: score * 0.2,  color: 'bg-blue-500' },
            { label: 'Profile completeness',pct: score * 0.1,  color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{item.label}</span>
                <span>{Math.round(item.pct)}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(item.pct, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Overall trust score: <strong>{score}%</strong>.{' '}
          {score >= 75
            ? 'Excellent! You are a verified trusted reviewer. 🎉'
            : `Reach 75% to become Verified.`}
        </p>
      </div>

      {/* ── Badge Progress ────────────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h2 className="font-heading font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Badge Progress
        </h2>
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${currentBadge.color}`}>
            <CurrentBadgeIcon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{currentBadge.name}</p>
            {nextBadge ? (
              <>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Reach {nextBadge.minScore}% trust score to unlock "{nextBadge.name}"
                </p>
              </>
            ) : (
              <p className="text-xs text-green-600 font-medium">Maximum badge reached! 🏆</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 flex-wrap pt-2">
          {badges.map((badge) => {
            const BadgeIcon = badge.icon;
            const earned    = score >= badge.minScore;
            return (
              <div
                key={badge.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${
                  earned ? `${badge.color} border-transparent` : 'text-muted-foreground/40 bg-muted/50 border-border/30'
                }`}
              >
                <BadgeIcon className="h-4 w-4" />
                {badge.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Your Reviews ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold">Your Reviews</h2>
        {reviews.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <p className="text-muted-foreground">You haven't written any reviews yet</p>
            <Link to="/add-review">
              <Button className="mt-4 rounded-xl">Write Your First Review</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Link to={`/shop/${review.shop_id}`} key={review.id} className="block">
                <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{review.shop_name || `Shop #${review.shop_id}`}</p>
                    <div className="flex items-center gap-2">
                      {(review.is_verified || review.verified) && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {review.review_text || review.comment}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
