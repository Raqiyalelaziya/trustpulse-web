import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import {
  ShieldCheck, Star, Trophy, Zap, ArrowRight,
  Store, Edit3, TrendingUp, Medal, Crown, Award
} from 'lucide-react'

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ value, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const target = parseFloat(value) || 0
    if (target === 0) return
    let start = 0
    const duration = 1200
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setDisplay(target); clearInterval(timer) }
      else setDisplay(start)
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}{suffix}</>
}

// ── Circular progress ring ────────────────────────────────────────────────────
function RingProgress({ value, size = 120, stroke = 8, color = '#22c55e', label, sublabel }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(value, 100) / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-black leading-none">{label}</span>
        {sublabel && <span className="text-[10px] opacity-60 mt-0.5 uppercase tracking-wider">{sublabel}</span>}
      </div>
    </div>
  )
}

const rankMedal = (i) => {
  if (i === 0) return { icon: Crown,  color: 'text-yellow-400', bg: 'bg-yellow-400/20 border-yellow-400/30' }
  if (i === 1) return { icon: Medal,  color: 'text-slate-300',  bg: 'bg-slate-300/20 border-slate-300/30' }
  if (i === 2) return { icon: Award,  color: 'text-orange-400', bg: 'bg-orange-400/20 border-orange-400/30' }
  return       { icon: null,           color: 'text-white/40',   bg: 'bg-white/5 border-white/10' }
}

export default function Dashboard() {
  const [user,        setUser]        = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading,     setLoading]     = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('trustpulse_token')
      if (!token) { navigate('/login'); return }
      try {
        const [userData, lb] = await Promise.all([api.me(), api.getLeaderboard()])
        setUser(userData)
        setLeaderboard(Array.isArray(lb) ? lb : lb?.users || [])
      } catch { navigate('/login') }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard…</p>
        </div>
      </div>
    )
  }
  if (!user) return null

  const score      = parseFloat(user.trust_score)   || 0
  const points     = user.points_balance             ?? user.reward_points ?? 0
  const profilePct = user.profile_completeness       || 0
  const name       = user.full_name || user.display_name || 'Reviewer'
  const initials   = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const scoreColor = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

  const myRank = leaderboard.findIndex(u =>
    u.email === user.email || u.id === user.id || u.full_name === user.full_name
  )

  const trustTier =
    score >= 75 ? { label: 'Verified',  color: 'from-emerald-500 to-teal-400',    ring: '#22c55e' } :
    score >= 50 ? { label: 'Trusted',   color: 'from-amber-500 to-yellow-400',    ring: '#f59e0b' } :
    score >= 25 ? { label: 'Growing',   color: 'from-blue-500 to-cyan-400',       ring: '#3b82f6' } :
                  { label: 'Newcomer',  color: 'from-slate-500 to-slate-400',     ring: '#94a3b8' }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* ── Hero card ─────────────────────────────────────────────────── */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10`}>
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)' }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Avatar + ring */}
          <div className="relative shrink-0">
            <RingProgress value={score} size={130} stroke={7} color={trustTier.ring} label={`${score.toFixed(0)}%`} sublabel="trust" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-2xl font-black text-white">{initials}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${trustTier.color} bg-clip-text text-transparent mb-2`}>
              <ShieldCheck className="h-3.5 w-3.5 text-current" style={{color: trustTier.ring}} />
              {trustTier.label} Reviewer
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Welcome back,<br />
              <span className={`bg-gradient-to-r ${trustTier.color} bg-clip-text text-transparent`}>{name}</span>
            </h1>
            <p className="text-white/50 text-sm mt-2">{user.email}</p>
            {myRank >= 0 && (
              <p className="text-white/60 text-sm mt-1">
                🏆 Ranked <span className="text-white font-bold">#{myRank + 1}</span> on the leaderboard
              </p>
            )}
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { label: 'Points',   value: points,     suffix: '',  color: '#f59e0b', icon: Zap },
              { label: 'Profile',  value: profilePct, suffix: '%', color: '#3b82f6', icon: TrendingUp },
            ].map(({ label, value, suffix, color, icon: Icon }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[90px]">
                <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color }} />
                <p className="text-xl font-black text-white">
                  <Counter value={value} suffix={suffix} />
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Trust formula ──────────────────────────────────────────── */}
        <div className="md:col-span-2 bg-card rounded-3xl border border-border/50 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              How Your Score Is Built
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              TrustPulse Formula
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Rating Consistency', weight: 40, color: 'bg-emerald-500', desc: 'Quality of your reviews' },
              { label: 'Number of Reviews',  weight: 30, color: 'bg-blue-500',    desc: 'How active you are' },
              { label: 'Account Age',        weight: 20, color: 'bg-violet-500',  desc: 'How long you\'ve been here' },
              { label: 'Profile Completeness',weight:10, color: 'bg-amber-500',   desc: 'How complete your profile is' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">— {item.desc}</span>
                  </div>
                  <span className="font-black text-foreground">{item.weight}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Score progress toward next tier */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Progress to <strong className="text-foreground">
                {score >= 75 ? 'Maximum' : score >= 50 ? 'Verified (75%)' : score >= 25 ? 'Trusted (50%)' : 'Growing (25%)'}
              </strong></span>
              <span className="font-bold text-foreground">{score.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${score}%`,
                  background: `linear-gradient(90deg, ${scoreColor}99, ${scoreColor})`
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Quick actions ──────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-card rounded-3xl border border-border/50 p-6 space-y-3">
            <h2 className="font-heading text-lg font-bold">Quick Actions</h2>
            <Link
              to="/shops"
              className="flex items-center justify-between w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 text-primary rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all group"
            >
              <span className="flex items-center gap-2.5">
                <Store className="h-4 w-4" />
                Browse Shops
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link
              to="/add-review"
              className="flex items-center justify-between w-full bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-600 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all group"
            >
              <span className="flex items-center gap-2.5">
                <Edit3 className="h-4 w-4" />
                Write a Review
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-between w-full bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/20 hover:border-violet-500/40 text-violet-600 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all group"
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4" />
                My Profile
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Profile completeness nudge */}
          {profilePct < 100 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Boost your score
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                Complete your profile to gain up to <strong>10 more trust points</strong>.
              </p>
              <div className="h-1.5 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${profilePct}%` }} />
              </div>
              <p className="text-[10px] text-amber-500 text-right">{profilePct}% complete</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Leaderboard ─────────────────────────────────────────────── */}
      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
        <div className="p-6 pb-4 flex items-center justify-between border-b border-border/50">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top Reviewers
          </h2>
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            UAE Leaderboard
          </span>
        </div>

        <div className="divide-y divide-border/30">
          {leaderboard.slice(0, 8).map((reviewer, i) => {
            const { icon: MedalIcon, color, bg } = rankMedal(i)
            const isMe = reviewer.email === user.email || reviewer.id === user.id
            const pts  = reviewer.points_balance ?? reviewer.trust_score ?? 0
            const rName = reviewer.full_name || reviewer.display_name || 'Reviewer'
            const rInit = rName[0]?.toUpperCase() || '?'

            return (
              <div
                key={reviewer.id || i}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  isMe ? 'bg-primary/5' : 'hover:bg-secondary/30'
                }`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${bg}`}>
                  {MedalIcon
                    ? <MedalIcon className={`h-4 w-4 ${color}`} />
                    : <span className={`text-xs font-bold ${color}`}>{i + 1}</span>
                  }
                </div>

                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                }`}>
                  {rInit}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isMe ? 'text-primary' : ''}`}>
                    {rName}
                    {isMe && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{reviewer.role || 'reviewer'}</p>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-foreground">{reviewer.trust_score || 0}%</p>
                  <p className="text-xs text-muted-foreground">trust score</p>
                </div>

                {/* Rank bar */}
                <div className="w-20 hidden sm:block">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-primary/50'}`}
                      style={{ width: `${Math.min((reviewer.trust_score || 0), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No leaderboard data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
