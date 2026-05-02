import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Award, Star, ShieldCheck, MessageSquare, Zap, LogOut, Trophy, Target, BadgeCheck, Camera, Edit2, Check, X } from 'lucide-react';
import StarRating from '../components/StarRating';
import UserTrustBadge from '../components/UserTrustBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

const badges = [
  { name: 'Newcomer', icon: Star, minPoints: 0, color: 'text-gray-500 bg-gray-100' },
  { name: 'Active Reviewer', icon: MessageSquare, minPoints: 50, color: 'text-blue-500 bg-blue-100' },
  { name: 'Trusted Reviewer', icon: ShieldCheck, minPoints: 150, color: 'text-green-500 bg-green-100' },
  { name: 'Top Reviewer', icon: Trophy, minPoints: 500, color: 'text-amber-500 bg-amber-100' },
  { name: 'Elite Reviewer', icon: Award, minPoints: 1000, color: 'text-purple-500 bg-purple-100' },
];

function getBadge(points) {
  const earned = badges.filter((b) => points >= b.minPoints);
  return earned[earned.length - 1] || badges[0];
}

function getNextBadge(points) {
  return badges.find((b) => points < b.minPoints);
}

function computeTrustLevel(user) {
  const likes = user.total_likes_received || 0;
  const comments = user.total_comments_received || 0;
  const engagement = likes + comments * 2; // comments weigh more
  if (engagement >= 150) return 'High';
  if (engagement >= 30) return 'Medium';
  return 'Normal';
}


export default function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    async function loadProfile() {
      const userData = await base44.auth.me();
      setUsernameInput(userData.username || '');
      setNameInput(userData.display_name || userData.full_name || '');
      const userReviews = await base44.entities.Review.filter({ created_by: userData.email }, '-created_date', 50);
      setReviews(userReviews);

      // Compute engagement from reviews
      const totalLikes = userReviews.reduce((sum, r) => sum + (r.likes || 0), 0);
      const totalComments = userReviews.reduce((sum, r) => sum + (r.comments_count || 0), 0);
      const updatedUser = { ...userData, total_likes_received: totalLikes, total_comments_received: totalComments };

      // Recompute trust level based on engagement
      const computedTrust = computeTrustLevel(updatedUser);
      const isVerified = (totalLikes + totalComments * 2) >= 150;
      if (computedTrust !== userData.trust_level || isVerified !== userData.is_verified_user) {
        await base44.auth.updateMe({ trust_level: computedTrust, is_verified_user: isVerified, total_likes_received: totalLikes, total_comments_received: totalComments });
        updatedUser.trust_level = computedTrust;
        updatedUser.is_verified_user = isVerified;
      }
      setUser(updatedUser);
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function updateReviewerName(newName) {
    // Update reviewer_name on all reviews belonging to this user
    const userReviews = await base44.entities.Review.filter({ created_by: user.email });
    await Promise.all(userReviews.map((r) => base44.entities.Review.update(r.id, { reviewer_name: newName })));
  }

  async function saveUsername() {
    if (!usernameInput.trim()) return;
    const newName = usernameInput.trim();
    await base44.auth.updateMe({ username: newName, display_name: newName });
    await updateReviewerName(newName);
    const freshUser = await base44.auth.me();
    setUser((prev) => ({ ...prev, ...freshUser, username: newName, display_name: newName }));
    setReviews((prev) => prev.map((r) => ({ ...r, reviewer_name: newName })));
    setEditingUsername(false);
    toast.success('Username updated!');
  }

  async function saveName() {
    if (!nameInput.trim()) return;
    const newName = nameInput.trim();
    await base44.auth.updateMe({ display_name: newName, username: newName });
    await updateReviewerName(newName);
    const freshUser = await base44.auth.me();
    setUser((prev) => ({ ...prev, ...freshUser, display_name: newName, username: newName }));
    setReviews((prev) => prev.map((r) => ({ ...r, reviewer_name: newName })));
    setEditingName(false);
    toast.success('Name updated!');
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_image: file_url });
    setUser({ ...user, profile_image: file_url });
    setUploadingImage(false);
    toast.success('Profile photo updated!');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const points = user.points || 0;
  const totalReviews = user.total_reviews || 0;
  const currentBadge = getBadge(points);
  const nextBadge = getNextBadge(points);
  const progress = nextBadge ? ((points - currentBadge.minPoints) / (nextBadge.minPoints - currentBadge.minPoints)) * 100 : 100;
  const verifiedReviewCount = reviews.filter((r) => r.verified).length;
  const CurrentBadgeIcon = currentBadge.icon;
  const trustLevel = user.trust_level || 'Normal';

  // Points guide by trust level
  const pointsGuide = {
    Normal: [{ action: 'Write a Review', pts: '+10' }, { action: 'Verified Review', pts: '+20' }, { action: 'Get a Like', pts: '+2' }],
    Medium: [{ action: 'Write a Review', pts: '+15' }, { action: 'Verified Review', pts: '+25' }, { action: 'Get a Like', pts: '+3' }],
    High: [{ action: 'Write a Review', pts: '+20' }, { action: 'Verified Review', pts: '+30' }, { action: 'Get a Like', pts: '+5' }],
  }[trustLevel] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-accent/50 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center overflow-hidden">
                {user.profile_image ? (
                  <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary font-heading">
                  {(user.display_name || user.full_name || user.email || '?')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingImage ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="h-8 text-base rounded-lg px-2 w-44 font-heading font-extrabold"
                      placeholder="Your name"
                    />
                    <button onClick={saveName} className="p-1 text-green-600"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingName(false)} className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-heading text-2xl font-extrabold">{user.display_name || user.full_name || 'User'}</h1>
                    <button onClick={() => { setNameInput(user.display_name || user.full_name || ''); setEditingName(true); }} className="p-0.5 text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {user.is_verified_user && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
                <UserTrustBadge trustLevel={trustLevel} size="sm" />
              </div>
              {/* Username */}
              <div className="flex items-center gap-2 mt-1">
                {editingUsername ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="h-7 text-sm rounded-lg px-2 w-36"
                      placeholder="username"
                    />
                    <button onClick={saveUsername} className="p-1 text-green-600"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingUsername(false)} className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm text-muted-foreground">@{user.username || 'set username'}</p>
                    <button onClick={() => setEditingUsername(true)} className="p-0.5 text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => base44.auth.logout()}
            >
              <LogOut className="h-4 w-4" />
              {t(lang, 'logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t(lang, 'points'), value: points, icon: Zap, color: 'text-accent' },
          { label: 'Reviews', value: totalReviews, icon: MessageSquare, color: 'text-primary' },
          { label: 'Likes Received', value: user.total_likes_received || 0, icon: Star, color: 'text-amber-500' },
          { label: 'Comments Received', value: user.total_comments_received || 0, icon: MessageSquare, color: 'text-blue-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border/50 p-5 text-center">
            <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-extrabold font-heading">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trust Level Progress */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h2 className="font-heading font-semibold flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-blue-600" />
          Trust Level Progress
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { level: 'Normal', threshold: 0, color: 'bg-gray-100 text-gray-600 border-gray-200' },
            { level: 'Medium', threshold: 30, color: 'bg-amber-50 text-amber-600 border-amber-200' },
            { level: 'High', threshold: 150, color: 'bg-blue-50 text-blue-600 border-blue-200' },
          ].map(({ level, threshold, color }) => {
            const active = trustLevel === level;
            const engagement = (user.total_likes_received || 0) + (user.total_comments_received || 0) * 2;
            const achieved = engagement >= threshold;
            return (
              <div key={level} className={`rounded-xl p-3 border text-center text-sm font-medium ${active ? color + ' border-2' : achieved ? color + ' opacity-60' : 'bg-muted/50 text-muted-foreground border-border/30'}`}>
                {level === 'High' && <BadgeCheck className="h-4 w-4 mx-auto mb-1 text-blue-600" />}
                <p>{level}</p>
                <p className="text-xs opacity-70">{threshold}+ engagement</p>
                {active && <p className="text-xs mt-1 font-semibold">✓ Current</p>}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Engagement score = likes + (comments × 2). Your score: <strong>{(user.total_likes_received || 0) + (user.total_comments_received || 0) * 2}</strong>.
          {trustLevel === 'High' ? ' You are verified! Sharing is enabled on your reviews. 🎉' : ` Reach 150 to become Verified.`}
        </p>
        {/* Points guide per trust level */}
        <div className="mt-2 pt-3 border-t border-border/50 space-y-1">
          <p className="text-xs font-semibold text-foreground">Points earned per action by trust level:</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="space-y-0.5"><p className="font-medium text-gray-600">Normal</p><p>Review: +10</p><p>Verified: +20</p><p>Like: +2</p></div>
            <div className="space-y-0.5"><p className="font-medium text-amber-600">Medium</p><p>Review: +15</p><p>Verified: +25</p><p>Like: +3</p></div>
            <div className="space-y-0.5"><p className="font-medium text-blue-600">High</p><p>Review: +20</p><p>Verified: +30</p><p>Like: +5</p></div>
          </div>
        </div>
      </div>

      {/* Badge Progress */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Badge Progress
          </h2>
        </div>
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
                  {nextBadge.minPoints - points} more points to "{nextBadge.name}"
                </p>
              </>
            ) : (
              <p className="text-xs text-trust-high">Maximum badge reached!</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 flex-wrap pt-2">
          {badges.map((badge) => {
            const BadgeIcon = badge.icon;
            const earned = points >= badge.minPoints;
            return (
              <div
                key={badge.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${earned ? badge.color + ' border-transparent' : 'text-muted-foreground/40 bg-muted/50 border-border/30'}`}
              >
                <BadgeIcon className="h-4 w-4" />
                {badge.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Points Guide */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-3">
        <h2 className="font-heading font-semibold">How to Earn Points — <span className="text-primary">{trustLevel} User</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pointsGuide.map((item) => (
            <div key={item.action} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
              <Zap className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-accent font-bold">{item.pts} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
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
                    <p className="font-semibold text-sm">{review.shop_name}</p>
                    <div className="flex items-center gap-2">
                      {review.verified && (
                        <span className="text-xs text-trust-high flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  <p className="text-xs text-accent font-medium">+{review.points_earned} pts</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}