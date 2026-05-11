import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('trust');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ total: 0, verified: 0, categories: 0 });

  const categories = [
    { id: '', name: 'All' },
    { id: 'Fashion', name: 'Fashion', icon: '👗' },
    { id: 'Beauty', name: 'Beauty', icon: '💄' },
    { id: 'Electronics', name: 'Electronics', icon: '📱' },
    { id: 'Accessories', name: 'Accessories', icon: '👜' },
    { id: 'Home', name: 'Home', icon: '🏠' },
    { id: 'Food', name: 'Food', icon: '🍽️' },
    { id: 'Perfume', name: 'Perfume', icon: '🌸' },
    { id: 'Handmade', name: 'Handmade', icon: '🎨' },
    { id: 'Health', name: 'Health', icon: '💚' },
    { id: 'Sports', name: 'Sports', icon: '⚽' },
  ];

  useEffect(() => {
    fetchShops();
  }, [selectedCategory]);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setSearchTerm(q);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      let url = 'https://trustpulse-api.onrender.com/shops';
      if (selectedCategory) url += `?category=${selectedCategory}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setShops(data);
        setStats({
          total: data.length,
          verified: data.filter(s => s.verified).length,
          categories: [...new Set(data.map(s => s.category).filter(Boolean))].length
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (cat) params.set('category', cat);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const filteredShops = shops
    .filter(shop => {
      const name = (shop.shop_name || shop.name || '').toLowerCase();
      const desc = (shop.description || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || desc.includes(term);
    })
    .sort((a, b) => {
      if (sortBy === 'trust') return (b.trust_score || 0) - (a.trust_score || 0);
      if (sortBy === 'rating') return (b.average_rating || 0) - (a.average_rating || 0);
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0);
      return 0;
    });

  const getTrustLabel = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 75) return { text: 'Very Good', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 50) return { text: 'Good', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { text: 'New', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Explore Shops</h1>
            <p className="text-slate-500 mb-6">Discover verified shops with real reviews from real people</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search shops by name or category..."
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 border rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2 ${
                    showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </form>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-700">Sort by</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'trust', label: 'Trust Score' },
                    { value: 'rating', label: 'Rating' },
                    { value: 'reviews', label: 'Most Reviewed' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === opt.value
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span><span className="font-bold text-slate-900">{stats.total}</span> Shops</span>
            <span className="text-slate-300">|</span>
            <span><span className="font-bold text-emerald-600">{stats.verified}</span> Verified</span>
            <span className="text-slate-300">|</span>
            <span><span className="font-bold text-slate-900">{stats.categories}</span> Categories</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">{filteredShops.length}</span> shops found
            {selectedCategory && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
            {searchTerm && <span> for "<span className="font-semibold">{searchTerm}</span>"</span>}
          </p>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); setSearchParams({}); }}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              Clear search ×
            </button>
          )}
        </div>

        {/* Shop Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900 mb-1">No shops found</p>
            <p className="text-slate-500 mb-4 text-sm">Try a different search term or category</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSearchParams({}); fetchShops(); }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-all"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShops.map((shop) => {
              const trust = getTrustLabel(shop.trust_score || 0);
              const avgRating = parseFloat(shop.average_rating || 0);
              const name = shop.shop_name || shop.name || 'Shop';

              return (
                <Link
                  key={shop.id}
                  to={`/shops/${shop.id}`}
                  className="group bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6">
                    {/* Top Row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-600 flex-shrink-0 border border-slate-200">
                        {shop.icon || name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {shop.verified && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          )}
                          {shop.category && (
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              {shop.category}
                            </span>
                          )}
                          {shop.platform && (
                            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                              {shop.platform}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 min-h-[40px]">
                      {shop.description || 'Verified UAE shop with quality products.'}
                    </p>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {/* Stars */}
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">({shop.review_count || 0})</span>
                      </div>

                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${trust.bg} ${trust.color} ${trust.border}`}>
                        {(shop.trust_score || 0).toFixed(0)}% trust
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Add Shop CTA */}
        {!loading && (
          <div className="mt-8 bg-slate-900 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">Can't find a shop?</p>
              <p className="text-sm text-slate-400">Add it to TrustPulse and help the community</p>
            </div>
            <Link
              to="/add-shop"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all whitespace-nowrap inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add a Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
