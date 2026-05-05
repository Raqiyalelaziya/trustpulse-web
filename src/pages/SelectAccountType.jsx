import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Store, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SelectAccountType() {
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    await base44.auth.updateMe({
      role: selected === 'shop_owner' ? 'shop_owner' : 'user',
    });
    navigate(selected === 'shop_owner' ? '/shop-owner-dashboard' : '/');
  }

  const options = [
    {
      id: 'user',
      icon: User,
      title: 'Regular User',
      description: 'Browse shops, write reviews, earn points and build your trust profile.',
      color: 'from-primary to-primary/70',
      border: 'border-primary',
      bg: 'bg-primary/5',
    },
    {
      id: 'shop_owner',
      icon: Store,
      title: 'Shop Owner',
      description: 'Manage your shop profile, view and respond to customer reviews.',
      color: 'from-amber-500 to-orange-500',
      border: 'border-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-black">TrustPulse</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold">Welcome! Who are you?</h1>
          <p className="text-muted-foreground text-sm">Choose your account type to get the best experience.</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {options.map((opt) => {
            const Icon    = opt.icon;
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 flex items-center gap-5 ${
                  isSelected
                    ? `${opt.border} ${opt.bg} shadow-md`
                    : 'border-border/50 bg-card hover:border-border hover:shadow-sm'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center shrink-0 shadow-md`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-base">{opt.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
                </div>
                {isSelected && <ShieldCheck className="h-6 w-6 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>

        <Button
          className="w-full h-12 text-base font-semibold rounded-xl gap-2"
          disabled={!selected || loading}
          onClick={handleContinue}
        >
          {loading ? 'Saving…' : 'Continue'}
          {!loading && <ArrowRight className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
