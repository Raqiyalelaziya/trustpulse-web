import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Filter, X, ShieldCheck } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ShopCard from '../components/ShopCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const categories = ['All', 'Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms = ['All', 'Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];
const trustLevels = ['All', 'High', 'Medium', 'Low', 'New'];
const minRatingOptions = ['Any', '2+', '3+', '4+', '4.5+'];
const recencyOptions = ['Any time', 'Last 7 days', 'Last 30 days', 'Last 3 months'];

export default function SearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const initialCategory = urlParams.get('category') || 'All';
  const { lang } = useLang();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [platform, setPlatform] = useState('All');
  const [trustLevel, setTrustLevel] = useState('All');
  const [sortBy, setSortBy] = useState('-average_rating');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [minRating, setMinRating] = useState('Any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [recency, setRecency] = useState('Any time');

  useEffect(() => {
    async function loadShops() {
      setLoading(true);
      const filters = {};
      if (category !== 'All') filters.category = category;
      if (platform !== 'All') filters.platform = platform;
      if (trustLevel !== 'All') filters.trust_level = trustLevel;

      let results;
      if (Object.keys(filters).length > 0) {
        results = await base44.entities.Shop.filter(filters, sortBy, 50);
      } else {
        results = await base44.entities.Shop.list(sortBy, 50);
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        results = results.filter(
          (s) =>
            s.name?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q)
        );
      }

      // Min rating filter
      if (minRating !== 'Any') {
        const threshold = parseFloat(minRating);
        results = results.filter((s) => (s.average_rating || 0) >= threshold);
      }

      // Verified only: shops with at least 1 verified review
      if (verifiedOnly) {
        results = results.filter((s) => (s.verified_review_count || 0) > 0);
      }

      // Recency: filter shops that have reviews within the window
      if (recency !== 'Any time') {
        const now = Date.now();
        const days = recency === 'Last 7 days' ? 7 : recency === 'Last 30 days' ? 30 : 90;
        const cutoff = now - days * 24 * 60 * 60 * 1000;
        // We filter by shop updated_date as a proxy for recent activity
        results = results.filter((s) => s.updated_date && new Date(s.updated_date).getTime() >= cutoff);
      }

      setShops(results);
      setLoading(false);
    }
    loadShops();
  }, [category, platform, trustLevel, sortBy, searchQuery, minRating, verifiedOnly, recency]);

  function resetFilters() {
    setCategory('All');
    setPlatform('All');
    setTrustLevel('All');
    setSortBy('-average_rating');
    setSearchQuery('');
    setMinRating('Any');
    setVerifiedOnly(false);
    setRecency('Any time');
  }

  const hasActiveFilters = category !== 'All' || platform !== 'All' || trustLevel !== 'All' || searchQuery || minRating !== 'Any' || verifiedOnly || recency !== 'Any time';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar initialValue={searchQuery} placeholder={t(lang, 'searchPlaceholder')} />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-2xl shrink-0"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      {showFilters && (
        <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold">{t(lang, 'filters')}</h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                <X className="h-3 w-3" /> {t(lang, 'clearAll')}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t(lang, 'category')}</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t(lang, 'platform')}</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t(lang, 'trustLevel')}</label>
              <Select value={trustLevel} onValueChange={setTrustLevel}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {trustLevels.map((t2) => <SelectItem key={t2} value={t2}>{t2}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t(lang, 'sortBy')}</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="-average_rating">{t(lang, 'highestRated')}</SelectItem>
                  <SelectItem value="-review_count">{t(lang, 'mostReviews')}</SelectItem>
                  <SelectItem value="-created_date">{t(lang, 'newest')}</SelectItem>
                  <SelectItem value="name">{t(lang, 'nameAZ')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Min Rating</label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {minRatingOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Recent Activity</label>
              <Select value={recency} onValueChange={setRecency}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {recencyOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 border text-sm font-medium transition-colors ${
                  verifiedOnly
                    ? 'bg-trust-high/10 border-trust-high/40 text-trust-high'
                    : 'border-border text-muted-foreground hover:border-trust-high/40'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Verified Only
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {loading ? 'Searching...' : `${shops.length} shop${shops.length !== 1 ? 's' : ''} found`}
        </p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-52 bg-card rounded-2xl border border-border/50 animate-pulse" />)}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t(lang, 'noShopsFound')}</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        )}
      </div>
    </div>
  );
}