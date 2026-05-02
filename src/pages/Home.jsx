import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Home() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getShops().then(data => {
      setShops(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-white mb-10">
        <h1 className="text-4xl font-bold mb-3">Shop with Confidence</h1>
        <p className="text-blue-100 text-lg mb-6">Real reviews from real buyers. Discover trustworthy UAE social media shops.</p>
        <div className="flex gap-3">
          <Link to="/shops" className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50">Browse Shops</Link>
          <Link to="/signup" className="border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700">Join Free</Link>
        </div>
      </div>

      {/* Top Rated Shops */}
      <h2 className="text-2xl font-bold mb-6">Top Rated Shops</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl"/>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {shops.map(shop => (
            <Link key={shop.id} to={`/shops/${shop.id}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{shop.category}</span>
                <span className="text-xs text-gray-400">{shop.platform}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{shop.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-blue-500 rounded-full" style={{width: `${shop.trust_score}%`}}/>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{shop.trust_score}%</span>
                </div>
                <span className="text-xs text-gray-400">{shop.review_count} reviews</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Trust Score</p>
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mt-10">
        {[
          { label: 'Shops Listed', value: shops.length },
          { label: 'Reviews', value: shops.reduce((a, s) => a + (s.review_count || 0), 0) },
          { label: 'Trust Verified', value: shops.filter(s => s.license_verified).length },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}