import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const Profile = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchUserReviews();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userResponse.json();
      
      const response = await fetch(`https://trustpulse-api.onrender.com/reviews?user_id=${userData.id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getBadgeLevel = (points) => {
    if (points >= 1000) return { name: 'Elite Reviewer', icon: '👑', color: 'from-yellow-400 to-orange-500', progress: 100 };
    if (points >= 500) return { name: 'Top Reviewer', icon: '🏆', color: 'from-purple-400 to-pink-500', progress: 75 };
    if (points >= 100) return { name: 'Trusted Reviewer', icon: '✅', color: 'from-blue-400 to-cyan-500', progress: 50 };
    if (points >= 50) return { name: 'Active Reviewer', icon: '📝', color: 'from-green-400 to-teal-500', progress: 25 };
    return { name: 'Newcomer', icon: '⭐', color: 'from-gray-400 to-gray-500', progress: 10 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const badge = getBadgeLevel(user.points_balance || 0);
  const verifiedReviews = reviews.filter(r => r.is_verified).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          {/* Gradient Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-start gap-6">
            {/* Profile Avatar */}
            <div className={`w-32 h-32 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-lg transform hover:scale-105 transition-transform`}>
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.full_name}</h1>
                  <p className="text-gray-600 mb-3">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 bg-gradient-to-r ${badge.color} text-white rounded-full text-sm font-semibold shadow-md`}>
                      {badge.icon} {badge.name}
                    </span>
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  ⚙️ {t(lang, 'edit')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Trust Score */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-90">Trust Score</span>
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-5xl font-bold mb-2">{(user.trust_score || 0).toFixed(0)}%</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full"
                style={{ width: `${user.trust_score || 0}%` }}
              />
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-90">Reviews</span>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-5xl font-bold mb-2">{reviews.length}</p>
            <p className="text-sm opacity-90">Total reviews written</p>
          </div>

          {/* Verified Reviews */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-90">Verified</span>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-5xl font-bold mb-2">{verifiedReviews}</p>
            <p className="text-sm opacity-90">With evidence</p>
          </div>

          {/* Profile Complete */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-90">Profile</span>
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-5xl font-bold mb-2">{user.profile_completeness || 0}%</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full"
                style={{ width: `${user.profile_completeness || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trust Score Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Trust Score Breakdown</h2>
              </div>

              <div className="space-y-5">
                {/* Rating Quality */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Rating quality</span>
                    <span className="text-sm font-bold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Review Count */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Review count</span>
                    <span className="text-sm font-bold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Account Age */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Account age</span>
                    <span className="text-sm font-bold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Profile Completeness */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile completeness</span>
                    <span className="text-sm font-bold text-gray-900">{user.profile_completeness || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full" 
                      style={{ width: `${user.profile_completeness || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Overall trust score: <strong>0%</strong>. Reach 75% to become Verified.
                </p>
              </div>
            </div>
          </div>

          {/* Badge Progress */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🎖️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Badge Progress</h2>
              </div>

              <div className="text-center mb-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                  {badge.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Reach 25% trust score to unlock 'Active Reviewer'
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`bg-gradient-to-r ${badge.color} h-3 rounded-full transition-all`}
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{badge.progress}% progress</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm text-gray-600">Newcomer</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-50">
                  <span className="text-2xl">📝</span>
                  <span className="text-sm text-gray-600">Active Reviewer</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-50">
                  <span className="text-2xl">✅</span>
                  <span className="text-sm text-gray-600">Trusted Reviewer</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-50">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm text-gray-600">Top Reviewer</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-50">
                  <span className="text-2xl">👑</span>
                  <span className="text-sm text-gray-600">Elite Reviewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Reviews */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">📝</span>
              <p className="text-gray-500 mb-4">You haven't written any reviews yet</p>
              <button
                onClick={() => navigate('/shops')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
              >
                Browse Shops
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{review.shop_name}</h4>
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.review_text}</p>
                  {review.is_verified && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      ✓ Verified
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
