import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { api } from '../api';
import { Send, Plus, Loader2, Star, ShieldCheck, Link2, ChevronDown, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const categories = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms  = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

const pointsMap = {
  Normal: { review: 10, verified: 20 },
  Medium: { review: 15, verified: 25 },
  High:   { review: 20, verified: 30 },
};

const ratingLabels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];
const ratingColors = ['', 'text-red-500', 'text-orange-500', 'text-amber-500', 'text-lime-500', 'text-emerald-500'];

function StarPicker({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-all duration-150 hover:scale-125 focus:outline-none"
        >
          <Star
            className="h-10 w-10 transition-all duration-150"
            style={{
              fill: star <= (hovered || rating) ? '#f59e0b' : 'transparent',
              color: star <= (hovered || rating) ? '#f59e0b' : 'rgba(156,163,175,0.4)',
              filter: star <= (hovered || rating) ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' : 'none',
            }}
          />
        </button>
      ))}
    </div>
  );
}

export default function AddReview() {
  const urlParams         = new URLSearchParams(window.location.search);
  const preSelectedShopId = urlParams.get('shop') || '';

  const navigate = useNavigate();
  const [user,            setUser]            = useState(null);
  const [shops,           setShops]           = useState([]);
  const [selectedShopId,  setSelectedShopId]  = useState(preSelectedShopId);
  const [isNewShop,       setIsNewShop]       = useState(false);
  const [newShopName,     setNewShopName]     = useState('');
  const [newShopPlatform, setNewShopPlatform] = useState('Instagram');
  const [newShopCategory, setNewShopCategory] = useState('Fashion');
  const [newShopUrl,      setNewShopUrl]      = useState('');
  const [rating,          setRating]          = useState(0);
  const [comment,         setComment]         = useState('');
  const [evidenceUrl,     setEvidenceUrl]     = useState('');
  const [submitting,      setSubmitting]      = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.Shop.list('name', 200).then(setShops);
  }, []);

  const trustLevel = user?.trust_level || 'Normal';
  const pts        = pointsMap[trustLevel] || pointsMap.Normal;
  const selectedShop = shops.find(s => s.id === selectedShopId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0)    { toast.error('Please select a rating'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    let shopId = selectedShopId;
    try {
      if (isNewShop) {
        if (!newShopName.trim()) { toast.error('Please enter a shop name'); setSubmitting(false); return; }
        const newShop = await base44.entities.Shop.create({ name: newShopName.trim(), platform: newShopPlatform, category: newShopCategory, profile_url: newShopUrl || undefined });
        shopId = newShop.id;
      }
      if (!shopId) { toast.error('Please select or add a shop'); setSubmitting(false); return; }
      const isVerified   = !!evidenceUrl.trim();
      const pointsEarned = isVerified ? pts.verified : pts.review;
      const result = await api.submitReview({ shop_id: shopId, rating, review_text: comment.trim(), evidence_url: evidenceUrl.trim() || undefined });
      if (result?.error) {
        if (result.error.includes('already reviewed')) { toast.error('You already reviewed this shop'); navigate(`/shops/${shopId}`); return; }
        toast.error(result.error); setSubmitting(false); return;
      }
      toast.success(`Review submitted! +${pointsEarned} points${isVerified ? ' (Verified ✓)' : ''}`);
      navigate(`/shops/${shopId}`);
    } catch (err) {
      const msg = err?.error || err?.message || 'Failed to submit review';
      if (msg.includes('already reviewed')) { toast.error('You already reviewed this shop'); navigate(`/shops/${shopId}`); }
      else { toast.error(msg); setSubmitting(false); }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(0,115,47,0.4), transparent 60%)' }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00732F, #00a845)' }}
            >
              <Star className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black text-white">Write a Review</h1>
              <p className="text-white/40 text-xs">Share your experience and help others shop safely</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {[
                { label: `+${pts.review} pts per review`, color: '#60a5fa' },
                { label: `+${pts.verified} pts if verified`, color: '#34d399' },
                { label: `${trustLevel} user`, color: '#f59e0b' },
              ].map(({ label, color }) => (
                <span key={label} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Step 1 — Shop */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2"
            style={{ background: 'rgba(0,115,47,0.05)' }}
          >
            <span className="h-5 w-5 rounded-full text-[11px] font-black flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #00732F, #00a845)' }}>1</span>
            <span className="text-sm font-bold">Select Shop</span>
            {selectedShop && <span className="ml-auto text-xs text-emerald-600 font-semibold">✓ {selectedShop.name}</span>}
          </div>
          <div className="p-5 space-y-3">
            {!isNewShop ? (
              <>
                <Select value={selectedShopId} onValueChange={setSelectedShopId}>
                  <SelectTrigger className="rounded-xl h-11">
                    <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Choose a shop..." />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.platform}</SelectItem>)}
                  </SelectContent>
                </Select>
                <button type="button" onClick={() => setIsNewShop(true)}
                  className="flex items-center gap-2 text-xs text-primary hover:underline font-medium">
                  <Plus className="h-3.5 w-3.5" /> Add a new shop not listed here
                </button>
              </>
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
                <button type="button" onClick={() => setIsNewShop(false)} className="text-xs text-muted-foreground hover:text-foreground">← Choose existing shop</button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 — Rating */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2"
            style={{ background: 'rgba(245,158,11,0.05)' }}
          >
            <span className="h-5 w-5 rounded-full text-[11px] font-black flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>2</span>
            <span className="text-sm font-bold">Your Rating</span>
            {rating > 0 && <span className={`ml-auto text-xs font-bold ${ratingColors[rating]}`}>{ratingLabels[rating]}</span>}
          </div>
          <div className="p-6 flex flex-col items-center gap-3">
            <StarPicker rating={rating} onChange={setRating} />
            {rating > 0 && (
              <p className={`text-sm font-bold ${ratingColors[rating]}`}>{ratingLabels[rating]}</p>
            )}
          </div>
        </div>

        {/* Step 3 — Review text */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2"
            style={{ background: 'rgba(96,165,250,0.05)' }}
          >
            <span className="h-5 w-5 rounded-full text-[11px] font-black flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>3</span>
            <span className="text-sm font-bold">Your Review</span>
            {comment.trim() && <span className="ml-auto text-xs text-blue-500 font-semibold">✓ {comment.trim().length} chars</span>}
          </div>
          <div className="p-5">
            <Textarea
              placeholder="Tell others about your experience — delivery, quality, communication, packaging..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="rounded-xl resize-none border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Step 4 — Evidence */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2"
            style={{ background: 'rgba(52,211,153,0.05)' }}
          >
            <span className="h-5 w-5 rounded-full text-[11px] font-black flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #10b981, #00732F)' }}>4</span>
            <span className="text-sm font-bold">Evidence URL</span>
            <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
            {evidenceUrl.trim() && <span className="ml-auto text-xs text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Verified</span>}
          </div>
          <div className="p-5 space-y-3">
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="https://screenshot-link.com/..."
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="rounded-xl pl-9"
              />
            </div>
            {evidenceUrl.trim() ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                Verified review — you'll earn <strong>+{pts.verified} points</strong> instead of {pts.review}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Add a screenshot link to earn extra points and get a Verified badge ✓</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || rating === 0 || !comment.trim() || !selectedShopId}
          className="w-full h-14 rounded-2xl text-base font-black text-white transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-40"
          style={{
            background: submitting || rating === 0 || !comment.trim() || !selectedShopId
              ? 'rgba(100,100,100,0.3)'
              : 'linear-gradient(135deg, #00732F, #00a845)',
            boxShadow: rating > 0 && comment.trim() && selectedShopId ? '0 4px 20px rgba(0,115,47,0.4)' : 'none',
          }}
        >
          {submitting
            ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</>
            : <><Send className="h-5 w-5" /> Submit Review</>
          }
        </button>
      </form>
    </div>
  );
}
