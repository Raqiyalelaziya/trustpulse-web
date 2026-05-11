import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UAEFlag from '@/components/UAEFlag';

const Home = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({ shops: 36, reviews: 42, verified: 23 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStats();
    fetchShops();
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
    } else {
      navigate('/search');
    }
  };

  const categories = [
    { name: 'Fashion', icon: '👗', count: 8 },
    { name: 'Beauty', icon: '💄', count: 6 },
    { name: 'Electronics', icon: '📱', count: 5 },
    { name: 'Accessories', icon: '👜', count: 7 },
    { name: 'Home', icon: '🏠', count: 4 },
    { name: 'Food', icon: '🍽️', count: 3 },
    { name: 'Perfume', icon: '🌸', count: 2 },
    { name: 'Handmade', icon: '🎨', count: 1 },
  ];

  return (
    <div className="bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              {/* UAE Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                <UAEFlag className="w-6 h-4" />
                <span className="text-sm font-medium text-white">Proudly serving the UAE</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Shop Smarter.
                <span className="block text-emerald-400 mt-2">Trust Verified.</span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                Real reviews from real buyers across the UAE. Discover trustworthy Instagram, TikTok and social media shops — before you buy.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search shops, brands, categories..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all inline-flex items-center gap-2"
                >
                  Browse Shops
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-transparent text-white border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Join Free
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verified Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Real Community</span>
                </div>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-300 text-sm font-medium">Total Shops Listed</p>
                    <UAEFlag className="w-6 h-4" />
                  </div>
                  <p className="text-5xl font-bold text-white mb-2">{stats.shops}</p>
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    Growing daily
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <p className="text-slate-300 text-sm font-medium mb-3">Reviews</p>
                  <p className="text-3xl font-bold text-white">{stats.reviews}</p>
                </div>
                <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-6">
                  <p className="text-emerald-300 text-sm font-medium mb-3">Verified</p>
                  <p className="text-3xl font-bold text-white">{stats.verified}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center lg:text-left">
              <p className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">{stats.shops}+</p>
              <p className="text-sm text-slate-500 font-medium">Shops Listed</p>
            </div>
            <div className="text-center lg:text-left border-l border-r border-slate-200 px-4 lg:px-8">
              <p className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">{stats.reviews}+</p>
              <p className="text-sm text-slate-500 font-medium">Real Reviews</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-1">{stats.verified}+</p>
              <p className="text-sm text-slate-500 font-medium">Verified Shops</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Browse Categories</h2>
              <p className="text-slate-600">Find shops in your favorite categories</p>
            </div>
            <Link to="/search" className="hidden sm:flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{cat.name}</h3>
                <p className="text-sm text-slate-500">{cat.count} shops</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">How TrustPulse Works</h2>
            <p className="text-slate-600">Making informed shopping decisions has never been easier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Discover',
                desc: 'Browse verified shops across UAE by category, rating, or location. Find exactly what you need.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Read Real Reviews',
                desc: 'Get authentic feedback from real UAE customers. Make decisions based on verified experiences.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Shop with Confidence',
                desc: 'Buy from trusted, verified shops. Then share your own review to help the community.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <span className="text-4xl font-bold text-slate-200">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SHOPS */}
      {shops.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Featured Shops</h2>
                <p className="text-slate-600">Top-rated shops trusted by our community</p>
              </div>
              <Link to="/search" className="hidden sm:flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.slice(0, 6).map((shop, i) => (
                <Link
                  key={i}
                  to={`/shops/${shop.id}`}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {shop.icon || '🏪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                        {shop.shop_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, s) => (
                            <svg key={s} className={`w-4 h-4 ${s < Math.round(shop.average_rating || 4) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">({shop.review_count || 0})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {shop.description || 'Verified UAE shop with quality products and excellent service.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {shop.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View shop
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-16 relative overflow-hidden">
            {/* UAE Flag accent */}
            

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span className="text-xs font-semibold text-emerald-400">JOIN THE COMMUNITY</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to make smarter shopping decisions?
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Join thousands of UAE buyers who trust our verified reviews to find the best shops and avoid scams.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2"
                >
                  Create Free Account
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/search"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-all"
                >
                  Explore Shops
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-white">TrustPulse</h3>
                <UAEFlag className="w-6 h-4" />
              </div>
              <p className="text-sm leading-relaxed max-w-md">
                The UAE's trusted platform for verified shop reviews. Helping buyers make informed decisions across Instagram, TikTok, and social media shops.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/search" className="hover:text-white transition-colors">Browse Shops</Link></li>
                <li><Link to="/add-shop" className="hover:text-white transition-colors">Add Shop</Link></li>
                <li><Link to="/add-review" className="hover:text-white transition-colors">Write Review</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2026 TrustPulse. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <UAEFlag className="w-6 h-4" />
              <span>Made in the UAE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
