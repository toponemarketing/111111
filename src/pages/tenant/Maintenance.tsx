import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  WrenchScrewdriverIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'
import { shouldUseSampleData } from '../../lib/sampleData'

// Sample maintenance requests data
const SAMPLE_MAINTENANCE_REQUESTS = [
  {
    id: '00000000-0000-0000-0000-000000000501',
    unit_id: '00000000-0000-0000-0000-000000000201',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    title: 'Leaking faucet in bathroom',
    description: 'The bathroom sink faucet is leaking constantly. Water is dripping even when turned off completely.',
    priority: 'medium',
    status: 'completed',
    created_at: '2023-08-10T12:00:00Z',
    completed_at: '2023-08-15T14:30:00Z',
    notes: 'Replaced washer and fixed leak.',
    unit: {
      id: '00000000-0000-0000-0000-000000000201',
      unit_number: '101',
      property: {
        id: '00000000-0000-0000-0000-000000000101',
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
    created_at: '2023-08-20T09:15:00Z',
    completed_at: null,
    notes: null,
    unit: {
      id: '00000000-0000-0000-0000-000000000201',
      unit_number: '101',
      property: {
        id: '00000000-0000-0000-0000-000000000101',
        name: 'Sunset Apartments'
      }
    }
  }
];

// Sample units data for tenant
const SAMPLE_TENANT_UNITS = [
  {
    id: '00000000-0000-0000-0000-000000000201',
    unit_number: '101',
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments'
    }
  }
];

const Maintenance = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium',
    unit_id: '',
  })
  const [units, setUnits] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [useSampleData, setUseSampleData] = useState(false)

  useEffect(() => {
    if (user) {
      const useSample = shouldUseSampleData()
      setUseSampleData(useSample)
      
      if (useSample) {
        console.log('Using sample data for maintenance requests')
        setMaintenanceRequests(SAMPLE_MAINTENANCE_REQUESTS)
        setUnits(SAMPLE_TENANT_UNITS)
        
        // Set default unit for new request if there's only one
        if (SAMPLE_TENANT_UNITS.length === 1) {
          setNewRequest(prev => ({ ...prev, unit_id: SAMPLE_TENANT_UNITS[0].id }))
        }
        
        setLoading(false)
      } else {
        fetchMaintenanceRequests()
        fetchTenantUnits()
      }
    }
  }, [user])

  const fetchMaintenanceRequests = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, unit:units(unit_number, property:properties(name))')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setMaintenanceRequests(data || [])
    } catch (error: any) {
      console.error('Error fetching maintenance requests:', error)
      toast.error(error.message || 'Error fetching maintenance requests')
      setMaintenanceRequests([]) // Ensure we always set an array
    } finally {
      setLoading(false)
    }
  }

  const fetchTenantUnits = async () => {
    if (!user) return
    
    try {
      // Get active leases for tenant
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select('unit_id')
        .eq('tenant_id', user.id)
        .eq('status', 'active')
      
      if (leasesError) {
        console.error('Error fetching leases:', leasesError)
        throw leasesError
      }
      
      // Safely handle the case where leases might be null or undefined
      const safeLeases = leases || []
      
      if (safeLeases.length > 0) {
        const unitIds = safeLeases.map(lease => lease.unit_id).filter(Boolean)
        
        if (unitIds.length === 0) {
          setUnits([])
          return
        }
        
        // Get unit details
        const { data: unitData, error: unitsError } = await supabase
          .from('units')
          .select('id, unit_number, property:properties(id, name)')
          .in('id', unitIds)
        
        if (unitsError) {
          console.error('Error fetching units:', unitsError)
          throw unitsError
        }
        
        // Safely handle the case where unitData might be null or undefined
        const safeUnitData = unitData || []
        setUnits(safeUnitData)
        
        // Set default unit for new request if there's only one
        if (safeUnitData.length === 1) {
          setNewRequest(prev => ({ ...prev, unit_id: safeUnitData[0].id }))
        }
      } else {
        // Ensure units is always an array, even if empty
        setUnits([])
      }
    } catch (error: any) {
      console.error('Error in fetchTenantUnits:', error)
      toast.error(error.message || 'Error fetching tenant units')
      // Ensure units is always an array, even on error
      setUnits([])
    }
  }

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    if (!newRequest.title.trim() || !newRequest.description.trim() || !newRequest.unit_id) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setSubmitting(true)
    try {
      if (useSampleData) {
        // Create a sample maintenance request
        console.log('Creating sample maintenance request:', newRequest)
        
        // Generate a unique ID for the new request
        const newId = `sample-${Date.now()}`
        
        // Find the unit details from our sample units
        const unit = units.find(u => u.id === newRequest.unit_id)
        
        if (!unit) {
          throw new Error('Unit not found')
        }
        
        // Create the new request object with sample data
        const newMaintenanceRequest = {
          id: newId,
          tenant_id: user.id,
          unit_id: newRequest.unit_id,
          title: newRequest.title.trim(),
          description: newRequest.description.trim(),
          priority: newRequest.priority,
          status: 'open',
          created_at: new Date().toISOString(),
          completed_at: null,
          notes: null,
          unit: {
            id: unit.id,
            unit_number: unit.unit_number,
            property: {
              id: unit.property.id,
              name: unit.property.name
            }
          }
        }
        
        // Add the new request to the state
        setMaintenanceRequests(prev => [newMaintenanceRequest, ...prev])
        
        // Reset the form
        setNewRequest({
          title: '',
          description: '',
          priority: 'medium',
          unit_id: units.length === 1 ? units[0].id : '',
        })
        
        // Close the modal
        setShowNewRequestModal(false)
        
        // Show success message
        toast.success('Maintenance request created successfully')
        setSubmitting(false)
        return
      }
      
      // Create the request object
      const requestData = {
        tenant_id: user.id,
        unit_id: newRequest.unit_id,
        title: newRequest.title.trim(),
        description: newRequest.description.trim(),
        priority: newRequest.priority,
        status: 'open'
      }
      
      console.log('Creating maintenance request with data:', requestData)
      
      // Insert the new maintenance request
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([requestData])
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      // Fetch the newly created request with unit details
      const { data: newRequestData, error: fetchError } = await supabase
        .from('maintenance_requests')
        .select('*, unit:units(unit_number, property:properties(name))')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (fetchError) {
        console.error('Error fetching new request:', fetchError)
        throw fetchError
      }
      
      const newRequestWithDetails = newRequestData && newRequestData.length > 0 ? newRequestData[0] : null
      
      console.log('Maintenance request created successfully:', newRequestWithDetails)
      
      // Update the UI with the new request
      if (newRequestWithDetails) {
        setMaintenanceRequests(prev => [newRequestWithDetails, ...prev])
      } else {
        // If we couldn't fetch the details, just refresh the list
        fetchMaintenanceRequests()
      }
      
      // Reset the form
      setNewRequest({
        title: '',
        description: '',
        priority: 'medium',
        unit_id: units && units.length === 1 ? units[0].id : '',
      })
      
      // Close the modal
      setShowNewRequestModal(false)
      
      // Show success message
      toast.success('Maintenance request created successfully')
    } catch (error: any) {
      console.error('Error creating maintenance request:', error)
      toast.error(error.message || 'Error creating maintenance request')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRequests = maintenanceRequests.filter(request => {
    if (!request) return false
    
    // Safely access properties with optional chaining
    const matchesSearch = 
      (request.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        <div className="flex space-x-2">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="btn btn-primary"
            disabled={!units || units.length === 0}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {/* Filters */}
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
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={useSampleData ? () => {} : fetchMaintenanceRequests}
            className="btn btn-secondary"
            disabled={loading}
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </button>
        </div>
      </div>

      {/* Maintenance requests list */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request.id}>
                <Link
                  to={`/tenant/maintenance/${request.id}`}
                  className="block hover:bg-gray-50"
                >
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
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h2 className="text-sm font-medium text-gray-900">{request.title}</h2>
                            <span className={`
                              ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            `}>
                              {request.status === 'open' ? 'Open' : 
                                request.status === 'in_progress' ? 'In Progress' : 
                                request.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            <span className="font-medium">
                              {request.unit?.property?.name || 'Unknown Property'} - Unit {request.unit?.unit_number || 'Unknown'}
                            </span>
                            <span className="mx-1">•</span>
                            <span>
                              {format(parseISO(request.created_at), 'MMM d, yyyy')}
                            </span>
                            {request.scheduled_date && (
                              <>
                                <span className="mx-1">•</span>
                                <span>
                                  Scheduled: {format(parseISO(request.scheduled_date), 'MMM d, yyyy')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${request.priority === 'emergency' ? 'bg-red-100 text-red-800' : 
                            request.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                            request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                        `}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No maintenance requests</h3>
            <p className="mt-1 text-gray-500">
              {units && units.length > 0
                ? 'You haven\'t submitted any maintenance requests yet.'
                : 'You don\'t have any active leases to submit maintenance requests for.'}
            </p>
            {units && units.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="btn btn-primary"
                >
                  Create New Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New request modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateRequest}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <WrenchScrewdriverIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        New Maintenance Request
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="unit" className="form-label">
                            Property & Unit <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="unit"
                            className="form-select"
                            value={newRequest.unit_id}
                            onChange={(e) => setNewRequest({ ...newRequest, unit_id: e.target.value })}
                            required
                          >
                            <option value="">Select a property & unit</option>
                            {units && units.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.property?.name || 'Unknown Property'} - Unit {unit.unit_number}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="title" className="form-label">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            className="form-input"
                            value={newRequest.title}
                            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                            placeholder="e.g., Leaking faucet in bathroom"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="form-label">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="description"
                            rows={4}
                            className="form-input"
                            value={newRequest.description}
                            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            placeholder="Please provide details about the issue..."
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="priority" className="form-label">
                            Priority <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="priority"
                            className="form-select"
                            value={newRequest.priority}
                            onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                            required
                          >
                            <option value="low">Low - Not urgent</option>
                            <option value="medium">Medium - Needs attention soon</option>
                            <option value="high">High - Requires prompt attention</option>
                            <option value="emergency">Emergency - Immediate attention needed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowNewRequestModal(false)}
                    disabled={submitting}
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

export default Maintenance
