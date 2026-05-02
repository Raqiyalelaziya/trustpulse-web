import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Store, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const categories = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

export default function AddShop() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { toast.error('Please enter a shop name'); return; }

    setSubmitting(true);

    let shopIconUrl = undefined;
    if (logoFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: logoFile });
      shopIconUrl = file_url;
    }

    const shop = await base44.entities.Shop.create({
      name: name.trim(),
      platform,
      category,
      description: description.trim() || undefined,
      profile_url: profileUrl.trim() || undefined,
      shop_icon: shopIconUrl,
      trust_level: 'New',
      average_rating: 0,
      review_count: 0,
      verified_review_count: 0,
    });

    toast.success('Shop added successfully!');
    navigate(`/shop/${shop.id}`);
  }

  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-extrabold">Add a Shop</h1>
        <p className="text-muted-foreground mt-1">List a social media shop so others can review it</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo upload */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Shop Logo</h2>
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 border-2 border-border">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <span className="font-heading font-extrabold text-white text-3xl">{initials}</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Upload className="h-4 w-4" />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
              {logoPreview && (
                <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(''); }} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
              <p className="text-xs text-muted-foreground">If no logo is uploaded, your shop initials will be shown</p>
            </div>
          </div>
        </div>

        {/* Shop Info */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h2 className="font-heading font-semibold">Shop Details</h2>
          <Input
            placeholder="Shop name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-xl resize-none"
          />
          <Input
            placeholder="Shop URL / profile link (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl text-base font-semibold gap-2">
          {submitting ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Adding Shop...</>
          ) : (
            <><Store className="h-5 w-5" /> Add Shop</>
          )}
        </Button>
      </form>
    </div>
  );
}