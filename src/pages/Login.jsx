import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react'

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

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    try {
      const result = await api.login(email.trim().toLowerCase(), password)
      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }
      if (result.token) {
        localStorage.setItem('trustpulse_token', result.token)
        localStorage.setItem('trustpulse_user', JSON.stringify(result))
        navigate('/dashboard')
      } else {
        setError('Login failed — please try again')
        setLoading(false)
      }
    } catch (err) {
      setError(err?.error || err?.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">

        {/* Logo + flag */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-black">TrustPulse</span>
            <UAEFlag className="w-8 h-5 rounded-sm overflow-hidden" />
          </div>
          <p className="text-muted-foreground text-sm">UAE's most trusted shop review platform</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-[#FF0000] via-white to-[#00732F]" />

          <div className="p-8 space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-black">Welcome back</h1>
              <p className="text-muted-foreground text-sm mt-1">Login to your TrustPulse account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Logging in…</>
                  : <><LogIn className="h-4 w-4" /> Login</>
                }
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Your data is secure and never shared
        </p>
      </div>
    </div>
  )
}
