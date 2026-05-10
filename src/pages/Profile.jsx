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

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '🦊', '🐱', '🐶', '🦁', '🐼'];

  useEffect(() => {
    fetchUser();
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
      // Save to localStorage for now
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
    if (score >= 90) return { name: 'Elite', emoji: '👑', color: 'from-yellow-400 to-orange-500' };
    if (score >= 75) return { name: 'Top', emoji: '🏆', color: 'from-purple-500 to-pink-500' };
    if (score >= 50) return { name: 'Trusted', emoji: '✅', color: 'from-green-400 to-emerald-500' };
    if (score >= 25) return { name: 'Active', emoji: '📝', color: 'from-blue-400 to-indigo-500' };
    return { name: 'Newcomer', emoji: '⭐', color: 'from-gray-400 to-gray-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const badge = getBadge(user.trust_score || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar */}
            <div className="relative cursor-pointer group" onClick={() => setShowAvatarSelector(true)}>
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center text-6xl border-4 border-white/20 group-hover:scale-105 transition-all">
                {user.avatar || user.full_name?.charAt(0).toUpperCase() || '👤'}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Change</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">{user.full_name}</h1>
              <p className="text-purple-200 mb-3">{user.email}</p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className={`px-4 py-2 bg-gradient-to-r ${badge.color} text-white rounded-full font-bold text-sm shadow-lg`}>
                  {badge.emoji} {badge.name}
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-sm">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMenu(true)}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
            >
              ⚙️ Menu
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Trust Score</p>
            <p className="text-4xl font-bold">{(user.trust_score || 0).toFixed(0)}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Points</p>
            <p className="text-4xl font-bold">{user.points_balance || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Profile</p>
            <p className="text-4xl font-bold">{user.profile_completeness || 0}%</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Reviews</p>
            <p className="text-4xl font-bold">{user.review_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              📊 Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMenu(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{user.full_name}</h3>
                <p className="text-purple-100">{user.email}</p>
              </div>
              <button onClick={() => setShowMenu(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => { setShowMenu(false); setShowEditModal(true); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">✏️</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">Edit Profile</p>
                  <p className="text-sm text-gray-500">Update your information</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button
                onClick={() => { setShowMenu(false); setShowSettingsModal(true); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-2xl">⚙️</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">Settings</p>
                  <p className="text-sm text-gray-500">Preferences & privacy</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button
                onClick={() => { setShowMenu(false); navigate('/dashboard'); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-green-50 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl">📊</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">Dashboard</p>
                  <p className="text-sm text-gray-500">View your statistics</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              <button
                onClick={() => { setShowMenu(false); handleLogout(); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">🚪</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-red-600">Logout</p>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">✏️ Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+971 50 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">⚙️ Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">🔔 Notifications</p>
                  <p className="text-sm text-gray-500">Get notified about updates</p>
                </div>
                <button
                  onClick={() => setSettingsForm({ ...settingsForm, notifications: !settingsForm.notifications })}
                  className={`relative w-14 h-8 rounded-full transition-all ${settingsForm.notifications ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settingsForm.notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">📧 Email Alerts</p>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
                <button
                  onClick={() => setSettingsForm({ ...settingsForm, email_alerts: !settingsForm.email_alerts })}
                  className={`relative w-14 h-8 rounded-full transition-all ${settingsForm.email_alerts ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settingsForm.email_alerts ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Public Profile Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">🌍 Public Profile</p>
                  <p className="text-sm text-gray-500">Show on leaderboard</p>
                </div>
                <button
                  onClick={() => setSettingsForm({ ...settingsForm, public_profile: !settingsForm.public_profile })}
                  className={`relative w-14 h-8 rounded-full transition-all ${settingsForm.public_profile ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settingsForm.public_profile ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Language */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900 mb-2">🌐 Language</p>
                <select
                  value={settingsForm.language}
                  onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              {/* Danger Zone */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="font-bold text-red-700 mb-2">⚠️ Danger Zone</p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
                      alert('Account deletion not implemented yet. Contact support.');
                    }
                  }}
                  className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Delete Account
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarSelector(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Choose Avatar</h3>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => {
                    // Save avatar choice
                    localStorage.setItem('userAvatar', avatar);
                    setUser({ ...user, avatar });
                    setShowAvatarSelector(false);
                  }}
                  className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-2xl flex items-center justify-center text-4xl transition-all hover:scale-105"
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
