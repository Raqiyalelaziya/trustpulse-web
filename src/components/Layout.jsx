import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadUser();
    // Re-check user when location changes
  }, [location.pathname]);

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
        // Token invalid
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
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
                  {/* Shield Background */}
                  <path d="M50 5 L90 20 L90 60 Q90 90 50 115 Q10 90 10 60 L10 20 Z" 
                        fill="white" 
                        stroke="#1e40af" 
                        strokeWidth="2"/>
                  {/* UAE Flag Stripes */}
                  <rect x="15" y="25" width="70" height="15" fill="#00732f"/>
                  <rect x="15" y="40" width="70" height="15" fill="#ffffff"/>
                  <rect x="15" y="55" width="70" height="15" fill="#000000"/>
                  <rect x="15" y="25" width="20" height="45" fill="#ff0000"/>
                  {/* Checkmark */}
                  <path d="M35 85 L45 95 L65 75" 
                        stroke="#1e40af" 
                        strokeWidth="5" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TrustPulse</h1>
                <p className="text-xs text-purple-200">UAE VERIFIED REVIEWS</p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive('/') ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10'
                }`}
              >
                🏠 Home
              </Link>
              <Link
                to="/search"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive('/search') ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10'
                }`}
              >
                🔍 Explore
              </Link>
              <Link
                to="/add-shop"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive('/add-shop') ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10'
                }`}
              >
                🏪 Add Shop
              </Link>
              <Link
                to="/add-review"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive('/add-review') ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10'
                }`}
              >
                ⭐ Review
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isActive('/dashboard') ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10'
                    }`}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isActive('/profile') ? 'bg-white/20 text-white' : 'text-purple-100 hover:bg-white/10'
                    }`}
                  >
                    👤 Profile
                  </Link>
                </>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              
              {/* Language Toggle */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    lang === 'en' ? 'bg-white text-purple-900' : 'text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('ar')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    lang === 'ar' ? 'bg-white text-purple-900' : 'text-white'
                  }`}
                >
                  AR
                </button>
              </div>

              {/* User Menu OR Login Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-white">{user.full_name}</p>
                      <p className="text-xs text-purple-200">{(user.trust_score || 0).toFixed(0)}% trust</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                          <p className="font-bold text-white">{user.full_name}</p>
                          <p className="text-sm text-purple-100">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-lg transition-all text-left"
                          >
                            <span className="text-xl">👤</span>
                            <span className="font-medium text-gray-700">My Profile</span>
                          </button>
                          <button
                            onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-all text-left"
                          >
                            <span className="text-xl">📊</span>
                            <span className="font-medium text-gray-700">Dashboard</span>
                          </button>
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-all text-left"
                          >
                            <span className="text-xl">🚪</span>
                            <span className="font-medium text-red-600">Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-lg font-medium transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all shadow-lg"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
