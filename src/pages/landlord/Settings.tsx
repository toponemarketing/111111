import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { 
  CreditCardIcon,
  UserIcon,
  KeyIcon,
  BellIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface PaymentMethod {
  id: string
  method_type: 'stripe' | 'paypal' | 'venmo' | 'bank' | 'cash'
  is_enabled: boolean
  account_email: string | null
  account_username: string | null
  account_details: string | null
  instructions: string | null
}

const Settings = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Profile state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethod>>({
    stripe: {
      id: '',
      method_type: 'stripe',
      is_enabled: false,
      account_email: '',
      account_username: null,
      account_details: null,
      instructions: null
    },
    paypal: {
      id: '',
      method_type: 'paypal',
      is_enabled: false,
      account_email: '',
      account_username: null,
      account_details: null,
      instructions: null
    },
    venmo: {
      id: '',
      method_type: 'venmo',
      is_enabled: false,
      account_email: null,
      account_username: '',
      account_details: null,
      instructions: null
    },
    bank: {
      id: '',
      method_type: 'bank',
      is_enabled: false,
      account_email: null,
      account_username: null,
      account_details: '',
      instructions: null
    },
    cash: {
      id: '',
      method_type: 'cash',
      is_enabled: false,
      account_email: null,
      account_username: null,
      account_details: null,
      instructions: ''
    }
  })
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_rent_reminders: true,
    email_maintenance_updates: true,
    email_lease_notifications: true,
    sms_rent_reminders: false,
    sms_maintenance_updates: false,
    sms_lease_notifications: false
  })

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) throw profileError
      
      setProfileData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || ''
      })
      
      // Fetch payment methods
      const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('landlord_id', user.id)
      
      if (paymentMethodsError) throw paymentMethodsError
      
      // Update payment methods state with fetched data
      const updatedPaymentMethods = { ...paymentMethods }
      
      paymentMethodsData.forEach((method: PaymentMethod) => {
        updatedPaymentMethods[method.method_type] = method
      })
      
      setPaymentMethods(updatedPaymentMethods)
      
      // In a real app, we would fetch notification settings here
      // For this demo, we'll use the default values
    } catch (error: any) {
      toast.error(error.message || 'Error fetching user data')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (
    methodType: string,
    field: string,
    value: string | boolean
  ) => {
    setPaymentMethods(prev => ({
      ...prev,
      [methodType]: {
        ...prev[methodType],
        [field]: value
      }
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNotificationSettings(prev => ({ ...prev, [name]: checked }))
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone
        })
        .eq('id', user.id)
      
      if (error) throw error
      
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const savePaymentMethods = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setSaving(true)
    try {
      // For each payment method, either update or insert
      for (const methodType in paymentMethods) {
        const method = paymentMethods[methodType as keyof typeof paymentMethods]
        
        if (method.id) {
          // Update existing method
          const { error } = await supabase
            .from('payment_methods')
            .update({
              is_enabled: method.is_enabled,
              account_email: method.account_email,
              account_username: method.account_username,
              account_details: method.account_details,
              instructions: method.instructions
            })
            .eq('id', method.id)
          
          if (error) throw error
        } else {
          // Insert new method
          const { error } = await supabase
            .from('payment_methods')
            .insert({
              landlord_id: user.id,
              method_type: method.method_type,
              is_enabled: method.is_enabled,
              account_email: method.account_email,
              account_username: method.account_username,
              account_details: method.account_details,
              instructions: method.instructions
            })
          
          if (error) throw error
        }
      }
      
      toast.success('Payment methods updated successfully')
      fetchUserData() // Refresh data to get new IDs
    } catch (error: any) {
      toast.error(error.message || 'Error updating payment methods')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match')
      return
    }
    
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      })
      
      if (error) throw error
      
      toast.success('Password updated successfully')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (error: any) {
      toast.error(error.message || 'Error updating password')
    } finally {
      setSaving(false)
    }
  }

  const saveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, we would save notification settings to the database
    // For this demo, we'll just show a success message
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      toast.success('Notification settings updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating notification settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`
                py-4 px-6 text-center border-b-2 font-medium text-sm
                ${activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setActiveTab('profile')}
            >
              <UserIcon className="h-5 w-5 inline mr-2" />
              Profile
            </button>
            <button
              className={`
                py-4 px-6 text-center border-b-2 font-medium text-sm
                ${activeTab === 'payment'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setActiveTab('payment')}
            >
              <CreditCardIcon className="h-5 w-5 inline mr-2" />
              Payment Methods
            </button>
            <button
              className={`
                py-4 px-6 text-center border-b-2 font-medium text-sm
                ${activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setActiveTab('password')}
            >
              <KeyIcon className="h-5 w-5 inline mr-2" />
              Password
            </button>
            <button
              className={`
                py-4 px-6 text-center border-b-2 font-medium text-sm
                ${activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setActiveTab('notifications')}
            >
              <BellIcon className="h-5 w-5 inline mr-2" />
              Notifications
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first_name" className="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      className="form-input"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      className="form-input"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="form-input bg-gray-50"
                    value={profileData.email}
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Payment Methods */}
          {activeTab === 'payment' && (
            <form onSubmit={savePaymentMethods}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure how you want to receive payments from tenants.
                  </p>
                </div>

                {/* Stripe */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Credit Card (Stripe)</h4>
                        <p className="text-sm text-gray-500">Accept credit/debit card payments</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm text-gray-500">Enable</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={paymentMethods.stripe.is_enabled}
                          onChange={(e) => handlePaymentMethodChange('stripe', 'is_enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentMethods.stripe.is_enabled && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="stripe_email" className="form-label">
                          Stripe Account Email
                        </label>
                        <input
                          type="email"
                          id="stripe_email"
                          className="form-input"
                          value={paymentMethods.stripe.account_email || ''}
                          onChange={(e) => handlePaymentMethodChange('stripe', 'account_email', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-base font-medium text-gray-900">PayPal</h4>
                        <p className="text-sm text-gray-500">Accept payments via PayPal</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm text-gray-500">Enable</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={paymentMethods.paypal.is_enabled}
                          onChange={(e) => handlePaymentMethodChange('paypal', 'is_enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentMethods.paypal.is_enabled && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="paypal_email" className="form-label">
                          PayPal Email
                        </label>
                        <input
                          type="email"
                          id="paypal_email"
                          className="form-input"
                          value={paymentMethods.paypal.account_email || ''}
                          onChange={(e) => handlePaymentMethodChange('paypal', 'account_email', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Venmo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Venmo</h4>
                        <p className="text-sm text-gray-500">Accept payments via Venmo</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm text-gray-500">Enable</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={paymentMethods.venmo.is_enabled}
                          onChange={(e) => handlePaymentMethodChange('venmo', 'is_enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentMethods.venmo.is_enabled && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="venmo_username" className="form-label">
                          Venmo Username
                        </label>
                        <input
                          type="text"
                          id="venmo_username"
                          className="form-input"
                          value={paymentMethods.venmo.account_username || ''}
                          onChange={(e) => handlePaymentMethodChange('venmo', 'account_username', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bank Transfer */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Bank Transfer</h4>
                        <p className="text-sm text-gray-500">Accept direct bank transfers</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm text-gray-500">Enable</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={paymentMethods.bank.is_enabled}
                          onChange={(e) => handlePaymentMethodChange('bank', 'is_enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentMethods.bank.is_enabled && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="bank_details" className="form-label">
                          Bank Account Details
                        </label>
                        <textarea
                          id="bank_details"
                          rows={3}
                          className="form-input"
                          placeholder="Bank name, account number, routing number, etc."
                          value={paymentMethods.bank.account_details || ''}
                          onChange={(e) => handlePaymentMethodChange('bank', 'account_details', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Cash</h4>
                        <p className="text-sm text-gray-500">Accept cash payments</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm text-gray-500">Enable</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={paymentMethods.cash.is_enabled}
                          onChange={(e) => handlePaymentMethodChange('cash', 'is_enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentMethods.cash.is_enabled && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="cash_instructions" className="form-label">
                          Cash Payment Instructions
                        </label>
                        <textarea
                          id="cash_instructions"
                          rows={3}
                          className="form-input"
                          placeholder="Instructions for tenants on how to pay in cash"
                          value={paymentMethods.cash.instructions || ''}
                          onChange={(e) => handlePaymentMethodChange('cash', 'instructions', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Password Settings */}
          {activeTab === 'password' && (
            <form onSubmit={changePassword}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure.
                  </p>
                </div>

                <div>
                  <label htmlFor="current_password" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    id="current_password"
                    className="form-input"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="new_password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    className="form-input"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label htmlFor="confirm_password" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    className="form-input"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <form onSubmit={saveNotificationSettings}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure how and when you receive notifications.
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_rent_reminders"
                          name="email_rent_reminders"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={notificationSettings.email_rent_reminders}
                          onChange={handleNotificationChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_rent_reminders" className="font-medium text-gray-700">
                          Rent Reminders
                        </label>
                        <p className="text-gray-500">Receive email notifications about upcoming and overdue rent payments.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_maintenance_updates"
                          name="email_maintenance_updates"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={notificationSettings.email_maintenance_updates}
                          onChange={handleNotificationChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_maintenance_updates" className="font-medium text-gray-700">
                          Maintenance Updates
                        </label>
                        <p className="text-gray-500">Receive email notifications about maintenance request updates.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_lease_notifications"
                          name="email_lease_notifications"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={notificationSettings.email_lease_notifications}
                          onChange={handleNotificationChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_lease_notifications" className="font-medium text-gray-700">
                          Lease Notifications
                        </label>
                        <p className="text-gray-500">Receive email notifications about lease expirations and renewals.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">SMS Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms_rent_reminders"
                          name="sms_rent_reminders"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={notificationSettings.sms_rent_reminders}
                          onChange={handleNotificationChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms_rent_reminders" className="font-medium text-gray-700">
                          Rent Reminders
                        </label>
                        <p className="text-gray-500">Receive SMS notifications about upcoming and overdue rent payments.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms_maintenance_updates"
                          name="sms_maintenance_updates"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={notificationSettings.sms_maintenance_updates}
                          onChange={handleNotificationChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms_maintenance_updates" className="font-medium text-gray-700">
                          Maintenance Updates
                        </label>
                        <p className="text-gray-500">Receive SMS notifications about maintenance request updates.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms_lease_notifications"
                          name="sms_lease_notifications"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={notificationSettings.sms_lease_notifications}
                          onChange={handleNotificationChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms_lease_notifications" className="font-medium text-gray-700">
                          Lease Notifications
                        </label>
                        <p className="text-gray-500">Receive SMS notifications about lease expirations and renewals.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
