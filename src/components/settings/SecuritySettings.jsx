import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

const SecuritySettings = ({ showPassword, setShowPassword }) => (
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

export default SecuritySettings
