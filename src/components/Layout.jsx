import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api'
import { Home, Search, PlusCircle, User, Store, Menu, X, Globe, ShieldAlert } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('trustpulse_token')
    if (token) {
      api.me().then(me => {
        setUser(me)
        if (me && !me.account_type_selected && location.pathname === '/') {
          navigate('/select-account-type')
        }
      }).catch(() => {})
    }
  }, [])

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Explore' },
    { path: '/add-shop', icon: Store, label: 'Add Shop' },
    { path: '/add-review', icon: PlusCircle, label: 'Review' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const active = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-xl">🛡️ TrustPulse</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all ${
                    active(item.path)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}
            {user?.role === 'admin' && (
              <Link to="/admin" title="Admin" className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all ${active('/admin') ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                <ShieldAlert className="h-4 w-4" />
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/profile" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-700">
                    {(user.full_name || user.email || '?')[0].toUpperCase()}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-green-600 px-3 py-1">Login</Link>
                <Link to="/signup" className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-green-600">🛡️ TrustPulse</Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-1 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    active(item.path) ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl ${
                  active(item.path) ? 'text-green-600' : 'text-gray-400'
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