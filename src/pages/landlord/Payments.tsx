import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns'

interface Payment {
  id: string
  lease_id: string
  tenant_id: string
  amount: number
  payment_date: string
  due_date: string
  payment_method: 'credit_card' | 'paypal' | 'venmo' | 'cash' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id: string | null
  notes: string | null
  late_fee: number | null
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

const Payments = () => {
  const { user } = useAuthStore()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMonth, setFilterMonth] = useState<string>('current')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  })

  useEffect(() => {
    fetchPayments()
  }, [user, filterMonth, filterStatus])

  const fetchPayments = async () => {
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
        setPayments([])
        setLoading(false)
        return
      }
      
      const propertyIds = properties.map(p => p.id)
      
      // Get all units in these properties
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id, unit_number, property_id')
        .in('property_id', propertyIds)
      
      if (unitsError) throw unitsError
      
      if (!units.length) {
        setPayments([])
        setLoading(false)
        return
      }
      
      // Add property info to units
      const unitsWithProperty = units.map(unit => ({
        ...unit,
        property: properties.find(p => p.id === unit.property_id)
      }))
      
      const unitIds = units.map(u => u.id)
      
      // Get all leases for these units
      const { data: leases, error: leasesError } = await supabase
        .from('leases')
        .select('id, unit_id, tenant_id')
        .in('unit_id', unitIds)
      
      if (leasesError) throw leasesError
      
      if (!leases.length) {
        setPayments([])
        setLoading(false)
        return
      }
      
      const leaseIds = leases.map(l => l.id)
      const tenantIds = [...new Set(leases.map(l => l.tenant_id))]
      
      // Get tenant profiles
      const { data: tenants, error: tenantsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', tenantIds)
      
      if (tenantsError) throw tenantsError
      
      // Determine date range based on filter
      let startDate, endDate
      const now = new Date()
      
      if (filterMonth === 'current') {
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
      } else if (filterMonth === 'last') {
        const lastMonth = subMonths(now, 1)
        startDate = startOfMonth(lastMonth)
        endDate = endOfMonth(lastMonth)
      } else if (filterMonth === 'all') {
        startDate = null
        endDate = null
      }
      
      // Build query for payments
      let query = supabase
        .from('payments')
        .select('*')
        .in('lease_id', leaseIds)
        .order('payment_date', { ascending: false })
      
      // Apply date filter if not "all"
      if (startDate && endDate) {
        query = query
          .gte('payment_date', format(startDate, 'yyyy-MM-dd'))
          .lte('payment_date', format(endDate, 'yyyy-MM-dd'))
      }
      
      // Apply status filter if not "all"
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }
      
      const { data: paymentsData, error: paymentsError } = await query
      
      if (paymentsError) throw paymentsError
      
      // Combine the data
      const paymentsWithDetails = paymentsData.map((payment: any) => {
        const lease = leases.find(l => l.id === payment.lease_id)
        const tenant = lease ? tenants.find(t => t.id === lease.tenant_id) : null
        const unit = lease ? unitsWithProperty.find(u => u.id === lease.unit_id) : null
        
        return {
          ...payment,
          tenant: tenant || { first_name: 'Unknown', last_name: 'Tenant', email: '' },
          unit: unit || { unit_number: 'Unknown', property: { name: 'Unknown Property' } }
        }
      })
      
      setPayments(paymentsWithDetails)
      
      // Calculate stats
      const total = paymentsWithDetails.reduce((sum, payment) => sum + payment.amount, 0)
      const completed = paymentsWithDetails
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0)
      const pending = paymentsWithDetails
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0)
      const overdue = paymentsWithDetails
        .filter(p => {
          const dueDate = parseISO(p.due_date)
          return p.status === 'pending' && dueDate < now
        })
        .reduce((sum, payment) => sum + payment.amount, 0)
      
      setStats({
        total,
        completed,
        pending,
        overdue
      })
    } catch (error: any) {
      toast.error(error.message || 'Error fetching payments')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    // For this demo, we'll just show a success message
    toast.success('Payments exported to CSV')
  }

  const filteredPayments = payments.filter(payment => {
    const fullName = `${payment.tenant.first_name} ${payment.tenant.last_name}`.toLowerCase()
    const propertyUnit = `${payment.unit.property.name} ${payment.unit.unit_number}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    return (
      fullName.includes(searchLower) ||
      propertyUnit.includes(searchLower) ||
      payment.payment_method.includes(searchLower) ||
      payment.status.includes(searchLower)
    )
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      case 'refunded':
        return <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
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
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            className="btn btn-secondary flex items-center"
            onClick={handleExportCSV}
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${stats.total.toFixed(2)}</div>
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
                    <div className="text-lg font-medium text-gray-900">${stats.completed.toFixed(2)}</div>
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
                <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${stats.pending.toFixed(2)}</div>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${stats.overdue.toFixed(2)}</div>
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
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="form-input"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="current">Current Month</option>
              <option value="last">Last Month</option>
              <option value="all">All Time</option>
            </select>
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              type="button"
              className="btn btn-secondary flex items-center justify-center"
              onClick={fetchPayments}
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Payments list */}
      {payments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No payments</h3>
          <p className="mt-1 text-gray-500">No payments have been recorded yet.</p>
        </div>
      ) : filteredPayments.length === 0 ? (
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
                setFilterMonth('current')
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property / Unit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {payment.tenant.first_name[0]}
                          {payment.tenant.last_name[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.tenant.first_name} {payment.tenant.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{payment.tenant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.unit.property.name}</div>
                      <div className="text-sm text-gray-500">Unit {payment.unit.unit_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                      {payment.late_fee && payment.late_fee > 0 && (
                        <div className="text-xs text-red-600">+${payment.late_fee} late fee</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(payment.payment_date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(payment.due_date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_method === 'credit_card' ? 'Credit Card' : 
                        payment.payment_method === 'paypal' ? 'PayPal' : 
                        payment.payment_method === 'venmo' ? 'Venmo' : 
                        payment.payment_method === 'cash' ? 'Cash' : 'Other'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`
                          ml-1.5 text-xs font-medium
                          ${payment.status === 'completed' ? 'text-green-800' : 
                            payment.status === 'pending' ? 'text-yellow-800' : 
                            payment.status === 'failed' ? 'text-red-800' : 
                            'text-gray-800'}
                        `}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments
