import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrustScoreDisplay from './TrustScoreDisplay';

const ShopProfile = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchShopData();
    fetchReviews();
    checkOwnership();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/shops/${shopId}`);
      const data = await response.json();
      setShop(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/reviews?shop_id=${shopId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkOwnership = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://trustpulse-api.onrender.com/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await response.json();
      
      const shopResponse = await fetch(`https://trustpulse-api.onrender.com/shops/${shopId}`);
      const shopData = await shopResponse.json();
      
      setIsOwner(userData.id === shopData.owner_id);
    } catch (error) {
      console.error('Error checking ownership:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://trustpulse-api.onrender.com/shops/${shopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Failed to update shop');

      const data = await response.json();
      setShop(data.shop);
      setEditing(false);
      alert('Shop updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update shop');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop not found</h2>
          <button
            onClick={() => navigate('/shops')}
            className="text-blue-600 hover:text-blue-700"
          >
            Browse all shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Shop Icon */}
            <div className="flex-shrink-0">
              {shop.shop_icon ? (
                <img
                  src={shop.shop_icon}
                  alt={shop.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                  {shop.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📂 {shop.category}
                    </span>
                    <span className="flex items-center gap-1">
                      🌐 {shop.platform}
                    </span>
                    {shop.license_verified && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        ✓ Verified License
                      </span>
                    )}
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setEditing(!editing)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editing ? 'Cancel' : 'Edit Shop'}
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile URL
                    </label>
                    <input
                      type="url"
                      value={editForm.profile_url || ''}
                      onChange={(e) => setEditForm({ ...editForm, profile_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">{shop.description}</p>
                  {shop.profile_url && (
                    <a
                      href={shop.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Visit Shop →
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews ({reviews.length})
                </h2>
                {!isOwner && (
                  <button
                    onClick={() => navigate(`/review/${shopId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No reviews yet</p>
                  <p className="text-sm text-gray-400">Be the first to review this shop!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.reviewer_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {review.reviewer_name || 'Anonymous'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700 mb-2">{review.review_text}</p>
                          {review.is_verified && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              ✓ Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Trust Score */}
          <div className="space-y-6">
            <TrustScoreDisplay shopId={shopId} score={shop.trust_score || 0} />

            {/* Shop Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Shop Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner</span>
                  <span className="font-medium">{shop.owner_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(shop.created_at).toLocaleDateString()}
                  </span>
                </div>
                {shop.license_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">License</span>
                    <span className="font-medium">{shop.license_number}</span>
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

export default ShopProfile;
