import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('https://trustpulse-api.onrender.com/leaderboard');
      const data = await response.json();
      setLeaderboard(data.slice(0, 10));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getBadgeInfo = (points) => {
    if (points >= 1000) return { name: 'Elite', icon: '👑', color: 'from-yellow-400 to-orange-500' };
    if (points >= 500) return { name: 'Top', icon: '🏆', color: 'from-purple-400 to-pink-500' };
    if (points >= 100) return { name: 'Trusted', icon: '✅', color: 'from-blue-400 to-cyan-500' };
    if (points >= 50) return { name: 'Active', icon: '📝', color: 'from-green-400 to-teal-500' };
    return { name: 'Newcomer', icon: '⭐', color: 'from-gray-400 to-gray-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const badge = getBadgeInfo(user.points_balance || 0);
  const userRank = leaderboard.findIndex(u => u.id === user.id) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Welcome Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-12 mb-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Animated Trust Score Circle */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{(user.trust_score || 0).toFixed(0)}%</p>
                      <p className="text-xs text-purple-300">Trust</p>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
              </div>

              {/* User Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-purple-300 uppercase tracking-wider">
                    {badge.icon} {badge.name} Reviewer
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-3">
                  Welcome back,<br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.full_name?.split(' ')[0] || 'User'}
                  </span>
                </h1>
                <p className="text-purple-200">{user.email}</p>
                {userRank > 0 && (
                  <p className="text-yellow-400 font-semibold mt-2">
                    🏅 Ranked #{userRank} on the leaderboard
                  </p>
                )}
              </div>
            </div>

            {/* Points & Profile Stats */}
            <div className="flex gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">⚡</span>
                  <span className="text-sm text-purple-200">Points</span>
                </div>
                <p className="text-4xl font-bold text-white">{user.points_balance || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📊</span>
                  <span className="text-sm text-purple-200">Profile</span>
                </div>
                <p className="text-4xl font-bold text-white">{user.profile_completeness || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Score Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* How Your Score Is Built */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How Your Score Is Built</h2>
                </div>
                <button className="px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  TrustPulse Formula
                </button>
              </div>

              <div className="space-y-6">
                {/* Rating Consistency */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                      <span className="font-semibold text-gray-900">Rating Consistency</span>
                      <span className="text-sm text-gray-500">— Quality of your reviews</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                      style={{ width: '40%' }}
                    ></div>
                  </div>
                </div>

                {/* Number of Reviews */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                      <span className="font-semibold text-gray-900">Number of Reviews</span>
                      <span className="text-sm text-gray-500">— How active you are</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                      style={{ width: '30%' }}
                    ></div>
                  </div>
                </div>

                {/* Account Age */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                      <span className="font-semibold text-gray-900">Account Age</span>
                      <span className="text-sm text-gray-500">— How long you've been here</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                      style={{ width: '20%' }}
                    ></div>
                  </div>
                </div>

                {/* Profile Completeness */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                      <span className="font-semibold text-gray-900">Profile Completeness</span>
                      <span className="text-sm text-gray-500">— How complete your profile is</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                      style={{ width: `${user.profile_completeness || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <p className="text-sm font-semibold text-purple-900 mb-1">
                      Progress to Growing (25%)
                    </p>
                    <p className="text-3xl font-bold text-purple-600">{(user.trust_score || 0).toFixed(1)}%</p>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(user.trust_score || 0) * 4}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Reviewers Leaderboard */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Top Reviewers</h2>
                </div>
                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  UAE Leaderboard
                </button>
              </div>

              <div className="space-y-3">
                {leaderboard.map((reviewer, index) => {
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                  const isCurrentUser = reviewer.id === user.id;
                  
                  return (
                    <div 
                      key={reviewer.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                          index < 3 
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {medal || index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {reviewer.full_name}
                            {isCurrentUser && <span className="ml-2 text-xs text-purple-600">(You)</span>}
                          </p>
                          <p className="text-sm text-gray-500">{reviewer.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{reviewer.trust_score?.toFixed(0)}%</p>
                        <p className="text-sm text-gray-500">trust score</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/shops')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg"
                >
                  <span className="text-2xl">🏪</span>
                  Browse Shops
                </button>

                <button
                  onClick={() => navigate('/shops')}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg"
                >
                  <span className="text-2xl">✍️</span>
                  Write a Review
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg"
                >
                  <span className="text-2xl">👤</span>
                  My Profile
                </button>
              </div>
            </div>

            {/* Boost Your Score */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🚀</span>
                <h3 className="text-xl font-bold text-gray-900">Boost your score</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Complete your profile to gain up to <strong className="text-orange-600">10 more trust points</strong>.
              </p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105">
                I'm complete
              </button>
            </div>

            {/* Points Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">💎</span>
                <h3 className="text-xl font-bold text-gray-900">Earn Points</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">+25</span>
                  <span>Review with evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">+10</span>
                  <span>Regular review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">+5</span>
                  <span>Daily login</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
