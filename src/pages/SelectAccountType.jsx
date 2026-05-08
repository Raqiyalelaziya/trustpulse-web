import { useNavigate } from 'react-router-dom'
import { User, Store, ArrowRight } from 'lucide-react'
import shieldLogo from '../assets/shield.png'
import { useLang } from '@/lib/LanguageContext'

export default function SelectAccountType() {
  const navigate = useNavigate()
  const { lang } = useLang()

  const handleSelection = (accountType) => {
    // Store the selected account type in sessionStorage
    sessionStorage.setItem('selected_account_type', accountType)
    // Navigate to signup page
    navigate('/signup')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)'
      }}
    >
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={shieldLogo} alt="TrustPulse" className="h-20 w-auto" />
          </div>
          <h1 className="font-heading font-black text-4xl text-white mb-3">
            {lang === 'ar' ? 'اختر نوع حسابك' : 'Choose Your Account Type'}
          </h1>
          <p className="text-white/60 text-lg">
            {lang === 'ar' 
              ? 'حدد ما إذا كنت تريد مراجعة المتاجر أو إدارة متجرك الخاص' 
              : 'Select whether you want to review shops or manage your own shop'}
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Regular User Card */}
          <button
            onClick={() => handleSelection('user')}
            className="group relative bg-card border-2 border-border rounded-3xl p-8 text-left transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <User className="h-7 w-7 text-white" />
            </div>

            <div className="space-y-4 pr-20">
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
                  {lang === 'ar' ? 'مستخدم عادي' : 'Regular User'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {lang === 'ar' 
                    ? 'اكتب تقييمات واربح نقاط المكافآت' 
                    : 'Write reviews and earn reward points'}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'مراجعة المتاجر ومشاركة تجاربك' : 'Review shops and share your experiences'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'كسب نقاط المكافآت على كل مراجعة' : 'Earn reward points for each review'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'الوصول إلى التوصيات الشخصية' : 'Access personalized recommendations'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'بناء ملفك الشخصي الموثوق' : 'Build your trust profile'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                {lang === 'ar' ? 'ابدأ المراجعة' : 'Start Reviewing'}
              </span>
              <ArrowRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>

          {/* Shop Owner Card */}
          <button
            onClick={() => handleSelection('shop_owner')}
            className="group relative bg-card border-2 border-border rounded-3xl p-8 text-left transition-all duration-300 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Store className="h-7 w-7 text-white" />
            </div>

            <div className="space-y-4 pr-20">
              <div>
                <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
                  {lang === 'ar' ? 'صاحب متجر' : 'Shop Owner'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {lang === 'ar' 
                    ? 'قم بإنشاء وإدارة ملف متجرك' 
                    : 'Create and manage your shop profile'}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'المطالبة بمتجرك أو إنشاء واحدة جديدة' : 'Claim your shop or create a new one'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'الرد على مراجعات العملاء' : 'Respond to customer reviews'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'تتبع درجة ثقة متجرك' : 'Track your shop trust score'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'الوصول إلى لوحة التحليلات' : 'Access analytics dashboard'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                {lang === 'ar' ? 'إعداد المتجر' : 'Setup Shop'}
              </span>
              <ArrowRight className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            {lang === 'ar' 
              ? 'يمكنك دائمًا تبديل نوع الحساب لاحقًا من إعدادات الملف الشخصي' 
              : 'You can always switch account type later from your profile settings'}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 text-sm text-white/60 hover:text-white transition-colors"
          >
            {lang === 'ar' ? 'هل لديك حساب؟ تسجيل الدخول' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
