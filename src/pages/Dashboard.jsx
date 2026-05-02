import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('trustpulse_token')
      if (!token) { navigate('/login'); return }
      try {
        const [userData, lb] = await Promise.all([
          api.me(),
          api.getLeaderboard()
        ])
        setUser(userData)
        setLeaderboard(lb)
      } catch (e) {
        navigate('/login')
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h1>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600">{user.trust_score.toFixed(1)}%</div>
          <div className="text-xs text-gray-400 mt-1">Trust Score</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-500">{user.points_balance}</div>
          <div className="text-xs text-gray-400 mt-1">Points</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-500">{user.profile_completeness}%</div>
          <div className="text-xs text-gray-400 mt-1">Profile Complete</div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">Profile</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user.full_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Trust Score Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">How your trust score is calculated</h2>
        <div className="space-y-3">
          {[
            { label: 'Rating consistency', weight: '40%', color: 'bg-blue-500' },
            { label: 'Number of reviews', weight: '30%', color: 'bg-green-500' },
            { label: 'Account age', weight: '20%', color: 'bg-purple-500' },
            { label: 'Profile completeness', weight: '10%', color: 'bg-orange-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}/>
              <span className="text-sm text-gray-600 flex-1">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">{item.weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/shops" className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium text-center hover:bg-blue-100">
            🏪 Browse Shops
          </Link>
          <Link to="/shops" className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium text-center hover:bg-green-100">
            ✍️ Write a Review
          </Link>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4">🏆 Top Reviewers</h2>
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((reviewer, i) => (
            <div key={reviewer.id} className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'}`}>
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800">{reviewer.full_name}</span>
              <span className="text-sm text-blue-600 font-semibold">{reviewer.points_balance} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}