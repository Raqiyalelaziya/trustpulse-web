import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Users, Store, MessageSquare, Flag, Trash2, ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';
import { toast } from 'sonner';

export default function Admin() {
  const [user,    setUser]    = useState(null);
  const [shops,   setShops]   = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [userData, shopData, reviewData, usersData] = await Promise.all([
      base44.auth.me(),
      base44.entities.Shop.list('-created_at', 100),
      base44.entities.Review.list('-created_at', 100),
      base44.entities.User.list('-trust_score', 50),
    ]);
    setUser(userData);
    setShops(shopData);
    setReviews(reviewData);
    setUsers(usersData);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You need admin privileges to view this page.</p>
      </div>
    );
  }

  const reportedReviews = reviews.filter((r) => r.reported);
  const flaggedShops    = shops.filter((s) => s.flagged);

  async function deleteReview(review) {
    await base44.entities.Review.delete(review.id);
    toast.success('Review deleted');
    loadData();
  }

  async function toggleShopFlag(shop) {
    await base44.entities.Shop.update(shop.id, { flagged: !shop.flagged });
    toast.success(shop.flagged ? 'Shop unflagged' : 'Shop flagged');
    loadData();
  }

  async function deleteShop(shop) {
    // Delete shop's reviews first
    const shopReviews = reviews.filter((r) => String(r.shop_id) === String(shop.id));
    await Promise.all(shopReviews.map((r) => base44.entities.Review.delete(r.id)));
    await base44.entities.Shop.delete(shop.id);
    toast.success('Shop and its reviews deleted');
    loadData();
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-extrabold">TrustPulse — Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Shops',   value: shops.length,         icon: Store,         color: 'text-primary' },
          { label: 'Total Reviews', value: reviews.length,        icon: MessageSquare, color: 'text-accent' },
          { label: 'Users',         value: users.length,          icon: Users,         color: 'text-green-500' },
          { label: 'Reported',      value: reportedReviews.length, icon: Flag,         color: 'text-destructive' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border/50 p-5">
            <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
            <p className="text-2xl font-extrabold font-heading">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="reported">
        <TabsList className="bg-secondary rounded-xl">
          <TabsTrigger value="reported"  className="rounded-lg gap-1"><Flag          className="h-4 w-4" /> Reported ({reportedReviews.length})</TabsTrigger>
          <TabsTrigger value="shops"     className="rounded-lg gap-1"><Store         className="h-4 w-4" /> Shops ({shops.length})</TabsTrigger>
          <TabsTrigger value="reviews"   className="rounded-lg gap-1"><MessageSquare className="h-4 w-4" /> All Reviews</TabsTrigger>
          <TabsTrigger value="users"     className="rounded-lg gap-1"><Users         className="h-4 w-4" /> Users</TabsTrigger>
        </TabsList>

        {/* Reported Reviews */}
        <TabsContent value="reported" className="space-y-3 mt-4">
          {reportedReviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No reported reviews 🎉</p>
          ) : (
            reportedReviews.map((review) => (
              <div key={review.id} className="bg-card rounded-xl border border-destructive/20 p-4 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{review.reviewer_name}</p>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">{review.review_text || review.comment}</p>
                  <p className="text-xs text-destructive">
                    Reported by {(review.reported_by || []).length} user(s)
                  </p>
                </div>
                <Button size="sm" variant="destructive" className="gap-1 rounded-lg" onClick={() => deleteReview(review)}>
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            ))
          )}
        </TabsContent>

        {/* Shops */}
        <TabsContent value="shops" className="space-y-3 mt-4">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{shop.name}</p>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{shop.platform}</span>
                  <TrustBadge level={shop.trust_level} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {shop.review_count} reviews · {Number(shop.average_rating || 0).toFixed(1)} avg rating · Trust: {shop.trust_score}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1 rounded-lg" onClick={() => toggleShopFlag(shop)}>
                  <Flag className="h-3 w-3" /> {shop.flagged ? 'Unflag' : 'Flag'}
                </Button>
                <Button size="sm" variant="destructive" className="gap-1 rounded-lg" onClick={() => deleteShop(shop)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* All Reviews */}
        <TabsContent value="reviews" className="space-y-3 mt-4">
          {reviews.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No reviews yet</p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{review.reviewer_name}</p>
                  {review.shop_name && (
                    <span className="text-xs text-muted-foreground">on {review.shop_name}</span>
                  )}
                  <StarRating rating={review.rating} size="sm" />
                  {(review.is_verified || review.verified) && (
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {review.review_text || review.comment}
                </p>
              </div>
              <Button
                size="sm" variant="ghost"
                className="text-destructive gap-1 rounded-lg"
                onClick={() => deleteReview(review)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="space-y-3 mt-4">
          {users.map((u) => (
            <div key={u.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {(u.full_name || u.display_name || u.email || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{u.full_name || u.display_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-accent font-semibold">{u.trust_score ?? u.points ?? 0}% trust</span>
                <span className="text-muted-foreground">{u.total_reviews || 0} reviews</span>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{u.role || 'user'}</span>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
