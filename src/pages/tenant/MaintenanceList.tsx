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

const MaintenanceList = () => {
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

  useEffect(() => {
    if (user) {
      fetchMaintenanceRequests()
      fetchTenantUnits()
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
      toast.error(error.message || 'Error fetching maintenance requests')
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
      
      if (leasesError) throw leasesError
      
      if (leases && leases.length > 0) {
        const unitIds = leases.map(lease => lease.unit_id)
        
        // Get unit details
        const { data: unitData, error: unitsError } = await supabase
          .from('units')
          .select('id, unit_number, property:properties(id, name)')
          .in('id', unitIds)
        
        if (unitsError) throw unitsError
        
        setUnits(unitData || [])
        
        // Set default unit for new request if there's only one
        if (unitData && unitData.length === 1) {
          setNewRequest(prev => ({ ...prev, unit_id: unitData[0].id }))
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching tenant units')
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
      // Create the request object
      const requestData = {
        tenant_id: user.id,
        unit_id: newRequest.unit_id,
        title: newRequest.title.trim(),
        description: newRequest.description.trim(),
        priority: newRequest.priority,
        status: 'open'
      }
      
      // Insert the new maintenance request
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([requestData])
        .select('*, unit:units(unit_number, property:properties(name))')
        .single()
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      // Update the UI with the new request
      setMaintenanceRequests([data, ...maintenanceRequests])
      
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
    } catch (error: any) {
      console.error('Error creating maintenance request:', error)
      toast.error(error.message || 'Error creating maintenance request')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="btn btn-primary"
          disabled={units.length === 0}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Request
        </button>
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
            onClick={fetchMaintenanceRequests}
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
                              {request.unit?.property?.name} - Unit {request.unit?.unit_number}
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
              {units.length > 0
                ? 'You haven\'t submitted any maintenance requests yet.'
                : 'You don\'t have any active leases to submit maintenance requests for.'}
            </p>
            {units.length > 0 && (
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
                            {units.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.property.name} - Unit {unit.unit_number}
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

export default MaintenanceList
