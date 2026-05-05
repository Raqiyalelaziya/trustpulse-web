import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api'
import { Home, Search, PlusCircle, User, Store, Menu, X, ShieldAlert, Trophy } from 'lucide-react'

function UAEFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0"  width="60" height="10" fill="#00732F" />
      <rect x="0" y="10" width="60" height="10" fill="#FFFFFF" />
      <rect x="0" y="20" width="60" height="10" fill="#000000" />
      <rect x="0" y="0"  width="20" height="30" fill="#FF0000" />
    </svg>
  )
}

export default function Layout({ children }) {
  const location    = useLocation()
  const navigate    = useNavigate()
  const [user,        setUser]        = useState(null)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('trustpulse_token')
    if (token) {
      api.me().then(me => setUser(me)).catch(() => {})
    }
  }, [location.pathname])

  const navItems = [
    { path: '/',           icon: Home,       label: 'Home' },
    { path: '/search',     icon: Search,     label: 'Explore' },
    { path: '/add-shop',   icon: Store,      label: 'Add Shop' },
    { path: '/add-review', icon: PlusCircle, label: 'Review' },
    { path: '/dashboard',  icon: Trophy,     label: 'Dashboard' },
    { path: '/profile',    icon: User,       label: 'Profile' },
  ]

  const active = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">

      {/* ── Desktop Header ─────────────────────────────────────────── */}
      <header className="hidden md:block sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="font-heading font-black text-lg">TrustPulse</span>
            <UAEFlag className="w-6 h-3.5 rounded-sm overflow-hidden" />
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`flex items-center justify-center h-9 w-9 rounded-xl transition-all ${
                    active(item.path)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                title="Admin"
                className={`flex items-center justify-center h-9 w-9 rounded-xl transition-all ${
                  active('/admin') ? 'bg-destructive text-white' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-black text-primary">
                    {(user.full_name || user.email || '?')[0].toUpperCase()}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-xl hover:bg-primary/90 transition-colors font-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Header ──────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xs">T</span>
            </div>
            <span className="font-heading font-black">TrustPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/profile">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-black text-primary">
                    {(user.full_name || '?')[0].toUpperCase()}
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-xs text-primary font-semibold">Login</Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="absolute top-14 left-0 right-0 bg-background border-b border-border p-4 space-y-1 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground mt-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create Account
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50 px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  active(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
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
