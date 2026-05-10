import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const AddShop = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    platform: '',
    description: '',
    profile_url: '',
    shop_icon: '',
    license_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'Electronics', emoji: '📱', color: 'from-blue-500 to-cyan-500' },
    { value: 'Fashion', emoji: '👗', color: 'from-pink-500 to-rose-500' },
    { value: 'Beauty & Health', emoji: '💄', color: 'from-purple-500 to-pink-500' },
    { value: 'Home & Garden', emoji: '🏡', color: 'from-green-500 to-emerald-500' },
    { value: 'Toys & Games', emoji: '🎮', color: 'from-orange-500 to-red-500' },
    { value: 'Sports & Outdoors', emoji: '⚽', color: 'from-indigo-500 to-blue-500' },
    { value: 'Food & Beverages', emoji: '🍔', color: 'from-yellow-500 to-orange-500' },
    { value: 'Services', emoji: '🛠️', color: 'from-teal-500 to-cyan-500' },
    { value: 'Other', emoji: '✨', color: 'from-gray-500 to-slate-500' }
  ];

  const platforms = [
    { value: 'Instagram', emoji: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'Facebook', emoji: '👥', color: 'bg-blue-600' },
    { value: 'WhatsApp', emoji: '💬', color: 'bg-green-500' },
    { value: 'TikTok', emoji: '🎵', color: 'bg-black' },
    { value: 'Snapchat', emoji: '👻', color: 'bg-yellow-400' },
    { value: 'Website', emoji: '🌐', color: 'bg-indigo-600' },
    { value: 'Other', emoji: '📱', color: 'bg-gray-600' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Shop name is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.platform) newErrors.platform = 'Please select a platform';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://trustpulse-api.onrender.com/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shop');
      }

      alert('🎉 Shop created successfully!');
      navigate(`/shop/${data.shop.id}`);
      
    } catch (error) {
      console.error('Shop creation error:', error);
      alert(error.message || 'Failed to create shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-4xl">🏪</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Add Your Shop
          </h1>
          <p className="text-gray-600 text-lg">
            List a social media shop so others can review it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shop Logo Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Shop Identity</h2>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group cursor-pointer">
                  {formData.shop_icon ? (
                    <img src={formData.shop_icon} alt="Logo" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl block mb-1">📷</span>
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Logo URL (Optional)
                </label>
                <input
                  type="url"
                  name="shop_icon"
                  value={formData.shop_icon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  If no logo is uploaded, your shop initials will be shown
                </p>
              </div>
            </div>
          </div>

          {/* Shop Details Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Shop Details</h2>
            </div>

            <div className="space-y-5">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Dubai Fashion Hub"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Platform & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Platform */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Platform *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, platform: platform.value }))}
                        className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                          formData.platform === platform.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{platform.emoji}</span>
                        <span className="text-xs font-medium text-gray-700">{platform.value}</span>
                      </button>
                    ))}
                  </div>
                  {errors.platform && <p className="mt-1 text-sm text-red-600">{errors.platform}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 6).map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                        className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                          formData.category === cat.value
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{cat.emoji}</span>
                        <span className="text-xs font-medium text-gray-700">{cat.value}</span>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description * (minimum 20 characters)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Tell customers about your shop, products, and what makes you special..."
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500">{formData.description.length}/20 characters</p>
                  {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>

              {/* Profile URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile URL (Instagram, Facebook, etc.)
                </label>
                <input
                  type="url"
                  name="profile_url"
                  value={formData.profile_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://instagram.com/yourshop"
                />
              </div>
            </div>
          </div>

          {/* License Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Boost Your Trust Score!</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Add your business license to get an instant <strong>+10% trust score boost</strong> and a verified badge!
            </p>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-white"
              placeholder="e.g., DED-123456 (Optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Shop...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Add Shop
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShop;
