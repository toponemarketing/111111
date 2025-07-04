import React from 'react'

const AppearanceSettings = () => (
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
    
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Color Scheme</h4>
      <div className="flex space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-600 cursor-pointer"></div>
        <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-transparent cursor-pointer"></div>
        <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-transparent cursor-pointer"></div>
        <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-transparent cursor-pointer"></div>
      </div>
    </div>
  </div>
)

export default AppearanceSettings
