import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { DollarSign, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

interface RegisterForm {
  businessName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  agreeToTerms: boolean
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            business_name: data.businessName,
            phone: data.phone
          }
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Create business profile
        const { error: businessError } = await supabase
          .from('businesses')
          .insert({
            id: authData.user.id,
            name: data.businessName,
            email: data.email,
            phone: data.phone,
            referral_rate: 5.0, // Default 5%
            auto_approve_days: 7,
            minimum_payout: 25.0
          })

        if (businessError) {
          console.error('Error creating business profile:', businessError)
        }

        setSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card">
            <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created!
            </h2>
            <p className="text-gray-600 mb-4">
              Welcome to ReferralPay! Redirecting you to your dashboard...
            </p>
            <LoadingSpinner className="mx-auto" />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <DollarSign className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">ReferralPay</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Start your free trial
          </h2>
          <p className="text-gray-600">
            Create your account and start rewarding referrals today
          </p>
        </div>

        <div className="card">
          {error && (
            <motion.div
              className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="h-5 w-5 text-error-600" />
              <span className="text-error-700 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                {...register('businessName', {
                  required: 'Business name is required',
                  minLength: {
                    value: 2,
                    message: 'Business name must be at least 2 characters'
                  }
                })}
                type="text"
                className="input"
                placeholder="Enter your business name"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-error-600">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="input"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="input"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
                id="agreeToTerms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-error-600">{errors.agreeToTerms.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
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
      </motion.div>
    </div>
  )
}

export default RegisterPage
