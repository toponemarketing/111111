import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  CurrencyDollarIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns'

const Payments = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<any[]>([])
  const [leases, setLeases] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedLease, setSelectedLease] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [paymentAmount, setPaymentAmount] = useState<string>('')
  const [paymentNote, setPaymentNote] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [nextPayment, setNextPayment] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchPaymentsData()
    }
  }, [user])

  const fetchPaymentsData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Fetch active leases
      const { data: leaseData, error: leaseError } = await supabase
        .from('leases')
        .select('*')
        .eq('tenant_id', user.id)
        .eq('status', 'active')
      
      if (leaseError) throw leaseError
      
      setLeases(leaseData || [])
      
      if (leaseData && leaseData.length > 0) {
        const unitIds = leaseData.map(lease => lease.unit_id)
        const leaseIds = leaseData.map(lease => lease.id)
        
        // Fetch units
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('*')
          .in('id', unitIds)
        
        if (unitError) throw unitError
        
        setUnits(unitData || [])
        
        if (unitData && unitData.length > 0) {
          const propertyIds = [...new Set(unitData.map(unit => unit.property_id))]
          
          // Fetch properties
          const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .select('*, landlord:landlord_id(*)')
            .in('id', propertyIds)
          
          if (propertyError) throw propertyError
          
          setProperties(propertyData || [])
          
          // Fetch payment methods
          if (propertyData && propertyData.length > 0) {
            const landlordIds = [...new Set(propertyData.map(property => property.landlord_id))]
            
            const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
              .from('payment_methods')
              .select('*')
              .in('landlord_id', landlordIds)
              .eq('is_enabled', true)
            
            if (paymentMethodsError) throw paymentMethodsError
            
            setPaymentMethods(paymentMethodsData || [])
          }
        }
        
        // Fetch payments
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .in('lease_id', leaseIds)
          .order('due_date', { ascending: false })
        
        if (paymentError) throw paymentError
        
        setPayments(paymentData || [])
        
        // Calculate next payment
        if (leaseData.length > 0) {
          const today = new Date()
          const activeLease = leaseData[0] // Assuming the first lease is the most relevant
          const dueDay = activeLease.rent_due_day
          let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
          
          if (today.getDate() >= dueDay) {
            // If we've passed the due day this month, next payment is next month
            nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay)
          }
          
          // Check if there's already a payment for this due date
          const existingPayment = paymentData?.find(p => {
            const paymentDueDate = parseISO(p.due_date)
            return paymentDueDate.getMonth() === nextDueDate.getMonth() && 
                   paymentDueDate.getFullYear() === nextDueDate.getFullYear()
          })
          
          if (!existingPayment) {
            setNextPayment({
              lease_id: activeLease.id,
              amount: activeLease.rent_amount,
              due_date: format(nextDueDate, 'yyyy-MM-dd')
            })
            
            // Pre-select the lease and amount for the payment form
            setSelectedLease(activeLease.id)
            setPaymentAmount(activeLease.rent_amount.toString())
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching payments data')
    } finally {
      setLoading(false)
    }
  }

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    if (!selectedLease || !selectedPaymentMethod || !paymentAmount) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid payment amount')
      return
    }
    
    setSubmitting(true)
    try {
      // In a real app, this would integrate with a payment processor
      // For this demo, we'll simulate a successful payment
      
      const lease = leases.find(l => l.id === selectedLease)
      const today = new Date()
      const dueDay = lease?.rent_due_day || 1
      let dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
      
      if (today.getDate() > dueDay) {
        // If we've passed the due day this month, due date was this month
        dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
      } else {
        // Otherwise, due date is next month
        dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
      }
      
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            tenant_id: user.id,
            lease_id: selectedLease,
            amount: amount,
            payment_method: selectedPaymentMethod,
            payment_date: format(today, 'yyyy-MM-dd'),
            due_date: format(dueDate, 'yyyy-MM-dd'),
            status: 'completed', // In a real app, this might be 'pending' until confirmed
            notes: paymentNote || null,
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      
      setPayments([data, ...payments])
      setShowPaymentModal(false)
      setSelectedLease('')
      setSelectedPaymentMethod('')
      setPaymentAmount('')
      setPaymentNote('')
      setNextPayment(null) // Clear next payment since we just made it
      
      toast.success('Payment submitted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error submitting payment')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getUnitAndPropertyName = (leaseId: string) => {
    const lease = leases.find(l => l.id === leaseId)
    if (!lease) return 'Unknown'
    
    const unit = units.find(u => u.id === lease.unit_id)
    if (!unit) return 'Unknown Unit'
    
    const property = properties.find(p => p.id === unit.property_id)
    if (!property) return `Unit ${unit.unit_number}`
    
    return `${property.name} - Unit ${unit.unit_number}`
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="btn btn-primary"
          disabled={leases.length === 0 || paymentMethods.length === 0}
        >
          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
          Make Payment
        </button>
      </div>

      {/* Next payment card */}
      {nextPayment && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Next Payment Due</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">${nextPayment.amount}</p>
                <p className="text-sm text-gray-500">
                  Due on {format(parseISO(nextPayment.due_date), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getUnitAndPropertyName(nextPayment.lease_id)}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn btn-primary"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

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
              placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button
            onClick={fetchPaymentsData}
            className="btn btn-secondary"
            disabled={loading}
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </button>
        </div>
      </div>

      {/* Payments history */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
        </div>
        {filteredPayments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <li key={payment.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`
                      flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
                      ${payment.status === 'completed' ? 'bg-green-100' : 
                        payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}
                    `}>
                      {payment.status === 'completed' ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      ) : payment.status === 'pending' ? (
                        <ClockIcon className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h2 className="text-sm font-medium text-gray-900">
                          ${payment.amount}
                        </h2>
                        <span className={`
                          ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                        `}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        <span>
                          {getUnitAndPropertyName(payment.lease_id)}
                        </span>
                        <span className="mx-1">•</span>
                        <span>
                          {payment.payment_method === 'credit_card' ? 'Credit Card' : 
                            payment.payment_method === 'paypal' ? 'PayPal' : 
                            payment.payment_method === 'venmo' ? 'Venmo' : 
                            payment.payment_method === 'bank' ? 'Bank Transfer' : 'Cash'}
                        </span>
                        {payment.notes && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{payment.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {format(parseISO(payment.payment_date), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {format(parseISO(payment.due_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No payment history</h3>
            <p className="mt-1 text-gray-500">
              {leases.length > 0
                ? 'You haven\'t made any payments yet.'
                : 'You don\'t have any active leases to make payments for.'}
            </p>
            {leases.length > 0 && paymentMethods.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="btn btn-primary"
                >
                  Make a Payment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleMakePayment}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CreditCardIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Make a Payment
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="lease" className="form-label">
                            Property & Unit <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="lease"
                            className="form-select"
                            value={selectedLease}
                            onChange={(e) => {
                              setSelectedLease(e.target.value)
                              // Update amount based on selected lease
                              const lease = leases.find(l => l.id === e.target.value)
                              if (lease) {
                                setPaymentAmount(lease.rent_amount.toString())
                              }
                            }}
                            required
                          >
                            <option value="">Select a property & unit</option>
                            {leases.map((lease) => (
                              <option key={lease.id} value={lease.id}>
                                {getUnitAndPropertyName(lease.id)} - ${lease.rent_amount}/month
                              </option>
                            ))}
                          </select>
                        </div>
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
                              className="form-input pl-7"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="payment-method" className="form-label">
                            Payment Method <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="payment-method"
                            className="form-select"
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            required
                          >
                            <option value="">Select a payment method</option>
                            {paymentMethods.map((method) => (
                              <option key={method.id} value={method.method_type}>
                                {method.method_type === 'credit_card' ? 'Credit Card' : 
                                  method.method_type === 'paypal' ? 'PayPal' : 
                                  method.method_type === 'venmo' ? 'Venmo' : 
                                  method.method_type === 'bank' ? 'Bank Transfer' : 'Cash'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="note" className="form-label">
                            Note (Optional)
                          </label>
                          <input
                            type="text"
                            id="note"
                            className="form-input"
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            placeholder="e.g., Rent for June 2023"
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
                    {submitting ? 'Processing...' : 'Submit Payment'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
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

export default Payments
