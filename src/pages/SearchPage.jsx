import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Filter, X, ShieldCheck, Search, SlidersHorizontal } from 'lucide-react';
import ShopCard from '../components/ShopCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const categories  = ['All', 'Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports', 'Books', 'Other'];
const platforms   = ['All', 'Instagram', 'TikTok', 'Website', 'Facebook', 'Other'];
const trustLevels = ['All', 'High', 'Medium', 'Low', 'New'];

const categoryEmoji = {
  All: '🔍', Fashion: '👗', Beauty: '💄', Electronics: '📱',
  Accessories: '👜', Home: '🏠', Food: '🍽️', Perfume: '🌸',
  Handmade: '🤝', Health: '💚', Sports: '⚽', Books: '📚', Other: '🏪',
};

export default function SearchPage() {
  const urlParams       = new URLSearchParams(window.location.search);
  const initialQuery    = urlParams.get('q') || '';
  const initialCategory = urlParams.get('category') || 'All';
  const { lang }        = useLang();

  const [shops,        setShops]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [category,     setCategory]     = useState(initialCategory);
  const [platform,     setPlatform]     = useState('All');
  const [trustLevel,   setTrustLevel]   = useState('All');
  const [sortBy,       setSortBy]       = useState('-trust_score');
  const [showFilters,  setShowFilters]  = useState(false);
  const [searchQuery,  setSearchQuery]  = useState(initialQuery);
  const [inputValue,   setInputValue]   = useState(initialQuery);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    async function loadShops() {
      setLoading(true);
      const filters = {};
      if (category !== 'All')    filters.category    = category;
      if (platform !== 'All')    filters.platform    = platform;
      if (trustLevel !== 'All')  filters.trust_level = trustLevel;

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

      if (verifiedOnly) {
        results = results.filter((s) => (s.verified_review_count || 0) > 0 || s.license_verified);
      }

      setShops(results);
      setLoading(false);
    }
    loadShops();
  }, [category, platform, trustLevel, sortBy, searchQuery, verifiedOnly]);

  function handleSearch(e) {
    e.preventDefault();
    setSearchQuery(inputValue);
  }

  function resetFilters() {
    setCategory('All');
    setPlatform('All');
    setTrustLevel('All');
    setSortBy('-trust_score');
    setSearchQuery('');
    setInputValue('');
    setVerifiedOnly(false);
  }

  const hasActiveFilters = category !== 'All' || platform !== 'All' || trustLevel !== 'All' || searchQuery || verifiedOnly;

  return (
    <div className="space-y-6">

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search shops by name or category…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(''); setSearchQuery(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" className="rounded-2xl px-6">Search</Button>
        <Button
          type="button"
          variant="outline"
          className={`rounded-2xl px-4 gap-2 ${showFilters || hasActiveFilters ? 'border-primary/40 text-primary bg-primary/5' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
        </Button>
      </form>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              category === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            <span>{categoryEmoji[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Advanced Filters
            </h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Trust Level</label>
              <Select value={trustLevel} onValueChange={setTrustLevel}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {trustLevels.map((tl) => <SelectItem key={tl} value={tl}>{tl}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="-trust_score">Highest Trust</SelectItem>
                  <SelectItem value="-average_rating">Highest Rated</SelectItem>
                  <SelectItem value="-review_count">Most Reviews</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 border text-sm font-medium transition-colors h-10 ${
                  verifiedOnly
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600'
                    : 'border-border text-muted-foreground hover:border-emerald-500/40'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Verified Only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="animate-pulse">Searching…</span>
          ) : (
            <><strong className="text-foreground">{shops.length}</strong> shop{shops.length !== 1 ? 's' : ''} found
            {searchQuery && <> for "<strong className="text-primary">{searchQuery}</strong>"</>}
            {category !== 'All' && <> in <strong className="text-primary">{category}</strong></>}
            </>
          )}
        </p>
        {hasActiveFilters && !loading && (
          <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Reset filters
          </button>
        )}
      </div>

      {/* Shop grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-56 bg-card rounded-2xl border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-5xl">🔍</div>
          <p className="font-heading font-bold text-lg">No shops found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          <Button variant="outline" onClick={resetFilters} className="rounded-xl mt-2">Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      )}
    </div>
  );
}
