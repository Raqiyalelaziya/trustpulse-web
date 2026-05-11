import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import shieldLogo from '@/assets/shield.png';
import UAEFlag from '@/components/UAEFlag';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', labelAr: 'الرئيسية' },
    { path: '/search', label: 'Explore', labelAr: 'استكشف' },
    { path: '/add-shop', label: 'Add Shop', labelAr: 'إضافة متجر' },
    { path: '/add-review', label: 'Write Review', labelAr: 'كتابة مراجعة' },
  ];

  if (user) {
    navLinks.push({ path: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم' });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar - UAE Indicator */}
      <div className="bg-slate-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <UAEFlag className="w-5 h-3.5" />
              <span className="font-medium">United Arab Emirates</span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Verified shop reviews you can trust</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="mailto:support@trustpulse.ae" className="text-slate-300 hover:text-white transition-colors hidden sm:inline">
              support@trustpulse.ae
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`bg-white sticky top-0 z-40 transition-all ${scrolled ? 'shadow-md' : 'shadow-sm'} border-b border-slate-200`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={shieldLogo}
                alt="TrustPulse" 
                className="w-16 h-16 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">TrustPulse</h1>
                  <UAEFlag className="w-6 h-4" />
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-wide">UAE VERIFIED REVIEWS</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'ar' ? link.labelAr : link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              
              {/* Language Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setLang('en');
                    localStorage.setItem('language', 'en');
                    document.documentElement.dir = 'ltr';
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLang('ar');
                    localStorage.setItem('language', 'ar');
                    document.documentElement.dir = 'rtl';
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    lang === 'ar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  العربية
                </button>
              </div>

              {/* User Menu OR Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-2 py-1.5 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{user.full_name}</p>
                      <p className="text-xs text-slate-500">Trust: {(user.trust_score || 0).toFixed(0)}%</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-bold">
                              {user.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{user.full_name}</p>
                              <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all text-left text-sm"
                          >
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium text-slate-700">My Profile</span>
                          </button>
                          <button
                            onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-all text-left text-sm"
                          >
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="font-medium text-slate-700">Dashboard</span>
                          </button>
                          <div className="my-1 border-t border-slate-100"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-all text-left text-sm"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium text-red-600">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-sm transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden py-4 border-t border-slate-200 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'ar' ? link.labelAr : link.label}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium bg-slate-900 text-white text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
