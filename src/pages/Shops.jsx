import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

const categories = ['All', 'Fashion', 'Beauty', 'Electronics', 'Accessories', 'Home', 'Food', 'Perfume', 'Handmade', 'Health', 'Sports']

export default function Shops() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    loadShops()
  }, [category])

  async function loadShops() {
    setLoading(true)
    try {
      let data
      if (category === 'All') {
        data = await api.getShops()
      } else {
        data = await api.getShopsByCategory(category)
      }
      setShops(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return loadShops()
    setLoading(true)
    try {
      const data = await api.searchShops(search)
      setShops(data)
    } catch (e) {}
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Browse Shops</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search shops..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl"/>
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No shops found</p>
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
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-blue-500 rounded-full" style={{width: `${shop.trust_score}%`}}/>
                </div>
                <span className="text-sm font-semibold text-blue-600">{shop.trust_score}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{shop.review_count} reviews</span>
                {shop.license_verified ? (
                  <span className="text-green-500 font-medium">✓ Verified</span>
                ) : (
                  <span className="text-gray-400">Unverified</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}