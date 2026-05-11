import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchLeaderboard();
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
        setUser(data);
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

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('https://trustpulse-api.onrender.com/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const trustScore = user.trust_score || 0;
  const getLevel = (score) => {
    if (score >= 90) return { name: 'Elite', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (score >= 75) return { name: 'Top Reviewer', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
    if (score >= 50) return { name: 'Trusted', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 25) return { name: 'Active', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    return { name: 'Newcomer', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
  };
  const level = getLevel(trustScore);

  const scoreBreakdown = [
    { label: 'Rating Consistency', value: 40, current: Math.min(40, Math.round(trustScore * 0.4)), desc: 'Quality of your reviews' },
    { label: 'Number of Reviews', value: 30, current: Math.min(30, Math.round(trustScore * 0.3)), desc: 'How active you are' },
    { label: 'Account Age', value: 20, current: Math.min(20, Math.round(trustScore * 0.2)), desc: 'How long you\'ve been here' },
    { label: 'Profile Completeness', value: 10, current: Math.min(10, Math.round(trustScore * 0.1)), desc: 'How complete your profile is' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Dashboard</p>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.full_name?.split(' ')[0]}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/add-review"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Write Review
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-sm transition-all"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Trust Score */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Trust Score</p>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-2">{trustScore.toFixed(0)}<span className="text-lg text-slate-400">%</span></p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${trustScore}%` }}></div>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${level.bg} ${level.color} border ${level.border}`}>
              {level.name}
            </span>
          </div>

          {/* Points */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Points</p>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-2">{user.points_balance || 0}</p>
            <p className="text-xs text-slate-500">Earn more by reviewing</p>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Profile</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-2">{user.profile_completeness || 0}<span className="text-lg text-slate-400">%</span></p>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${user.profile_completeness || 0}%` }}></div>
            </div>
          </div>

          {/* Rank */}
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-400">Leaderboard</p>
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              #{leaderboard.findIndex(u => u.id === user.id) + 1 || '—'}
            </p>
            <p className="text-xs text-slate-400">UAE Rank</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Score Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trust Score Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Trust Score Breakdown</h2>
                  <p className="text-sm text-slate-500">How your score is calculated</p>
                </div>
                <Link to="/profile" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
                  View formula →
                </Link>
              </div>

              <div className="space-y-5">
                {scoreBreakdown.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {item.current}<span className="text-slate-400 font-normal">/{item.value}%</span>
                      </p>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(item.current / item.value) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress to next level */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">Progress to next level</p>
                  <p className="text-sm font-bold text-emerald-600">
                    {trustScore < 25 ? `${(((trustScore) / 25) * 100).toFixed(0)}%` : 
                     trustScore < 50 ? `${(((trustScore - 25) / 25) * 100).toFixed(0)}%` :
                     trustScore < 75 ? `${(((trustScore - 50) / 25) * 100).toFixed(0)}%` :
                     trustScore < 90 ? `${(((trustScore - 75) / 15) * 100).toFixed(0)}%` : '100%'}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" 
                       style={{ width: `${trustScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                  <p className="text-sm text-slate-500">Your latest interactions</p>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold mb-1">No activity yet</p>
                <p className="text-sm text-slate-500 mb-4">Start by writing your first review</p>
                <Link
                  to="/add-review"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  Write Review
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Quick Actions</h2>
              <p className="text-sm text-slate-500 mb-4">Common tasks</p>
              
              <div className="space-y-2">
                <Link
                  to="/search"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">Browse Shops</p>
                    <p className="text-xs text-slate-500">Explore verified shops</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/add-review"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">Write Review</p>
                    <p className="text-xs text-slate-500">Share your experience</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/add-shop"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">Add Shop</p>
                    <p className="text-xs text-slate-500">Register a new shop</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">Settings</p>
                    <p className="text-xs text-slate-500">Manage account</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Top Reviewers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Top Reviewers</h2>
                  <p className="text-sm text-slate-500">UAE leaderboard</p>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((reviewer, i) => (
                  <div key={reviewer.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-all">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-slate-200 text-slate-700' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{reviewer.full_name}</p>
                      <p className="text-xs text-slate-500">{reviewer.review_count || 0} reviews</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{(reviewer.trust_score || 0).toFixed(0)}%</span>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No reviewers yet</p>
                )}
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="font-bold text-emerald-900">Pro Tip</p>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                Reviews with photos earn 25% more trust points. Add evidence to your next review.
              </p>
              <Link
                to="/add-review"
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Write a review
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
