import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  Receipt, 
  BarChart3, 
  Settings,
  Wrench
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Quotes', href: '/quotes', icon: FileText },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-white shadow-sm">
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <div className="flex items-center space-x-2">
          <Wrench className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">ServicePro</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
