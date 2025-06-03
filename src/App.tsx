import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/authStore'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import LandlordDashboard from './pages/landlord/Dashboard'
import Properties from './pages/landlord/Properties'
import PropertyDetail from './pages/landlord/PropertyDetail'
import UnitDetail from './pages/landlord/UnitDetail'
import Tenants from './pages/landlord/Tenants'
import TenantDetail from './pages/landlord/TenantDetail'
import Payments from './pages/landlord/Payments'
import Maintenance from './pages/landlord/Maintenance'
import MaintenanceDetail from './pages/landlord/MaintenanceDetail'
import Settings from './pages/landlord/Settings'
import TenantDashboard from './pages/tenant/Dashboard'
import TenantPayments from './pages/tenant/Payments'
import TenantMaintenance from './pages/tenant/Maintenance'
import TenantMaintenanceDetail from './pages/tenant/MaintenanceDetail'
import TenantSettings from './pages/tenant/Settings'
import NotFound from './pages/NotFound'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const { user, setUser, clearUser, useSampleData } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're using sample data (already set in authStore.ts)
    if (useSampleData) {
      console.log('App: Using sample data, skipping auth check')
      setLoading(false)
      return
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user profile data including role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser({
            ...session.user,
            role: profile?.role || 'tenant',
            profile: profile || null
          })
        } else {
          clearUser()
        }
        setLoading(false)
      }
    )

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user profile data including role
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              ...session.user,
              role: profile?.role || 'tenant',
              profile: profile || null
            })
          })
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [setUser, clearUser, useSampleData])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Landlord Routes */}
      <Route
        element={
          <ProtectedRoute
            isAllowed={!!user && user.role === 'landlord'}
            redirectPath="/login"
          >
            <DashboardLayout userRole="landlord" />
          </ProtectedRoute>
        }
      >
        <Route path="/landlord" element={<Navigate to="/landlord/dashboard" replace />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/landlord/properties" element={<Properties />} />
        <Route path="/landlord/properties/:id" element={<PropertyDetail />} />
        <Route path="/landlord/units/:id" element={<UnitDetail />} />
        <Route path="/landlord/tenants" element={<Tenants />} />
        <Route path="/landlord/tenants/:id" element={<TenantDetail />} />
        <Route path="/landlord/payments" element={<Payments />} />
        <Route path="/landlord/maintenance" element={<Maintenance />} />
        <Route path="/landlord/maintenance/:id" element={<MaintenanceDetail />} />
        <Route path="/landlord/settings" element={<Settings />} />
      </Route>

      {/* Tenant Routes */}
      <Route
        element={
          <ProtectedRoute
            isAllowed={!!user && user.role === 'tenant'}
            redirectPath="/login"
          >
            <DashboardLayout userRole="tenant" />
          </ProtectedRoute>
        }
      >
        <Route path="/tenant" element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/payments" element={<TenantPayments />} />
        <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
        <Route path="/tenant/maintenance/:id" element={<TenantMaintenanceDetail />} />
        <Route path="/tenant/settings" element={<TenantSettings />} />
      </Route>

      {/* Redirect based on role */}
      <Route
        path="/"
        element={
          user ? (
            user.role === 'landlord' ? (
              <Navigate to="/landlord/dashboard" replace />
            ) : (
              <Navigate to="/tenant/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

interface ProtectedRouteProps {
  isAllowed: boolean
  redirectPath: string
  children: React.ReactNode
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath,
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default App
