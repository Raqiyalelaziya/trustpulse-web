import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const WriteReview = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch('https://trustpulse-api.onrender.com/shops');
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShop || !rating || !reviewText) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://trustpulse-api.onrender.com/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shop_id: selectedShop,
          rating,
          review_text: reviewText,
          evidence_url: evidenceUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Review submitted! You earned ${data.points_earned} points!`);
        navigate('/shops');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedShopData = shops.find(s => s.id === parseInt(selectedShop));
  const pointsToEarn = evidenceUrl ? 25 : 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl p-12 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-6 shadow-2xl">
              <span className="text-4xl">⭐</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Write a Review</h1>
            <p className="text-purple-200 text-lg">Share your experience and help others shop safely</p>
            
            {/* Points Info */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                <p className="text-sm text-purple-200 mb-1">Base Reward</p>
                <p className="text-2xl font-bold text-white">+10 pts</p>
              </div>
              <div className="px-6 py-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-lg rounded-xl border border-yellow-400/30">
                <p className="text-sm text-yellow-200 mb-1">With Evidence</p>
                <p className="text-2xl font-bold text-yellow-400">+25 pts</p>
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                <p className="text-sm text-purple-200 mb-1">New User Bonus</p>
                <p className="text-2xl font-bold text-white">+5 pts</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Shop Selection Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🏪</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Select Shop</h2>
                <p className="text-sm text-gray-500">Choose the shop you want to review</p>
              </div>
            </div>

            {/* Shop Dropdown with Search */}
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏪</span>
                  <span className="font-medium text-gray-900">
                    {selectedShopData ? selectedShopData.name : 'Choose a shop...'}
                  </span>
                </div>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search shops..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Shop List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredShops.length === 0 ? (
                      <div className="p-8 text-center">
                        <span className="text-4xl block mb-2">🔍</span>
                        <p className="text-gray-500">No shops found</p>
                      </div>
                    ) : (
                      filteredShops.map((shop) => (
                        <button
                          key={shop.id}
                          type="button"
                          onClick={() => {
                            setSelectedShop(shop.id);
                            setShowDropdown(false);
                            setSearchTerm('');
                          }}
                          className={`w-full p-4 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all flex items-center gap-4 ${
                            selectedShop === shop.id ? 'bg-gradient-to-r from-purple-100 to-pink-100' : ''
                          }`}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                            {shop.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{shop.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {shop.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                ⭐ {shop.trust_score?.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          {selectedShop === shop.id && (
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Add New Shop Link */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => navigate('/add-shop')}
                      className="w-full p-3 text-center text-purple-600 hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <span className="text-xl">➕</span>
                      Add a new shop not listed here
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Rating</h2>
                <p className="text-sm text-gray-500">Click to rate from 1 to 5 stars</p>
              </div>
            </div>

            <div className="flex justify-center gap-4 py-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transform hover:scale-125 transition-transform"
                >
                  <svg
                    className={`w-16 h-16 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 drop-shadow-lg'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {rating === 5 ? '⭐ Excellent!' : rating === 4 ? '😊 Great!' : rating === 3 ? '👍 Good!' : rating === 2 ? '😐 Fair' : '☹️ Poor'}
                </p>
              </div>
            )}
          </div>

          {/* Review Text Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📝</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Review</h2>
                <p className="text-sm text-gray-500">Tell others about your experience (min. 20 characters)</p>
              </div>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience — delivery, quality, communication, packaging..."
              rows={6}
              className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-sm ${reviewText.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                {reviewText.length >= 20 ? '✓ Minimum length met' : `${20 - reviewText.length} more characters needed`}
              </span>
              <span className="text-sm text-gray-400">{reviewText.length} characters</span>
            </div>
          </div>

          {/* Evidence URL Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📸</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Evidence URL
                  <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full font-semibold">Optional</span>
                </h2>
                <p className="text-sm text-gray-600">Add proof to earn extra points and get a Verified badge ✓</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://screenshot-link.com/..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-yellow-300 rounded-xl focus:outline-none focus:border-yellow-500 transition-all"
              />
              <svg className="absolute left-4 top-4 w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl">
              <p className="text-sm text-gray-700 mb-2">
                <strong className="text-yellow-700">💡 Tip:</strong> Add a screenshot link to earn <strong className="text-orange-600">+15 extra points</strong> and get a Verified badge ✓
              </p>
            </div>
          </div>

          {/* Points Preview */}
          {selectedShop && rating && reviewText.length >= 20 && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg opacity-90 mb-2">You'll earn</p>
                  <p className="text-5xl font-bold">{pointsToEarn} points</p>
                  {evidenceUrl && (
                    <p className="text-sm opacity-90 mt-2">Including +15 evidence bonus! 🎉</p>
                  )}
                </div>
                <div className="text-6xl">💎</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedShop || !rating || reviewText.length < 20 || loading}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-[1.02] transition-all disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">⭐</span>
                <span>Submit Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;
