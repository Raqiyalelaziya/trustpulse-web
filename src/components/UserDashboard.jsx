import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
    fetchLeaderboard();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.message.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('https://trustpulse-api.onrender.com/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getTrustBadge = (score) => {
    if (score >= 90) return { label: t(lang, 'excellent'), color: 'bg-green-100 text-green-800', icon: '🏆' };
    if (score >= 80) return { label: t(lang, 'veryGood'), color: 'bg-blue-100 text-blue-800', icon: '⭐' };
    if (score >= 70) return { label: t(lang, 'good'), color: 'bg-indigo-100 text-indigo-800', icon: '✓' };
    if (score >= 60) return { label: t(lang, 'fair'), color: 'bg-yellow-100 text-yellow-800', icon: '!' };
    return { label: t(lang, 'newShop'), color: 'bg-gray-100 text-gray-800', icon: '🌱' };
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t(lang, 'loginRequired')}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t(lang, 'login')}
          </button>
        </div>
      </div>
    );
  }

  const badge = getTrustBadge(user.trust_score || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t(lang, 'dashboard')}</h1>
          <p className="text-gray-600 mt-1">{t(lang, 'welcomeBack')}, {user.full_name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Trust Score Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t(lang, 'trustScore')}</h3>
              <span className="text-2xl">{badge.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{(user.trust_score || 0).toFixed(1)}%</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>

          {/* Points Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t(lang, 'totalPoints')}</h3>
              <span className="text-2xl">💎</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{user.points_balance || 0}</p>
            <p className="text-xs text-gray-500 mt-2">
              Earn points by reviewing shops
            </p>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t(lang, 'profile')}</h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{user.profile_completeness || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${user.profile_completeness || 0}%` }}
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{t(lang, 'accountType')}</h3>
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-xl font-bold text-gray-900 capitalize">{user.role}</p>
            <p className="text-xs text-gray-500 mt-2">
              Member since {new Date(user.account_created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === 'leaderboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t(lang, 'leaderboard')}
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === 'rewards'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t(lang, 'earnRewards')}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">{t(lang, 'quickActions')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/shops')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-3xl mb-2">🏪</div>
                    <h4 className="font-medium text-gray-900">{t(lang, 'browseShops')}</h4>
                    <p className="text-sm text-gray-500">{t(lang, 'findTrustedSellers')}</p>
                  </button>

                  <button
                    onClick={() => navigate('/create-shop')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-3xl mb-2">➕</div>
                    <h4 className="font-medium text-gray-900">{t(lang, 'createShop')}</h4>
                    <p className="text-sm text-gray-500">{t(lang, 'listYourBusiness')}</p>
                  </button>

                  <button
                    onClick={() => navigate('/reviews')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-3xl mb-2">✍️</div>
                    <h4 className="font-medium text-gray-900">{t(lang, 'writeReview')}</h4>
                    <p className="text-sm text-gray-500">{t(lang, 'shareYourExperience')}</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(lang, 'topContributors')}</h3>
                <div className="space-y-3">
                  {leaderboard.map((member, index) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 p-4 rounded-lg 
                        ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent border border-yellow-200' : 'bg-gray-50'}`}
                    >
                      <div className="text-2xl font-bold w-12 text-center">
                        {getRankEmoji(index + 1)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                        <p className="text-sm text-gray-500">
                          {member.review_count} {t(lang, 'reviews')} • {member.trust_score?.toFixed(1)}% trust score
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{member.points_balance}</p>
                        <p className="text-xs text-gray-500">{t(lang, 'points')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Earn {t(lang, 'points')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">✍️</span>
                      <h4 className="font-medium text-gray-900">{t(lang, 'writeReview')}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {t(lang, 'shareYourExperience')}
                    </p>
                    <p className="text-xl font-bold text-blue-600">+10 {t(lang, 'points')}</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📸</span>
                      <h4 className="font-medium text-gray-900">Add {t(lang, 'evidence')}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Include receipt or screenshot
                    </p>
                    <p className="text-xl font-bold text-green-600">+25 {t(lang, 'points')}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Your current balance:</strong> {user.points_balance || 0} {t(lang, 'points')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Points will soon be redeemable for rewards and badges!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
