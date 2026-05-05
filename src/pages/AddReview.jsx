import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { api } from '../api';
import { Camera, Send, Plus, Loader2, X } from 'lucide-react';
import StarRating from '../components/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const categories = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms  = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

// Points by trust level
const pointsMap = {
  Normal: { review: 10, verified: 20 },
  Medium: { review: 15, verified: 25 },
  High:   { review: 20, verified: 30 },
};

export default function AddReview() {
  const urlParams        = new URLSearchParams(window.location.search);
  const preSelectedShopId = urlParams.get('shop') || '';

  const navigate = useNavigate();
  const [user,             setUser]             = useState(null);
  const [shops,            setShops]            = useState([]);
  const [selectedShopId,   setSelectedShopId]   = useState(preSelectedShopId);
  const [isNewShop,        setIsNewShop]        = useState(false);
  const [newShopName,      setNewShopName]      = useState('');
  const [newShopPlatform,  setNewShopPlatform]  = useState('Instagram');
  const [newShopCategory,  setNewShopCategory]  = useState('Fashion');
  const [newShopUrl,       setNewShopUrl]       = useState('');
  const [rating,           setRating]           = useState(0);
  const [comment,          setComment]          = useState('');
  const [evidenceUrl,      setEvidenceUrl]      = useState('');
  const [submitting,       setSubmitting]       = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.Shop.list('name', 200).then(setShops);
  }, []);

  const trustLevel = user?.trust_level || 'Normal';
  const pts        = pointsMap[trustLevel] || pointsMap.Normal;

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0)     { toast.error('Please select a rating'); return; }
    if (!comment.trim())  { toast.error('Please write a comment'); return; }

    setSubmitting(true);
    let shopId = selectedShopId;

    try {
      // Create new shop if needed
      if (isNewShop) {
        if (!newShopName.trim()) { toast.error('Please enter a shop name'); setSubmitting(false); return; }
        const newShop = await base44.entities.Shop.create({
          name:        newShopName.trim(),
          platform:    newShopPlatform,
          category:    newShopCategory,
          profile_url: newShopUrl || undefined,
        });
        shopId = newShop.id;
      }

      if (!shopId) { toast.error('Please select or add a shop'); setSubmitting(false); return; }

      const isVerified   = !!evidenceUrl.trim();
      const pointsEarned = isVerified ? pts.verified : pts.review;

      // Submit review via Flask API
      await api.submitReview({
        shop_id:      shopId,
        rating:       rating,
        review_text:  comment.trim(),
        evidence_url: evidenceUrl.trim() || undefined,
      });

      toast.success(
        `Review submitted! You earned ${pointsEarned} points${isVerified ? ' (Verified Review! ✓)' : ''}`
      );

      // ✅ Correct redirect — /shops/:id
      navigate(`/shops/${shopId}`);

    } catch (err) {
      const msg = err?.error || err?.message || 'Failed to submit review';
      toast.error(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-extrabold">Write a Review</h1>
        <p className="text-muted-foreground mt-1">Share your experience and help others shop safely</p>
        {user && (
          <p className="text-xs text-primary mt-1">
            You earn <strong>{pts.review} pts</strong> per review,{' '}
            <strong>{pts.verified} pts</strong> for verified — as a <strong>{trustLevel}</strong> user
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Shop Selection */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Select Shop</h2>
          {!isNewShop ? (
            <div className="space-y-3">
              <Select value={selectedShopId} onValueChange={setSelectedShopId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a shop..." />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.platform})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setIsNewShop(true)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Plus className="h-4 w-4" /> Add a new shop
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Shop name"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                className="rounded-xl"
              />
              <div className="grid grid-cols-2 gap-3">
                <Select value={newShopPlatform} onValueChange={setNewShopPlatform}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={newShopCategory} onValueChange={setNewShopCategory}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Shop URL (optional)"
                value={newShopUrl}
                onChange={(e) => setNewShopUrl(e.target.value)}
                className="rounded-xl"
              />
              <button
                type="button"
                onClick={() => setIsNewShop(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Choose existing shop
              </button>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Your Rating</h2>
          <div className="flex justify-center py-4">
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Your Review</h2>
          <Textarea
            placeholder="Tell others about your experience with this shop..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="rounded-xl resize-none"
          />
        </div>

        {/* Evidence URL */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Evidence URL <span className="text-muted-foreground font-normal text-sm">(Optional)</span></h2>
          <p className="text-xs text-muted-foreground">
            Add a link to a screenshot or post as proof — earns extra points and a Verified badge ✓
          </p>
          <Input
            placeholder="https://..."
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            className="rounded-xl"
          />
          {evidenceUrl.trim() && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Verified review — you'll earn {pts.verified} points instead of {pts.review}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-2xl text-base font-semibold gap-2"
        >
          {submitting ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</>
          ) : (
            <><Send className="h-5 w-5" /> Submit Review</>
          )}
        </Button>
      </form>
    </div>
  );
}
