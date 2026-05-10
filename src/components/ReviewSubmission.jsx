import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const ReviewSubmission = ({ shopId, shopName, onSuccess }) => {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: '',
    evidence_url: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';
    if (!formData.review_text.trim()) newErrors.review_text = 'Please write a review';
    if (formData.review_text.length < 20) newErrors.review_text = 'Review must be at least 20 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://trustpulse-api.onrender.com/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shop_id: shopId,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Success!
      const pointsEarned = formData.evidence_url ? 25 : 10;
      alert(`✅ ${t(lang, 'reviewSubmittedSuccess')} ${t(lang, 'pointsEarned').replace('{points}', pointsEarned)} 🎉`);
      
      // Reset form
      setFormData({ rating: 0, review_text: '', evidence_url: '' });
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Review submission error:', error);
      if (error.message.includes('already reviewed')) {
        alert('You have already reviewed this shop.');
      } else if (error.message.includes('own shop')) {
        alert('You cannot review your own shop.');
      } else {
        alert(error.message || 'Failed to submit review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= (hoveredRating || formData.rating);
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => {
            setFormData(prev => ({ ...prev, rating: i }));
            setErrors(prev => ({ ...prev, rating: '' }));
          }}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className={`w-10 h-10 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      );
    }
    return stars;
  };

  const getRatingLabel = (rating) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[rating] || 'Select a rating';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t(lang, 'writeReview')}
      </h2>
      <p className="text-gray-600 mb-6">
        Share your experience with <span className="font-semibold">{shopName}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t(lang, 'rating')} *
          </label>
          <div className="flex items-center gap-2 mb-2">
            {renderStars()}
          </div>
          <p className="text-sm font-medium text-gray-600">
            {getRatingLabel(hoveredRating || formData.rating)}
          </p>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(lang, 'yourReview')} * (minimum 20 characters)
          </label>
          <textarea
            value={formData.review_text}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, review_text: e.target.value }));
              setErrors(prev => ({ ...prev, review_text: '' }));
            }}
            rows="5"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 
              ${errors.review_text ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe your experience with this shop. What did you buy? How was the service? Would you recommend them?"
          />
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-500">
              {formData.review_text.length}/20 characters
            </p>
            {errors.review_text && (
              <p className="text-sm text-red-600">{errors.review_text}</p>
            )}
          </div>
        </div>

        {/* Evidence URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(lang, 'evidence')} (Receipt, Screenshot, etc.)
          </label>
          <input
            type="url"
            value={formData.evidence_url}
            onChange={(e) => setFormData(prev => ({ ...prev, evidence_url: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/receipt.jpg"
          />
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>💰 {t(lang, 'earnRewards')}!</strong> Reviews with evidence earn <strong>25 {t(lang, 'points')}</strong> instead of 10.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors"
          >
            {loading ? t(lang, 'loading') : t(lang, 'submitReview')}
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By submitting a review, you agree to our review guidelines. 
          Please be honest and respectful.
        </p>
      </form>
    </div>
  );
};

export default ReviewSubmission;
