import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon,
  UserIcon,
  HomeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState<any>(null)
  const [lease, setLease] = useState<any>(null)
  const [tenant, setTenant] = useState<any>(null)
  const [unit, setUnit] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: '',
    due_date: '',
    payment_method: 'credit_card',
    status: 'pending',
    transaction_id: '',
    notes: '',
    late_fee: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id && user) {
      fetchPaymentDetails()
    }
  }, [id, user])

  const fetchPaymentDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      // Fetch payment
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single()
      
      if (paymentError) throw paymentError
      
      setPayment(paymentData)
      setFormData({
        amount: paymentData.amount.toString(),
        payment_date: paymentData.payment_date,
        due_date: paymentData.due_date,
        payment_method: paymentData.payment_method,
        status: paymentData.status,
        transaction_id: paymentData.transaction_id || '',
        notes: paymentData.notes || '',
        late_fee: paymentData.late_fee ? paymentData.late_fee.toString() : ''
      })
      
      // Fetch lease
      const { data: leaseData, error: leaseError } = await supabase
        .from('leases')
        .select('*')
        .eq('id', paymentData.lease_id)
        .single()
      
      if (leaseError) throw leaseError
      
      setLease(leaseData)
      
      // Fetch tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', paymentData.tenant_id)
        .single()
      
      if (tenantError) throw tenantError
      
      setTenant(tenantData)
      
      // Fetch unit
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', leaseData.unit_id)
        .single()
      
      if (unitError) throw unitError
      
      setUnit(unitData)
      
      // Fetch property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', unitData.property_id)
        .single()
      
      if (propertyError) throw propertyError
      
      // Verify this property belongs to the landlord
      if (propertyData.landlord_id !== user.id) {
        toast.error('You do not have permission to view this payment')
        navigate('/landlord/payments')
        return
      }
      
      setProperty(propertyData)
    } catch (error: any) {
      toast.error(error.message || 'Error fetching payment details')
      navigate('/landlord/payments')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    setSubmitting(true)
    try {
      const updates: any = {
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        due_date: formData.due_date,
        payment_method: formData.payment_method,
        status: formData.status,
        transaction_id: formData.transaction_id || null,
        notes: formData.notes || null,
        late_fee: formData.late_fee ? parseFloat(formData.late_fee) : null
      }
      
      const { error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      setPayment({ ...payment, ...updates })
      setShowEditModal(false)
      toast.success('Payment updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating payment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGenerateReceipt = () => {
    // In a real app, this would generate and download a receipt
    // For this demo, we'll just show a success message
    toast.success('Payment receipt generated')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!payment || !lease || !tenant || !unit || !property) {
    return (
      <div className="text-center py-12">
        <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Payment not found</h3>
        <p className="mt-1 text-gray-500">The payment you're looking for doesn't exist or you don't have access to it.</p>
        <div className="mt-6">
          <Link to="/landlord/payments" className="btn btn-primary">
            Back to Payments
          </Link>
        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleGenerateReceipt}
            className="btn btn-secondary"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Generate Receipt
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="btn btn-primary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Payment
          </button>
        </div>
      </div>

      {/* Payment details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            <div className="flex items-center">
              {payment.status === 'completed' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
              ) : payment.status === 'pending' ? (
                <ClockIcon className="h-5 w-5 text-yellow-500 mr-1.5" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />
              )}
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
              `}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="text-2xl font-bold text-gray-900">${payment.amount}</p>
                  {payment.late_fee && payment.late_fee > 0 && (
                    <p className="text-sm text-red-600">
                      Includes ${payment.late_fee} late fee
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Date</h3>
                    <p className="text-gray-900">
                      {format(parseISO(payment.payment_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <p className="text-gray-900">
                      {format(parseISO(payment.due_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                  <p className="text-gray-900">
                    {payment.payment_method === 'credit_card' ? 'Credit Card' : 
                      payment.payment_method === 'paypal' ? 'PayPal' : 
                      payment.payment_method === 'venmo' ? 'Venmo' : 
                      payment.payment_method === 'cash' ? 'Cash' : 'Other'}
                  </p>
                </div>
                
                {payment.transaction_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                    <p className="text-gray-900">{payment.transaction_id}</p>
                  </div>
                )}
                
                {payment.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="text-gray-900 whitespace-pre-line">{payment.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Tenant Information</h3>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {tenant.first_name[0]}{tenant.last_name[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {tenant.first_name} {tenant.last_name}
                    </p>
                    <div className="text-xs text-gray-500 flex flex-col">
                      <span>{tenant.email}</span>
                      {tenant.phone && <span>{tenant.phone}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property & Unit</h3>
                  <p className="text-sm text-gray-900">
                    {property.name} - Unit {unit.unit_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Lease Information</h3>
                  <p className="text-sm text-gray-900">
                    ${lease.rent_amount}/month
                  </p>
                  <p className="text-xs text-gray-500">
                    Due on day {lease.rent_due_day} of each month
                  </p>
                  <p className="text-xs text-gray-500">
                    Lease period: {format(parseISO(lease.start_date), 'MMM d, yyyy')} - 
                    {format(parseISO(lease.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/landlord/tenants/${tenant.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View tenant details
                  </Link>
                  <Link
                    to={`/landlord/units/${unit.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View unit details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Payment Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdatePayment}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Payment
                      </h3>
                      <div className="mt-4 space-y-4">
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
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                              <option value="refunded">Refunded</option>
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
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowEditModal(false)}
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

export default PaymentDetail
