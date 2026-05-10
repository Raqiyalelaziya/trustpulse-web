import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const Explore = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: '', name: 'All', emoji: '🔍', color: 'from-blue-500 to-indigo-600' },
    { id: 'Fashion', name: 'Fashion', emoji: '👗', color: 'from-pink-500 to-rose-600' },
    { id: 'Beauty', name: 'Beauty', emoji: '💄', color: 'from-purple-500 to-pink-600' },
    { id: 'Electronics', name: 'Electronics', emoji: '📱', color: 'from-blue-500 to-cyan-600' },
    { id: 'Accessories', name: 'Accessories', emoji: '👜', color: 'from-orange-500 to-red-600' },
    { id: 'Home', name: 'Home', emoji: '🏡', color: 'from-green-500 to-emerald-600' },
    { id: 'Food', name: 'Food', emoji: '🍔', color: 'from-yellow-500 to-orange-600' },
    { id: 'Perfume', name: 'Perfume', emoji: '🌸', color: 'from-purple-500 to-indigo-600' },
    { id: 'Handmade', name: 'Handmade', emoji: '🎨', color: 'from-teal-500 to-cyan-600' },
    { id: 'Health', name: 'Health', emoji: '💊', color: 'from-green-500 to-teal-600' },
    { id: 'Sport', name: 'Sport', emoji: '⚽', color: 'from-blue-500 to-purple-600' },
  ];

  const platformColors = {
    'Instagram': 'from-pink-500 to-purple-600',
    'TikTok': 'from-black to-pink-600',
    'Facebook': 'from-blue-600 to-indigo-600',
    'WhatsApp': 'from-green-500 to-emerald-600',
    'Website': 'from-gray-700 to-gray-900',
  };

  useEffect(() => {
    fetchShops();
  }, [selectedCategory]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      let url = 'https://trustpulse-api.onrender.com/shops';
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrustBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', emoji: '🏆', color: 'from-yellow-400 to-orange-500' };
    if (score >= 80) return { text: 'Very Good', emoji: '⭐', color: 'from-green-400 to-emerald-500' };
    if (score >= 70) return { text: 'Good', emoji: '✓', color: 'from-blue-400 to-cyan-500' };
    if (score >= 60) return { text: 'Fair', emoji: '!', color: 'from-orange-400 to-red-500' };
    return { text: 'New', emoji: '🌱', color: 'from-gray-400 to-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* Hero Search Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              Explore <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Trusted Shops</span>
            </h1>
            <p className="text-purple-200 text-lg">Discover verified shops with real reviews from real people</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search shops by name or category..."
                className="w-full pl-14 pr-32 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:border-purple-400 transition-all text-lg"
              />
              <svg className="absolute left-5 top-5 w-7 h-7 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-2 top-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{shops.length}</p>
              <p className="text-purple-200 text-sm">Shops</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{shops.filter(s => s.license_verified).length}</p>
              <p className="text-purple-200 text-sm">Verified</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{categories.length - 1}</p>
              <p className="text-purple-200 text-sm">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredShops.length} shops found
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-2xl font-bold text-gray-900 mb-2">No shops found</p>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => {
              const trustBadge = getTrustBadge(shop.trust_score);
              return (
                <div
                  key={shop.id}
                  onClick={() => navigate(`/shops/${shop.id}`)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
                >
                  {/* Shop Image/Header */}
                  <div className={`relative h-48 bg-gradient-to-br ${platformColors[shop.platform] || 'from-gray-400 to-gray-600'} overflow-hidden`}>
                    {/* Background Image (if available) */}
                    {shop.profile_url ? (
                      <>
                        <img 
                          src={shop.profile_url} 
                          alt={shop.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </>
                    ) : (
                      /* Decorative Pattern */
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}></div>
                    )}

                    {/* Shop Icon/Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {shop.shop_icon ? (
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-4 border-white/50 shadow-2xl overflow-hidden">
                          <img 
                            src={shop.shop_icon} 
                            alt={shop.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to letter if image fails
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `<span class="text-5xl font-bold bg-gradient-to-br ${platformColors[shop.platform] || 'from-gray-400 to-gray-600'} bg-clip-text text-transparent">${shop.name.charAt(0).toUpperCase()}</span>`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                          <span className="text-5xl font-bold text-white">
                            {shop.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {shop.license_verified && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Platform Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-lg">
                        {shop.platform}
                      </span>
                    </div>

                    {/* Trust Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className={`px-4 py-2 bg-gradient-to-r ${trustBadge.color} rounded-xl shadow-lg border-2 border-white/50 flex items-center gap-2`}>
                        <span className="text-xl">{trustBadge.emoji}</span>
                        <span className="text-white font-bold text-sm">{trustBadge.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {shop.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold rounded-full">
                        {shop.category}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(shop.average_rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {(shop.average_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({shop.review_count || 0} reviews)
                      </span>
                    </div>

                    {/* Trust Score Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">TRUST SCORE</span>
                        <span className="text-sm font-bold text-gray-900">
                          {(shop.trust_score || 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 bg-gradient-to-r ${trustBadge.color} transition-all duration-500`}
                          style={{ width: `${shop.trust_score || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* View Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform group-hover:scale-105 flex items-center justify-center gap-2">
                      <span>View Shop</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
