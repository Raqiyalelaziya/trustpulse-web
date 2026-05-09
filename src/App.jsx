import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import SearchPage from './pages/SearchPage'
import ShopDetail from './pages/ShopDetail'
import AddReview from './pages/AddReview'
import AddShop from './pages/AddShop'
import Admin from './pages/Admin'
import CompareShops from './pages/CompareShops'
import Contact from './pages/Contact'
import SelectAccountType from './pages/SelectAccountType'
import Onboarding from './pages/Onboarding'
import ShopOwnerDashboard from './pages/ShopOwnerDashboard'
import ShopOwnerLogin from './pages/ShopOwnerLogin'
import Dashboard from './pages/Dashboard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/search" element={<Layout><SearchPage /></Layout>} />
          <Route path="/shops/:id" element={<Layout><ShopDetail /></Layout>} />
          <Route path="/add-review" element={<Layout><AddReview /></Layout>} />
          <Route path="/add-shop" element={<Layout><AddShop /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/compare" element={<Layout><CompareShops /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/select-account-type" element={<SelectAccountType />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/shop-owner-login" element={<ShopOwnerLogin />} />
          <Route path="/shop-owner-dashboard" element={<Layout><ShopOwnerDashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
