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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={shieldLogo} alt="TrustPulse" className="h-20 w-auto" />
          </div>
          <h1 className="font-heading font-black text-4xl mb-3"
            style={{ color: '#1e293b' }}
          >
            {lang === 'ar' ? 'اختر نوع حسابك' : 'Choose Your Account Type'}
          </h1>
          <p className="text-lg"
            style={{ color: '#64748b' }}
          >
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
            className="group relative bg-white border-2 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            style={{
              borderColor: '#e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="absolute top-6 right-6 h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <User className="h-7 w-7 text-white" />
            </div>

            <div className="space-y-4 pr-20">
              <div>
                <h2 className="font-heading font-bold text-2xl mb-2"
                  style={{ color: '#1e293b' }}
                >
                  {lang === 'ar' ? 'مستخدم عادي' : 'Regular User'}
                </h2>
                <p className="text-sm"
                  style={{ color: '#64748b' }}
                >
                  {lang === 'ar' 
                    ? 'اكتب تقييمات واربح نقاط المكافآت' 
                    : 'Write reviews and earn reward points'}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#3b82f6' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'مراجعة المتاجر ومشاركة تجاربك' : 'Review shops and share your experiences'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#3b82f6' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'كسب نقاط المكافآت على كل مراجعة' : 'Earn reward points for each review'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#3b82f6' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'الوصول إلى التوصيات الشخصية' : 'Access personalized recommendations'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#3b82f6' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'بناء ملفك الشخصي الموثوق' : 'Build your trust profile'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#3b82f6' }}
              >
                {lang === 'ar' ? 'ابدأ المراجعة' : 'Start Reviewing'}
              </span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: '#3b82f6' }}
              />
            </div>
          </button>

          {/* Shop Owner Card */}
          <button
            onClick={() => handleSelection('shop_owner')}
            className="group relative bg-white border-2 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            style={{
              borderColor: '#e2e8f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10b981'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="absolute top-6 right-6 h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Store className="h-7 w-7 text-white" />
            </div>

            <div className="space-y-4 pr-20">
              <div>
                <h2 className="font-heading font-bold text-2xl mb-2"
                  style={{ color: '#1e293b' }}
                >
                  {lang === 'ar' ? 'صاحب متجر' : 'Shop Owner'}
                </h2>
                <p className="text-sm"
                  style={{ color: '#64748b' }}
                >
                  {lang === 'ar' 
                    ? 'قم بإنشاء وإدارة ملف متجرك' 
                    : 'Create and manage your shop profile'}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'المطالبة بمتجرك أو إنشاء واحدة جديدة' : 'Claim your shop or create a new one'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'الرد على مراجعات العملاء' : 'Respond to customer reviews'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'تتبع درجة ثقة متجرك' : 'Track your shop trust score'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1" style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: '#475569' }}>
                    {lang === 'ar' ? 'الوصول إلى لوحة التحليلات' : 'Access analytics dashboard'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#10b981' }}
              >
                {lang === 'ar' ? 'إعداد المتجر' : 'Setup Shop'}
              </span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: '#10b981' }}
              />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm"
            style={{ color: '#94a3b8' }}
          >
            {lang === 'ar' 
              ? 'يمكنك دائمًا تبديل نوع الحساب لاحقًا من إعدادات الملف الشخصي' 
              : 'You can always switch account type later from your profile settings'}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 text-sm font-medium transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            {lang === 'ar' ? 'هل لديك حساب؟ تسجيل الدخول' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
