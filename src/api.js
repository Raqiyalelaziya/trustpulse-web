const API = "https://trustpulse-api.onrender.com";

const getToken = () => localStorage.getItem("trustpulse_token") || "";

export async function apiCall(path, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (!res.ok) throw await res.json();
  return res.json();
}

export const api = {
  login: (email, password) => apiCall("/auth/login", "POST", { email, password }),
  signup: (data) => apiCall("/auth/signup", "POST", data),
  me: () => apiCall("/auth/me"),
  getShops: () => apiCall("/shops"),
  getShop: (id) => apiCall(`/shops/${id}`),
  searchShops: (search) => apiCall(`/shops?search=${search}`),
  getShopsByCategory: (cat) => apiCall(`/shops?category=${cat}`),
  submitReview: (data) => apiCall("/reviews", "POST", data),
  getTrustBreakdown: (id) => apiCall(`/trust/shop/${id}`),
  getLeaderboard: () => apiCall("/leaderboard"),
  submitComplaint: (data) => apiCall("/complaints", "POST", data),
};