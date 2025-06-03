import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<'landlord' | 'tenant'>('landlord')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create the user profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role,
          })

        if (profileError) throw profileError

        toast.success('Registration successful! Please check your email for verification.')
        navigate('/login')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
      
      <form className="space-y-6" onSubmit={handleRegister}>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="form-label">
              First name
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              required
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="last-name" className="form-label">
              Last name
            </label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              autoComplete="family-name"
              required
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

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
            autoComplete="new-password"
            required
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <label className="form-label">I am a</label>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <div
              className={`
                border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium cursor-pointer
                ${role === 'landlord'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              `}
              onClick={() => setRole('landlord')}
            >
              Landlord
            </div>
            <div
              className={`
                border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium cursor-pointer
                ${role === 'tenant'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              `}
              onClick={() => setRole('tenant')}
            >
              Tenant
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
