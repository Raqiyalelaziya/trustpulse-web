import { useState } from 'react';
import { Check, Store, Instagram, Link as LinkIcon, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CATEGORIES = [
  'Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 
  'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'
];

const PLATFORMS = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

const API_BASE = 'https://trustpulse-api.onrender.com';

export default function ShopCreationWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    category: '',
    platform: '',
    description: '',
    
    // Step 2: Social Links
    profile_url: '',
    shop_icon: '',
    
    // Step 3: Verification
    license_number: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = formData.name.trim() && formData.category && formData.platform;
  const canProceedStep2 = true; // Social links are optional
  const canSubmit = canProceedStep1;

  async function handleSubmit() {
    if (!canSubmit) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('trustpulse_token');
      if (!token) {
        toast.error('Please log in again');
        return;
      }

      const response = await fetch(`${API_BASE}/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          platform: formData.platform,
          description: formData.description.trim() || null,
          profile_url: formData.profile_url.trim() || null,
          shop_icon: formData.shop_icon.trim() || null,
          license_number: formData.license_number.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shop');
      }

      toast.success('🎉 Shop created successfully!');
      onComplete(data.shop);
    } catch (error) {
      console.error('Shop creation error:', error);
      toast.error(error.message || 'Failed to create shop. Please try again.');
      setLoading(false);
    }
  }

  const steps = [
    { num: 1, title: 'Basic Info', icon: Store },
    { num: 2, title: 'Social Links', icon: LinkIcon },
    { num: 3, title: 'Verification', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isComplete = step > s.num;
          
          return (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                  isComplete 
                    ? 'bg-emerald-500 text-white'
                    : isActive 
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-card border-2 border-border text-muted-foreground'
                }`}>
                  {isComplete ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <p className={`text-xs font-semibold mt-2 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${isComplete ? 'bg-emerald-500' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center space-y-2 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto">
                <Store className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Tell us about your shop</h2>
              <p className="text-sm text-muted-foreground">We need some basic information to get started</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Shop Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Zara Fashion UAE"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger id="category" className="h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={(v) => updateField('platform', v)}>
                  <SelectTrigger id="platform" className="h-11">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(plat => (
                      <SelectItem key={plat} value={plat}>{plat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Brief description of your shop and what you sell..."
                rows={3}
                className="resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
            </div>
          </div>
        )}

        {/* Step 2: Social Links */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-2 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
                <LinkIcon className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Connect your social media</h2>
              <p className="text-sm text-muted-foreground">Help customers find and trust your shop (optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_url" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Shop Profile URL
              </Label>
              <Input
                id="profile_url"
                type="url"
                value={formData.profile_url}
                onChange={(e) => updateField('profile_url', e.target.value)}
                placeholder="https://instagram.com/yourshop"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Link to your Instagram, TikTok, or website</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shop_icon">Shop Logo/Icon URL (Optional)</Label>
              <Input
                id="shop_icon"
                type="url"
                value={formData.shop_icon}
                onChange={(e) => updateField('shop_icon', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Direct link to your shop logo image</p>
            </div>

            {formData.shop_icon && (
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Logo Preview</p>
                <img 
                  src={formData.shop_icon} 
                  alt="Shop logo preview" 
                  className="h-20 w-20 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error('Invalid image URL');
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center space-y-2 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Verify your business</h2>
              <p className="text-sm text-muted-foreground">Verified shops get higher trust scores and more visibility</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_number">Business License Number (Optional)</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => updateField('license_number', e.target.value)}
                placeholder="UAE license number"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Enter your UAE business license number to boost your trust score by 10%
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Why verify?</p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• +10% trust score boost immediately</li>
                    <li>• "Verified Business" badge on your profile</li>
                    <li>• Higher ranking in search results</li>
                    <li>• Increased customer confidence</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <p className="text-sm font-semibold mb-2">📊 Your Starting Trust Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                    style={{ width: formData.license_number ? '10%' : '0%' }}
                  />
                </div>
                <span className="text-sm font-bold text-primary">
                  {formData.license_number ? '10%' : '0%'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.license_number 
                  ? '✓ License entered! You start with 10% trust score'
                  : 'Add license to start with 10% trust score instead of 0%'
                }
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {step === 1 && (
            <Button variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}

          <div className="flex-1" />

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !canProceedStep1 : false}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating shop...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Create Shop
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <p className="text-center text-xs text-muted-foreground">
        Step {step} of 3 • All fields marked with * are required
      </p>
    </div>
  );
}
