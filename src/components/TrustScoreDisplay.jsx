import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const TrustScoreDisplay = ({ shopId, score }) => {
  const { lang } = useLanguage();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBreakdown = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://trustpulse-api.onrender.com/trust/shop/${shopId}`);
      const data = await response.json();
      setBreakdown(data);
    } catch (error) {
      console.error('Error fetching trust breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowBreakdown = () => {
    if (!breakdown && !loading) {
      fetchBreakdown();
    }
    setShowBreakdown(!showBreakdown);
  };

  const getTrustBadge = (score) => {
    if (score >= 90) return { label: t(lang, 'excellent'), color: 'bg-green-600', icon: '🏆' };
    if (score >= 80) return { label: t(lang, 'veryGood'), color: 'bg-blue-600', icon: '⭐' };
    if (score >= 70) return { label: t(lang, 'good'), color: 'bg-indigo-600', icon: '✓' };
    if (score >= 60) return { label: t(lang, 'fair'), color: 'bg-yellow-600', icon: '!' };
    return { label: t(lang, 'newShop'), color: 'bg-gray-600', icon: '🌱' };
  };

  const badge = getTrustBadge(score);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-indigo-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Main Score Display */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t(lang, 'trustScore')}</h3>
          <div className="flex items-center gap-3">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score.toFixed(1)}%
            </span>
            <div className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
              {badge.icon} {badge.label}
            </div>
          </div>
        </div>
        
        {/* Circular Progress */}
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - score / 100)}`}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{Math.round(score)}%</span>
          </div>
        </div>
      </div>

      {/* View Breakdown Button */}
      <button
        onClick={handleShowBreakdown}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
      >
        {showBreakdown ? t(lang, 'hideBreakdown') : t(lang, 'viewBreakdown')}
      </button>

      {/* Breakdown Details */}
      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : breakdown ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Score Components:</h4>
              
              {/* Rating Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-sm font-medium">{breakdown.components.rating.score}pts (40%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(breakdown.components.rating.score / 40) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current: {breakdown.components.rating.raw} stars
                </p>
              </div>

              {/* Review Count Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Number of Reviews</span>
                  <span className="text-sm font-medium">{breakdown.components.reviews.score}pts (30%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(breakdown.components.reviews.score / 30) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current: {breakdown.components.reviews.raw} reviews
                </p>
              </div>

              {/* Account Age Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Account Age</span>
                  <span className="text-sm font-medium">{breakdown.components.age.score}pts (20%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(breakdown.components.age.score / 20) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {breakdown.components.age.raw}
                </p>
              </div>

              {/* License Verification Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">License {t(lang, 'verified')}</span>
                  <span className="text-sm font-medium">{breakdown.components.license.score}pts (10%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${breakdown.components.license.raw ? 'bg-green-600' : 'bg-gray-400'} h-2 rounded-full`}
                    style={{ width: `${breakdown.components.license.score * 10}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {breakdown.components.license.raw ? `${t(lang, 'verified')} ✓` : t(lang, 'unverified')}
                </p>
              </div>

              {/* How to Improve */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">💡 How to Improve Your Score:</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  {breakdown.components.rating.raw < 4.5 && (
                    <li>• Maintain excellent customer service to improve ratings</li>
                  )}
                  {breakdown.components.reviews.raw < 50 && (
                    <li>• Encourage satisfied customers to leave reviews</li>
                  )}
                  {!breakdown.components.license.raw && (
                    <li>• Add your business license for instant +10% boost</li>
                  )}
                  {breakdown.total_trust_score < 70 && (
                    <li>• Build your reputation over time with consistent quality</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Unable to load breakdown. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrustScoreDisplay;
