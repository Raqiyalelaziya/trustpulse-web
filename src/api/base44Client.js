// src/api/base44Client.js
// Replaces the Base44 SDK with direct Flask API calls.
// All methods are self-contained — no dependency on ../api needed.
 
const BASE_URL = 'https://trustpulse-api.onrender.com'
 
const getToken = () => localStorage.getItem('trustpulse_token')
const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('trustpulse_user') || 'null') } catch { return null }
}
 
const authFetch = async (path, options = {}) => {
  const token = getToken()
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
}
 
// Map a trust_score (0–100) to a human-readable trust level
const trustLevelFromScore = (score) => {
  if (score >= 75) return 'High'
  if (score >= 50) return 'Medium'
  if (score >= 25) return 'Low'
  return 'New'
}
 
// Normalise a shop object so pages get consistent field names
const normaliseShop = (s) => ({
  ...s,
  trust_level: trustLevelFromScore(s.trust_score || 0),
  average_rating: s.average_rating ?? parseFloat(((s.trust_score || 0) / 20).toFixed(1)),
  review_count: s.review_count || 0,
  verified_review_count: s.verified_review_count || 0,
  flagged: s.flagged || false,
})
 
// Normalise a review object so pages get consistent field names
const normaliseReview = (r) => ({
  ...r,
  comment: r.comment || r.review_text || '',
  review_text: r.review_text || r.comment || '',
  verified: r.verified ?? r.is_verified ?? false,
  reviewer_name: r.reviewer_name || `User #${r.user_id}`,
  reported: r.reported || false,
  reported_by: r.reported_by || [],
  shop_name: r.shop_name || '',
  points_earned: r.points_earned || 0,
  likes: r.likes || 0,
  comments_count: r.comments_count || 0,
})
 
// Normalise a user object so pages get consistent field names
const normaliseUser = (u) => ({
  ...u,
  display_name: u.display_name || u.full_name || u.email || 'User',
  username: u.username || u.full_name || '',
  points: u.trust_score || u.points || 0,
  total_reviews: u.total_reviews || 0,
  trust_level: trustLevelFromScore(u.trust_score || 0),
  is_verified_user: (u.trust_score || 0) >= 75,
  total_likes_received: u.total_likes_received || 0,
  total_comments_received: u.total_comments_received || 0,
  profile_image: u.profile_image || null,
  role: u.role || 'user',
})
 
export const base44 = {
  // ─── AUTH ────────────────────────────────────────────────────────────────
  auth: {
    isAuthenticated: async () => {
      if (!getToken()) return false
      try {
        const res = await authFetch('/auth/me')
        return res.ok
      } catch { return false }
    },
 
    me: async () => {
      const res = await authFetch('/auth/me')
      if (!res.ok) throw new Error('Not authenticated')
      const data = await res.json()
      return normaliseUser(data)
    },
 
    // Update current user's profile. Tries PATCH /auth/me, falls back to localStorage.
    updateMe: async (updates) => {
      try {
        const res = await authFetch('/auth/me', {
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
        if (res.ok) {
          const updated = await res.json()
          localStorage.setItem('trustpulse_user', JSON.stringify(updated))
          return normaliseUser(updated)
        }
      } catch { /* fall through */ }
      // Fallback: merge into localStorage
      const current = getStoredUser() || {}
      const merged = normaliseUser({ ...current, ...updates })
      localStorage.setItem('trustpulse_user', JSON.stringify(merged))
      return merged
    },
 
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      return res.json()
    },
 
    signup: async (data) => {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
 
    logout: (redirectPath) => {
      localStorage.removeItem('trustpulse_token')
      localStorage.removeItem('trustpulse_user')
      window.location.href = redirectPath || '/'
    },
 
    redirectToLogin: (returnPath) => {
      const qs = returnPath ? `?redirect=${encodeURIComponent(returnPath)}` : ''
      window.location.href = `/login${qs}`
    },
  },
 
  // ─── ENTITIES ────────────────────────────────────────────────────────────
  entities: {
    Shop: {
      list: async (_sort, limit) => {
        try {
          const res = await fetch(`${BASE_URL}/shops`)
          const data = await res.json()
          const shops = (Array.isArray(data) ? data : data.shops || []).map(normaliseShop)
          return shops.slice(0, limit ?? shops.length)
        } catch { return [] }
      },
 
      filter: async (filters, _sort, limit) => {
        try {
          const res = await fetch(`${BASE_URL}/shops`)
          const data = await res.json()
          let shops = (Array.isArray(data) ? data : data.shops || []).map(normaliseShop)
          if (filters?.category) shops = shops.filter((s) => s.category === filters.category)
          if (filters?.owner_id) shops = shops.filter((s) => s.owner_id === filters.owner_id)
          return shops.slice(0, limit ?? shops.length)
        } catch { return [] }
      },
 
      get: async (id) => {
        try {
          const res = await fetch(`${BASE_URL}/shops/${id}`)
          const data = await res.json()
          return normaliseShop(data.shop || data)
        } catch { return null }
      },
 
      create: async (body) => {
        try {
          const res = await authFetch('/shops', { method: 'POST', body: JSON.stringify(body) })
          if (res.ok) return normaliseShop(await res.json())
        } catch { /* fall through */ }
        return body
      },
 
      update: async (id, body) => {
        try {
          const res = await authFetch(`/shops/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
          if (res.ok) return normaliseShop(await res.json())
        } catch { /* fall through */ }
        return body
      },
 
      delete: async (id) => {
        try { await authFetch(`/shops/${id}`, { method: 'DELETE' }) } catch { /* silent */ }
      },
    },
 
    Review: {
      list: async (_sort, limit) => {
        try {
          const res = await authFetch('/reviews')
          if (!res.ok) return []
          const data = await res.json()
          const reviews = (Array.isArray(data) ? data : data.reviews || []).map(normaliseReview)
          return reviews.slice(0, limit ?? reviews.length)
        } catch { return [] }
      },
 
      filter: async (filters, _sort, limit) => {
        try {
          const params = new URLSearchParams()
          if (filters?.shop_id)    params.set('shop_id', filters.shop_id)
          if (filters?.user_id)    params.set('user_id', filters.user_id)
          if (filters?.created_by) {
            // created_by stores the user's email in Base44 style; map to user_id via localStorage
            const me = getStoredUser()
            if (me?.id && me?.email === filters.created_by) params.set('user_id', me.id)
          }
          const qs = params.toString()
          const res = await authFetch(`/reviews${qs ? `?${qs}` : ''}`)
          if (!res.ok) return []
          const data = await res.json()
          let reviews = (Array.isArray(data) ? data : data.reviews || []).map(normaliseReview)
          // Client-side filter as a safety net
          if (filters?.shop_id) reviews = reviews.filter((r) => String(r.shop_id) === String(filters.shop_id))
          return reviews.slice(0, limit ?? reviews.length)
        } catch { return [] }
      },
 
      create: async (body) => {
        const res = await authFetch('/reviews', { method: 'POST', body: JSON.stringify(body) })
        return res.json()
      },
 
      update: async (id, body) => {
        try {
          const res = await authFetch(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
          if (res.ok) return normaliseReview(await res.json())
        } catch { /* fall through */ }
        return body
      },
 
      delete: async (id) => {
        try { await authFetch(`/reviews/${id}`, { method: 'DELETE' }) } catch { /* silent */ }
      },
    },
 
    User: {
      list: async (_sort, limit) => {
        try {
          const res = await fetch(`${BASE_URL}/leaderboard`)
          const data = await res.json()
          const users = (Array.isArray(data) ? data : data.users || []).map(normaliseUser)
          return users.slice(0, limit ?? users.length)
        } catch { return [] }
      },
      filter: async () => [],
      me: async () => base44.auth.me(),
      updateMyUserData: async (data) => base44.auth.updateMe(data),
    },
 
    Complaint: {
      list: async (_sort, limit) => {
        try {
          const res = await authFetch('/complaints')
          if (!res.ok) return []
          const data = await res.json()
          const complaints = Array.isArray(data) ? data : data.complaints || []
          return complaints.slice(0, limit ?? complaints.length)
        } catch { return [] }
      },
      filter: async (filters, _sort, limit) => {
        try {
          const params = new URLSearchParams()
          if (filters?.shop_id) params.set('shop_id', filters.shop_id)
          const qs = params.toString()
          const res = await authFetch(`/complaints${qs ? `?${qs}` : ''}`)
          if (!res.ok) return []
          const data = await res.json()
          return (Array.isArray(data) ? data : data.complaints || []).slice(0, limit ?? 9999)
        } catch { return [] }
      },
      create: async (body) => {
        try {
          const res = await authFetch('/complaints', { method: 'POST', body: JSON.stringify(body) })
          if (res.ok) return res.json()
        } catch { /* fall through */ }
        return body
      },
    },
 
    Comment: {
      list: async () => [],
      filter: async (filters, _sort, limit) => {
        try {
          const params = new URLSearchParams()
          if (filters?.review_id) params.set('review_id', filters.review_id)
          const res = await fetch(`${BASE_URL}/comments?${params.toString()}`)
          if (!res.ok) return []
          const data = await res.json()
          return Array.isArray(data) ? data : []
        } catch { return [] }
      },
      create: async (body) => {
        try {
          const res = await authFetch('/comments', { method: 'POST', body: JSON.stringify(body) })
          if (res.ok) return res.json()
        } catch { /* fall through */ }
        return body
      },
    },
  },
 
  // ─── INTEGRATIONS ────────────────────────────────────────────────────────
  integrations: {
    Core: {
      // Image hosting not available — returns a temporary blob URL for preview only.
      UploadFile: async ({ file }) => ({ file_url: URL.createObjectURL(file) }),
    },
  },
}