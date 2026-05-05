import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { ShieldCheck, Star, ArrowRight, TrendingUp, Users, Store, Search } from 'lucide-react'
import ShopCard from '../components/ShopCard'

const categories = [
  { name: 'Fashion',     emoji: '👗' },
  { name: 'Beauty',      emoji: '💄' },
  { name: 'Electronics', emoji: '📱' },
  { name: 'Accessories', emoji: '👜' },
  { name: 'Home',        emoji: '🏠' },
  { name: 'Food',        emoji: '🍽️' },
  { name: 'Perfume',     emoji: '🌸' },
  { name: 'Handmade',    emoji: '🤝' },
  { name: 'Health',      emoji: '💚' },
  { name: 'Sports',      emoji: '⚽' },
]

// UAE Flag SVG component
function UAEFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Green stripe */}
      <rect x="0" y="0" width="60" height="10" fill="#00732F" />
      {/* White stripe */}
      <rect x="0" y="10" width="60" height="10" fill="#FFFFFF" />
      {/* Black stripe */}
      <rect x="0" y="20" width="60" height="10" fill="#000000" />
      {/* Red vertical bar */}
      <rect x="0" y="0" width="20" height="30" fill="#FF0000" />
    </svg>
  )
}

export default function Home() {
  const [shops,   setShops]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    api.getShops().then(data => {
      setShops(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const totalReviews  = shops.reduce((a, s) => a + (s.review_count || 0), 0)
  const verifiedShops = shops.filter(s => s.license_verified).length
  const topShops      = [...shops].sort((a, b) => (b.trust_score || 0) - (a.trust_score || 0)).slice(0, 6)

  return (
    <div className="space-y-14">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden min-h-[340px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        {/* UAE flag colour bands */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00732F]" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#000000]" />
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#FF0000]" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* Glow */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(0,115,47,0.4), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(255,0,0,0.2), transparent 50%)' }}
        />

        <div className="relative px-8 md:px-12 py-12 w-full">
          <div className="max-w-2xl space-y-6">
            {/* UAE badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <UAEFlag className="w-8 h-4 rounded-sm overflow-hidden" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">UAE Social Shops</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Shop Smarter.<br />
              <span className="bg-gradient-to-r from-[#00732F] via-emerald-400 to-[#00732F] bg-clip-text text-transparent">
                Trust Verified.
              </span>
            </h1>

            <p className="text-white/60 text-lg max-w-lg">
              Real reviews from real buyers across the UAE. Discover trustworthy Instagram, TikTok and social media shops — before you buy.
            </p>

            {/* Search bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); if (search.trim()) window.location.href = `/search?q=${search}` }}
              className="flex gap-2 max-w-lg"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shops…"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#00732F] hover:bg-[#005a25] text-white font-semibold rounded-2xl transition-colors text-sm"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to="/search"
                className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/90 transition-colors"
              >
                <Store className="h-4 w-4" /> Browse Shops
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Join Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-6 right-8 hidden md:flex flex-col gap-2">
          {[
            { label: 'Shops',    value: shops.length,  color: 'text-emerald-400' },
            { label: 'Reviews',  value: totalReviews,  color: 'text-blue-400' },
            { label: 'Verified', value: verifiedShops, color: 'text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right backdrop-blur-sm">
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Store,      label: 'Shops Listed',    value: shops.length,  color: 'text-primary',  bg: 'bg-primary/5' },
          { icon: Star,       label: 'Total Reviews',   value: totalReviews,  color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { icon: ShieldCheck,label: 'Verified Shops',  value: verifiedShops, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl border border-border/50 p-5 text-center`}>
            <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
            <p className={`text-3xl font-black font-heading ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-black">Browse by Category</h2>
          <Link to="/search" className="text-sm text-primary hover:underline flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {categories.map(({ name, emoji }) => (
            <Link
              key={name}
              to={`/search?category=${name}`}
              className="group flex flex-col items-center gap-2 p-4 bg-card border border-border/50 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">{name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Top Shops ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-black">Top Trusted Shops</h2>
            <div className="flex items-center gap-1.5 bg-[#00732F]/10 border border-[#00732F]/20 rounded-full px-3 py-1">
              <UAEFlag className="w-5 h-3 rounded-sm" />
              <span className="text-xs font-semibold text-[#00732F]">UAE</span>
            </div>
          </div>
          <Link to="/search" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 bg-card rounded-2xl border border-border/50 animate-pulse" />
            ))}
          </div>
        ) : topShops.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-5xl">🏪</div>
            <p className="text-muted-foreground">No shops yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        )}
      </div>

      {/* ── UAE Trust Banner ──────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        {/* UAE stripe accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0000] via-[#FFFFFF] to-[#00732F]" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00732F] via-[#FFFFFF] to-[#FF0000]" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <UAEFlag className="w-10 h-6 rounded-md overflow-hidden" />
              <span className="text-white/60 text-sm font-semibold uppercase tracking-widest">Built for UAE Shoppers</span>
            </div>
            <h2 className="font-heading text-3xl font-black text-white">
              Join thousands of UAE<br />shoppers buying with confidence
            </h2>
            <p className="text-white/50 text-sm max-w-md">
              TrustPulse helps you verify UAE social media shops before purchasing. Real reviews, verified ratings, and transparent trust scores.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 bg-[#00732F] hover:bg-[#005a25] text-white px-8 py-4 rounded-2xl font-bold transition-colors"
            >
              <Users className="h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
              Browse Top Shops
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
