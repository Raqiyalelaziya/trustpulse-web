import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store, MessageSquare, ShieldCheck, LogOut,
  LayoutDashboard, AlertCircle, User, Calculator,
  Plus, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import ShopCreationWizard from './ShopCreationWizard';
import DashboardOverview    from '@/components/shopowner/DashboardOverview';
import DashboardReviews     from '@/components/shopowner/DashboardReviews';
import DashboardComplaints  from '@/components/shopowner/DashboardComplaints';
import DashboardProfile     from '@/components/shopowner/DashboardProfile';
import DashboardCalculator  from '@/components/shopowner/DashboardCalculator';

const CATEGORIES = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const PLATFORMS  = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

const NAV = [
  { id: 'overview',   label: 'Overview',        icon: LayoutDashboard },
  { id: 'reviews',    label: 'Reviews',          icon: MessageSquare },
  { id: 'complaints', label: 'Complaints',       icon: AlertCircle },
  { id: 'profile',    label: 'Shop Profile',     icon: User },
  { id: 'calculator', label: 'Trust Calculator', icon: Calculator },
];

export default function ShopOwnerDashboard() {
  const [user,       setUser]       = useState(null);
  const [shop,       setShop]       = useState(null);
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activePage, setActivePage] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) { base44.auth.redirectToLogin('/shop-owner-dashboard'); return; }

      const me = await base44.auth.me();
      setUser(me);

      if (me.role !== 'shop_owner') { setLoading(false); return; }

      // Find shop owned by this user
      if (me.owned_shop_id) {
        try {
          const shopData = await base44.entities.Shop.get(me.owned_shop_id);
          if (shopData) {
            setShop(shopData);
            const shopReviews = await base44.entities.Review.filter(
              { shop_id: shopData.id }, '-created_at', 50,
            );
            setReviews(shopReviews);
          }
        } catch { /* shop not found, will show claim screen */ }
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleClaimShop(shopId) {
    await base44.auth.updateMe({ owned_shop_id: shopId });
    try {
      const shopData = await base44.entities.Shop.get(shopId);
      if (shopData) {
        setShop(shopData);
        const shopReviews = await base44.entities.Review.filter(
          { shop_id: shopData.id }, '-created_at', 50,
        );
        setReviews(shopReviews);
      }
    } catch { /* keep existing state */ }
    setUser((u) => ({ ...u, owned_shop_id: shopId }));
  }

  async function handleCreateShop(newShop) {
    setShop(newShop);
    setUser((u) => ({ ...u, owned_shop_id: newShop.id }));
    setReviews([]);
  }

  async function handleSaveShop(editData) {
    await base44.entities.Shop.update(shop.id, editData);
    setShop((s) => ({ ...s, ...editData }));
    toast.success('Shop updated!');
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // ── Wrong role ────────────────────────────────────────────────────────────
  if (user && user.role !== 'shop_owner') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">This page is only for shop owners.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  // ── No shop yet → show claim/create screen ───────────────────────────────
  if (!shop) {
    return <ClaimOrCreateScreen onClaim={handleClaimShop} onCreate={handleCreateShop} />;
  }

  const initials = shop.name
    ? shop.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SH';

  // ── Main Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Top Nav */}
      <div className="bg-primary text-primary-foreground h-14 flex items-center px-5 gap-3 shrink-0">
        <span className="font-heading font-extrabold text-lg mr-auto tracking-tight">
          TrustPulse <span className="opacity-60 font-normal text-sm">for Shops</span>
        </span>
        <span className="text-xs font-semibold bg-primary-foreground/10 text-primary-foreground/80 px-3 py-1 rounded-full">
          ✓ Shop Owner
        </span>
        <span className="text-sm text-primary-foreground/70 hidden sm:block">{shop.name}</span>
        <div className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-48 bg-card border-r border-border shrink-0 flex-col py-3 px-2 hidden md:flex">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-1">Main</p>
          {NAV.slice(0, 4).map((item) => {
            const Icon   = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 text-left w-full ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                {item.id === 'reviews' && (
                  <span className="ml-auto text-[10px] bg-primary/10 text-primary rounded-full px-1.5 font-semibold">
                    {reviews.length}
                  </span>
                )}
              </button>
            );
          })}

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-4">Tools</p>
          <button
            onClick={() => setActivePage('calculator')}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 text-left w-full ${
              activePage === 'calculator'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Calculator className="h-4 w-4 shrink-0" />
            Trust Calculator
          </button>

          <div className="mt-auto border-t border-border pt-2">
            <button
              onClick={() => base44.auth.logout('/')}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all w-full"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {/* Mobile nav */}
          <div className="flex gap-1 mb-5 overflow-x-auto md:hidden pb-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    activePage === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {activePage === 'overview'   && <DashboardOverview   shop={shop} reviews={reviews} onNavigate={setActivePage} />}
          {activePage === 'reviews'    && <DashboardReviews    reviews={reviews} />}
          {activePage === 'complaints' && <DashboardComplaints shop={shop} />}
          {activePage === 'profile'    && <DashboardProfile    shop={shop} onSave={handleSaveShop} categories={CATEGORIES} platforms={PLATFORMS} />}
          {activePage === 'calculator' && <DashboardCalculator shop={shop} reviews={reviews} />}
        </main>
      </div>
    </div>
  );
}

// ── Claim or Create Shop Screen ──────────────────────────────────────────────
function ClaimOrCreateScreen({ onClaim, onCreate }) {
  const [mode,         setMode]         = useState('search'); // 'search' | 'create'
  const [query,        setQuery]        = useState('');
  const [allShops,     setAllShops]     = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [claiming,     setClaiming]     = useState(null);

  useEffect(() => {
    base44.entities.Shop.list('name', 1000).then((shops) => {
      setAllShops(shops);
      setLoadingShops(false);
    });
  }, []);

  const results = query.trim()
    ? allShops.filter((s) => s.name?.toLowerCase().includes(query.toLowerCase()))
    : [];

  async function claim(shop) {
    setClaiming(shop.id);
    await onClaim(shop.id);
    setClaiming(null);
  }

  // ── Create Mode: Show Wizard ──────────────────────────────────────────────
  if (mode === 'create') {
    return (
      <ShopCreationWizard 
        onComplete={onCreate}
        onCancel={() => setMode('search')}
      />
    );
  }

  // ── Search Mode: Claim Existing ───────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 mt-10">
      <div className="text-center space-y-2">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-md">
          <Store className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold">Get Started</h1>
        <p className="text-sm text-muted-foreground">
          Search for your shop to claim it, or create a new listing
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for your shop name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loadingShops}
          className="pl-12 h-12 text-base"
        />
      </div>

      {loadingShops && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Loading shops…</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Found {results.length} shop{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((shop) => (
            <div key={shop.id} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {shop.shop_icon ? (
                  <img src={shop.shop_icon} alt={shop.name} className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <span className="font-bold text-primary text-lg">{shop.name[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{shop.name}</p>
                <p className="text-xs text-muted-foreground">{shop.category} · {shop.platform}</p>
              </div>
              <Button 
                size="sm" 
                disabled={claiming === shop.id} 
                onClick={() => claim(shop)}
                className="shrink-0"
              >
                {claiming === shop.id ? 'Claiming…' : 'Claim'}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* No Results or Create New */}
      {(results.length === 0 && query && !loadingShops) || !query ? (
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center space-y-4">
          {query ? (
            <>
              <div className="text-4xl">🔍</div>
              <div>
                <p className="font-semibold text-foreground">No shops found matching "{query}"</p>
                <p className="text-sm text-muted-foreground mt-1">Your shop might not be listed yet</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl">🏪</div>
              <div>
                <p className="font-semibold text-foreground">Don't see your shop?</p>
                <p className="text-sm text-muted-foreground mt-1">Create a new shop listing in 3 easy steps</p>
              </div>
            </>
          )}
          
          <Button 
            onClick={() => setMode('create')}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4" />
            Create New Shop
          </Button>

          {query && (
            <p className="text-xs text-muted-foreground">
              or <button onClick={() => setQuery('')} className="text-primary hover:underline">search again</button>
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
