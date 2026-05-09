import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Sparkles, Trophy, Shield, Store, Star, ArrowRight } from 'lucide-react'
import shieldLogo from '../assets/shield.png'

export default function Onboarding() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('trustpulse_user') || '{}')
    if (!storedUser.account_type) {
      navigate('/select-account-type')
      return
    }
    setUser(storedUser)
  }, [navigate])

  if (!user) return null

  const isShopOwner = user.account_type === 'shop_owner'

  const userSteps = [
    {
      icon: Star,
      color: '#3b82f6',
      title: 'Write Your First Review',
      desc: 'Share your experience with a shop and earn 10-20 points',
      action: 'Add Review',
      route: '/add-review'
    },
    {
      icon: Trophy,
      color: '#f59e0b',
      title: 'Build Your Trust Score',
      desc: 'Get likes and comments to increase your trust level',
      action: 'View Dashboard',
      route: '/dashboard'
    },
    {
      icon: Shield,
      color: '#10b981',
      title: 'Become Verified',
      desc: 'Add evidence to reviews to earn verified status',
      action: 'Explore Shops',
      route: '/search'
    }
  ]

  const shopOwnerSteps = [
    {
      icon: Store,
      color: '#10b981',
      title: 'Claim Your Shop',
      desc: 'Find your shop in our database or create a new listing',
      action: 'Add Shop',
      route: '/add-shop'
    },
    {
      icon: Star,
      color: '#f59e0b',
      title: 'Monitor Reviews',
      desc: 'Track customer feedback and build your trust score',
      action: 'View Dashboard',
      route: '/dashboard'
    },
    {
      icon: Shield,
      color: '#3b82f6',
      title: 'Grow Your Business',
      desc: 'Respond to reviews and attract more customers',
      action: 'Explore Platform',
      route: '/'
    }
  ]

  const steps = isShopOwner ? shopOwnerSteps : userSteps

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 100%)' }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />
      
      <div className="relative w-full max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={shieldLogo} alt="TrustPulse" className="h-20 w-auto" />
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center animate-bounce"
                style={{ background: 'linear-gradient(135deg, #00732F, #00a845)' }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="font-heading font-black text-4xl text-white mb-3">
            Welcome to TrustPulse! 🎉
          </h1>
          <p className="text-white/60 text-lg">
            {isShopOwner 
              ? "Let's get your shop set up in 3 easy steps"
              : "Let's get you started as a reviewer in 3 easy steps"}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: isShopOwner ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)', color: isShopOwner ? '#10b981' : '#3b82f6', border: `1px solid ${isShopOwner ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}` }}
          >
            {isShopOwner ? <Store className="h-4 w-4" /> : <Star className="h-4 w-4" />}
            {isShopOwner ? 'Shop Owner Account' : 'Reviewer Account'}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive = i === step
            const isComplete = i < step
            return (
              <div
                key={i}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300"
                style={{
                  borderColor: isActive ? s.color : 'rgba(255,255,255,0.1)',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? `0 10px 30px ${s.color}30` : 'none'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: isComplete ? s.color : isActive ? `${s.color}30` : 'rgba(255,255,255,0.05)' }}
                    >
                      {isComplete 
                        ? <Check className="h-6 w-6 text-white" />
                        : <Icon className="h-6 w-6" style={{ color: isActive ? s.color : 'rgba(255,255,255,0.4)' }} />
                      }
                    </div>
                    {i < steps.length - 1 && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full h-4 w-0.5"
                        style={{ background: isComplete ? s.color : 'rgba(255,255,255,0.1)' }}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-white mb-1">{s.title}</h3>
                    <p className="text-white/50 text-sm">{s.desc}</p>
                  </div>

                  <div className="text-sm font-bold" style={{ color: isComplete ? s.color : 'rgba(255,255,255,0.2)' }}>
                    Step {i + 1}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {step < steps.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Next Step
            </button>
          )}
          <button
            onClick={() => navigate(steps[step].route)}
            className="flex-1 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${steps[step].color}, ${steps[step].color}dd)`,
              boxShadow: `0 4px 20px ${steps[step].color}40`
            }}
          >
            {steps[step].action}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          Skip and go to dashboard →
        </button>
      </div>
    </div>
  )
}
