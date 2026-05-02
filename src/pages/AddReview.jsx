import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Camera, Send, Plus, Loader2, X } from 'lucide-react';
import StarRating from '../components/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const categories = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

// Points by trust level
const pointsMap = {
  Normal: { review: 10, verified: 20 },
  Medium: { review: 15, verified: 25 },
  High: { review: 20, verified: 30 },
};

export default function AddReview() {
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedShopId = urlParams.get('shop') || '';

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(preSelectedShopId);
  const [isNewShop, setIsNewShop] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopPlatform, setNewShopPlatform] = useState('Instagram');
  const [newShopCategory, setNewShopCategory] = useState('Fashion');
  const [newShopUrl, setNewShopUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [proofFiles, setProofFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.Shop.list('name', 200).then(setShops);
  }, []);

  const trustLevel = user?.trust_level || 'Normal';
  const pts = pointsMap[trustLevel] || pointsMap.Normal;

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }

    setSubmitting(true);
    let shopId = selectedShopId;

    if (isNewShop) {
      if (!newShopName.trim()) { toast.error('Please enter a shop name'); setSubmitting(false); return; }
      const newShop = await base44.entities.Shop.create({
        name: newShopName.trim(),
        platform: newShopPlatform,
        category: newShopCategory,
        profile_url: newShopUrl || undefined,
        trust_level: 'New',
        average_rating: 0,
        review_count: 0,
        verified_review_count: 0,
      });
      shopId = newShop.id;
    }

    if (!shopId) { toast.error('Please select or add a shop'); setSubmitting(false); return; }

    let proofUrls = [];
    if (proofFiles.length > 0) {
      const uploads = await Promise.all(proofFiles.map((f) => base44.integrations.Core.UploadFile({ file: f })));
      proofUrls = uploads.map((u) => u.file_url);
    }

    const isVerified = proofUrls.length > 0 || user?.is_verified_user;
    const pointsEarned = isVerified ? pts.verified : pts.review;

    const selectedShop = shops.find((s) => s.id === shopId);
    await base44.entities.Review.create({
      shop_id: shopId,
      shop_name: isNewShop ? newShopName : selectedShop?.name || '',
      rating,
      comment: comment.trim(),
      proof_image_url: proofUrls[0] || undefined,
      proof_image_urls: proofUrls.length > 0 ? proofUrls : undefined,
      verified: isVerified,
      reviewer_name: user?.full_name || user?.username || 'Anonymous',
      reviewer_email: user?.email || '',
      reviewer_trust_level: trustLevel,
      reviewer_verified: user?.is_verified_user || false,
      points_earned: pointsEarned,
      likes: 0,
      liked_by: [],
      reported: false,
      reported_by: [],
    });

    // Update shop stats
    const allReviews = await base44.entities.Review.filter({ shop_id: shopId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const verifiedCount = allReviews.filter((r) => r.verified).length;
    let trustLevelShop = 'New';
    if (allReviews.length >= 10 && avgRating >= 4) trustLevelShop = 'High';
    else if (allReviews.length >= 5 && avgRating >= 3) trustLevelShop = 'Medium';
    else if (allReviews.length >= 3 && avgRating < 3) trustLevelShop = 'Low';

    await base44.entities.Shop.update(shopId, {
      average_rating: Math.round(avgRating * 10) / 10,
      review_count: allReviews.length,
      verified_review_count: verifiedCount,
      trust_level: trustLevelShop,
    });

    // Update user points
    if (user) {
      const currentPoints = user.points || 0;
      const currentReviews = user.total_reviews || 0;
      await base44.auth.updateMe({
        points: currentPoints + pointsEarned,
        total_reviews: currentReviews + 1,
      });
    }

    toast.success(`Review submitted! You earned ${pointsEarned} points${isVerified ? ' (Verified Review!)' : ''}`);
    navigate(`/shop/${shopId}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-extrabold">Write a Review</h1>
        <p className="text-muted-foreground mt-1">Share your experience and help others shop safely</p>
        {user && (
          <p className="text-xs text-primary mt-1">
            You earn <strong>{pts.review} pts</strong> per review, <strong>{pts.verified} pts</strong> for verified — as a <strong>{trustLevel}</strong> user
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
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a shop..." /></SelectTrigger>
                <SelectContent>
                  {shops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.platform})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button type="button" onClick={() => setIsNewShop(true)} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Plus className="h-4 w-4" /> Add a new shop
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input placeholder="Shop name" value={newShopName} onChange={(e) => setNewShopName(e.target.value)} className="rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <Select value={newShopPlatform} onValueChange={setNewShopPlatform}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={newShopCategory} onValueChange={setNewShopCategory}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Shop URL (optional)" value={newShopUrl} onChange={(e) => setNewShopUrl(e.target.value)} className="rounded-xl" />
              <button type="button" onClick={() => setIsNewShop(false)} className="text-sm text-muted-foreground hover:text-foreground">
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

        {/* Proof Upload */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Photos of Purchase (Optional)</h2>
          <p className="text-xs text-muted-foreground">
            Upload up to 5 photos of your order to earn extra points and get a "Verified" badge
          </p>
          {proofFiles.length < 5 && (
            <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to add photos ({proofFiles.length}/5)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setProofFiles((prev) => [...prev, ...newFiles].slice(0, 5));
                }}
              />
            </label>
          )}
          {proofFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {proofFiles.map((file, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-secondary">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setProofFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl text-base font-semibold gap-2">
          {submitting ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
          ) : (
            <><Send className="h-5 w-5" /> Submit Review</>
          )}
        </Button>
      </form>
    </div>
  );
}