import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Logo from '@/components/Logo';
import { ShieldCheck, Store, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopOwnerLogin() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function check() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) { setLoading(false); return; }
      const me = await base44.auth.me();
      setUser(me);
      setLoading(false);
    }
    check();
  }, []);

  function handleLogin() {
    base44.auth.redirectToLogin('/shop-owner-login');
  }

  async function handleContinue() {
    if (!user) return;
    if (user.role !== 'shop_owner') {
      setError('Your account is not registered as a shop owner. Please contact support or register your shop first.');
      return;
    }
    navigate('/shop-owner-dashboard');
  }

  const rules = [
    { pass: true,  text: <>Must be logged in with a registered account</> },
    { pass: true,  text: <>Account role must be set to <strong>"shop_owner"</strong></> },
    { pass: true,  text: 'Shop name must exist and be linked to your account' },
    { pass: false, text: <>An account <strong>cannot</strong> be both a regular user and a shop owner at the same time</> },
    { pass: false, text: 'Non shop-owner accounts → access denied' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="bg-card border-b border-border px-6 py-3 flex items-center gap-3">
        <Logo size="sm" />
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4">

          {/* Header */}
          <div className="text-center space-y-2 mb-2">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
              <Store className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-xl font-extrabold text-foreground">Shop Owner Portal</h1>
            <p className="text-sm text-muted-foreground">Manage your trust profile and reviews</p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin" />
              </div>
            ) : user ? (
              <>
                {/* Logged in — show user info */}
                <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">
                      {(user.full_name || user.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${user.role === 'shop_owner' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {user.role === 'shop_owner' ? 'Shop Owner' : user.role || 'User'}
                  </span>
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <Button className="w-full" onClick={handleContinue}>
                  Enter Dashboard <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Not you?{' '}
                  <span className="text-primary cursor-pointer hover:underline" onClick={() => { base44.auth.logout('/shop-owner-login'); }}>
                    Switch account
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Sign in with your shop owner account to access the dashboard.
                </p>
                <Button className="w-full" onClick={handleLogin}>
                  Sign In <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Validation Rules */}
          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Access rules</p>
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className={`font-bold shrink-0 mt-0.5 ${rule.pass ? 'text-primary' : 'text-destructive'}`}>
                  {rule.pass ? '✓' : '✕'}
                </span>
                <span className="text-foreground">{rule.text}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}