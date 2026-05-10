import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';

const Profile = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [settingsForm, setSettingsForm] = useState({
    notifications: true,
    email_alerts: true,
    public_profile: true,
    language: 'en'
  });
  const [saving, setSaving] = useState(false);

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '🦊', '🐱', '🐶', '🦁', '🐼', '🐯', '🦄', '👑', '🌟'];

  useEffect(() => {
    fetchUser();
    fetchUserReviews();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) data.avatar = savedAvatar;
        setUser(data);
        setEditForm({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || ''
        });
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const userData = JSON.parse(userStr);
      
      const response = await fetch(`https://trustpulse-api.onrender.com/reviews?user_id=${userData.user_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        alert('✅ Profile updated successfully!');
        setShowEditModal(false);
        fetchUser();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settingsForm));
      alert('✅ Settings saved!');
      setShowSettingsModal(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getBadge = (score) => {
    if (score >= 90) return { name: 'Elite', emoji: '👑', color: 'from-yellow-400 via-orange-500 to-red-500', bg: 'from-yellow-400/20 to-orange-500/20' };
    if (score >= 75) return { name: 'Top Reviewer', emoji: '🏆', color: 'from-purple-500 via-pink-500 to-red-500', bg: 'from-purple-500/20 to-pink-500/20' };
    if (score >= 50) return { name: 'Trusted', emoji: '✅', color: 'from-green-400 via-emerald-500 to-teal-500', bg: 'from-green-400/20 to-emerald-500/20' };
    if (score >= 25) return { name: 'Active', emoji: '📝', color: 'from-blue-400 via-indigo-500 to-purple-500', bg: 'from-blue-400/20 to-indigo-500/20' };
    return { name: 'Newcomer', emoji: '⭐', color: 'from-gray-400 to-slate-500', bg: 'from-gray-400/20 to-slate-500/20' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const badge = getBadge(user.trust_score || 0);
  const trustScore = user.trust_score || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      
      {/* GORGEOUS Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            
            {/* Avatar with Glow */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} rounded-full blur-2xl opacity-50 scale-110 animate-pulse`}></div>
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="relative group"
              >
                <div className={`w-40 h-40 bg-gradient-to-br ${badge.color} rounded-3xl shadow-2xl flex items-center justify-center text-7xl border-4 border-white/30 group-hover:scale-105 transition-all duration-300`}>
                  {user.avatar || user.full_name?.charAt(0).toUpperCase() || '👤'}
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">📷</span>
                    <span className="text-white text-sm font-bold">Change Avatar</span>
                  </div>
                </div>
              </button>
              
              {/* Verification Badge */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-2xl">
              {user.full_name}
            </h1>
            <p className="text-purple-200 text-lg mb-4">{user.email}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 justify-center mb-6">
              <span className={`px-6 py-2 bg-gradient-to-r ${badge.color} text-white rounded-full font-bold text-sm shadow-2xl flex items-center gap-2`}>
                <span className="text-lg">{badge.emoji}</span>
                {badge.name}
              </span>
              {user.role === 'admin' && (
                <span className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-sm shadow-2xl">
                  🛡️ Admin
                </span>
              )}
              <span className="px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-sm border border-white/20">
                ✨ {user.role}
              </span>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMenu(true)}
              className="px-8 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl font-semibold transition-all border border-white/20 hover:scale-105 shadow-xl"
            >
              ⚙️ Account Menu
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Floating */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl shadow-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 -right-4 text-7xl opacity-20">🏅</div>
            <div className="relative">
              <p className="text-sm opacity-90 mb-1 font-medium">Trust Score</p>
              <p className="text-4xl font-bold mb-2">{trustScore.toFixed(0)}%</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${trustScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 -right-4 text-7xl opacity-20">💎</div>
            <div className="relative">
              <p className="text-sm opacity-90 mb-1 font-medium">Points</p>
              <p className="text-4xl font-bold mb-2">{user.points_balance || 0}</p>
              <p className="text-xs opacity-80">Keep earning!</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 -right-4 text-7xl opacity-20">⚡</div>
            <div className="relative">
              <p className="text-sm opacity-90 mb-1 font-medium">Profile</p>
              <p className="text-4xl font-bold mb-2">{user.profile_completeness || 0}%</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${user.profile_completeness || 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 -right-4 text-7xl opacity-20">📝</div>
            <div className="relative">
              <p className="text-sm opacity-90 mb-1 font-medium">Reviews</p>
              <p className="text-4xl font-bold mb-2">{reviews.length}</p>
              <p className="text-xs opacity-80">Reviews written</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Trust Score Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trust Score Visual */}
          <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -mr-32 -mt-32 opacity-50"></div>
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Trust Score Breakdown
              </h3>
              
              <div className="flex items-center gap-8 mb-6">
                {/* Circular Progress */}
                <div className="relative">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-200" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="url(#trustGradient)" 
                      strokeWidth="12" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 56}`} 
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - trustScore / 100)}`} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="trustGradient">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{trustScore.toFixed(0)}</span>
                    <span className="text-xs text-gray-500 font-semibold">/ 100</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  {[
                    { label: 'Rating Quality', value: 40, color: 'from-green-400 to-emerald-500' },
                    { label: 'Reviews Written', value: 30, color: 'from-blue-400 to-indigo-500' },
                    { label: 'Account Age', value: 20, color: 'from-purple-400 to-pink-500' },
                    { label: 'Profile Completion', value: 10, color: 'from-orange-400 to-red-500' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{item.label}</span>
                        <span className="text-gray-900 font-bold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* My Reviews */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              My Reviews ({reviews.length})
            </h3>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">📝</span>
                <p className="text-gray-600 mb-4">You haven't written any reviews yet</p>
                <button
                  onClick={() => navigate('/add-review')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Write Your First Review
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-900">{review.shop_name || 'Shop'}</p>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={s <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Badges */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-3 hover:scale-105"
              >
                <span className="text-2xl">✏️</span>
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-3 hover:scale-105"
              >
                <span className="text-2xl">⚙️</span>
                <span>Settings</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-3 hover:scale-105"
              >
                <span className="text-2xl">📊</span>
                <span>View Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/add-review')}
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-3 hover:scale-105"
              >
                <span className="text-2xl">⭐</span>
                <span>Write Review</span>
              </button>
            </div>
          </div>

          {/* Achievements/Badges */}
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Achievements
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Newcomer', emoji: '⭐', earned: true },
                { name: 'First Review', emoji: '✍️', earned: reviews.length >= 1 },
                { name: 'Active Reviewer', emoji: '📝', earned: reviews.length >= 5 },
                { name: 'Trusted', emoji: '✅', earned: trustScore >= 50 },
                { name: 'Top Reviewer', emoji: '🏆', earned: trustScore >= 75 },
                { name: 'Elite', emoji: '👑', earned: trustScore >= 90 }
              ].map((b, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${b.earned ? 'bg-white/20 backdrop-blur-sm' : 'bg-black/20 opacity-50'}`}>
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="font-semibold flex-1">{b.name}</span>
                  {b.earned && <span className="text-xs bg-white/30 px-2 py-1 rounded-full">EARNED</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMenu(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                {user.avatar || user.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{user.full_name}</h3>
                <p className="text-purple-100">{user.email}</p>
              </div>
              <button onClick={() => setShowMenu(false)} className="text-white text-3xl hover:scale-125 transition-transform">×</button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { icon: '✏️', title: 'Edit Profile', desc: 'Update your information', color: 'from-purple-500 to-pink-500', action: () => { setShowMenu(false); setShowEditModal(true); } },
                { icon: '⚙️', title: 'Settings', desc: 'Preferences & privacy', color: 'from-blue-500 to-indigo-500', action: () => { setShowMenu(false); setShowSettingsModal(true); } },
                { icon: '📊', title: 'Dashboard', desc: 'View your statistics', color: 'from-green-500 to-emerald-500', action: () => { setShowMenu(false); navigate('/dashboard'); } },
                { icon: '🚪', title: 'Logout', desc: 'Sign out of your account', color: 'from-red-500 to-pink-500', action: () => { setShowMenu(false); handleLogout(); }, danger: true }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all hover:scale-105 ${item.danger ? 'hover:bg-red-50' : ''}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-bold ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">✏️</span> Edit Profile
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-white text-3xl hover:scale-125 transition-transform">×</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="+971 50 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '✨ Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">⚙️</span> Settings
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-white text-3xl hover:scale-125 transition-transform">×</button>
            </div>
            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { key: 'notifications', icon: '🔔', title: 'Notifications', desc: 'Get notified about updates' },
                { key: 'email_alerts', icon: '📧', title: 'Email Alerts', desc: 'Receive email updates' },
                { key: 'public_profile', icon: '🌍', title: 'Public Profile', desc: 'Show on leaderboard' }
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl">{s.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{s.title}</p>
                      <p className="text-sm text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettingsForm({ ...settingsForm, [s.key]: !settingsForm[s.key] })}
                    className={`relative w-14 h-8 rounded-full transition-all ${settingsForm[s.key] ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settingsForm[s.key] ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              ))}

              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🌐</span>
                  <p className="font-bold text-gray-900">Language</p>
                </div>
                <select
                  value={settingsForm.language}
                  onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-white"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="ar">🇦🇪 العربية</option>
                </select>
              </div>

              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span> Danger Zone
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure? This cannot be undone!')) {
                      alert('Contact support to delete your account.');
                    }
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                  Delete Account
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '✨ Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selector */}
      {showAvatarSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarSelector(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              <span className="text-3xl">🎨</span> Choose Avatar
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => {
                    localStorage.setItem('userAvatar', avatar);
                    setUser({ ...user, avatar });
                    setShowAvatarSelector(false);
                  }}
                  className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-2xl flex items-center justify-center text-4xl transition-all hover:scale-110 hover:shadow-lg"
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
