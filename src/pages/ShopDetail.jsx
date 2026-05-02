import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function ShopDetail() {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [trust, setTrust] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [shopData, trustData] = await Promise.all([
          api.getShop(id),
          api.getTrustBreakdown(id)
        ])
        setShop(shopData)
        setTrust(trustData)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!shop) return <div className="text-center py-20 text-gray-400">Shop not found</div>

  return (
    <div className="max-w-3xl mx-auto">

      {/* Shop Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{shop.category}</span>
              <span className="text-xs text-gray-400">{shop.platform}</span>
              {shop.license_verified ? (
                <span className="text-xs text-green-500 font-medium">✓ Verified</span>
              ) : null}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{shop.trust_score}%</div>
            <div className="text-xs text-gray-400">Trust Score</div>
          </div>
        </div>

        <Link
          to={`/add-review?shop_id=${shop.id}&shop_name=${shop.name}`}
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
        >
          Write a Review
        </Link>
      </div>

      {/* Trust Breakdown */}
      {trust && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Trust Score Breakdown</h2>
          <div className="space-y-4">
            {Object.values(trust.components).map((comp, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{comp.label}</span>
                  <span className="font-medium text-gray-800">{comp.score} / {comp.weight}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{width: `${(comp.score / parseFloat(comp.weight)) * 100}%`}}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">Raw: {String(comp.raw)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4">
          Reviews ({shop.reviews?.length || 0})
        </h2>
        {!shop.reviews || shop.reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shop.reviews.map((review, i) => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm">{review.reviewer_name}</span>
                    {review.is_verified ? (
                      <span className="text-xs text-green-500">✓ Verified</span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className={s < review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.review_text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}