import React, { useState } from 'react'
import { 
  User, 
  Building, 
  Bell, 
  CreditCard, 
  Shield, 
  Palette,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ]

  const ProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-500">Update your personal details and contact information.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" className="mt-1 input-field" defaultValue="John" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" className="mt-1 input-field" defaultValue="Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 input-field" defaultValue="john.doe@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="tel" className="mt-1 input-field" defaultValue="(555) 123-4567" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <button className="btn-secondary">Change Photo</button>
        </div>
      </div>
    </div>
  )

  const BusinessSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
        <p className="text-sm text-gray-500">Manage your business details and preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input type="text" className="mt-1 input-field" defaultValue="ServicePro Solutions" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Type</label>
          <select className="mt-1 input-field">
            <option>Home Services</option>
            <option>Cleaning Services</option>
            <option>Landscaping</option>
            <option>Maintenance</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input type="text" className="mt-1 input-field" defaultValue="12-3456789" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Business Address</label>
          <input type="text" className="mt-1 input-field" defaultValue="123 Business St, City, State 12345" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Phone</label>
          <input type="tel" className="mt-1 input-field" defaultValue="(555) 987-6543" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Email</label>
          <input type="email" className="mt-1 input-field" defaultValue="info@servicepro.com" />
        </div>
      </div>
    </div>
  )

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-500">Choose how you want to be notified about important events.</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">New Job Alerts</h4>
            <p className="text-sm text-gray-500">Get notified when new jobs are created</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Payment Reminders</h4>
            <p className="text-sm text-gray-500">Reminders for overdue invoices</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Schedule Changes</h4>
            <p className="text-sm text-gray-500">Notifications for appointment changes</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" />
        </div>
      </div>
    </div>
  )

  const BillingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Billing & Subscription</h3>
        <p className="text-sm text-gray-500">Manage your subscription and payment methods.</p>
      </div>
      
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-primary-900">Pro Plan</h4>
            <p className="text-sm text-primary-700">$29/month • Billed monthly</p>
          </div>
          <button className="btn-secondary">Change Plan</button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h4>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="btn-secondary">Update</button>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Billing History</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Jan 2024</span>
            <span className="text-sm font-medium text-gray-900">$29.00</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Dec 2023</span>
            <span className="text-sm font-medium text-gray-900">$29.00</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Nov 2023</span>
            <span className="text-sm font-medium text-gray-900">$29.00</span>
          </div>
        </div>
      </div>
    </div>
  )

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="text-sm text-gray-500">Manage your account security and privacy.</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Change Password</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <div className="mt-1 relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-field pr-10" 
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" className="mt-1 input-field" />
          </div>
          <button className="btn-primary">Update Password</button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button className="btn-secondary">Enable</button>
        </div>
      </div>
    </div>
  )

  const AppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
        <p className="text-sm text-gray-500">Customize how the application looks and feels.</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Theme</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300">
            <div className="w-full h-20 bg-white border border-gray-200 rounded mb-3"></div>
            <p className="text-sm font-medium text-gray-900">Light</p>
            <p className="text-xs text-gray-500">Clean and bright interface</p>
          </div>
          <div className="border border-primary-300 bg-primary-50 rounded-lg p-4 cursor-pointer">
            <div className="w-full h-20 bg-gray-800 rounded mb-3"></div>
            <p className="text-sm font-medium text-gray-900">Dark</p>
            <p className="text-xs text-gray-500">Easy on the eyes</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-300">
            <div className="w-full h-20 bg-gradient-to-br from-white to-gray-800 rounded mb-3"></div>
            <p className="text-sm font-medium text-gray-900">Auto</p>
            <p className="text-xs text-gray-500">Matches system preference</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Color Scheme</h4>
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full cursor-pointer ring-2 ring-blue-600 ring-offset-2"></div>
          <div className="w-8 h-8 bg-green-600 rounded-full cursor-pointer hover:ring-2 hover:ring-green-600 hover:ring-offset-2"></div>
          <div className="w-8 h-8 bg-purple-600 rounded-full cursor-pointer hover:ring-2 hover:ring-purple-600 hover:ring-offset-2"></div>
          <div className="w-8 h-8 bg-red-600 rounded-full cursor-pointer hover:ring-2 hover:ring-red-600 hover:ring-offset-2"></div>
          <div className="w-8 h-8 bg-orange-600 rounded-full cursor-pointer hover:ring-2 hover:ring-orange-600 hover:ring-offset-2"></div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />
      case 'business':
        return <BusinessSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'billing':
        return <BillingSettings />
      case 'security':
        return <SecuritySettings />
      case 'appearance':
        return <AppearanceSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button className="btn-primary flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
