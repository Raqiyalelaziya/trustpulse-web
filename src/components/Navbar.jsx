import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('trustpulse_token')
  const user = JSON.parse(localStorage.getItem('trustpulse_user') || '{}')

  function logout() {
    localStorage.removeItem('trustpulse_token')
    localStorage.removeItem('trustpulse_user')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🛡️ TrustPulse
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/shops" className="text-gray-600 hover:text-blue-600 text-sm">Shops</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm">Dashboard</Link>
              <span className="text-sm text-gray-500">Hi, {user.full_name}</span>
              <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/signup" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}