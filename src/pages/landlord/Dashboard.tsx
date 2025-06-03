import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  HomeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns'

// Sample data for development/testing
const SAMPLE_PROPERTIES = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    description: 'Modern apartment complex with great amenities',
    image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Riverside Condos',
    address: '456 River St',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    description: 'Luxury condos with river views',
    image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
  }
];

const SAMPLE_UNITS = [
  {
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
  },
  {
    id: '00000000-0000-0000-0000-000000000202',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '102',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1000,
    rent_amount: 1800,
    status: 'occupied',
    description: 'Spacious 2-bedroom apartment with modern kitchen',
    image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
  },
  {
    id: '00000000-0000-0000-0000-000000000203',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '103',
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 900,
    rent_amount: 1600,
    status: 'vacant',
    description: 'Bright 2-bedroom apartment with city views',
    image_url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'
  },
  {
    id: '00000000-0000-0000-0000-000000000204',
    property_id: '00000000-0000-0000-0000-000000000102',
    unit_number: '201',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    rent_amount: 2500,
    status: 'occupied',
    description: 'Luxury 3-bedroom condo with river views',
    image_url: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'
  },
  {
    id: '00000000-0000-0000-0000-000000000205',
    property_id: '00000000-0000-0000-0000-000000000102',
    unit_number: '202',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    rent_amount: 2200,
    status: 'vacant',
    description: 'Modern 2-bedroom condo with updated appliances',
    image_url: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
  }
];

const SAMPLE_TENANTS = [
  {
    id: '00000000-0000-0000-0000-000000000003',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@example.com',
    phone: '555-111-2222',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@example.com',
    phone: '555-333-4444',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '555-555-6666',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

const SAMPLE_LEASES = [
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
    document_url: 'https://example.com/lease-301.pdf'
  },
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
    document_url: 'https://example.com/lease-302.pdf'
  },
  {
    id: '00000000-0000-0000-0000-000000000303',
    unit_id: '00000000-0000-0000-0000-000000000204',
    tenant_id: '00000000-0000-0000-0000-000000000005',
    start_date: '2023-03-01',
    end_date: '2023-12-15',
    rent_amount: 2500,
    security_deposit: 2500,
    rent_due_day: 1,
    late_fee_amount: 100,
    late_fee_days: 5,
    status: 'active',
    document_url: 'https://example.com/lease-303.pdf'
  }
];

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
    late_fee: null,
    tenant: {
      id: '00000000-0000-0000-0000-000000000003',
      first_name: 'Michael',
      last_name: 'Brown'
    },
    lease: {
      unit: {
        id: '00000000-0000-0000-0000-000000000201',
        unit_number: '101',
        property: {
          id: '00000000-0000-0000-0000-000000000101',
          name: 'Sunset Apartments'
        }
      }
    }
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
    late_fee: null,
    tenant: {
      id: '00000000-0000-0000-0000-000000000003',
      first_name: 'Michael',
      last_name: 'Brown'
    },
    lease: {
      unit: {
        id: '00000000-0000-0000-0000-000000000201',
        unit_number: '101',
        property: {
          id: '00000000-0000-0000-0000-000000000101',
          name: 'Sunset Apartments'
        }
      }
    }
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
    late_fee: 50,
    tenant: {
      id: '00000000-0000-0000-0000-000000000003',
      first_name: 'Michael',
      last_name: 'Brown'
    },
    lease: {
      unit: {
        id: '00000000-0000-0000-0000-000000000201',
        unit_number: '101',
        property: {
          id: '00000000-0000-0000-0000-000000000101',
          name: 'Sunset Apartments'
        }
      }
    }
  },
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
    late_fee: null,
    tenant: {
      id: '00000000-0000-0000-0000-000000000004',
      first_name: 'Emily',
      last_name: 'Davis'
    },
    lease: {
      unit: {
        id: '00000000-0000-0000-0000-000000000202',
        unit_number: '102',
        property: {
          id: '00000000-0000-0000-0000-000000000101',
          name: 'Sunset Apartments'
        }
      }
    }
  },
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
    late_fee: null,
    tenant: {
      id: '00000000-0000-0000-0000-000000000005',
      first_name: 'David',
      last_name: 'Wilson'
    },
    lease: {
      unit: {
        id: '00000000-0000-0000-0000-000000000204',
        unit_number: '201',
        property: {
          id: '00000000-0000-0000-0000-000000000102',
          name: 'Riverside Condos'
        }
      }
    }
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
    notes: 'Replaced washer and fixed leak.',
    tenant: {
      id: '00000000-0000-0000-0000-000000000003',
      first_name: 'Michael',
      last_name: 'Brown'
    },
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
    tenant: {
      id: '00000000-0000-0000-0000-000000000003',
      first_name: 'Michael',
      last_name: 'Brown'
    },
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
    tenant: {
      id: '00000000-0000-0000-0000-000000000004',
      first_name: 'Emily',
      last_name: 'Davis'
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000202',
      unit_number: '102',
      property: {
        id: '00000000-0000-0000-0000-000000000101',
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
    created_at: '2023-08-19T10:45:00Z',
    completed_at: null,
    notes: null,
    tenant: {
      id: '00000000-0000-0000-0000-000000000005',
      first_name: 'David',
      last_name: 'Wilson'
    },
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
    tenant: {
      id: '00000000-0000-0000-0000-000000000005',
      first_name: 'David',
      last_name: 'Wilson'
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000204',
      unit_number: '201',
      property: {
        id: '00000000-0000-0000-0000-000000000102',
        name: 'Riverside Condos'
      }
    }
  }
];

const SAMPLE_NOTIFICATIONS = [
  {
    id: '00000000-0000-0000-0000-000000000801',
    created_at: '2023-08-20T09:15:00Z',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'New Maintenance Request',
    message: 'Michael Brown has submitted a new maintenance request for Sunset Apartments - Unit 101.',
    type: 'maintenance',
    is_read: false,
    related_id: '00000000-0000-0000-0000-000000000502'
  },
  {
    id: '00000000-0000-0000-0000-000000000802',
    created_at: '2023-08-19T10:45:00Z',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'New Maintenance Request',
    message: 'David Wilson has submitted a new maintenance request for Riverside Condos - Unit 201.',
    type: 'maintenance',
    is_read: false,
    related_id: '00000000-0000-0000-0000-000000000504'
  },
  {
    id: '00000000-0000-0000-0000-000000000803',
    created_at: '2023-08-18T14:30:00Z',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'New Maintenance Request',
    message: 'Emily Davis has submitted a new maintenance request for Sunset Apartments - Unit 102.',
    type: 'maintenance',
    is_read: true,
    related_id: '00000000-0000-0000-0000-000000000503'
  },
  {
    id: '00000000-0000-0000-0000-000000000804',
    created_at: '2023-08-07T09:30:00Z',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Late Rent Payment',
    message: 'Michael Brown has made a late rent payment for Sunset Apartments - Unit 101.',
    type: 'payment',
    is_read: true,
    related_id: '00000000-0000-0000-0000-000000000403'
  },
  {
    id: '00000000-0000-0000-0000-000000000805',
    created_at: '2023-08-01T10:15:00Z',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Rent Payment Received',
    message: 'Emily Davis has paid rent for Sunset Apartments - Unit 102.',
    type: 'payment',
    is_read: true,
    related_id: '00000000-0000-0000-0000-000000000404'
  }
];

// Sample monthly revenue data
const SAMPLE_MONTHLY_REVENUE = [
  { month: 'Mar 2023', amount: 5000 },
  { month: 'Apr 2023', amount: 5500 },
  { month: 'May 2023', amount: 5500 },
  { month: 'Jun 2023', amount: 5500 },
  { month: 'Jul 2023', amount: 5500 },
  { month: 'Aug 2023', amount: 5550 }
];

// Create a sample landlord user for development
const SAMPLE_LANDLORD_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  role: 'landlord',
  profile: {
    id: '00000000-0000-0000-0000-000000000001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    role: 'landlord',
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
};

const Dashboard = () => {
  const { user, useSampleData, setUseSampleData } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    properties: 0,
    units: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    tenants: 0,
    openMaintenanceRequests: 0,
    totalRentCollected: 0,
    pendingPayments: 0,
    upcomingLeaseRenewals: 0
  })
  const [recentPayments, setRecentPayments] = useState<any[]>([])
  const [recentMaintenanceRequests, setRecentMaintenanceRequests] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])

  useEffect(() => {
    // Check if we should use sample data
    const shouldUseSampleData = import.meta.env.DEV && 
      (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    console.log('Should use sample data:', shouldUseSampleData);
    
    if (shouldUseSampleData) {
      // Set the global sample data flag
      setUseSampleData(true);
      
      // If we're using sample data and don't have a user, create a sample user
      if (!user) {
        console.log('Setting sample landlord user');
        useAuthStore.setState({ 
          user: SAMPLE_LANDLORD_USER as any,
          useSampleData: true
        });
      }
      
      // Initialize with sample data
      initializeSampleData();
    } else {
      fetchDashboardData();
    }
  }, [user]);

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

  // Initialize with sample data
  const initializeSampleData = () => {
    console.log('Initializing sample dashboard data for landlord')
    
    // Calculate stats from sample data
    const occupiedUnits = SAMPLE_UNITS.filter(u => u.status === 'occupied').length
    const vacantUnits = SAMPLE_UNITS.filter(u => u.status === 'vacant').length
    const tenantIds = [...new Set(SAMPLE_LEASES.map(l => l.tenant_id))]
    
    // Count upcoming lease renewals (within next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const upcomingRenewals = SAMPLE_LEASES.filter(lease => {
      try {
        const endDate = new Date(lease.end_date)
        return endDate <= thirtyDaysFromNow
      } catch (error) {
        return false
      }
    }).length
    
    // Count open maintenance requests
    const openRequests = SAMPLE_MAINTENANCE_REQUESTS.filter(req => 
      req.status === 'open' || req.status === 'in_progress'
    ).length
    
    // Calculate total rent collected this month
    const currentMonthStart = startOfMonth(new Date())
    const currentMonthEnd = endOfMonth(new Date())
    
    const monthlyPayments = SAMPLE_PAYMENTS.filter(payment => {
      try {
        const paymentDate = new Date(payment.payment_date)
        return payment.status === 'completed' && 
               paymentDate >= currentMonthStart && 
               paymentDate <= currentMonthEnd
      } catch (error) {
        return false
      }
    })
    
    const totalRentCollected = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0)
    
    // Count pending payments
    const pendingPayments = SAMPLE_PAYMENTS.filter(payment => payment.status === 'pending').length
    
    setStats({
      properties: SAMPLE_PROPERTIES.length,
      units: SAMPLE_UNITS.length,
      occupiedUnits,
      vacantUnits,
      tenants: tenantIds.length,
      openMaintenanceRequests: openRequests,
      totalRentCollected,
      pendingPayments,
      upcomingLeaseRenewals: upcomingRenewals
    })
    
    setRecentPayments(SAMPLE_PAYMENTS)
    setRecentMaintenanceRequests(SAMPLE_MAINTENANCE_REQUESTS)
    setNotifications(SAMPLE_NOTIFICATIONS)
    setMonthlyRevenue(SAMPLE_MONTHLY_REVENUE)
    
    setLoading(false)
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    
    try {
      // Check if we should use sample data (for development/testing)
      const useDevData = import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      if (useDevData) {
        setUseSampleData(true)
        initializeSampleData()
        return
      }
      
      if (!user || !user.id) {
        console.log('No user found, using sample data')
        setUseSampleData(true)
        initializeSampleData()
        return
      }
      
      // Fetch properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('landlord_id', user.id)
      
      if (propertiesError) throw propertiesError
      
      const propertyIds = properties?.map(p => p.id) || []
      
      if (propertyIds.length === 0) {
        console.log('No properties found, using sample data')
        setUseSampleData(true)
        initializeSampleData()
        return
      }
      
      // Fetch units
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id, status')
        .in('property_id', propertyIds)
      
      if (unitsError) throw unitsError
      
      const unitIds = units?.map(u => u.id) || []
      const occupiedUnits = units?.filter(u => u.status === 'occupied').length || 0
      const vacantUnits = units?.filter(u => u.status === 'vacant').length || 0
      
      // Fetch tenants with active leases
      const { data: activeLeases, error: leasesError } = await supabase
        .from('leases')
        .select('id, tenant_id, end_date')
        .in('unit_id', unitIds)
        .eq('status', 'active')
      
      if (leasesError) throw leasesError
      
      const tenantIds = [...new Set(activeLeases?.map(l => l.tenant_id) || [])]
      
      // Count upcoming lease renewals (within next 30 days)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      
      const upcomingRenewals = activeLeases?.filter(lease => {
        try {
          const endDate = new Date(lease.end_date)
          return endDate <= thirtyDaysFromNow
        } catch (error) {
          return false
        }
      }).length || 0
      
      // Fetch open maintenance requests
      const { data: openRequests, error: requestsError } = await supabase
        .from('maintenance_requests')
        .select('id')
        .in('unit_id', unitIds)
        .in('status', ['open', 'in_progress'])
      
      if (requestsError) throw requestsError
      
      // Fetch recent payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          tenant:profiles(
            id,
            first_name,
            last_name
          ),
          lease:leases(
            unit:units(
              id,
              unit_number,
              property:properties(
                id,
                name
              )
            )
          )
        `)
        .in('lease_id', activeLeases?.map(l => l.id) || [])
        .order('payment_date', { ascending: false })
        .limit(5)
      
      if (paymentsError) throw paymentsError
      
      // Calculate total rent collected (completed payments this month)
      const currentMonthStart = startOfMonth(new Date())
      const currentMonthEnd = endOfMonth(new Date())
      
      const { data: monthlyPayments, error: monthlyPaymentsError } = await supabase
        .from('payments')
        .select('amount')
        .in('lease_id', activeLeases?.map(l => l.id) || [])
        .eq('status', 'completed')
        .gte('payment_date', currentMonthStart.toISOString())
        .lte('payment_date', currentMonthEnd.toISOString())
      
      if (monthlyPaymentsError) throw monthlyPaymentsError
      
      const totalRentCollected = monthlyPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
      
      // Fetch pending payments
      const { data: pendingPayments, error: pendingPaymentsError } = await supabase
        .from('payments')
        .select('id')
        .in('lease_id', activeLeases?.map(l => l.id) || [])
        .eq('status', 'pending')
      
      if (pendingPaymentsError) throw pendingPaymentsError
      
      // Fetch recent maintenance requests
      const { data: recentRequests, error: recentRequestsError } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenant:profiles(
            id,
            first_name,
            last_name
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
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentRequestsError) throw recentRequestsError
      
      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (notificationsError) throw notificationsError
      
      // Calculate monthly revenue for the last 6 months
      const monthlyRevenueData = []
      
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i))
        const monthEnd = endOfMonth(subMonths(new Date(), i))
        
        const { data: monthRevenue, error: monthRevenueError } = await supabase
          .from('payments')
          .select('amount')
          .in('lease_id', activeLeases?.map(l => l.id) || [])
          .eq('status', 'completed')
          .gte('payment_date', monthStart.toISOString())
          .lte('payment_date', monthEnd.toISOString())
        
        if (monthRevenueError) throw monthRevenueError
        
        const totalAmount = monthRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0
        
        monthlyRevenueData.push({
          month: format(monthStart, 'MMM yyyy'),
          amount: totalAmount
        })
      }
      
      setStats({
        properties: propertyIds.length,
        units: unitIds.length,
        occupiedUnits,
        vacantUnits,
        tenants: tenantIds.length,
        openMaintenanceRequests: openRequests?.length || 0,
        totalRentCollected,
        pendingPayments: pendingPayments?.length || 0,
        upcomingLeaseRenewals: upcomingRenewals
      })
      
      setRecentPayments(payments || [])
      setRecentMaintenanceRequests(recentRequests || [])
      setNotifications(notificationsData || [])
      setMonthlyRevenue(monthlyRevenueData)
    } catch (error: any) {
      console.error('Error in fetchDashboardData:', error)
      toast.error(error.message || 'Error fetching dashboard data')
      
      // If there's an error, use sample data
      setUseSampleData(true)
      initializeSampleData()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const occupancyRate = stats.units > 0 ? Math.round((stats.occupiedUnits / stats.units) * 100) : 0

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.profile?.first_name || 'Landlord'}</p>
        </div>
        {useSampleData && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Using Sample Data
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.properties}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/landlord/properties" className="text-sm text-primary-600 hover:text-primary-500">
              View all properties
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Units</p>
              <p className="text-2xl font-bold text-gray-900">{stats.units}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Occupied</span>
              <span className="font-medium text-gray-900">{stats.occupiedUnits}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-500">Vacant</span>
              <span className="font-medium text-gray-900">{stats.vacantUnits}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tenants}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/landlord/tenants" className="text-sm text-primary-600 hover:text-primary-500">
              View all tenants
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Monthly Revenue</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="h-64">
              {monthlyRevenue && monthlyRevenue.length > 0 ? (
                <div className="h-full flex items-end space-x-2">
                  {monthlyRevenue.map((item, index) => {
                    // Safely calculate max amount
                    const amounts = monthlyRevenue.map(m => m.amount || 0)
                    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0
                    const height = maxAmount > 0 ? ((item.amount || 0) / maxAmount) * 100 : 0
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex justify-center items-end h-[200px]">
                          <div 
                            className="w-full max-w-[40px] bg-primary-500 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                        <div className="text-xs font-medium">${item.amount || 0}</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No revenue data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Financial Summary</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">This Month's Rent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRentCollected}</p>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Collected for {format(new Date(), 'MMMM yyyy')}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                  <div className="flex items-center">
                    <p className="text-lg font-bold text-gray-900">{stats.pendingPayments}</p>
                    {stats.pendingPayments > 0 && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-1" />
                    )}
                  </div>
                </div>
                <div className="mt-1">
                  <Link to="/landlord/payments" className="text-xs text-primary-600 hover:text-primary-500">
                    View pending payments
                  </Link>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Upcoming Lease Renewals</p>
                  <div className="flex items-center">
                    <p className="text-lg font-bold text-gray-900">{stats.upcomingLeaseRenewals}</p>
                    {stats.upcomingLeaseRenewals > 0 && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-1" />
                    )}
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  In the next 30 days
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Maintenance Requests</p>
                  <div className="flex items-center">
                    <p className="text-lg font-bold text-gray-900">{stats.openMaintenanceRequests}</p>
                    {stats.openMaintenanceRequests > 0 && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-1" />
                    )}
                  </div>
                </div>
                <div className="mt-1">
                  <Link to="/landlord/maintenance" className="text-xs text-primary-600 hover:text-primary-500">
                    View open requests
                  </Link>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Link to="/landlord/payments/add" className="btn btn-primary w-full">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Record New Payment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Payments</h2>
            <Link to="/landlord/payments" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {recentPayments && recentPayments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentPayments.slice(0, 5).map((payment) => (
                  <li key={payment.id}>
                    <Link to={`/landlord/payments/${payment.id}`} className="block hover:bg-gray-50 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {payment.tenant?.first_name || 'Unknown'} {payment.tenant?.last_name || 'Tenant'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.lease?.unit?.property?.name || 'Unknown Property'} - Unit {payment.lease?.unit?.unit_number || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${payment.amount || 0}
                          </p>
                          <div className="flex items-center justify-end">
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                            `}>
                              {payment.status ? (payment.status.charAt(0).toUpperCase() + payment.status.slice(1)) : 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {safeFormatDate(payment.payment_date, 'MMM d', 'N/A')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <CurrencyDollarIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No recent payments</h3>
                <p className="mt-1 text-gray-500">There are no recent payments to display.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Maintenance Requests */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Maintenance Requests</h2>
            <Link to="/landlord/maintenance" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {recentMaintenanceRequests && recentMaintenanceRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentMaintenanceRequests.slice(0, 5).map((request) => (
                  <li key={request.id}>
                    <Link to={`/landlord/maintenance/${request.id}`} className="block hover:bg-gray-50 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`
                              h-10 w-10 rounded-full flex items-center justify-center
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
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {request.title || 'Unknown Request'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.unit?.property?.name || 'Unknown Property'} - Unit {request.unit?.unit_number || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                            ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                              request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          `}>
                            {request.status === 'open' ? 'Open' : 
                              request.status === 'in_progress' ? 'In Progress' : 
                              request.status === 'completed' ? 'Completed' : 'Unknown'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {safeFormatDate(request.created_at, 'MMM d', 'N/A')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No maintenance requests</h3>
                <p className="mt-1 text-gray-500">There are no recent maintenance requests to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications && notifications.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Notifications</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li key={notification.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center
                        ${notification.type === 'payment' ? 'bg-green-100' : 
                          notification.type === 'maintenance' ? 'bg-yellow-100' : 
                          notification.type === 'lease' ? 'bg-blue-100' : 'bg-gray-100'}
                      `}>
                        {notification.type === 'payment' ? (
                          <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                        ) : notification.type === 'maintenance' ? (
                          <WrenchScrewdriverIcon className="h-6 w-6 text-yellow-600" />
                        ) : notification.type === 'lease' ? (
                          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        ) : (
                          <BellIcon className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{notification.title || 'Notification'}</p>
                        <p className="text-xs text-gray-500">
                          {safeFormatDate(notification.created_at, 'MMM d, h:mm a', 'N/A')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{notification.message || ''}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
