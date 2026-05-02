import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

const categories = ['Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports']

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
    <div className="space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-10 text-white">
        <h1 className="text-4xl font-bold mb-3">Shop with Confidence</h1>
        <p className="text-green-100 text-lg mb-6">Real reviews from real buyers. Discover trustworthy UAE social media shops.</p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/search" className="bg-white text-green-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50">Browse Shops</Link>
          <Link to="/signup" className="border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800">Join Free</Link>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Link key={cat} to={`/search?category=${cat}`} className="bg-gray-100 hover:bg-green-100 hover:text-green-700 px-4 py-2 rounded-full text-sm font-medium transition">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Shops */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Rated Shops</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl"/>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🏪</p>
            <p>No shops yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shops.map(shop => (
              <Link key={shop.id} to={`/shops/${shop.id}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{shop.category}</span>
                  <span className="text-xs text-gray-400">{shop.platform}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{shop.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-green-500 rounded-full" style={{width: `${shop.trust_score}%`}}/>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{shop.trust_score}%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{shop.review_count} reviews</span>
                  {shop.license_verified ? <span className="text-green-500">✓ Verified</span> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Shops Listed', value: shops.length },
          { label: 'Reviews', value: shops.reduce((a, s) => a + (s.review_count || 0), 0) },
          { label: 'Verified', value: shops.filter(s => s.license_verified).length },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}