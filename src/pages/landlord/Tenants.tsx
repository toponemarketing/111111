import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { 
  PlusIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  HomeIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

// Sample tenants data
const SAMPLE_TENANTS = [
  {
    id: '00000000-0000-0000-0000-000000000003',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@example.com',
    phone: '555-111-2222',
    avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000301',
      unit_id: '00000000-0000-0000-0000-000000000201',
      start_date: '2023-01-01',
      end_date: '2024-01-01',
      rent_amount: 1200
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000201',
      unit_number: '101',
      property_id: '00000000-0000-0000-0000-000000000101'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@example.com',
    phone: '555-333-4444',
    avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000302',
      unit_id: '00000000-0000-0000-0000-000000000202',
      start_date: '2023-02-15',
      end_date: '2024-02-15',
      rent_amount: 1800
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000202',
      unit_number: '102',
      property_id: '00000000-0000-0000-0000-000000000101'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '555-555-6666',
    avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000303',
      unit_id: '00000000-0000-0000-0000-000000000204',
      start_date: '2023-03-01',
      end_date: '2024-03-01',
      rent_amount: 2500
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000204',
      unit_number: '201',
      property_id: '00000000-0000-0000-0000-000000000102'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Riverside Condos'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    first_name: 'Jessica',
    last_name: 'Martinez',
    email: 'jessica.martinez@example.com',
    phone: '555-777-8888',
    avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000304',
      unit_id: '00000000-0000-0000-0000-000000000205',
      start_date: '2023-04-15',
      end_date: '2024-04-15',
      rent_amount: 2200
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000205',
      unit_number: '202',
      property_id: '00000000-0000-0000-0000-000000000102'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Riverside Condos'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    first_name: 'Robert',
    last_name: 'Anderson',
    email: 'robert.anderson@example.com',
    phone: '555-999-0000',
    avatar_url: 'https://randomuser.me/api/portraits/men/4.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000305',
      unit_id: '00000000-0000-0000-0000-000000000206',
      start_date: '2023-05-01',
      end_date: '2024-05-01',
      rent_amount: 3000
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000206',
      unit_number: '301',
      property_id: '00000000-0000-0000-0000-000000000103'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Mountain View Homes'
    }
  }
];

interface Tenant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  lease?: {
    id: string
    unit_id: string
    start_date: string
    end_date: string
    rent_amount: number
  }
  unit?: {
    id: string
    unit_number: string
    property_id: string
  }
  property?: {
    id: string
    name: string
  }
}

const Tenants = () => {
  const { user, useSampleData, setUseSampleData } = useAuthStore()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)

  useEffect(() => {
    console.log('Tenants component mounted, user:', user?.id)
    console.log('useSampleData flag:', useSampleData)
    
    // Check if we should use sample data
    const shouldUseDevData = import.meta.env.DEV && 
      (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
    
    console.log('Should use sample data (env check):', shouldUseDevData)
    
    if (shouldUseDevData || useSampleData) {
      console.log('Using sample tenant data')
      setUseSampleData(true)
      setTenants(SAMPLE_TENANTS)
      setLoading(false)
    } else {
      fetchTenants()
    }
  }, [user, useSampleData])

  const fetchTenants = async () => {
    if (!user) {
      console.log('No user found, cannot fetch tenants')
      return
    }
    
    setLoading(true)
    try {
      console.log('Fetching tenants for landlord:', user.id)
      
      // First, get all properties owned by this landlord
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('landlord_id', user.id)
      
      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError)
        throw propertiesError
      }
      
      console.log('Fetched properties:', properties)
      
      // Safely handle the case where properties might be null or undefined
      const safeProperties = Array.isArray(properties) ? properties : []
      
      if (safeProperties.length === 0) {
        console.log('No properties found for this landlord')
        setTenants([])
        setLoading(false)
        return
      }
      
      const propertyIds = safeProperties.map(p => p.id)
      
      // Get all units in these properties
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id, unit_number, property_id')
        .in('property_id', propertyIds)
      
      if (unitsError) {
        console.error('Error fetching units:', unitsError)
        throw unitsError
      }
      
      console.log('Fetched units:', units)
      
      // Safely handle the case where units might be null or undefined
      const safeUnits = Array.isArray(units) ? units : []
      
      if (safeUnits.length === 0) {
        console.log('No units found for these properties')
        setTenants([])
        setLoading(false)
        return
      }
      
      const unitIds = safeUnits.map(u => u.id)
      
      // Get all active leases for these units
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select('id, unit_id, tenant_id, start_date, end_date, rent_amount')
        .in('unit_id', unitIds)
        .eq('status', 'active')
      
      if (leasesError) {
        console.error('Error fetching leases:', leasesError)
        throw leasesError
      }
      
      console.log('Fetched leases:', leases)
      
      // Safely handle the case where leases might be null or undefined
      const safeLeases = Array.isArray(leases) ? leases : []
      
      if (safeLeases.length === 0) {
        console.log('No active leases found')
        setTenants([])
        setLoading(false)
        return
      }
      
      const tenantIds = [...new Set(safeLeases.map(l => l.tenant_id).filter(Boolean))]
      
      // Get tenant profiles
      const { data: tenantProfiles, error: tenantsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, avatar_url')
        .in('id', tenantIds)
        .eq('role', 'tenant')
      
      if (tenantsError) {
        console.error('Error fetching tenant profiles:', tenantsError)
        throw tenantsError
      }
      
      console.log('Fetched tenant profiles:', tenantProfiles)
      
      // Safely handle the case where tenantProfiles might be null or undefined
      const safeTenantProfiles = Array.isArray(tenantProfiles) ? tenantProfiles : []
      
      // Get property details
      const { data: propertyDetails, error: propertyDetailsError } = await supabase
        .from('properties')
        .select('id, name')
        .in('id', propertyIds)
      
      if (propertyDetailsError) {
        console.error('Error fetching property details:', propertyDetailsError)
        throw propertyDetailsError
      }
      
      console.log('Fetched property details:', propertyDetails)
      
      // Safely handle the case where propertyDetails might be null or undefined
      const safePropertyDetails = Array.isArray(propertyDetails) ? propertyDetails : []
      
      // Combine the data
      const tenantsWithDetails = safeTenantProfiles.map(tenant => {
        const lease = safeLeases.find(l => l.tenant_id === tenant.id)
        const unit = lease ? safeUnits.find(u => u.id === lease.unit_id) : undefined
        
        // Get property details for this unit
        const property = unit 
          ? { 
              id: unit.property_id, 
              name: safePropertyDetails.find(p => p.id === unit.property_id)?.name || 'Unknown Property'
            } 
          : undefined
        
        return {
          ...tenant,
          lease,
          unit,
          property
        }
      })
      
      setTenants(tenantsWithDetails)
    } catch (error: any) {
      console.error('Error in fetchTenants:', error)
      toast.error(error.message || 'Error fetching tenants')
      
      // If there's an error, use sample data in development mode
      if (import.meta.env.DEV) {
        console.log('Using sample data due to error')
        setUseSampleData(true)
        setTenants(SAMPLE_TENANTS)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInviteTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    
    try {
      // In a real app, this would send an invitation email
      // For this demo, we'll just show a success message
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setShowInviteModal(false)
    } catch (error: any) {
      toast.error(error.message || 'Error sending invitation')
    } finally {
      setInviteLoading(false)
    }
  }

  const filteredTenants = tenants.filter(tenant => {
    if (!tenant) return false
    
    // Safely access properties with optional chaining
    const fullName = `${tenant.first_name || ''} ${tenant.last_name || ''}`.toLowerCase()
    const email = (tenant.email || '').toLowerCase()
    const phone = tenant.phone || ''
    const propertyName = tenant.property?.name?.toLowerCase() || ''
    const unitNumber = tenant.unit?.unit_number?.toLowerCase() || ''
    const searchLower = searchTerm.toLowerCase()
    
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchTerm) ||
      propertyName.includes(searchLower) ||
      unitNumber.includes(searchLower)
    )
  })

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
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <div className="flex items-center space-x-4">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary flex items-center"
            onClick={() => setShowInviteModal(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Invite Tenant
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary flex items-center justify-center"
            onClick={fetchTenants}
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tenants list */}
      {!Array.isArray(tenants) || tenants.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <UserIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tenants</h3>
          <p className="mt-1 text-gray-500">You don't have any tenants yet.</p>
          <div className="mt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowInviteModal(true)}
            >
              <PlusIcon className="h-5 w-5 mr-2 inline" />
              Invite Tenant
            </button>
          </div>
        </div>
      ) : !Array.isArray(filteredTenants) || filteredTenants.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms.</p>
          <div className="mt-6">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredTenants.map((tenant) => (
              <li key={tenant.id}>
                <Link to={`/landlord/tenants/${tenant.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {tenant.avatar_url ? (
                            <img
                              src={tenant.avatar_url}
                              alt={`${tenant.first_name} ${tenant.last_name}`}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <span>
                              {tenant.first_name?.[0] || '?'}
                              {tenant.last_name?.[0] || '?'}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tenant.first_name} {tenant.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            {tenant.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-sm">
                        {tenant.unit && tenant.property && (
                          <div className="text-gray-500 flex items-center">
                            <HomeIcon className="h-4 w-4 mr-1" />
                            {tenant.property.name} - Unit {tenant.unit.unit_number}
                          </div>
                        )}
                        {tenant.lease && (
                          <div className="text-gray-500">
                            Lease: {format(parseISO(tenant.lease.start_date), 'MMM d, yyyy')} - {format(parseISO(tenant.lease.end_date), 'MMM d, yyyy')}
                          </div>
                        )}
                        {tenant.phone && (
                          <div className="text-gray-500 flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            {tenant.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Invite Tenant Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleInviteTenant}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Invite Tenant
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-4">
                          Send an invitation email to a tenant to join your property management system.
                        </p>
                        <div>
                          <label htmlFor="email" className="form-label">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="form-input"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="tenant@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                    disabled={inviteLoading}
                  >
                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tenants
