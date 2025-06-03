import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  UserIcon,
  HomeIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

// Sample tenants data
const SAMPLE_TENANTS_MAP = {
  '00000000-0000-0000-0000-000000000003': {
    id: '00000000-0000-0000-0000-000000000003',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@example.com',
    phone: '555-111-2222',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
    created_at: '2023-01-01T00:00:00Z',
    leases: [
      {
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
        document_url: 'https://example.com/lease-301.pdf',
        unit: {
          id: '00000000-0000-0000-0000-000000000201',
          unit_number: '101',
          property: {
            id: '00000000-0000-0000-0000-000000000101',
            name: 'Sunset Apartments',
            landlord_id: '00000000-0000-0000-0000-000000000001'
          }
        }
      }
    ],
    payments: [
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
    ],
    maintenance_requests: [
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
    ]
  },
  '00000000-0000-0000-0000-000000000004': {
    id: '00000000-0000-0000-0000-000000000004',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@example.com',
    phone: '555-333-4444',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
    created_at: '2023-02-01T00:00:00Z',
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000302',
        unit_id: '00000000-0000-0000-0000-000000000202',
        tenant_id: '00000000-0000-0000-0000-000000000004',
        start_date: '2023-02-15',
        end_date: '2024-02-15',
        rent_amount: 1800,
        security_deposit: 1800,
        rent_due_day: 1,
        late_fee_amount: 75,
        late_fee_days: 5,
        status: 'active',
        document_url: 'https://example.com/lease-302.pdf',
        unit: {
          id: '00000000-0000-0000-0000-000000000202',
          unit_number: '102',
          property: {
            id: '00000000-0000-0000-0000-000000000101',
            name: 'Sunset Apartments',
            landlord_id: '00000000-0000-0000-0000-000000000001'
          }
        }
      }
    ],
    payments: [
      {
        id: '00000000-0000-0000-0000-000000000404',
        lease_id: '00000000-0000-0000-0000-000000000302',
        tenant_id: '00000000-0000-0000-0000-000000000004',
        amount: 1800,
        payment_date: '2023-08-01',
        due_date: '2023-08-01',
        payment_method: 'paypal',
        status: 'completed',
        transaction_id: 'txn_456789',
        notes: 'August rent',
        late_fee: null
      }
    ],
    maintenance_requests: [
      {
        id: '00000000-0000-0000-0000-000000000503',
        unit_id: '00000000-0000-0000-0000-000000000202',
        tenant_id: '00000000-0000-0000-0000-000000000004',
        title: 'AC not cooling properly',
        description: 'The air conditioner is running but not cooling the apartment. It\'s very hot inside.',
        priority: 'high',
        status: 'in_progress',
        created_at: '2023-08-18T14:30:00Z',
        completed_at: null,
        notes: 'Technician scheduled for tomorrow.',
        unit: {
          id: '00000000-0000-0000-0000-000000000202',
          unit_number: '102',
          property: {
            id: '00000000-0000-0000-0000-000000000101',
            name: 'Sunset Apartments'
          }
        }
      }
    ]
  },
  '00000000-0000-0000-0000-000000000005': {
    id: '00000000-0000-0000-0000-000000000005',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '555-555-6666',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
    created_at: '2023-03-01T00:00:00Z',
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000303',
        unit_id: '00000000-0000-0000-0000-000000000204',
        tenant_id: '00000000-0000-0000-0000-000000000005',
        start_date: '2023-03-01',
        end_date: '2024-03-01',
        rent_amount: 2500,
        security_deposit: 2500,
        rent_due_day: 1,
        late_fee_amount: 100,
        late_fee_days: 5,
        status: 'active',
        document_url: 'https://example.com/lease-303.pdf',
        unit: {
          id: '00000000-0000-0000-0000-000000000204',
          unit_number: '201',
          property: {
            id: '00000000-0000-0000-0000-000000000102',
            name: 'Riverside Condos',
            landlord_id: '00000000-0000-0000-0000-000000000001'
          }
        }
      }
    ],
    payments: [
      {
        id: '00000000-0000-0000-0000-000000000405',
        lease_id: '00000000-0000-0000-0000-000000000303',
        tenant_id: '00000000-0000-0000-0000-000000000005',
        amount: 2500,
        payment_date: '2023-08-01',
        due_date: '2023-08-01',
        payment_method: 'venmo',
        status: 'pending',
        transaction_id: null,
        notes: 'August rent',
        late_fee: null
      }
    ],
    maintenance_requests: [
      {
        id: '00000000-0000-0000-0000-000000000504',
        unit_id: '00000000-0000-0000-0000-000000000204',
        tenant_id: '00000000-0000-0000-0000-000000000005',
        title: 'Dishwasher not draining',
        description: 'The dishwasher fills with water but doesn\'t drain properly. There\'s standing water after each cycle.',
        priority: 'medium',
        status: 'open',
        created_at: '2023-08-19T10:45:00Z',
        completed_at: null,
        notes: null,
        unit: {
          id: '00000000-0000-0000-0000-000000000204',
          unit_number: '201',
          property: {
            id: '00000000-0000-0000-0000-000000000102',
            name: 'Riverside Condos'
          }
        }
      },
      {
        id: '00000000-0000-0000-0000-000000000505',
        unit_id: '00000000-0000-0000-0000-000000000204',
        tenant_id: '00000000-0000-0000-0000-000000000005',
        title: 'Garage door not opening',
        description: 'The automatic garage door opener isn\'t working. I can\'t get my car out of the garage.',
        priority: 'high',
        status: 'completed',
        created_at: '2023-08-15T08:20:00Z',
        completed_at: '2023-08-16T13:45:00Z',
        notes: 'Replaced garage door opener motor.',
        unit: {
          id: '00000000-0000-0000-0000-000000000204',
          unit_number: '201',
          property: {
            id: '00000000-0000-0000-0000-000000000102',
            name: 'Riverside Condos'
          }
        }
      }
    ]
  }
};

const TenantDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, useSampleData } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [tenant, setTenant] = useState<any>(null)
  const [leases, setLeases] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'system'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    console.log('TenantDetail component mounted, id:', id, 'user:', user?.id)
    console.log('useSampleData flag:', useSampleData)
    
    if (id && user) {
      if (useSampleData) {
        console.log('Using sample tenant data for id:', id)
        loadSampleTenantData(id)
      } else {
        fetchTenantDetails()
      }
    }
  }, [id, user, useSampleData])

  const loadSampleTenantData = (tenantId: string) => {
    console.log('Loading sample tenant data for id:', tenantId)
    
    // Find the tenant in our sample data
    const sampleTenantData = SAMPLE_TENANTS_MAP[tenantId]
    
    if (sampleTenantData) {
      console.log('Found sample tenant data:', sampleTenantData)
      setTenant(sampleTenantData)
      setLeases(sampleTenantData.leases || [])
      setPayments(sampleTenantData.payments || [])
      setMaintenanceRequests(sampleTenantData.maintenance_requests || [])
    } else {
      console.log('No sample tenant found for id:', tenantId)
      toast.error('Tenant not found')
      navigate('/landlord/tenants')
    }
    
    setLoading(false)
  }

  const fetchTenantDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      // Fetch tenant profile
      const { data: tenantData, error: tenantError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'tenant')
        .single()
      
      if (tenantError) throw tenantError
      
      setTenant(tenantData)
      
      // Fetch leases
      const { data: leaseData, error: leaseError } = await supabase
        .from('leases')
        .select(`
          *,
          unit:units(
            id,
            unit_number,
            property:properties(
              id,
              name,
              landlord_id
            )
          )
        `)
        .eq('tenant_id', id)
        .order('start_date', { ascending: false })
      
      if (leaseError) throw leaseError
      
      // Verify this tenant has a lease with a property owned by the landlord
      const hasAccess = leaseData?.some(lease => lease.unit.property.landlord_id === user.id)
      
      if (!hasAccess) {
        toast.error('You do not have permission to view this tenant')
        navigate('/landlord/tenants')
        return
      }
      
      setLeases(leaseData || [])
      
      // Fetch payments
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('tenant_id', id)
        .order('payment_date', { ascending: false })
      
      if (paymentError) throw paymentError
      
      setPayments(paymentData || [])
      
      // Fetch maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          unit:units(
            id,
            unit_number,
            property:properties(
              id,
              name
            )
          )
        `)
        .eq('tenant_id', id)
        .order('created_at', { ascending: false })
      
      if (maintenanceError) throw maintenanceError
      
      setMaintenanceRequests(maintenanceData || [])
    } catch (error: any) {
      toast.error(error.message || 'Error fetching tenant details')
      navigate('/landlord/tenants')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNotificationData(prev => ({ ...prev, [name]: value }))
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    if (!notificationData.title || !notificationData.message) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setSubmitting(true)
    try {
      if (useSampleData) {
        // Simulate sending a notification with sample data
        console.log('Simulating sending a notification with sample data:', notificationData)
        
        setShowSendNotificationModal(false)
        setNotificationData({
          title: '',
          message: '',
          type: 'system'
        })
        
        toast.success('Notification sent successfully')
        setSubmitting(false)
        return
      }
      
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: id,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            is_read: false
          }
        ])
      
      if (error) throw error
      
      setShowSendNotificationModal(false)
      setNotificationData({
        title: '',
        message: '',
        type: 'system'
      })
      
      toast.success('Notification sent successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error sending notification')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <UserIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Tenant not found</h3>
        <p className="mt-1 text-gray-500">The tenant you're looking for doesn't exist or you don't have access to them.</p>
        <div className="mt-6">
          <Link to="/landlord/tenants" className="btn btn-primary">
            Back to Tenants
          </Link>
        </div>
      </div>
    )
  }

  const activeLeases = leases.filter(lease => lease.status === 'active')
  const currentLease = activeLeases.length > 0 ? activeLeases[0] : null

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/landlord/tenants" className="mr-4 text-gray-400 hover:text-gray-500">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Tenant Details
          </h1>
        </div>
        <div className="flex space-x-2">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <button
            onClick={() => setShowSendNotificationModal(true)}
            className="btn btn-primary"
          >
            <BellIcon className="h-5 w-5 mr-2" />
            Send Notification
          </button>
        </div>
      </div>

      {/* Tenant details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Tenant Information</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                    {tenant.avatar_url ? (
                      <img
                        src={tenant.avatar_url}
                        alt={`${tenant.first_name} ${tenant.last_name}`}
                        className="h-24 w-24 rounded-full"
                      />
                    ) : (
                      <span className="text-primary-700 text-2xl font-medium">
                        {tenant.first_name[0]}{tenant.last_name[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium text-gray-900">
                    {tenant.first_name} {tenant.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">Tenant since {format(parseISO(tenant.created_at), 'MMMM yyyy')}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{tenant.email}</span>
                </div>
                {tenant.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{tenant.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              {currentLease ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Current Lease</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Property & Unit</h4>
                      <p className="text-gray-900">
                        {currentLease.unit.property.name} - Unit {currentLease.unit.unit_number}
                      </p>
                      <Link
                        to={`/landlord/units/${currentLease.unit.id}`}
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        View unit details
                      </Link>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Lease Period</h4>
                      <p className="text-gray-900">
                        {format(parseISO(currentLease.start_date), 'MMM d, yyyy')} - 
                        {format(parseISO(currentLease.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Rent</h4>
                      <p className="text-gray-900">${currentLease.rent_amount}/month</p>
                      <p className="text-sm text-gray-500">Due on day {currentLease.rent_due_day} of each month</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Security Deposit</h4>
                      <p className="text-gray-900">${currentLease.security_deposit || 0}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center h-full">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No active lease</p>
                  <p className="text-sm text-gray-500">This tenant doesn't have an active lease.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
          <Link to="/landlord/payments/add" className="btn btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Payment
          </Link>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(parseISO(payment.payment_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount}
                        {payment.late_fee && payment.late_fee > 0 && (
                          <span className="text-xs text-red-600 ml-1">
                            (incl. ${payment.late_fee} late fee)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                        `}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.payment_method === 'credit_card' ? 'Credit Card' : 
                          payment.payment_method === 'paypal' ? 'PayPal' : 
                          payment.payment_method === 'venmo' ? 'Venmo' : 
                          payment.payment_method === 'cash' ? 'Cash' : 'Other'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.notes ? (
                          <span className="truncate max-w-xs block">{payment.notes}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/landlord/payments/${payment.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No payment history</h3>
              <p className="mt-1 text-gray-500">This tenant doesn't have any payment records.</p>
              <div className="mt-6">
                <Link to="/landlord/payments/add" className="btn btn-primary">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Payment
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Requests */}
      {maintenanceRequests.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Maintenance Requests</h2>
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
                            {request.unit.property.name} - Unit {request.unit.unit_number}
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

      {/* Lease History */}
      {leases.length > 1 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Lease History</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {leases.filter(lease => lease.id !== (currentLease?.id || '')).map((lease) => (
                <div key={lease.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {lease.unit.property.name} - Unit {lease.unit.unit_number}
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
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Rent</h4>
                      <p className="text-gray-900">${lease.rent_amount}/month</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Security Deposit</h4>
                      <p className="text-gray-900">${lease.security_deposit || 0}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link
                      to={`/landlord/units/${lease.unit.id}`}
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      View unit details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showSendNotificationModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSendNotification}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Send Notification to {tenant.first_name} {tenant.last_name}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="title" className="form-label">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-input"
                            value={notificationData.title}
                            onChange={handleNotificationInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="form-label">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            className="form-input"
                            value={notificationData.message}
                            onChange={handleNotificationInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="type" className="form-label">
                            Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="type"
                            name="type"
                            className="form-select"
                            value={notificationData.type}
                            onChange={handleNotificationInputChange}
                            required
                          >
                            <option value="system">System</option>
                            <option value="payment">Payment</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="lease">Lease</option>
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
                    {submitting ? 'Sending...' : 'Send Notification'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowSendNotificationModal(false)}
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

export default TenantDetail
