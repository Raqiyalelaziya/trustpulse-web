import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
    fetchReviews();
  }, [id]);

  const fetchShop = async () => {
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/shops/${id}`);
      if (response.ok) {
        const data = await response.json();
        setShop(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/shops/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Shop not found</p>
          <Link to="/search" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Browse all shops →
          </Link>
        </div>
      </div>
    );
  }

  const trustScore = shop.trust_score || 0;
  const avgRating = parseFloat(shop.average_rating || 0);
  
  // Rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
  });

  const trustBreakdown = [
    { label: 'Account Age', current: 18, max: 20 },
    { label: 'License Verified', current: shop.verified ? 10 : 0, max: 10 },
    { label: 'Average Rating', current: Math.round(avgRating * 8), max: 40 },
    { label: 'Number of Reviews', current: Math.min(reviews.length * 3, 30), max: 30 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-500 hover:text-slate-700">Home</Link>
            <span className="text-slate-300">/</span>
            <Link to="/search" className="text-slate-500 hover:text-slate-700">Shops</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium truncate">{shop.shop_name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Clean & Professional */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* Shop Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-5xl border border-slate-200">
                {shop.icon || shop.shop_name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Shop Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {shop.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                    {shop.category}
                  </span>
                )}
                {shop.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold border border-emerald-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
                {shop.platform && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                    {shop.platform}
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{shop.shop_name}</h1>
              
              {shop.description && (
                <p className="text-slate-600 mb-4 max-w-2xl">{shop.description}</p>
              )}

              {/* Rating Summary */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-slate-900">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Trust Score:</span>
                  <span className={`font-bold ${trustScore >= 75 ? 'text-emerald-600' : trustScore >= 50 ? 'text-blue-600' : 'text-slate-700'}`}>
                    {trustScore.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <button
                onClick={() => navigate(`/add-review?shop=${id}`)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2 justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Write a Review
              </button>
              {shop.website_url && (
                <a
                  href={shop.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2 justify-center"
                >
                  Visit Shop
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left - Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Reviews Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
                <p className="text-sm text-slate-500">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
              </div>
              <button
                onClick={() => navigate(`/add-review?shop=${id}`)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
              >
                Add Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-900 mb-1">No reviews yet</p>
                <p className="text-sm text-slate-500 mb-4">Be the first to share your experience</p>
                <button
                  onClick={() => navigate(`/add-review?shop=${id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  Write the first review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {review.user_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-900 text-sm">{review.user_name || 'Anonymous'}</p>
                          <span className="text-xs text-slate-500">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {review.verified && (
                            <span className="text-xs text-emerald-600 font-semibold">✓ Verified Purchase</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{review.review_text || review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Rating Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Rating Overview</h3>
            
            <div className="text-center mb-4 pb-4 border-b border-slate-100">
              <p className="text-5xl font-bold text-slate-900 mb-1">{avgRating.toFixed(1)}</p>
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-slate-500">Based on {reviews.length} reviews</p>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingCounts[stars - 1];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-3">{stars}</span>
                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Trust Score</h3>
              <span className={`text-xl font-bold ${trustScore >= 75 ? 'text-emerald-600' : trustScore >= 50 ? 'text-blue-600' : 'text-slate-700'}`}>
                {trustScore.toFixed(0)}%
              </span>
            </div>

            <div className="space-y-3">
              {trustBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.current}/{item.max}</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(item.current / item.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Info */}
          {(shop.location || shop.platform || shop.created_at) && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Shop Information</h3>
              <dl className="space-y-3 text-sm">
                {shop.location && (
                  <div>
                    <dt className="text-slate-500 text-xs mb-1">Location</dt>
                    <dd className="text-slate-900 font-medium">{shop.location}</dd>
                  </div>
                )}
                {shop.platform && (
                  <div>
                    <dt className="text-slate-500 text-xs mb-1">Platform</dt>
                    <dd className="text-slate-900 font-medium">{shop.platform}</dd>
                  </div>
                )}
                {shop.category && (
                  <div>
                    <dt className="text-slate-500 text-xs mb-1">Category</dt>
                    <dd className="text-slate-900 font-medium">{shop.category}</dd>
                  </div>
                )}
                {shop.created_at && (
                  <div>
                    <dt className="text-slate-500 text-xs mb-1">Listed Since</dt>
                    <dd className="text-slate-900 font-medium">
                      {new Date(shop.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
