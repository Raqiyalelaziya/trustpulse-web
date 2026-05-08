import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import shieldLogo from '../assets/shield.png'
import { useLang } from '@/lib/LanguageContext'

const API_BASE = 'https://trustpulse-api.onrender.com'

export default function Signup() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState('user')
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  })

  // Read account type from sessionStorage
  useEffect(() => {
    const selectedType = sessionStorage.getItem('selected_account_type')
    if (selectedType) {
      setAccountType(selectedType)
    } else {
      // If no selection, redirect to account type selection
      navigate('/select-account-type')
    }
  }, [navigate])

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.full_name.trim()) {
      toast.error(lang === 'ar' ? 'الرجاء إدخال اسمك الكامل' : 'Please enter your full name')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email')
      return
    }
    if (formData.password.length < 6) {
      toast.error(lang === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: accountType, // 'user' or 'shop_owner'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Store token and user data
      localStorage.setItem('trustpulse_token', data.token)
      localStorage.setItem('trustpulse_user', JSON.stringify(data.user))
      
      // Clear the account type selection from sessionStorage
      sessionStorage.removeItem('selected_account_type')

      toast.success(lang === 'ar' ? '🎉 تم إنشاء الحساب بنجاح!' : '🎉 Account created successfully!')
      
      // Redirect based on account type
      if (accountType === 'shop_owner') {
        navigate('/shop-owner-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message || (lang === 'ar' ? 'فشل إنشاء الحساب' : 'Failed to create account'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)'
      }}
    >
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={shieldLogo} alt="TrustPulse" className="h-16 w-auto" />
          </div>
          <h1 className="font-heading font-black text-3xl text-white mb-2">
            TrustPulse 🇦🇪
          </h1>
          <p className="text-white/60 text-sm">
            {lang === 'ar' ? 'منصة مراجعات الإمارات الأكثر موثوقية' : "UAE's most trusted shop review platform"}
          </p>
        </div>

        {/* Account Type Badge */}
        <div className="mb-6 flex items-center justify-between bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${accountType === 'shop_owner' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <span className="text-sm font-semibold text-foreground">
              {accountType === 'shop_owner' 
                ? (lang === 'ar' ? 'حساب صاحب متجر' : 'Shop Owner Account')
                : (lang === 'ar' ? 'حساب مستخدم عادي' : 'Regular User Account')}
            </span>
          </div>
          <button
            onClick={() => navigate('/select-account-type')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === 'ar' ? 'تغيير' : 'Change'}
          </button>
        </div>

        {/* Signup Form */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur">
          <div className="space-y-2 mb-6">
            <h2 className="font-heading font-bold text-2xl text-foreground">
              {lang === 'ar' ? 'إنشاء حساب' : 'Create account'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === 'ar' 
                ? 'انضم إلى TrustPulse وابدأ في مراجعة المتاجر' 
                : 'Join TrustPulse and start reviewing shops'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="full_name">
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder={lang === 'ar' ? 'you@example.com' : 'you@example.com'}
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder={lang === 'ar' ? '6 أحرف على الأقل' : 'Min 6 characters'}
                  className="h-11 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gap-2 font-semibold"
              style={{
                background: accountType === 'shop_owner'
                  ? 'linear-gradient(135deg, #00732F, #00a845)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {lang === 'ar' ? 'جاري الإنشاء...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  {lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {lang === 'ar' ? 'هل لديك حساب؟' : 'Already have an account?'}{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
            {lang === 'ar' ? 'بياناتك آمنة ولن تتم مشاركتها' : 'Your data is secure and never shared'}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/select-account-type')}
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'ar' ? 'العودة لاختيار نوع الحساب' : 'Back to account type selection'}
        </button>
      </div>
    </div>
  )
}
