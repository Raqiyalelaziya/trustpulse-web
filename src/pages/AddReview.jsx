import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function AddReview() {
  const [searchParams] = useSearchParams()
  const shop_id = searchParams.get('shop_id')
  const shop_name = searchParams.get('shop_name')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    rating: 5,
    review_text: '',
    evidence_url: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await api.submitReview({
        shop_id: parseInt(shop_id),
        rating: form.rating,
        review_text: form.review_text,
        evidence_url: form.evidence_url
      })
      alert(`Review submitted! You earned ${result.points_earned} points!`)
      navigate(`/shops/${shop_id}`)
    } catch (err) {
      setError(err.error || 'Failed to submit review')
    }
    setLoading(false)
  }

  if (!localStorage.getItem('trustpulse_token')) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-gray-600 mb-4">You need to login to write a review</p>
        <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Login</a>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Write a Review</h1>
        {shop_name && <p className="text-gray-500 mb-6">for <strong>{shop_name}</strong></p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({...form, rating: star})}
                  className={`text-3xl transition ${star <= form.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              value={form.review_text}
              onChange={e => setForm({...form, review_text: e.target.value})}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience with this shop..."
              required
            />
          </div>

          {/* Evidence URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence URL <span className="text-gray-400 font-normal">(optional — screenshot link for +15 bonus points)</span>
            </label>
            <input
              type="url"
              value={form.evidence_url}
              onChange={e => setForm({...form, evidence_url: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://imgur.com/your-screenshot"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            💰 You earn <strong>10 points</strong> for a review, <strong>25 points</strong> if you add evidence!
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}