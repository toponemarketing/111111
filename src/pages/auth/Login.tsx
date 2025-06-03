import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../stores/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      // Navigation will happen automatically via the auth state listener in App.tsx
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  // Test bypass function - for development only
  const bypassLogin = (role: 'landlord' | 'tenant') => {
    // Create a mock user for testing
    const mockUser = {
      id: 'test-user-id',
      email: email || 'test@example.com',
      role: role,
      profile: {
        id: 'test-user-id',
        first_name: role === 'landlord' ? 'Test Landlord' : 'Test Tenant',
        last_name: 'User',
        email: email || 'test@example.com',
        phone: '555-123-4567',
        role: role,
        created_at: new Date().toISOString()
      }
    } as any;
    
    // Set the mock user in the auth store
    setUser(mockUser);
    
    // Navigate to the appropriate dashboard
    navigate(role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
    
    toast.success(`Logged in as test ${role}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
      
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      {/* Test bypass buttons - for development only */}
      <div className="mt-4 space-y-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Test Access (Dev Only)</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => bypassLogin('landlord')}
            className="btn btn-secondary text-sm"
            type="button"
          >
            Test as Landlord
          </button>
          <button
            onClick={() => bypassLogin('tenant')}
            className="btn btn-secondary text-sm"
            type="button"
          >
            Test as Tenant
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
