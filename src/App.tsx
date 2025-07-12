import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ReferralsPage from './pages/ReferralsPage'
import SettingsPage from './pages/SettingsPage'
import ClientDashboard from './pages/ClientDashboard'
import ReferralLinkPage from './pages/ReferralLinkPage'

// Components
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/referral/:code" element={<ReferralLinkPage />} />
      <Route path="/client/:clientId" element={<ClientDashboard />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        user ? (
          <Layout>
            <DashboardPage />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/referrals" element={
        user ? (
          <Layout>
            <ReferralsPage />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/settings" element={
        user ? (
          <Layout>
            <SettingsPage />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
