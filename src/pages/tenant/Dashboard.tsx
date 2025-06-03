import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns'

// Sample data for development/testing
const SAMPLE_LEASE = {
  id: '00000000-0000-0000-0000-000000000301',
  unit_id: '00000000-0000-0000-0000-000000000201',
  tenant_id: '00000000-0000-0000-0000-000000000003',
  start_date: '2023-01-01',
  end_date: '2024-01-01',
  rent_amount: 1200,
  security_deposit: 1200,
  rent_due_day: 1,
  late_fee_amount: 50,
  late_fee_days: 5,
  status: 'active',
  document_url: 'https://example.com/lease-301.pdf'
};

const SAMPLE_UNIT = {
  id: '00000000-0000-0000-0000-000000000201',
  property_id: '00000000-0000-0000-0000-000000000101',
  unit_number: '101',
  bedrooms: 1,
  bathrooms: 1,
  square_feet: 750,
  rent_amount: 1200,
  status: 'occupied',
  description: 'Cozy 1-bedroom apartment with balcony',
  image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
};

const SAMPLE_PROPERTY = {
  id: '00000000-0000-0000-0000-000000000101',
  landlord_id: '00000000-0000-0000-0000-000000000001',
  name: 'Sunset Apartments',
  address: '123 Sunset Blvd',
  city: 'Los Angeles',
  state: 'CA',
  zip: '90001',
  description: 'Modern apartment complex with great amenities',
  image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  landlord: {
    id: '00000000-0000-0000-0000-000000000001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567'
  }
};

const SAMPLE_PAYMENTS = [
  {
    id: '00000000-0000-0000-0000-000000000401',
    lease_id: '00000000-0000-0000-0000-000000000301',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    amount: 1200,
    payment_date: '2023-06-01',
    due_date: '2023-06-01',
    payment_method: 'credit_card',
    status: 'completed',
    transaction_id: 'txn_123456',
    notes: 'June rent',
    late_fee: null
  },
  {
    id: '00000000-0000-0000-0000-000000000402',
    lease_id: '00000000-0000-0000-0000-000000000301',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    amount: 1200,
    payment_date: '2023-07-01',
    due_date: '2023-07-01',
    payment_method: 'credit_card',
    status: 'completed',
    transaction_id: 'txn_234567',
    notes: 'July rent',
    late_fee: null
  },
  {
    id: '00000000-0000-0000-0000-000000000403',
    lease_id: '00000000-0000-0000-0000-000000000301',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    amount: 1250,
    payment_date: '2023-08-07',
    due_date: '2023-08-01',
    payment_method: 'credit_card',
    status: 'completed',
    transaction_id: 'txn_345678',
    notes: 'August rent (late)',
    late_fee: 50
  }
];

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
    notes: 'Replaced washer and fixed leak.'
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
    notes: null
  }
];

const SAMPLE_PAYMENT_METHODS = [
  {
    id: '00000000-0000-0000-0000-000000000901',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    method_type: 'stripe',
    is_enabled: true,
    account_email: 'john.smith@example.com',
    account_username: null,
    account_details: null,
    instructions: 'Pay securely with credit or debit card'
  },
  {
    id: '00000000-0000-0000-0000-000000000902',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    method_type: 'paypal',
    is_enabled: true,
    account_email: 'john.smith@example.com',
    account_username: null,
    account_details: null,
    instructions: 'Send payment to the email address listed'
  },
  {
    id: '00000000-0000-0000-0000-000000000903',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    method_type: 'venmo',
    is_enabled: true,
    account_email: null,
    account_username: '@john-smith-landlord',
    account_details: null,
    instructions: 'Send payment to the Venmo username listed'
  }
];

const Dashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [lease, setLease] = useState<any>(null)
  const [unit, setUnit] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [landlord, setLandlord] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [nextPayment, setNextPayment] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [useSampleData, setUseSampleData] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Check if we should use sample data (for development/testing)
      const useDevData = import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      if (useDevData) {
        console.log('Using sample dashboard data')
        setUseSampleData(true)
        setLease(SAMPLE_LEASE)
        setUnit(SAMPLE_UNIT)
        setProperty(SAMPLE_PROPERTY)
        setLandlord(SAMPLE_PROPERTY.landlord)
        setPayments(SAMPLE_PAYMENTS)
        setMaintenanceRequests(SAMPLE_MAINTENANCE_REQUESTS)
        setPaymentMethods(SAMPLE_PAYMENT_METHODS)
        
        // Calculate next payment
        const today = new Date()
        const dueDay = SAMPLE_LEASE.rent_due_day
        let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
        
        if (today.getDate() >= dueDay) {
          // If we've passed the due day this month, next payment is next month
          nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay)
        }
        
        // Check if there's already a payment for this due date
        const existingPayment = SAMPLE_PAYMENTS.find(p => {
          if (!p.due_date) return false
          const paymentDueDate = new Date(p.due_date)
          return paymentDueDate.getMonth() === nextDueDate.getMonth() && 
                 paymentDueDate.getFullYear() === nextDueDate.getFullYear()
        })
        
        if (!existingPayment) {
          setNextPayment({
            amount: SAMPLE_LEASE.rent_amount,
            due_date: nextDueDate.toISOString().split('T')[0]
          })
        }
        
        setLoading(false)
        return
      }
      
      // Fetch active lease
      const { data: leaseData, error: leaseError } = await supabase
        .from('leases')
        .select('*')
        .eq('tenant_id', user.id)
        .eq('status', 'active')
        .single()
      
      if (leaseError && leaseError.code !== 'PGRST116') {
        // PGRST116 is the error code for no rows returned
        throw leaseError
      }
      
      if (leaseData) {
        setLease(leaseData)
        
        // Fetch unit details
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('*')
          .eq('id', leaseData.unit_id)
          .single()
        
        if (unitError) throw unitError
        
        setUnit(unitData)
        
        // Fetch property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*, landlord:landlord_id(id, first_name, last_name, email, phone)')
          .eq('id', unitData.property_id)
          .single()
        
        if (propertyError) throw propertyError
        
        setProperty(propertyData)
        setLandlord(propertyData.landlord)
        
        // Fetch payment methods
        const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('landlord_id', propertyData.landlord_id)
          .eq('is_enabled', true)
        
        if (paymentMethodsError) throw paymentMethodsError
        
        setPaymentMethods(paymentMethodsData || [])
        
        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('lease_id', leaseData.id)
          .order('payment_date', { ascending: false })
          .limit(5)
        
        if (paymentsError) throw paymentsError
        
        setPayments(paymentsData || [])
        
        // Calculate next payment
        const today = new Date()
        const dueDay = leaseData.rent_due_day
        let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
        
        if (today.getDate() >= dueDay) {
          // If we've passed the due day this month, next payment is next month
          nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay)
        }
        
        // Check if there's already a payment for this due date
        const existingPayment = (paymentsData || []).find(p => {
          if (!p.due_date) return false
          try {
            const paymentDueDate = parseISO(p.due_date)
            return paymentDueDate.getMonth() === nextDueDate.getMonth() && 
                   paymentDueDate.getFullYear() === nextDueDate.getFullYear()
          } catch (err) {
            console.error('Error parsing payment due date:', err)
            return false
          }
        })
        
        if (!existingPayment) {
          setNextPayment({
            amount: leaseData.rent_amount,
            due_date: nextDueDate.toISOString().split('T')[0]
          })
        }
      }
      
      // Fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (maintenanceError) throw maintenanceError
      
      setMaintenanceRequests(maintenanceData || [])
    } catch (error: any) {
      console.error('Error in fetchDashboardData:', error)
      toast.error(error.message || 'Error fetching dashboard data')
      
      // If there's an error, use sample data in development mode
      if (import.meta.env.DEV) {
        console.log('Using sample data due to error')
        setUseSampleData(true)
        setLease(SAMPLE_LEASE)
        setUnit(SAMPLE_UNIT)
        setProperty(SAMPLE_PROPERTY)
        setLandlord(SAMPLE_PROPERTY.landlord)
        setPayments(SAMPLE_PAYMENTS)
        setMaintenanceRequests(SAMPLE_MAINTENANCE_REQUESTS)
        setPaymentMethods(SAMPLE_PAYMENT_METHODS)
        
        // Calculate next payment
        const today = new Date()
        const dueDay = SAMPLE_LEASE.rent_due_day
        let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay)
        
        if (today.getDate() >= dueDay) {
          // If we've passed the due day this month, next payment is next month
          nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay)
        }
        
        setNextPayment({
          amount: SAMPLE_LEASE.rent_amount,
          due_date: nextDueDate.toISOString().split('T')[0]
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | null | undefined, formatString: string, fallback: string = 'N/A') => {
    if (!dateString) return fallback
    
    try {
      const date = parseISO(dateString)
      return format(date, formatString)
    } catch (error) {
      console.error('Error formatting date:', error, dateString)
      return fallback
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
        <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
        <div className="flex items-center space-x-4">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <div className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Lease Information */}
      {lease ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Lease</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <HomeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{property?.name} - Unit {unit?.unit_number}</p>
                      <p className="text-sm text-gray-500">{property?.address}</p>
                      <p className="text-sm text-gray-500">{property?.city}, {property?.state} {property?.zip}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">${lease.rent_amount}/month (due on the {lease.rent_due_day}{lease.rent_due_day === 1 ? 'st' : lease.rent_due_day === 2 ? 'nd' : lease.rent_due_day === 3 ? 'rd' : 'th'})</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {safeFormatDate(lease.start_date, 'MMM d, yyyy')} - {safeFormatDate(lease.end_date, 'MMM d, yyyy')}
                    </span>
                  </div>
                  {lease.document_url && (
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <a
                        href={lease.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500"
                      >
                        View Lease Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Landlord Contact</h3>
                <div className="space-y-3">
                  <p className="text-gray-900">{landlord?.first_name} {landlord?.last_name}</p>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${landlord?.email}`} className="text-primary-600 hover:text-primary-500">
                      {landlord?.email}
                    </a>
                  </div>
                  {landlord?.phone && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${landlord?.phone}`} className="text-primary-600 hover:text-primary-500">
                        {landlord?.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <HomeIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Active Lease</h3>
          <p className="mt-1 text-gray-500">You don't have an active lease at the moment.</p>
        </div>
      )}

      {/* Next Payment & Payment Methods */}
      {lease && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Next Payment */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Next Payment</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {nextPayment ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${nextPayment.amount}</p>
                      <p className="text-sm text-gray-500">
                        Due on {safeFormatDate(nextPayment.due_date, 'MMMM d, yyyy', 'the 1st of next month')}
                      </p>
                    </div>
                    <Link to="/tenant/payments" className="btn btn-primary">
                      Make Payment
                    </Link>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Methods Accepted</h3>
                    <div className="flex flex-wrap gap-2">
                      {paymentMethods.map((method) => (
                        <span
                          key={method.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {method.method_type === 'stripe' ? 'Credit Card' : 
                            method.method_type === 'paypal' ? 'PayPal' : 
                            method.method_type === 'venmo' ? 'Venmo' : 
                            method.method_type === 'bank' ? 'Bank Transfer' : 'Cash'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircleIcon className="h-12 w-12 mx-auto text-green-500" />
                  <p className="mt-2 text-lg font-medium text-gray-900">You're all paid up!</p>
                  <p className="mt-1 text-gray-500">No payments due at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Payments</h2>
                <Link to="/tenant/payments" className="text-sm text-primary-600 hover:text-primary-500">
                  View all
                </Link>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {payments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {payments.slice(0, 3).map((payment) => (
                    <li key={payment.id} className="py-3">
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
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {payment.payment_method === 'credit_card' ? 'Credit Card' : 
                                payment.payment_method === 'paypal' ? 'PayPal' : 
                                payment.payment_method === 'venmo' ? 'Venmo' : 
                                payment.payment_method === 'cash' ? 'Cash' : 'Other'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {safeFormatDate(payment.payment_date, 'MMM d, yyyy', 'Date not available')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${payment.amount}</p>
                          <p className={`text-xs ${
                            payment.status === 'completed' ? 'text-green-600' : 
                            payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No payment history yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Requests */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Maintenance Requests</h2>
            <div className="flex space-x-3">
              <Link to="/tenant/maintenance" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
              {lease && (
                <Link to="/tenant/maintenance" className="btn btn-primary text-sm">
                  New Request
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {maintenanceRequests.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {maintenanceRequests.slice(0, 3).map((request) => (
                <li key={request.id}>
                  <Link to={`/tenant/maintenance/${request.id}`} className="block hover:bg-gray-50 py-3">
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
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{request.title}</p>
                          <p className="text-xs text-gray-500">
                            {safeFormatDate(request.created_at, 'MMM d, yyyy', 'Date not available')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                            request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                          {request.status === 'open' ? 'Open' : 
                            request.status === 'in_progress' ? 'In Progress' : 
                            request.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                        <ArrowRightIcon className="ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4">
              <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No maintenance requests yet</p>
              {lease && (
                <Link to="/tenant/maintenance" className="mt-3 btn btn-primary inline-block">
                  Submit a Request
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
