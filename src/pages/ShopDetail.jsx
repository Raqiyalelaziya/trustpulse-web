import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trustBreakdown, setTrustBreakdown] = useState(null);

  useEffect(() => {
    fetchShopData();
    fetchTrustBreakdown();
  }, [id]);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/shops/${id}`);
      const data = await response.json();
      setShop(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustBreakdown = async () => {
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/trust/shop/${id}`);
      const data = await response.json();
      setTrustBreakdown(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTrustBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', emoji: '🏆', color: 'from-yellow-400 to-orange-500', ring: 'ring-yellow-400' };
    if (score >= 80) return { text: 'Very Good', emoji: '⭐', color: 'from-green-400 to-emerald-500', ring: 'ring-green-400' };
    if (score >= 70) return { text: 'Good', emoji: '✓', color: 'from-blue-400 to-cyan-500', ring: 'ring-blue-400' };
    if (score >= 60) return { text: 'Fair', emoji: '!', color: 'from-orange-400 to-red-500', ring: 'ring-orange-400' };
    return { text: 'New Shop', emoji: '🌱', color: 'from-gray-400 to-gray-500', ring: 'ring-gray-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😔</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop Not Found</h2>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Browse Shops
          </button>
        </div>
      </div>
    );
  }

  const badge = getTrustBadge(shop.trust_score);
  const reviews = shop.reviews || [];
  const avgRating = shop.average_rating || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      
      {/* Hero Header */}
      <div className={`relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Background Image if available */}
        {shop.profile_url && (
          <>
            <img 
              src={shop.profile_url} 
              alt={shop.name}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-purple-900/50 to-transparent"></div>
          </>
        )}

        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            
            {/* Shop Icon */}
            <div className="flex-shrink-0">
              {shop.shop_icon ? (
                <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50 ring-8 ring-white/20">
                  <img src={shop.shop_icon} alt={shop.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-32 h-32 bg-gradient-to-br ${badge.color} rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/50 ring-8 ring-white/20`}>
                  <span className="text-6xl font-bold text-white">
                    {shop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-purple-700 text-sm font-bold rounded-full shadow-lg">
                  👗 {shop.category}
                </span>
                {shop.license_verified && (
                  <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full shadow-lg">
                  {shop.platform}
                </span>
              </div>

              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {shop.name}
              </h1>
              
              {shop.description && (
                <p className="text-purple-100 text-lg mb-6 max-w-2xl leading-relaxed">
                  {shop.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <p className="text-purple-200 text-sm">Reviews</p>
                  <p className="text-3xl font-bold text-white">{reviews.length}</p>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <p className="text-purple-200 text-sm">Rating</p>
                  <p className="text-3xl font-bold text-white">{avgRating.toFixed(1)} ⭐</p>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <p className="text-purple-200 text-sm">Verified</p>
                  <p className="text-3xl font-bold text-white">{shop.verified_review_count || 0}</p>
                </div>
              </div>
            </div>

            {/* Trust Score Circle */}
            <div className="flex-shrink-0">
              <div className="relative">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-white/20"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - (shop.trust_score || 0) / 100)}`}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{(shop.trust_score || 0).toFixed(0)}%</span>
                  <span className="text-sm text-purple-200 font-semibold">TRUST</span>
                  <span className="text-lg mt-1">{badge.emoji}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Reviews ({reviews.length})</h2>
                    <p className="text-sm text-gray-500">What customers are saying</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/add-review?shop=${id}`)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="text-xl">✍️</span>
                  <span>Add Review</span>
                </button>
              </div>

              <div className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-6xl block mb-4">✍️</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to review this shop!</p>
                    <button
                      onClick={() => navigate(`/add-review?shop=${id}`)}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Write a Review
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {review.reviewer_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.reviewer_name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">{review.review_text}</p>
                        {review.is_verified && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Rating Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rating Overview</h3>
              <div className="text-center mb-6">
                <p className="text-6xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                <div className="flex justify-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">{reviews.length} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-8">{rating} ⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Breakdown */}
            {trustBreakdown && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📊</span>
                  <h3 className="text-xl font-bold">Trust Breakdown</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(trustBreakdown.components).map(([key, data]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{data.label}</span>
                        <span className="text-sm font-bold">{data.score.toFixed(0)}/{data.weight}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all"
                          style={{ width: `${(data.score / parseFloat(data.weight)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shop Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shop Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Verified Reviews</span>
                  <span className="font-bold text-gray-900">{shop.verified_review_count || 0}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Trust Score</span>
                  <span className="font-bold text-gray-900">{(shop.trust_score || 0).toFixed(1)}%</span>
                </div>
                {shop.license_number && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">License</span>
                    <span className="font-bold text-green-600">✓ Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
