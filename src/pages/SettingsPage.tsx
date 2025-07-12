import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  CreditCard, 
  Settings as SettingsIcon, 
  Bell,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import LoadingSpinner from '../components/LoadingSpinner'

interface BusinessSettingsForm {
  name: string
  email: string
  phone: string
  referral_rate: number
  auto_approve_days: number
  minimum_payout: number
  primary_color: string
}

const SettingsPage = () => {
  const { user } = useAuthStore()
  const { business, setBusiness } = useBusinessStore()
  const [activeTab, setActiveTab] = useState('business')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BusinessSettingsForm>()

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        email: business.email,
        phone: business.phone || '',
        referral_rate: business.referral_rate,
        auto_approve_days: business.auto_approve_days,
        minimum_payout: business.minimum_payout,
        primary_color: business.primary_color || '#0ea5e9'
      })
    }
  }, [business, reset])

  const onSubmitBusinessSettings = async (data: BusinessSettingsForm) => {
    setLoading(true)
    setSuccess('')

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          referral_rate: data.referral_rate,
          auto_approve_days: data.auto_approve_days,
          minimum_payout: data.minimum_payout,
          primary_color: data.primary_color,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) throw error

      setBusiness({ ...business!, ...data })
      setSuccess('Settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectJobber = () => {
    const clientId = import.meta.env.VITE_JOBBER_CLIENT_ID
    const redirectUri = `${import.meta.env.VITE_APP_URL}/auth/jobber/callback`
    const state = user?.id || ''
    
    const authUrl = `https://api.getjobber.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clients:read jobs:read invoices:read&state=${state}`
    
    window.location.href = authUrl
  }

  const handleConnectStripe = () => {
    // This would redirect to Stripe Connect
    console.log('Connecting to Stripe...')
  }

  const tabs = [
    { id: 'business', name: 'Business', icon: Building2 },
    { id: 'integrations', name: 'Integrations', icon: ExternalLink },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and referral program settings.</p>
      </div>

      {success && (
        <motion.div
          className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center space-x-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="h-5 w-5 text-success-600" />
          <span className="text-success-700 text-sm">{success}</span>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'business' && (
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h3>
              <form onSubmit={handleSubmit(onSubmitBusinessSettings)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      {...register('name', { required: 'Business name is required' })}
                      type="text"
                      className="input"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Rate (%)
                    </label>
                    <input
                      {...register('referral_rate', { 
                        required: 'Referral rate is required',
                        min: { value: 0.1, message: 'Minimum rate is 0.1%' },
                        max: { value: 50, message: 'Maximum rate is 50%' }
                      })}
                      type="number"
                      step="0.1"
                      className="input"
                    />
                    {errors.referral_rate && (
                      <p className="mt-1 text-sm text-error-600">{errors.referral_rate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auto-approve Days
                    </label>
                    <input
                      {...register('auto_approve_days', { 
                        required: 'Auto-approve days is required',
                        min: { value: 1, message: 'Minimum is 1 day' }
                      })}
                      type="number"
                      className="input"
                    />
                    {errors.auto_approve_days && (
                      <p className="mt-1 text-sm text-error-600">{errors.auto_approve_days.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Payout ($)
                    </label>
                    <input
                      {...register('minimum_payout', { 
                        required: 'Minimum payout is required',
                        min: { value: 1, message: 'Minimum is $1' }
                      })}
                      type="number"
                      step="0.01"
                      className="input"
                    />
                    {errors.minimum_payout && (
                      <p className="mt-1 text-sm text-error-600">{errors.minimum_payout.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Color
                  </label>
                  <input
                    {...register('primary_color')}
                    type="color"
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Jobber Integration */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Jobber</h3>
                      <p className="text-gray-600">Connect your Jobber account to sync clients and jobs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {business?.jobber_connected ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-success-600" />
                        <span className="text-success-600 font-medium">Connected</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectJobber}
                        className="btn-primary"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Stripe Integration */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Stripe</h3>
                      <p className="text-gray-600">Connect Stripe to process referral payouts</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {business?.stripe_connected ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-success-600" />
                        <span className="text-success-600 font-medium">Connected</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectStripe}
                        className="btn-primary"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Payout Settings */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Automatic Payouts</h4>
                      <p className="text-sm text-gray-600">Automatically process payouts when conditions are met</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                {[
                  {
                    title: 'New Referrals',
                    description: 'Get notified when someone uses a referral link',
                    email: true,
                    push: true
                  },
                  {
                    title: 'Completed Jobs',
                    description: 'Get notified when referred jobs are completed',
                    email: true,
                    push: false
                  },
                  {
                    title: 'Payout Processed',
                    description: 'Get notified when payouts are processed',
                    email: true,
                    push: true
                  },
                  {
                    title: 'Weekly Summary',
                    description: 'Receive weekly referral performance summaries',
                    email: false,
                    push: false
                  }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={notification.email}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={notification.push}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-secondary">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                    <button className="btn-secondary">
                      Change Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">API Keys</h4>
                      <p className="text-sm text-gray-600">Manage API keys for integrations</p>
                    </div>
                    <button className="btn-secondary">
                      Manage Keys
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
