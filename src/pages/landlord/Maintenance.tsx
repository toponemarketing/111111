import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { 
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
  HomeIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

// Sample data for development/testing
const SAMPLE_MAINTENANCE_REQUESTS = [
  {
    id: '00000000-0000-0000-0000-000000000501',
    unit_id: '00000000-0000-0000-0000-000000000201',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    title: 'Leaking faucet in bathroom',
    description: 'The bathroom sink faucet is leaking constantly. Water is dripping even when turned off completely.',
    priority: 'medium',
    status: 'completed',
    created_at: '2023-08-10T10:00:00Z',
    completed_at: '2023-08-15T14:30:00Z',
    notes: 'Replaced washer and fixed leak.',
    tenant: {
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@example.com'
    },
    unit: {
      unit_number: '101',
      property: {
        name: 'Sunset Apartments'
      }
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000502',
    unit_id: '00000000-0000-0000-0000-000000000201',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    title: 'Broken light fixture in kitchen',
    description: 'The ceiling light in the kitchen is not working. I changed the bulb but it still doesn\'t work.',
    priority: 'low',
    status: 'open',
    created_at: '2023-08-18T09:15:00Z',
    completed_at: null,
    notes: null,
    tenant: {
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@example.com'
    },
    unit: {
      unit_number: '101',
      property: {
        name: 'Sunset Apartments'
      }
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000503',
    unit_id: '00000000-0000-0000-0000-000000000202',
    tenant_id: '00000000-0000-0000-0000-000000000004',
    title: 'AC not cooling properly',
    description: 'The air conditioner is running but not cooling the apartment. It\'s very hot inside.',
    priority: 'high',
    status: 'in_progress',
    created_at: '2023-08-20T14:30:00Z',
    completed_at: null,
    notes: 'Technician scheduled for tomorrow.',
    tenant: {
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily.davis@example.com'
    },
    unit: {
      unit_number: '102',
      property: {
        name: 'Sunset Apartments'
      }
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000504',
    unit_id: '00000000-0000-0000-0000-000000000204',
    tenant_id: '00000000-0000-0000-0000-000000000005',
    title: 'Dishwasher not draining',
    description: 'The dishwasher fills with water but doesn\'t drain properly. There\'s standing water after each cycle.',
    priority: 'medium',
    status: 'open',
    created_at: '2023-08-22T11:45:00Z',
    completed_at: null,
    notes: null,
    tenant: {
      first_name: 'David',
      last_name: 'Wilson',
      email: 'david.wilson@example.com'
    },
    unit: {
      unit_number: '201',
      property: {
        name: 'Riverside Condos'
      }
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000505',
    unit_id: '00000000-0000-0000-0000-000000000205',
    tenant_id: '00000000-0000-0000-0000-000000000006',
    title: 'Water damage on ceiling',
    description: 'There\'s a water stain on the ceiling in the living room that seems to be growing. Might be a leak from upstairs.',
    priority: 'emergency',
    status: 'in_progress',
    created_at: '2023-08-23T08:00:00Z',
    completed_at: null,
    notes: 'Plumber identified leak from unit above. Repairs in progress.',
    tenant: {
      first_name: 'Jessica',
      last_name: 'Martinez',
      email: 'jessica.martinez@example.com'
    },
    unit: {
      unit_number: '202',
      property: {
        name: 'Riverside Condos'
      }
    }
  }
];

interface MaintenanceRequest {
  id: string
  unit_id: string
  tenant_id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  completed_at: string | null
  notes?: string | null
  tenant: {
    first_name: string
    last_name: string
    email: string
  }
  unit: {
    unit_number: string
    property: {
      name: string
    }
  }
}

const Maintenance = () => {
  const { user } = useAuthStore()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    emergency: 0
  })
  const [useSampleData, setUseSampleData] = useState(false)

  useEffect(() => {
    if (user) {
      fetchMaintenanceRequests()
    }
  }, [user, filterStatus, filterPriority])

  const fetchMaintenanceRequests = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      console.log('Fetching maintenance requests for landlord:', user.id)
      
      // Check if we should use sample data (for development/testing)
      const useDevData = import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      if (useDevData) {
        console.log('Using sample maintenance request data')
        setUseSampleData(true)
        
        // Filter sample data based on status and priority filters
        let filteredSampleData = [...SAMPLE_MAINTENANCE_REQUESTS]
        
        if (filterStatus !== 'all') {
          filteredSampleData = filteredSampleData.filter(r => r.status === filterStatus)
        }
        
        if (filterPriority !== 'all') {
          filteredSampleData = filteredSampleData.filter(r => r.priority === filterPriority)
        }
        
        // Calculate stats from sample data
        const total = filteredSampleData.length
        const open = filteredSampleData.filter(r => r.status === 'open').length
        const inProgress = filteredSampleData.filter(r => r.status === 'in_progress').length
        const completed = filteredSampleData.filter(r => r.status === 'completed').length
        const emergency = filteredSampleData.filter(r => r.priority === 'emergency').length
        
        setRequests(filteredSampleData)
        setStats({
          total,
          open,
          inProgress,
          completed,
          emergency
        })
        
        setLoading(false)
        return
      }
      
      // First, get all properties owned by this landlord
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, name')
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
        setRequests([])
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          completed: 0,
          emergency: 0
        })
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
        setRequests([])
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          completed: 0,
          emergency: 0
        })
        setLoading(false)
        return
      }
      
      // Add property info to units
      const unitsWithProperty = safeUnits.map(unit => ({
        ...unit,
        property: safeProperties.find(p => p.id === unit.property_id) || { name: 'Unknown Property' }
      }))
      
      const unitIds = safeUnits.map(u => u.id)
      
      // Build query for maintenance requests
      let query = supabase
        .from('maintenance_requests')
        .select('*')
        .in('unit_id', unitIds)
        .order('created_at', { ascending: false })
      
      // Apply status filter if not "all"
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }
      
      // Apply priority filter if not "all"
      if (filterPriority !== 'all') {
        query = query.eq('priority', filterPriority)
      }
      
      const { data: requestsData, error: requestsError } = await query
      
      if (requestsError) {
        console.error('Error fetching maintenance requests:', requestsError)
        throw requestsError
      }
      
      console.log('Fetched maintenance requests:', requestsData)
      
      // Safely handle the case where requestsData might be null or undefined
      const safeRequestsData = Array.isArray(requestsData) ? requestsData : []
      
      if (safeRequestsData.length === 0) {
        console.log('No maintenance requests found')
        setRequests([])
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          completed: 0,
          emergency: 0
        })
        setLoading(false)
        return
      }
      
      // Get tenant profiles for these requests
      const tenantIds = [...new Set(safeRequestsData.map((r: any) => r.tenant_id).filter(Boolean))]
      
      // Only fetch tenant profiles if there are tenant IDs
      let safeTenants: any[] = []
      if (tenantIds.length > 0) {
        const { data: tenants, error: tenantsError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', tenantIds)
        
        if (tenantsError) {
          console.error('Error fetching tenant profiles:', tenantsError)
          throw tenantsError
        }
        
        console.log('Fetched tenant profiles:', tenants)
        
        // Safely handle the case where tenants might be null or undefined
        safeTenants = Array.isArray(tenants) ? tenants : []
      }
      
      // Combine the data
      const requestsWithDetails = safeRequestsData.map((request: any) => {
        const tenant = safeTenants.find(t => t.id === request.tenant_id) || 
                      { first_name: 'Unknown', last_name: 'Tenant', email: '' }
        const unit = unitsWithProperty.find(u => u.id === request.unit_id) || 
                    { unit_number: 'Unknown', property: { name: 'Unknown Property' } }
        
        return {
          ...request,
          tenant,
          unit
        }
      })
      
      setRequests(requestsWithDetails)
      
      // Calculate stats
      const total = requestsWithDetails.length
      const open = requestsWithDetails.filter(r => r.status === 'open').length
      const inProgress = requestsWithDetails.filter(r => r.status === 'in_progress').length
      const completed = requestsWithDetails.filter(r => r.status === 'completed').length
      const emergency = requestsWithDetails.filter(r => r.priority === 'emergency').length
      
      setStats({
        total,
        open,
        inProgress,
        completed,
        emergency
      })
    } catch (error: any) {
      console.error('Error in fetchMaintenanceRequests:', error)
      toast.error(error.message || 'Error fetching maintenance requests')
      
      // If there's an error, use sample data in development mode
      if (import.meta.env.DEV) {
        console.log('Using sample data due to error')
        setUseSampleData(true)
        setRequests(SAMPLE_MAINTENANCE_REQUESTS)
        
        // Calculate stats from sample data
        const total = SAMPLE_MAINTENANCE_REQUESTS.length
        const open = SAMPLE_MAINTENANCE_REQUESTS.filter(r => r.status === 'open').length
        const inProgress = SAMPLE_MAINTENANCE_REQUESTS.filter(r => r.status === 'in_progress').length
        const completed = SAMPLE_MAINTENANCE_REQUESTS.filter(r => r.status === 'completed').length
        const emergency = SAMPLE_MAINTENANCE_REQUESTS.filter(r => r.priority === 'emergency').length
        
        setStats({
          total,
          open,
          inProgress,
          completed,
          emergency
        })
      } else {
        // Set empty arrays and default stats on error in production
        setRequests([])
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          completed: 0,
          emergency: 0
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    if (!request) return false
    
    // Safely access properties with optional chaining
    const fullName = `${request.tenant?.first_name || ''} ${request.tenant?.last_name || ''}`.toLowerCase()
    const propertyUnit = `${request.unit?.property?.name || ''} ${request.unit?.unit_number || ''}`.toLowerCase()
    const title = (request.title || '').toLowerCase()
    const description = (request.description || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    return (
      fullName.includes(searchLower) ||
      propertyUnit.includes(searchLower) ||
      title.includes(searchLower) ||
      description.includes(searchLower)
    )
  })

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-gray-500" />
      default:
        return null
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
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        {useSampleData && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Using Sample Data
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-gray-500">
                <WrenchScrewdriverIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-yellow-500">
                <ExclamationCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.open}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.inProgress}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.completed}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-red-500">
                <ExclamationCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Emergency</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.emergency}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
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
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="form-input"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="emergency">Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              type="button"
              className="btn btn-secondary flex items-center justify-center"
              onClick={fetchMaintenanceRequests}
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance requests list */}
      {!Array.isArray(requests) || requests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No maintenance requests</h3>
          <p className="mt-1 text-gray-500">No maintenance requests have been submitted yet.</p>
        </div>
      ) : !Array.isArray(filteredRequests) || filteredRequests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms or filters.</p>
          <div className="mt-6">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setFilterPriority('all')
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request.id}>
                <Link to={`/landlord/maintenance/${request.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`
                          flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
                          ${request.priority === 'emergency' ? 'bg-red-100' : 
                            request.priority === 'high' ? 'bg-orange-100' : 
                            request.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'}
                        `}>
                          <WrenchScrewdriverIcon className={`
                            h-6 w-6
                            ${request.priority === 'emergency' ? 'text-red-600' : 
                              request.priority === 'high' ? 'text-orange-600' : 
                              request.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'}
                          `} />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {request.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${getPriorityBadgeClass(request.priority)}
                              `}>
                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                              </span>
                              <span className={`
                                ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${getStatusBadgeClass(request.status)}
                              `}>
                                {request.status === 'open' ? 'Open' : 
                                  request.status === 'in_progress' ? 'In Progress' : 
                                  request.status === 'completed' ? 'Completed' : 'Cancelled'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{request.tenant?.first_name || 'Unknown'} {request.tenant?.last_name || 'Tenant'}</span>
                              <span className="mx-2">•</span>
                              <HomeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{request.unit?.property?.name || 'Unknown Property'} - Unit {request.unit?.unit_number || 'Unknown'}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(parseISO(request.created_at), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <ArrowRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Maintenance
