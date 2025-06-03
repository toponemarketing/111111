import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  HomeIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'
import { SAMPLE_UNITS_WITH_DETAILS } from '../../lib/sampleData'

interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface Lease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  security_deposit: number | null;
  rent_due_day: number;
  lease_type: string;
  notes: string | null;
  status: string;
  tenant: Tenant;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  rent_amount: number;
  status: string;
  description: string | null;
  property?: Property;
  leases?: Lease[];
  maintenance_requests?: MaintenanceRequest[];
}

interface FormData {
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  rent_amount: number;
  status: string;
  description: string;
}

interface LeaseFormData {
  tenant_id: string;
  start_date: string;
  end_date: string;
  rent_amount: string;
  security_deposit: string;
  rent_due_day: string;
  lease_type: string;
  notes: string;
}

const UnitDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, useSampleData } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [leases, setLeases] = useState<Lease[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddLeaseModal, setShowAddLeaseModal] = useState(false)
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    unit_number: '',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 0,
    rent_amount: 0,
    status: 'vacant',
    description: ''
  })
  
  // Lease form state
  const [leaseFormData, setLeaseFormData] = useState<LeaseFormData>({
    tenant_id: '',
    start_date: '',
    end_date: '',
    rent_amount: '',
    security_deposit: '',
    rent_due_day: '1',
    lease_type: 'fixed',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id && user) {
      if (useSampleData) {
        loadSampleUnitData(id)
      } else {
        fetchUnitDetails()
      }
    }
  }, [id, user, useSampleData])

  const loadSampleUnitData = (unitId: string) => {
    // Find the unit in our sample data
    const sampleUnitData = SAMPLE_UNITS_WITH_DETAILS[unitId as keyof typeof SAMPLE_UNITS_WITH_DETAILS]
    
    if (sampleUnitData) {
      setUnit(sampleUnitData)
      setProperty(sampleUnitData.property)
      setLeases(sampleUnitData.leases || [])
      setMaintenanceRequests(sampleUnitData.maintenance_requests || [])
      
      // Set form data
      setFormData({
        unit_number: sampleUnitData.unit_number,
        bedrooms: sampleUnitData.bedrooms,
        bathrooms: sampleUnitData.bathrooms,
        square_feet: sampleUnitData.square_feet || 0,
        rent_amount: sampleUnitData.rent_amount,
        status: sampleUnitData.status,
        description: sampleUnitData.description || ''
      })
      
      // Set available tenants (for demo purposes, create some sample available tenants)
      setAvailableTenants([
        {
          id: '00000000-0000-0000-0000-000000000008',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@example.com'
        },
        {
          id: '00000000-0000-0000-0000-000000000009',
          first_name: 'James',
          last_name: 'Williams',
          email: 'james.williams@example.com'
        },
        {
          id: '00000000-0000-0000-0000-000000000010',
          first_name: 'Lisa',
          last_name: 'Garcia',
          email: 'lisa.garcia@example.com'
        }
      ])
    } else {
      toast.error('Unit not found')
      navigate('/landlord/properties')
    }
    
    setLoading(false)
  }

  const fetchUnitDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      // Fetch unit
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single()
      
      if (unitError) throw unitError
      
      setUnit(unitData)
      setFormData({
        unit_number: unitData.unit_number,
        bedrooms: unitData.bedrooms,
        bathrooms: unitData.bathrooms,
        square_feet: unitData.square_feet || 0,
        rent_amount: unitData.rent_amount,
        status: unitData.status,
        description: unitData.description || ''
      })
      
      // Fetch property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', unitData.property_id)
        .single()
      
      if (propertyError) throw propertyError
      
      // Verify this property belongs to the landlord
      if (propertyData.landlord_id !== user.id) {
        toast.error('You do not have permission to view this unit')
        navigate('/landlord/properties')
        return
      }
      
      setProperty(propertyData)
      
      // Fetch leases
      const { data: leaseData, error: leaseError } = await supabase
        .from('leases')
        .select(`
          *,
          tenant:profiles(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('unit_id', id)
        .order('start_date', { ascending: false })
      
      if (leaseError) throw leaseError
      
      setLeases(leaseData || [])
      
      // Fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenant:profiles(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('unit_id', id)
        .order('created_at', { ascending: false })
      
      if (maintenanceError) throw maintenanceError
      
      setMaintenanceRequests(maintenanceData || [])
      
      // Fetch available tenants (tenants without active leases)
      const { data: allTenants, error: tenantsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'tenant')
      
      if (tenantsError) throw tenantsError
      
      // Get all tenants with active leases
      const { data: activeLeaseTenants, error: activeLeaseError } = await supabase
        .from('leases')
        .select('tenant_id')
        .eq('status', 'active')
      
      if (activeLeaseError) throw activeLeaseError
      
      const activeTenantIds = new Set(activeLeaseTenants?.map(lease => lease.tenant_id) || [])
      
      // Filter out tenants who already have active leases
      const availableTenantsList = allTenants?.filter(tenant => !activeTenantIds.has(tenant.id)) || []
      
      setAvailableTenants(availableTenantsList)
    } catch (error: any) {
      toast.error(error.message || 'Error fetching unit details')
      navigate('/landlord/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLeaseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLeaseFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate updating a unit with sample data
        
        // Update the unit in our state
        const updatedUnit = {
          ...unit,
          unit_number: formData.unit_number,
          bedrooms: parseInt(formData.bedrooms.toString()),
          bathrooms: parseFloat(formData.bathrooms.toString()),
          square_feet: parseInt(formData.square_feet.toString()) || 0,
          rent_amount: parseFloat(formData.rent_amount.toString()),
          status: formData.status,
          description: formData.description || null
        }
        
        setUnit(updatedUnit)
        setShowEditModal(false)
        toast.success('Unit updated successfully')
        setLoading(false)
        return
      }
      
      const { error } = await supabase
        .from('units')
        .update({
          unit_number: formData.unit_number,
          bedrooms: parseInt(formData.bedrooms.toString()),
          bathrooms: parseFloat(formData.bathrooms.toString()),
          square_feet: parseInt(formData.square_feet.toString()) || 0,
          rent_amount: parseFloat(formData.rent_amount.toString()),
          status: formData.status,
          description: formData.description || null
        })
        .eq('id', id)
      
      if (error) throw error
      
      setUnit({
        ...unit!,
        unit_number: formData.unit_number,
        bedrooms: parseInt(formData.bedrooms.toString()),
        bathrooms: parseFloat(formData.bathrooms.toString()),
        square_feet: parseInt(formData.square_feet.toString()) || 0,
        rent_amount: parseFloat(formData.rent_amount.toString()),
        status: formData.status,
        description: formData.description || null
      })
      
      setShowEditModal(false)
      toast.success('Unit updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating unit')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUnit = async () => {
    if (!id || !user) return
    
    // Check if unit has active leases
    const activeLeases = leases.filter(lease => lease.status === 'active')
    if (activeLeases.length > 0) {
      toast.error('Cannot delete unit with active leases. Please terminate all leases first.')
      setShowDeleteModal(false)
      return
    }
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate deleting a unit with sample data
        
        toast.success('Unit deleted successfully')
        navigate(`/landlord/properties/${property?.id}`)
        setLoading(false)
        return
      }
      
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast.success('Unit deleted successfully')
      navigate(`/landlord/properties/${property?.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error deleting unit')
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleAddLease = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    if (!leaseFormData.tenant_id || !leaseFormData.start_date || !leaseFormData.end_date || !leaseFormData.rent_amount) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setSubmitting(true)
    try {
      // Check if unit already has an active lease
      const activeLeases = leases.filter(lease => lease.status === 'active')
      if (activeLeases.length > 0) {
        toast.error('This unit already has an active lease. Please terminate the existing lease first.')
        return
      }
      
      if (useSampleData) {
        // Simulate adding a lease with sample data
        
        // Find the tenant from available tenants
        const tenant = availableTenants.find(t => t.id === leaseFormData.tenant_id)
        
        if (!tenant) {
          throw new Error('Tenant not found')
        }
        
        // Create a new lease
        const newLease = {
          id: `sample-lease-${Date.now()}`,
          tenant_id: leaseFormData.tenant_id,
          unit_id: id,
          start_date: leaseFormData.start_date,
          end_date: leaseFormData.end_date,
          rent_amount: parseFloat(leaseFormData.rent_amount),
          security_deposit: leaseFormData.security_deposit ? parseFloat(leaseFormData.security_deposit) : null,
          rent_due_day: parseInt(leaseFormData.rent_due_day),
          lease_type: leaseFormData.lease_type,
          notes: leaseFormData.notes || null,
          status: 'active',
          tenant: tenant
        }
        
        // Update unit status to occupied
        setUnit({ ...unit!, status: 'occupied' })
        
        // Add the new lease to the leases array
        setLeases([newLease, ...leases])
        
        // Remove the tenant from available tenants
        setAvailableTenants(availableTenants.filter(t => t.id !== leaseFormData.tenant_id))
        
        setShowAddLeaseModal(false)
        setLeaseFormData({
          tenant_id: '',
          start_date: '',
          end_date: '',
          rent_amount: unit?.rent_amount.toString() || '',
          security_deposit: '',
          rent_due_day: '1',
          lease_type: 'fixed',
          notes: ''
        })
        
        toast.success('Lease added successfully')
        setSubmitting(false)
        return
      }
      
      // Create new lease
      const { data, error } = await supabase
        .from('leases')
        .insert([
          {
            tenant_id: leaseFormData.tenant_id,
            unit_id: id,
            start_date: leaseFormData.start_date,
            end_date: leaseFormData.end_date,
            rent_amount: parseFloat(leaseFormData.rent_amount),
            security_deposit: leaseFormData.security_deposit ? parseFloat(leaseFormData.security_deposit) : null,
            rent_due_day: parseInt(leaseFormData.rent_due_day),
            lease_type: leaseFormData.lease_type,
            notes: leaseFormData.notes || null,
            status: 'active'
          }
        ])
        .select(`
          *,
          tenant:profiles(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .single()
      
      if (error) throw error
      
      // Update unit status to occupied
      const { error: unitError } = await supabase
        .from('units')
        .update({ status: 'occupied' })
        .eq('id', id)
      
      if (unitError) throw unitError
      
      // Update local state
      setUnit({ ...unit!, status: 'occupied' })
      setLeases([data, ...leases])
      
      // Remove the tenant from available tenants
      setAvailableTenants(availableTenants.filter(tenant => tenant.id !== leaseFormData.tenant_id))
      
      setShowAddLeaseModal(false)
      setLeaseFormData({
        tenant_id: '',
        start_date: '',
        end_date: '',
        rent_amount: unit?.rent_amount.toString() || '',
        security_deposit: '',
        rent_due_day: '1',
        lease_type: 'fixed',
        notes: ''
      })
      
      toast.success('Lease added successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error adding lease')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTerminateLease = async (leaseId: string) => {
    if (!user || !id) return
    
    if (!window.confirm('Are you sure you want to terminate this lease? This action cannot be undone.')) {
      return
    }
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate terminating a lease with sample data
        
        // Update lease status
        const updatedLeases = leases.map(lease => 
          lease.id === leaseId ? { ...lease, status: 'terminated' } : lease
        )
        
        // Update unit status to vacant
        setUnit({ ...unit!, status: 'vacant' })
        setLeases(updatedLeases)
        
        toast.success('Lease terminated successfully')
        setLoading(false)
        return
      }
      
      // Update lease status
      const { error: leaseError } = await supabase
        .from('leases')
        .update({ status: 'terminated' })
        .eq('id', leaseId)
      
      if (leaseError) throw leaseError
      
      // Update unit status to vacant
      const { error: unitError } = await supabase
        .from('units')
        .update({ status: 'vacant' })
        .eq('id', id)
      
      if (unitError) throw unitError
      
      // Update local state
      setUnit({ ...unit!, status: 'vacant' })
      setLeases(leases.map(lease => 
        lease.id === leaseId ? { ...lease, status: 'terminated' } : lease
      ))
      
      toast.success('Lease terminated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error terminating lease')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !unit) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!unit || !property) {
    return (
      <div className="text-center py-12">
        <HomeIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Unit not found</h3>
        <p className="mt-1 text-gray-500">The unit you're looking for doesn't exist or you don't have access to it.</p>
        <div className="mt-6">
          <Link to="/landlord/properties" className="btn btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const activeLeases = leases.filter(lease => lease.status === 'active')
  const isOccupied = activeLeases.length > 0
  const activeTenant = isOccupied ? activeLeases[0].tenant : null

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to={`/landlord/properties/${property.id}`} className="mr-4 text-gray-400 hover:text-gray-500">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Unit {unit.unit_number}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="btn btn-secondary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Unit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
            disabled={isOccupied}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Unit details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Unit Details</h2>
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${unit.status === 'occupied' || isOccupied ? 'bg-green-100 text-green-800' : 
                unit.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
            `}>
              {unit.status === 'occupied' || isOccupied ? 'Occupied' : 
                unit.status === 'maintenance' ? 'Under Maintenance' : 'Vacant'}
            </span>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Property</h3>
                  <p className="text-gray-900">{property.name}</p>
                  <p className="text-sm text-gray-500">
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Unit Details</h3>
                  <p className="text-gray-900">
                    {unit.bedrooms} {unit.bedrooms === 1 ? 'bedroom' : 'bedrooms'} • 
                    {unit.bathrooms} {unit.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                    {unit.square_feet ? ` • ${unit.square_feet} sq ft` : ''}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rent</h3>
                  <p className="text-gray-900">${unit.rent_amount}/month</p>
                </div>
                
                {unit.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-900">{unit.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              {isOccupied && activeTenant ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Current Tenant</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {activeTenant.first_name[0]}{activeTenant.last_name[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {activeTenant.first_name} {activeTenant.last_name}
                        </p>
                        <div className="text-xs text-gray-500 flex flex-col">
                          <span>{activeTenant.email}</span>
                          {activeTenant.phone && <span>{activeTenant.phone}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Lease: {format(parseISO(activeLeases[0].start_date), 'MMM d, yyyy')} - 
                        {format(parseISO(activeLeases[0].end_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Rent: ${activeLeases[0].rent_amount}/month (due on day {activeLeases[0].rent_due_day})
                      </p>
                      
                      <div className="mt-3">
                        <Link
                          to={`/landlord/tenants/${activeTenant.id}`}
                          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                        >
                          View tenant details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No active tenant</p>
                  {availableTenants.length > 0 && (
                    <button
                      onClick={() => {
                        setLeaseFormData({
                          ...leaseFormData,
                          rent_amount: unit.rent_amount.toString()
                        })
                        setShowAddLeaseModal(true)
                      }}
                      className="btn btn-primary mt-4"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Lease
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leases */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Lease History</h2>
          {!isOccupied && availableTenants.length > 0 && (
            <button
              onClick={() => {
                setLeaseFormData({
                  ...leaseFormData,
                  rent_amount: unit.rent_amount.toString()
                })
                setShowAddLeaseModal(true)
              }}
              className="btn btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Lease
            </button>
          )}
        </div>
        <div className="px-4 py-5 sm:p-6">
          {leases.length > 0 ? (
            <div className="space-y-6">
              {leases.map((lease) => (
                <div key={lease.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {lease.tenant?.first_name} {lease.tenant?.last_name}
                      </h3>
                    </div>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${lease.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {lease.status === 'active' ? 'Active' : 'Terminated'}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Lease Period</h4>
                      <p className="text-gray-900">
                        {format(parseISO(lease.start_date), 'MMM d, yyyy')} - {format(parseISO(lease.end_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lease.lease_type === 'fixed' ? 'Fixed Term' : 'Month-to-Month'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Rent</h4>
                      <p className="text-gray-900">${lease.rent_amount}/month</p>
                      <p className="text-sm text-gray-500">Due on day {lease.rent_due_day} of each month</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Security Deposit</h4>
                      <p className="text-gray-900">${lease.security_deposit || 0}</p>
                    </div>
                  </div>
                  
                  {lease.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                      <p className="text-gray-900 whitespace-pre-line">{lease.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/landlord/tenants/${lease.tenant.id}`}
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      View tenant details
                    </Link>
                    
                    {lease.status === 'active' && (
                      <button
                        onClick={() => handleTerminateLease(lease.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Terminate Lease
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No lease history</h3>
              <p className="mt-1 text-gray-500">This unit doesn't have any lease history.</p>
              {availableTenants.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setLeaseFormData({
                        ...leaseFormData,
                        rent_amount: unit.rent_amount.toString()
                      })
                      setShowAddLeaseModal(true)
                    }}
                    className="btn btn-primary"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Lease
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Requests */}
      {maintenanceRequests.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Maintenance Requests</h2>
            <Link to="/landlord/maintenance" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200">
              {maintenanceRequests.map((request) => (
                <li key={request.id}>
                  <Link to={`/landlord/maintenance/${request.id}`} className="block hover:bg-gray-50 py-4">
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
                          <p className="text-sm font-medium text-gray-900">
                            {request.title}
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
                          </p>
                          <p className="text-sm text-gray-500">
                            Reported by: {request.tenant?.first_name} {request.tenant?.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {format(parseISO(request.created_at), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Priority: {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Edit Unit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateUnit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Unit
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="unit_number" className="form-label">
                            Unit Number
                          </label>
                          <input
                            type="text"
                            name="unit_number"
                            id="unit_number"
                            required
                            className="form-input"
                            value={formData.unit_number}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="bedrooms" className="form-label">
                              Bedrooms
                            </label>
                            <input
                              type="number"
                              name="bedrooms"
                              id="bedrooms"
                              required
                              min="0"
                              className="form-input"
                              value={formData.bedrooms}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="bathrooms" className="form-label">
                              Bathrooms
                            </label>
                            <input
                              type="number"
                              name="bathrooms"
                              id="bathrooms"
                              required
                              min="0"
                              step="0.5"
                              className="form-input"
                              value={formData.bathrooms}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="square_feet" className="form-label">
                              Square Feet
                            </label>
                            <input
                              type="number"
                              name="square_feet"
                              id="square_feet"
                              min="0"
                              className="form-input"
                              value={formData.square_feet}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="rent_amount" className="form-label">
                              Rent Amount
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                              <input
                                type="number"
                                name="rent_amount"
                                id="rent_amount"
                                required
                                min="0"
                                step="0.01"
                                className="form-input pl-7"
                                value={formData.rent_amount}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="status" className="form-label">
                            Status
                          </label>
                          <select
                            name="status"
                            id="status"
                            required
                            className="form-select"
                            value={formData.status}
                            onChange={handleInputChange}
                            disabled={isOccupied}
                          >
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Under Maintenance</option>
                          </select>
                          {isOccupied && (
                            <p className="text-xs text-gray-500 mt-1">
                              Status cannot be changed while unit has an active lease.
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="description" className="form-label">
                            Description (Optional)
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="form-input"
                            value={formData.description}
                            onChange={handleInputChange}
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
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowEditModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Unit
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong>Unit {unit.unit_number}</strong>? This action cannot be undone.
                        {isOccupied && (
                          <span className="block mt-2 text-red-500 font-medium">
                            This unit has an active lease. You must terminate the lease first.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-danger sm:ml-3"
                  onClick={handleDeleteUnit}
                  disabled={loading || isOccupied}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 sm:mt-0"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lease Modal */}
      {showAddLeaseModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddLease}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add New Lease
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="tenant_id" className="form-label">
                            Tenant <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="tenant_id"
                            name="tenant_id"
                            className="form-select"
                            value={leaseFormData.tenant_id}
                            onChange={handleLeaseInputChange}
                            required
                          >
                            <option value="">Select a tenant</option>
                            {availableTenants.map((tenant) => (
                              <option key={tenant.id} value={tenant.id}>
                                {tenant.first_name} {tenant.last_name} ({tenant.email})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="start_date" className="form-label">
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              id="start_date"
                              name="start_date"
                              className="form-input"
                              value={leaseFormData.start_date}
                              onChange={handleLeaseInputChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="end_date" className="form-label">
                              End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              id="end_date"
                              name="end_date"
                              className="form-input"
                              value={leaseFormData.end_date}
                              onChange={handleLeaseInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="rent_amount" className="form-label">
                              Rent Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                              <input
                                type="number"
                                id="rent_amount"
                                name="rent_amount"
                                className="form-input pl-7"
                                value={leaseFormData.rent_amount}
                                onChange={handleLeaseInputChange}
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="security_deposit" className="form-label">
                              Security Deposit
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                              <input
                                type="number"
                                id="security_deposit"
                                name="security_deposit"
                                className="form-input pl-7"
                                value={leaseFormData.security_deposit}
                                onChange={handleLeaseInputChange}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="rent_due_day" className="form-label">
                              Rent Due Day <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="rent_due_day"
                              name="rent_due_day"
                              className="form-select"
                              value={leaseFormData.rent_due_day}
                              onChange={handleLeaseInputChange}
                              required
                            >
                              {[...Array(28)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="lease_type" className="form-label">
                              Lease Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="lease_type"
                              name="lease_type"
                              className="form-select"
                              value={leaseFormData.lease_type}
                              onChange={handleLeaseInputChange}
                              required
                            >
                              <option value="fixed">Fixed Term</option>
                              <option value="month_to_month">Month-to-Month</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="notes" className="form-label">
                            Notes (Optional)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="form-input"
                            value={leaseFormData.notes}
                            onChange={handleLeaseInputChange}
                            placeholder="Add any additional notes about the lease..."
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
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Lease'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowAddLeaseModal(false)}
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

export default UnitDetail
