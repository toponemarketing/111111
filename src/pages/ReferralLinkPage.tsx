import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Gift, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

interface ReferralForm {
  name: string
  email: string
  phone: string
  address: string
  serviceNeeded: string
  message?: string
}

const ReferralLinkPage = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [referralData, setReferralData] = useState<any>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ReferralForm>()

  useEffect(() => {
    loadReferralData()
  }, [code])

  const loadReferralData = async () => {
    // Mock referral data lookup
    setTimeout(() => {
      if (code === 'REF-ABC123' || code === 'REF-SARAH123') {
        setReferralData({
          code,
          business_name: 'Elite Cleaning Services',
          business_logo: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
          referrer_name: 'Sarah Johnson',
          reward_rate: 5.0,
          services: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Move-in/Move-out Cleaning'],
          valid: true,
          expired: false
        })
      } else {
        setError('Invalid or expired referral link')
      }
      setLoading(false)
    }, 1000)
  }

  const onSubmit = async (data: ReferralForm) => {
    setSubmitting(true)
    setError('')

    try {
      // Mock form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, this would create a lead in the system
      console.log('Referral form submitted:', { ...data, referral_code: code })
      
      setSuccess(true)
    } catch (err) {
      setError('Failed to submit your information. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error && !referralData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="card">
            <AlertCircle className="h-16 w-16 text-error-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Referral Link
            </h2>
            <p className="text-gray-600 mb-6">
              This referral link is invalid or has expired. Please contact the person who shared it with you.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Go to Homepage
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="card">
            <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-4">
              Your information has been submitted successfully. {referralData.business_name} will contact you soon to schedule your service.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Thanks to {referralData.referrer_name}'s referral, you'll both earn rewards when your service is completed!
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Learn More About ReferralPay
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gift className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600">ReferralPay</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You've Been Referred!
          </h1>
          <p className="text-gray-600">
            {referralData.referrer_name} recommended {referralData.business_name} to you
          </p>
        </motion.div>

        {/* Business Info */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={referralData.business_logo}
              alt={referralData.business_name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {referralData.business_name}
              </h2>
              <p className="text-gray-600">
                Referred by {referralData.referrer_name}
              </p>
            </div>
          </div>
          
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-success-600" />
              <span className="text-success-800 font-medium">
                Special Referral Bonus: Both you and {referralData.referrer_name} will earn rewards when your service is completed!
              </span>
            </div>
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Available</h3>
          <div className="grid grid-cols-2 gap-3">
            {referralData.services.map((service: string, index: number) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-center text-sm font-medium text-gray-700"
              >
                {service}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Get Your Free Quote
          </h3>
          
          {error && (
            <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-error-600" />
              <span className="text-error-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="input"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  type="tel"
                  className="input"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Needed
                </label>
                <select
                  {...register('serviceNeeded', { required: 'Please select a service' })}
                  className="input"
                >
                  <option value="">Select a service</option>
                  {referralData.services.map((service: string, index: number) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
                {errors.serviceNeeded && (
                  <p className="mt-1 text-sm text-error-600">{errors.serviceNeeded.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Service Address
              </label>
              <input
                {...register('address', { required: 'Address is required' })}
                type="text"
                className="input"
                placeholder="Enter the address where service is needed"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                {...register('message')}
                rows={3}
                className="input"
                placeholder="Tell us more about what you need..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center"
            >
              {submitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {submitting ? 'Submitting...' : 'Get My Free Quote'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By submitting this form, you agree to be contacted by {referralData.business_name} 
              regarding your service request.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ReferralLinkPage
