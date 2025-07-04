import React, { useState } from 'react'
import { 
  User, 
  Building, 
  Bell, 
  CreditCard, 
  Shield, 
  Palette,
  Save
} from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex">
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="flex-1 p-8">
              {activeTab === 'profile' && (
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
                </div>
              )}

              {activeTab === 'business' && (
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
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
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
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
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
                </div>
              )}

              {activeTab === 'security' && (
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
                        <input type="password" className="mt-1 input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" className="mt-1 input-field" />
                      </div>
                      <button className="btn-primary">Update Password</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
                    <p className="text-sm text-gray-500">Customize how ServicePro looks and feels.</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Theme</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border-2 border-primary-500 rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-white border border-gray-200 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gray-800 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button className="btn-secondary">Cancel</button>
                  <button className="btn-primary flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
