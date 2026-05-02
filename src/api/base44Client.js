// This file replaces the base44 SDK with our Flask API
import { api } from '../api'

export const base44 = {
  auth: {
    isAuthenticated: async () => {
      const token = localStorage.getItem('trustpulse_token')
      if (!token) return false
      try {
        await api.me()
        return true
      } catch {
        return false
      }
    },
    me: async () => {
      return await api.me()
    },
    login: async (email, password) => {
      return await api.login(email, password)
    },
    logout: () => {
      localStorage.removeItem('trustpulse_token')
      localStorage.removeItem('trustpulse_user')
    },
    redirectToLogin: (path) => {
      window.location.href = path || '/login'
    }
  },
  entities: {
    Shop: {
      list: async (sort, limit) => {
        const shops = await api.getShops()
        return shops.slice(0, limit || shops.length)
      },
      filter: async (filters, sort, limit) => {
        let shops = await api.getShops()
        if (filters?.category) {
          shops = shops.filter(s => s.category === filters.category)
        }
        return shops.slice(0, limit || shops.length)
      },
      get: async (id) => {
        return await api.getShop(id)
      },
      create: async (data) => {
        return data
      },
      update: async (id, data) => {
        return data
      }
    },
    Review: {
      list: async (sort, limit) => {
        return []
      },
      filter: async (filters, sort, limit) => {
        return []
      },
      create: async (data) => {
        return await api.submitReview(data)
      }
    },
    User: {
      list: async (sort, limit) => {
        const lb = await api.getLeaderboard()
        return lb.slice(0, limit || lb.length)
      },
      filter: async (filters) => {
        return []
      },
      me: async () => {
        return await api.me()
      },
      updateMyUserData: async (data) => {
        return data
      }
    },
    Comment: {
      list: async () => [],
      filter: async () => [],
      create: async (data) => data
    }
  }
}