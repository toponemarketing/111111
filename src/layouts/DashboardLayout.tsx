import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  CreditCardIcon, 
  WrenchScrewdriverIcon, 
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

interface DashboardLayoutProps {
  userRole: 'landlord' | 'tenant'
}

const DashboardLayout = ({ userRole }: DashboardLayoutProps) => {
  const { user, clearUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const landlordNavigation = [
    { name: 'Dashboard', href: '/landlord/dashboard', icon: HomeIcon },
    { name: 'Properties', href: '/landlord/properties', icon: BuildingOfficeIcon },
    { name: 'Tenants', href: '/landlord/tenants', icon: UsersIcon },
    { name: 'Payments', href: '/landlord/payments', icon: CreditCardIcon },
    { name: 'Maintenance', href: '/landlord/maintenance', icon: WrenchScrewdriverIcon },
    { name: 'Settings', href: '/landlord/settings', icon: Cog6ToothIcon },
  ]

  const tenantNavigation = [
    { name: 'Dashboard', href: '/tenant/dashboard', icon: HomeIcon },
    { name: 'Payments', href: '/tenant/payments', icon: CreditCardIcon },
    { name: 'Maintenance', href: '/tenant/maintenance', icon: WrenchScrewdriverIcon },
    { name: 'Settings', href: '/tenant/settings', icon: Cog6ToothIcon },
  ]

  const navigation = userRole === 'landlord' ? landlordNavigation : tenantNavigation

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    clearUser()
    navigate('/login')
  }

  return (
    <div className="h-full">
      {/* Mobile sidebar */}
      <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-700">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32px" height="32px">
                  <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                </svg>
                <span className="ml-2 text-white text-xl font-bold">PropertyPro</span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-base font-medium rounded-md
                    ${location.pathname === item.href
                      ? 'bg-primary-800 text-white'
                      : 'text-white hover:bg-primary-600'}
                  `}
                >
                  <item.icon className="mr-4 h-6 w-6 text-primary-200" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                    {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">
                    {user?.profile?.first_name
                      ? `${user.profile.first_name} ${user.profile.last_name || ''}`
                      : user?.email}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-primary-200 hover:text-white flex items-center mt-1"
                  >
                    <ArrowRightOnRectangleIcon className="mr-1 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-primary-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32px" height="32px">
                  <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                </svg>
                <span className="ml-2 text-white text-xl font-bold">PropertyPro</span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${location.pathname === item.href
                      ? 'bg-primary-800 text-white'
                      : 'text-white hover:bg-primary-600'}
                  `}
                >
                  <item.icon className="mr-3 h-6 w-6 text-primary-200" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                    {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.profile?.first_name
                      ? `${user.profile.first_name} ${user.profile.last_name || ''}`
                      : user?.email}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-medium text-primary-200 hover:text-white flex items-center mt-1"
                  >
                    <ArrowRightOnRectangleIcon className="mr-1 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col h-full">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 h-full">
          <div className="py-6 h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
