import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api'
import { Home, Search, PlusCircle, User, Store, Menu, X, ShieldAlert, Trophy } from 'lucide-react'
import shieldLogo from '../assets/shield.png'
import { useLang } from '@/lib/LanguageContext'

// iPhone-style language toggle
function LangToggle({ lang, onToggle }) {
  const isAr = lang === 'ar'
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center shrink-0 transition-all duration-300"
      style={{
        width: 64,
        height: 28,
        borderRadius: 14,
        background: isAr
          ? 'linear-gradient(135deg, #00732F, #00a845)'
          : 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: isAr ? '0 0 10px rgba(0,115,47,0.4)' : 'none',
        padding: 3,
      }}
      title="Switch language"
    >
      {/* Sliding pill */}
      <span
        className="absolute flex items-center justify-center font-black text-[10px] transition-all duration-300"
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          background: 'white',
          color: isAr ? '#00732F' : '#1e293b',
          left: isAr ? 'calc(100% - 25px)' : 3,
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      >
        {isAr ? 'ع' : 'E'}
      </span>
      {/* Labels */}
      <span
        className="absolute text-[9px] font-bold transition-all duration-300"
        style={{
          left: isAr ? 7 : 'auto',
          right: isAr ? 'auto' : 7,
          color: isAr ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        }}
      >
        {isAr ? 'EN' : 'AR'}
      </span>
    </button>
  )
}

export default function Layout({ children }) {
  const location   = useLocation()
  const [user,       setUser]       = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)
  const { lang, setLang } = useLang()

  useEffect(() => {
    const token = localStorage.getItem('trustpulse_token')
    if (token) {
      api.me().then(me => setUser(me)).catch(() => {})
    }
  }, [location.pathname])

  const navItems = [
    { path: '/',           icon: Home,       label: lang === 'ar' ? 'الرئيسية'   : 'Home',      color: '#60a5fa' },
    { path: '/search',     icon: Search,     label: lang === 'ar' ? 'استكشاف'    : 'Explore',   color: '#a78bfa' },
    { path: '/add-shop',   icon: Store,      label: lang === 'ar' ? 'إضافة متجر' : 'Add Shop',  color: '#34d399' },
    { path: '/add-review', icon: PlusCircle, label: lang === 'ar' ? 'تقييم'      : 'Review',    color: '#f59e0b' },
    { path: '/dashboard',  icon: Trophy,     label: lang === 'ar' ? 'لوحتي'      : 'Dashboard', color: '#fbbf24' },
    { path: '/profile',    icon: User,       label: lang === 'ar' ? 'ملفي'       : 'Profile',   color: '#f472b6' },
  ]

  const active = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* ── Desktop Header ─────────────────────────────────────────── */}
      <header className="hidden md:block sticky top-0 z-50"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={shieldLogo}
              alt="TrustPulse"
              className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading font-black text-white text-lg tracking-tight">TrustPulse</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-semibold">
                {lang === 'ar' ? 'مراجعات الإمارات الموثوقة' : 'UAE Verified Reviews'}
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon      = item.icon
              const isActive  = active(item.path)
              const isHovered = hoveredNav === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredNav(item.path)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                  style={{
                    color: isActive ? item.color : isHovered ? item.color : 'rgba(255,255,255,0.45)',
                    background: isActive ? `${item.color}18` : isHovered ? `${item.color}12` : 'transparent',
                    transform: isHovered && !isActive ? 'translateY(-1px)' : 'none',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: item.color }}
                    />
                  )}
                </Link>
              )
            })}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onMouseEnter={() => setHoveredNav('admin')}
                onMouseLeave={() => setHoveredNav(null)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: active('/admin') || hoveredNav === 'admin' ? '#ef4444' : 'rgba(255,255,255,0.45)',
                  background: active('/admin') ? 'rgba(239,68,68,0.15)' : hoveredNav === 'admin' ? 'rgba(239,68,68,0.08)' : 'transparent',
                }}
              >
                <ShieldAlert className="h-4 w-4" />
                <span className="hidden lg:inline">{lang === 'ar' ? 'مدير' : 'Admin'}</span>
              </Link>
            )}
          </nav>

          {/* Right — Lang toggle + Auth */}
          <div className="flex items-center gap-3 shrink-0">
            <LangToggle lang={lang} onToggle={() => setLang(lang === 'ar' ? 'en' : 'ar')} />

            {user ? (
              <Link
                to="/profile"
                onMouseEnter={() => setHoveredNav('profile-avatar')}
                onMouseLeave={() => setHoveredNav(null)}
                className="flex items-center gap-2.5 transition-all duration-200"
                style={{ opacity: hoveredNav === 'profile-avatar' ? 1 : 0.85 }}
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-white leading-none">
                    {user.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[10px] text-white/30 mt-0.5">{user.trust_score || 0}% trust</span>
                </div>
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all duration-200"
                  style={{
                    background: hoveredNav === 'profile-avatar'
                      ? 'linear-gradient(135deg, #00732F, #00c851)'
                      : 'linear-gradient(135deg, #00732F, #00a845)',
                    transform: hoveredNav === 'profile-avatar' ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {(user.full_name || user.email || '?')[0].toUpperCase()}
                </div>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onMouseEnter={() => setHoveredNav('login')}
                  onMouseLeave={() => setHoveredNav(null)}
                  className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
                  style={{
                    color: hoveredNav === 'login' ? 'white' : 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: hoveredNav === 'login' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
                <Link
                  to="/signup"
                  onMouseEnter={() => setHoveredNav('signup')}
                  onMouseLeave={() => setHoveredNav(null)}
                  className="text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 text-white"
                  style={{
                    background: hoveredNav === 'signup'
                      ? 'linear-gradient(135deg, #005a25, #00a845)'
                      : 'linear-gradient(135deg, #00732F, #00a845)',
                    transform: hoveredNav === 'signup' ? 'translateY(-1px)' : 'none',
                    boxShadow: hoveredNav === 'signup' ? '0 4px 15px rgba(0,115,47,0.4)' : 'none',
                  }}
                >
                  {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up Free'}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* UAE accent strip */}
        <div className="h-px w-full flex">
          <div className="flex-1" style={{ background: 'rgba(255,0,0,0.5)' }} />
          <div className="flex-1" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex-1" style={{ background: 'rgba(0,115,47,0.5)' }} />
        </div>
      </header>

      {/* ── Mobile Header ──────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50"
        style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={shieldLogo} alt="TrustPulse" className="h-12 w-auto object-contain" />
            <span className="font-heading font-black text-white text-base">TrustPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle lang={lang} onToggle={() => setLang(lang === 'ar' ? 'en' : 'ar')} />
            {user ? (
              <Link to="/profile">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center font-black text-xs text-white"
                  style={{ background: 'linear-gradient(135deg, #00732F, #00a845)' }}
                >
                  {(user.full_name || '?')[0].toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {lang === 'ar' ? 'دخول' : 'Login'}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)' }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* UAE strip */}
        <div className="h-px flex">
          <div className="flex-1" style={{ background: 'rgba(255,0,0,0.5)' }} />
          <div className="flex-1" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex-1" style={{ background: 'rgba(0,115,47,0.5)' }} />
        </div>

        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 p-4 space-y-1 shadow-2xl z-50"
            style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: isActive ? item.color : 'rgba(255,255,255,0.55)',
                    background: isActive ? `${item.color}18` : 'transparent',
                    border: isActive ? `1px solid ${item.color}30` : '1px solid transparent',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            {!user && (
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white mt-2"
                style={{ background: 'linear-gradient(135deg, #00732F, #00a845)' }}
              >
                <PlusCircle className="h-4 w-4" />
                {lang === 'ar' ? 'إنشاء حساب مجاني' : 'Create Free Account'}
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ── Content ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-10">
        {children}
      </main>

      {/* ── Mobile Bottom Nav ──────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2"
        style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = active(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
                style={{ color: isActive ? item.color : 'rgba(255,255,255,0.3)' }}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
