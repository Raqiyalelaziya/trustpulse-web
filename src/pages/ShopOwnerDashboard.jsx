import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Star, MessageSquare, ShieldCheck, Edit2, Save, X, ArrowRight, LogOut, LayoutDashboard, AlertCircle, User, Calculator } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/Logo';

import DashboardOverview from '@/components/shopowner/DashboardOverview';
import DashboardReviews from '@/components/shopowner/DashboardReviews';
import DashboardComplaints from '@/components/shopowner/DashboardComplaints';
import DashboardProfile from '@/components/shopowner/DashboardProfile';
import DashboardCalculator from '@/components/shopowner/DashboardCalculator';

const categories = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms = ['Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];

const NAV = [
  { id: 'overview',    label: 'Overview',         icon: LayoutDashboard },
  { id: 'reviews',     label: 'Reviews',           icon: MessageSquare },
  { id: 'complaints',  label: 'Complaints',        icon: AlertCircle },
  { id: 'profile',     label: 'Shop profile',      icon: User },
  { id: 'calculator',  label: 'Trust calculator',  icon: Calculator },
];

export default function ShopOwnerDashboard() {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) { base44.auth.redirectToLogin('/shop-owner-dashboard'); return; }

      const me = await base44.auth.me();
      setUser(me);

      if (me.role !== 'shop_owner') { setLoading(false); return; }

      if (me.owned_shop_id) {
        const shops = await base44.entities.Shop.list('name', 1000);
        const myShop = shops.find(s => s.id === me.owned_shop_id);
        if (myShop) {
          setShop(myShop);
          const shopReviews = await base44.entities.Review.filter({ shop_id: myShop.id }, '-created_date', 50);
          setReviews(shopReviews);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleClaimShop(shopId) {
    await base44.auth.updateMe({ owned_shop_id: shopId });
    const shops = await base44.entities.Shop.list('name', 1000);
    const myShop = shops.find(s => s.id === shopId);
    if (myShop) {
      setShop(myShop);
      const shopReviews = await base44.entities.Review.filter({ shop_id: myShop.id }, '-created_date', 50);
      setReviews(shopReviews);
    }
    setUser((u) => ({ ...u, owned_shop_id: shopId }));
  }

  async function handleSaveShop(editData) {
    await base44.entities.Shop.update(shop.id, {
      name: editData.name,
      description: editData.description,
      category: editData.category,
      platform: editData.platform,
      profile_url: editData.profile_url,
    });
    setShop((s) => ({ ...s, ...editData }));
    toast({ title: 'Shop updated!' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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

  if (!shop) {
    return <ClaimShopScreen onClaim={handleClaimShop} />;
  }

  const initials = shop.name ? shop.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'SH';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <div className="bg-primary text-primary-foreground h-14 flex items-center px-5 gap-3 shrink-0">
        <div className="mr-auto">
          <Logo size="sm" forceWhite />
        </div>
        <span className="text-xs font-semibold bg-primary-foreground/10 text-primary-foreground/80 px-3 py-1 rounded-full">
          ✓ Verified shop
        </span>
        <span className="text-sm text-primary-foreground/70 hidden sm:block">{shop.name}</span>
        <div className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 bg-card border-r border-border shrink-0 flex flex-col py-3 px-2 hidden md:flex">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-1">Main</p>
          {NAV.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 text-left w-full ${
                  active ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                {item.id === 'complaints' && (
                  <span className="ml-auto text-[10px] bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
                )}
                {item.id === 'reviews' && (
                  <span className="ml-auto text-[10px] bg-primary/10 text-primary rounded-full px-1.5 font-semibold">{reviews.length}</span>
                )}
              </button>
            );
          })}

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1 mt-4">Tools</p>
          <button
            onClick={() => setActivePage('calculator')}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 text-left w-full ${
              activePage === 'calculator' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Calculator className="h-4 w-4 shrink-0" />
            Trust calculator
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
          {/* Mobile nav tabs */}
          <div className="flex gap-1 mb-5 overflow-x-auto md:hidden pb-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    activePage === item.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {activePage === 'overview'   && <DashboardOverview shop={shop} reviews={reviews} onNavigate={setActivePage} />}
          {activePage === 'reviews'    && <DashboardReviews reviews={reviews} />}
          {activePage === 'complaints' && <DashboardComplaints />}
          {activePage === 'profile'    && <DashboardProfile shop={shop} onSave={handleSaveShop} categories={categories} platforms={platforms} />}
          {activePage === 'calculator' && <DashboardCalculator shop={shop} reviews={reviews} />}
        </main>
      </div>
    </div>
  );
}

function ClaimShopScreen({ onClaim }) {
  const [query, setQuery] = useState('');
  const [allShops, setAllShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [claimed, setClaimed] = useState(null);

  useEffect(() => {
    base44.entities.Shop.list('name', 1000).then((shops) => {
      setAllShops(shops);
      setLoadingShops(false);
    });
  }, []);

  const results = query.trim()
    ? allShops.filter((s) => s.name && s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  async function claim(shop) {
    setClaimed(shop.id);
    await onClaim(shop.id);
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 mt-10">
      <div className="text-center space-y-2">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-md">
          <Store className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold">Claim Your Shop</h1>
        <p className="text-sm text-muted-foreground">Search for your shop and claim ownership to manage it.</p>
      </div>
      <Input
        placeholder="Search your shop name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loadingShops}
      />
      {loadingShops && <p className="text-sm text-muted-foreground text-center">Loading shops...</p>}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((shop) => (
            <div key={shop.id} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {shop.shop_icon
                  ? <img src={shop.shop_icon} alt={shop.name} className="h-12 w-12 rounded-xl object-cover" />
                  : <span className="font-bold text-primary text-lg">{shop.name[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{shop.name}</p>
                <p className="text-xs text-muted-foreground">{shop.category} · {shop.platform}</p>
              </div>
              <Button size="sm" disabled={claimed === shop.id} onClick={() => claim(shop)}>
                {claimed === shop.id ? 'Claiming...' : 'Claim'}
              </Button>
            </div>
          ))}
        </div>
      )}
      {results.length === 0 && query && !loadingShops && (
        <div className="text-center text-sm text-muted-foreground py-6">
          No shops found. <Link to="/add-shop" className="text-primary hover:underline">Add your shop →</Link>
        </div>
      )}
    </div>
  );
}