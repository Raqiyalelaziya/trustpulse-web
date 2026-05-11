import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({ shops: 0, reviews: 0, verified: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchShops();
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://trustpulse-api.onrender.com/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await fetch('https://trustpulse-api.onrender.com/shops?limit=6');
      if (response.ok) {
        const data = await response.json();
        setShops(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'Fashion', emoji: '👗', icon: '🛍️', color: 'from-pink-400 to-red-500' },
    { name: 'Beauty', emoji: '💄', icon: '✨', color: 'from-purple-400 to-pink-500' },
    { name: 'Electronics', emoji: '📱', icon: '⚡', color: 'from-blue-400 to-purple-500' },
    { name: 'Accessories', emoji: '💍', icon: '✨', color: 'from-orange-400 to-yellow-500' },
    { name: 'Home', emoji: '🏠', icon: '🛋️', color: 'from-green-400 to-blue-500' },
    { name: 'Food', emoji: '🍔', icon: '🍽️', color: 'from-red-400 to-orange-500' },
    { name: 'Perfume', emoji: '💐', icon: '🌸', color: 'from-pink-400 to-purple-500' },
    { name: 'Handmade', emoji: '🎨', icon: '🖌️', color: 'from-indigo-400 to-purple-500' },
    { name: 'Health', emoji: '💚', icon: '⚕️', color: 'from-green-400 to-emerald-500' },
    { name: 'Sports', emoji: '⚽', icon: '🏃', color: 'from-blue-400 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Text Content */}
              <div className="text-center lg:text-left animate-fade-in">
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold flex items-center gap-2 w-fit mx-auto lg:mx-0">
                    <span className="animate-spin text-lg">🇦🇪</span>
                    UAE SOCIAL SHOPS
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
                  Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">Smarter.</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">Trust Verified.</span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Real reviews from real buyers across the UAE. Discover trustworthy Instagram, TikTok and social media shops — before you buy.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search shops, sellers, categories..."
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 justify-center"
                  >
                    <span>Search</span>
                  </button>
                </form>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/search"
                    className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 justify-center"
                  >
                    <span>📖</span> Browse Shops
                  </Link>
                  <Link
                    to="/signup"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 justify-center"
                  >
                    <span>⭐</span> Join Free
                  </Link>
                </div>
              </div>

              {/* Right: Animated Stats */}
              <div className="hidden lg:block">
                <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {[
                    { icon: '📦', stat: stats.shops || 36, label: 'Shops Listed', color: 'from-blue-500 to-cyan-500' },
                    { icon: '⭐', stat: stats.reviews || 42, label: 'Total Reviews', color: 'from-yellow-400 to-orange-500' },
                    { icon: '✅', stat: stats.verified || 23, label: 'Verified Shops', color: 'from-green-400 to-emerald-500' }
                  ].map((item, i) => (
                    <div key={i} className={`bg-gradient-to-br ${item.color} rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all`}>
                      <p className="text-white/80 text-sm font-semibold mb-2">{item.label}</p>
                      <p className="text-5xl font-black text-white">{item.stat}</p>
                      <p className="text-4xl absolute bottom-4 right-4 opacity-20">{item.icon}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats on Mobile */}
        <section className="lg:hidden px-4 py-8">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '📦', stat: stats.shops || 36, label: 'Shops' },
              { icon: '⭐', stat: stats.reviews || 42, label: 'Reviews' },
              { icon: '✅', stat: stats.verified || 23, label: 'Verified' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all">
                <p className="text-3xl mb-2">{item.icon}</p>
                <p className="text-2xl font-black text-white">{item.stat}</p>
                <p className="text-xs text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2">Browse by Category</h2>
                <p className="text-gray-400">Explore verified shops in your favorite categories</p>
              </div>
              <Link to="/search" className="text-purple-400 font-bold hover:text-purple-300 transition-all flex items-center gap-2">
                See all <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  to={`/search?category=${encodeURIComponent(cat.name)}`}
                  className={`bg-gradient-to-br ${cat.color} rounded-3xl p-6 text-white hover:scale-110 transition-all duration-300 transform hover:shadow-2xl group cursor-pointer`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{cat.emoji}</div>
                  <p className="font-bold text-lg">{cat.name}</p>
                  <p className="text-white/70 text-sm">Browse {cat.name.toLowerCase()}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED SHOPS */}
        {shops.length > 0 && (
          <section className="px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2">Featured Shops</h2>
                <p className="text-gray-400">Highly rated shops from our community</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.slice(0, 6).map((shop, i) => (
                  <Link
                    key={i}
                    to={`/shops/${shop.id}`}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {shop.icon || '🏪'}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, s) => (
                          <span key={s} className={s < (shop.average_rating || 4) ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{shop.shop_name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{shop.description || 'Verified shop'}</p>
                    
                    <div className="flex gap-2 mb-4">
                      {shop.verified && <span className="text-xs bg-green-500/30 text-green-300 px-3 py-1 rounded-full font-semibold flex items-center gap-1">✅ Verified</span>}
                      <span className="text-xs bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full font-semibold">{shop.review_count || 0} reviews</span>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all group-hover:scale-105">
                      View Shop
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-4xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mt-20"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20"></div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to Shop Smart?</h2>
              <p className="text-xl text-white/90 mb-8">Join thousands of UAE buyers making smarter shopping decisions</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/search"
                  className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105"
                >
                  Start Browsing
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white/20 text-white rounded-2xl font-bold border border-white/30 hover:bg-white/30 transition-all hover:scale-105"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer-like Section */}
        <section className="px-4 py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-black text-white mb-4">🛡️ Trust & Safety</h3>
                <p className="text-gray-400">Every shop is verified by our community of real buyers</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4">⭐ Real Reviews</h3>
                <p className="text-gray-400">Honest feedback from actual customers shopping across UAE</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4">🚀 Smart Shopping</h3>
                <p className="text-gray-400">Make informed decisions with verified shop ratings</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
