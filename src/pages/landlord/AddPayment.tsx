import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon,
  UserIcon,
  HomeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

const AddPayment = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeLeases, setActiveLeases] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLease, setSelectedLease] = useState<any>(null)
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: '',
    payment_method: 'credit_card',
    status: 'completed',
    transaction_id: '',
    notes: '',
    late_fee: ''
  })

  useEffect(() => {
    if (user) {
      fetchActiveLeases()
    }
  }, [user])

  const fetchActiveLeases = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // First, get all properties owned by this landlord
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, name')
        .eq('landlord_id', user.id)
      
      if (propertiesError) throw propertiesError
      
      if (!properties.length) {
        setLoading(false)
        return
      }
      
      const propertyIds = properties.map(p => p.id)
      
      // Get all units in these properties
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id, unit_number, property_id, property:properties(name)')
        .in('property_id', propertyIds)
      
      if (unitsError) throw unitsError
      
      if (!units.length) {
        setLoading(false)
        return
      }
      
      const unitIds = units.map(u => u.id)
      
      // Get all active leases for these units
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select(`
          *,
          tenant:profiles(
            id,
            first_name,
            last_name,
            email
          ),
          unit:units(
            id,
            unit_number,
            property:properties(
              id,
              name
            )
          )
        `)
        .in('unit_id', unitIds)
        .eq('status', 'active')
        .order('end_date', { ascending: true })
      
      if (leasesError) throw leasesError
      
      setActiveLeases(leases || [])
    } catch (error: any) {
      toast.error(error.message || 'Error fetching active leases')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLeaseSelect = (lease: any) => {
    setSelectedLease(lease)
    setFormData(prev => ({
      ...prev,
      amount: lease.rent_amount.toString(),
      due_date: format(new Date(), 'yyyy-MM-dd') // In a real app, calculate the actual due date
    }))
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !selectedLease) return
    
    if (!formData.amount || !formData.payment_date || !formData.due_date) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            lease_id: selectedLease.id,
            tenant_id: selectedLease.tenant_id,
            amount: parseFloat(formData.amount),
            payment_date: formData.payment_date,
            due_date: formData.due_date,
            payment_method: formData.payment_method,
            status: formData.status,
            transaction_id: formData.transaction_id || null,
            notes: formData.notes || null,
            late_fee: formData.late_fee ? parseFloat(formData.late_fee) : null
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      
      toast.success('Payment added successfully')
      navigate(`/landlord/payments/${data.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Error adding payment')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredLeases = activeLeases.filter(lease => {
    const tenantName = `${lease.tenant.first_name} ${lease.tenant.last_name}`.toLowerCase()
    const propertyUnit = `${lease.unit.property.name} ${lease.unit.unit_number}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    return (
      tenantName.includes(searchLower) ||
      propertyUnit.includes(searchLower)
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
        <div className="flex items-center">
          <Link to="/landlord/payments" className="mr-4 text-gray-400 hover:text-gray-500">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add Payment</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lease selection */}
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Select Lease</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search tenants or properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {activeLeases.length === 0 ? (
              <div className="text-center py-6">
                <UserIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No active leases</h3>
                <p className="mt-1 text-gray-500">There are no active leases to add payments for.</p>
              </div>
            ) : filteredLeases.length === 0 ? (
              <div className="text-center py-6">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLeases.map((lease) => (
                  <div 
                    key={lease.id} 
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedLease?.id === lease.id ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50 hover:bg-gray-100'}
                    `}
                    onClick={() => handleLeaseSelect(lease)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {lease.tenant.first_name[0]}{lease.tenant.last_name[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {lease.tenant.first_name} {lease.tenant.last_name}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <HomeIcon className="h-3 w-3 mr-1" />
                          <span>
                            {lease.unit.property.name} - Unit {lease.unit.unit_number}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-gray-500">
                        ${lease.rent_amount}/month
                      </span>
                      <span className="text-gray-500">
                        Due on day {lease.rent_due_day}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment form */}
        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {selectedLease ? (
              <form onSubmit={handleAddPayment}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="form-label">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        className="form-input pl-7"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="late_fee" className="form-label">
                      Late Fee (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        id="late_fee"
                        name="late_fee"
                        className="form-input pl-7"
                        value={formData.late_fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="payment_date" className="form-label">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="payment_date"
                        name="payment_date"
                        className="form-input"
                        value={formData.payment_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="due_date" className="form-label">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="due_date"
                        name="due_date"
                        className="form-input"
                        value={formData.due_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="payment_method" className="form-label">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="payment_method"
                        name="payment_method"
                        className="form-select"
                        value={formData.payment_method}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="venmo">Venmo</option>
                        <option value="cash">Cash</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="status" className="form-label">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="transaction_id" className="form-label">
                      Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      id="transaction_id"
                      name="transaction_id"
                      className="form-input"
                      value={formData.transaction_id}
                      onChange={handleInputChange}
                    />
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
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any additional notes about the payment..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Adding Payment...' : 'Add Payment'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No lease selected</h3>
                <p className="mt-1 text-gray-500">Please select a lease from the list to add a payment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPayment
