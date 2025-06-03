// This file contains all sample data for development/testing

// Create a sample landlord user for development
export const SAMPLE_LANDLORD_USER = {
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

// Sample properties data
export const SAMPLE_PROPERTIES = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    description: 'Modern apartment complex with great amenities',
    image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    units_count: 3,
    vacant_units: 1
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
    image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    units_count: 2,
    vacant_units: 1
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Mountain View Homes',
    address: '789 Mountain Rd',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    description: 'Beautiful homes with mountain views',
    image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    units_count: 1,
    vacant_units: 0
  }
];

// Sample units data
export const SAMPLE_UNITS = [
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
  },
  {
    id: '00000000-0000-0000-0000-000000000206',
    property_id: '00000000-0000-0000-0000-000000000103',
    unit_number: '301',
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2000,
    rent_amount: 3000,
    status: 'occupied',
    description: 'Spacious 4-bedroom home with mountain views',
    image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
  }
];

// Sample units with leases and tenants
export const SAMPLE_UNITS_WITH_DETAILS: Record<string, any> = {
  '00000000-0000-0000-0000-000000000201': {
    id: '00000000-0000-0000-0000-000000000201',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '101',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 750,
    rent_amount: 1200,
    status: 'occupied',
    description: 'Cozy 1-bedroom apartment with balcony',
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments',
      address: '123 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001'
    },
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000301',
        tenant_id: '00000000-0000-0000-0000-000000000003',
        start_date: '2023-01-01',
        end_date: '2024-01-01',
        rent_amount: 1200,
        security_deposit: 1200,
        rent_due_day: 1,
        status: 'active',
        tenant: {
          id: '00000000-0000-0000-0000-000000000003',
          first_name: 'Michael',
          last_name: 'Brown',
          email: 'michael.brown@example.com',
          phone: '555-111-2222'
        }
      }
    ],
    maintenance_requests: [
      {
        id: '00000000-0000-0000-0000-000000000501',
        title: 'Leaking faucet in bathroom',
        status: 'completed',
        priority: 'medium',
        created_at: '2023-08-10T12:00:00Z',
        tenant: {
          id: '00000000-0000-0000-0000-000000000003',
          first_name: 'Michael',
          last_name: 'Brown'
        }
      },
      {
        id: '00000000-0000-0000-0000-000000000502',
        title: 'Broken light fixture in kitchen',
        status: 'open',
        priority: 'low',
        created_at: '2023-08-20T09:15:00Z',
        tenant: {
          id: '00000000-0000-0000-0000-000000000003',
          first_name: 'Michael',
          last_name: 'Brown'
        }
      }
    ]
  },
  '00000000-0000-0000-0000-000000000202': {
    id: '00000000-0000-0000-0000-000000000202',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '102',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1000,
    rent_amount: 1800,
    status: 'occupied',
    description: 'Spacious 2-bedroom apartment with modern kitchen',
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments',
      address: '123 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001'
    },
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000302',
        tenant_id: '00000000-0000-0000-0000-000000000004',
        start_date: '2023-02-15',
        end_date: '2024-02-15',
        rent_amount: 1800,
        security_deposit: 1800,
        rent_due_day: 1,
        status: 'active',
        tenant: {
          id: '00000000-0000-0000-0000-000000000004',
          first_name: 'Emily',
          last_name: 'Davis',
          email: 'emily.davis@example.com',
          phone: '555-333-4444'
        }
      }
    ],
    maintenance_requests: [
      {
        id: '00000000-0000-0000-0000-000000000503',
        title: 'AC not cooling properly',
        status: 'in_progress',
        priority: 'high',
        created_at: '2023-08-18T14:30:00Z',
        tenant: {
          id: '00000000-0000-0000-0000-000000000004',
          first_name: 'Emily',
          last_name: 'Davis'
        }
      }
    ]
  },
  '00000000-0000-0000-0000-000000000203': {
    id: '00000000-0000-0000-0000-000000000203',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '103',
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 900,
    rent_amount: 1600,
    status: 'vacant',
    description: 'Bright 2-bedroom apartment with city views',
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments',
      address: '123 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001'
    },
    leases: [],
    maintenance_requests: []
  },
  '00000000-0000-0000-0000-000000000204': {
    id: '00000000-0000-0000-0000-000000000204',
    property_id: '00000000-0000-0000-0000-000000000102',
    unit_number: '201',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    rent_amount: 2500,
    status: 'occupied',
    description: 'Luxury 3-bedroom condo with river views',
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Riverside Condos',
      address: '456 River St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    },
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000303',
        tenant_id: '00000000-0000-0000-0000-000000000005',
        start_date: '2023-03-01',
        end_date: '2024-03-01',
        rent_amount: 2500,
        security_deposit: 2500,
        rent_due_day: 1,
        status: 'active',
        tenant: {
          id: '00000000-0000-0000-0000-000000000005',
          first_name: 'David',
          last_name: 'Wilson',
          email: 'david.wilson@example.com',
          phone: '555-555-6666'
        }
      }
    ],
    maintenance_requests: [
      {
        id: '00000000-0000-0000-0000-000000000504',
        title: 'Dishwasher not draining',
        status: 'open',
        priority: 'medium',
        created_at: '2023-08-19T10:45:00Z',
        tenant: {
          id: '00000000-0000-0000-0000-000000000005',
          first_name: 'David',
          last_name: 'Wilson'
        }
      },
      {
        id: '00000000-0000-0000-0000-000000000505',
        title: 'Garage door not opening',
        status: 'completed',
        priority: 'high',
        created_at: '2023-08-15T08:20:00Z',
        tenant: {
          id: '00000000-0000-0000-0000-000000000005',
          first_name: 'David',
          last_name: 'Wilson'
        }
      }
    ]
  },
  '00000000-0000-0000-0000-000000000205': {
    id: '00000000-0000-0000-0000-000000000205',
    property_id: '00000000-0000-0000-0000-000000000102',
    unit_number: '202',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    rent_amount: 2200,
    status: 'vacant',
    description: 'Modern 2-bedroom condo with updated appliances',
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Riverside Condos',
      address: '456 River St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    },
    leases: [],
    maintenance_requests: []
  },
  '00000000-0000-0000-0000-000000000206': {
    id: '00000000-0000-0000-0000-000000000206',
    property_id: '00000000-0000-0000-0000-000000000103',
    unit_number: '301',
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2000,
    rent_amount: 3000,
    status: 'occupied',
    description: 'Spacious 4-bedroom home with mountain views',
    property: {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Mountain View Homes',
      address: '789 Mountain Rd',
      city: 'Denver',
      state: 'CO',
      zip: '80201'
    },
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000305',
        tenant_id: '00000000-0000-0000-0000-000000000007',
        start_date: '2023-05-01',
        end_date: '2024-05-01',
        rent_amount: 3000,
        security_deposit: 3000,
        rent_due_day: 1,
        status: 'active',
        tenant: {
          id: '00000000-0000-0000-0000-000000000007',
          first_name: 'Robert',
          last_name: 'Anderson',
          email: 'robert.anderson@example.com',
          phone: '555-999-0000'
        }
      }
    ],
    maintenance_requests: []
  }
};

// Sample tenants data
export const SAMPLE_TENANTS = [
  {
    id: '00000000-0000-0000-0000-000000000003',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@example.com',
    phone: '555-111-2222',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000301',
      unit_id: '00000000-0000-0000-0000-000000000201',
      start_date: '2023-01-01',
      end_date: '2024-01-01',
      rent_amount: 1200
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000201',
      unit_number: '101',
      property_id: '00000000-0000-0000-0000-000000000101'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@example.com',
    phone: '555-333-4444',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000302',
      unit_id: '00000000-0000-0000-0000-000000000202',
      start_date: '2023-02-15',
      end_date: '2024-02-15',
      rent_amount: 1800
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000202',
      unit_number: '102',
      property_id: '00000000-0000-0000-0000-000000000101'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Sunset Apartments'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '555-555-6666',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000303',
      unit_id: '00000000-0000-0000-0000-000000000204',
      start_date: '2023-03-01',
      end_date: '2024-03-01',
      rent_amount: 2500
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000204',
      unit_number: '201',
      property_id: '00000000-0000-0000-0000-000000000102'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Riverside Condos'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    first_name: 'Jessica',
    last_name: 'Martinez',
    email: 'jessica.martinez@example.com',
    phone: '555-777-8888',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000304',
      unit_id: '00000000-0000-0000-0000-000000000205',
      start_date: '2023-04-15',
      end_date: '2024-04-15',
      rent_amount: 2200
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000205',
      unit_number: '202',
      property_id: '00000000-0000-0000-0000-000000000102'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Riverside Condos'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    first_name: 'Robert',
    last_name: 'Anderson',
    email: 'robert.anderson@example.com',
    phone: '555-999-0000',
    role: 'tenant',
    avatar_url: 'https://randomuser.me/api/portraits/men/4.jpg',
    lease: {
      id: '00000000-0000-0000-0000-000000000305',
      unit_id: '00000000-0000-0000-0000-000000000206',
      start_date: '2023-05-01',
      end_date: '2024-05-01',
      rent_amount: 3000
    },
    unit: {
      id: '00000000-0000-0000-0000-000000000206',
      unit_number: '301',
      property_id: '00000000-0000-0000-0000-000000000103'
    },
    property: {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Mountain View Homes'
    }
  }
];

// Sample leases data
export const SAMPLE_LEASES = [
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
    end_date: '2024-03-01',
    rent_amount: 2500,
    security_deposit: 2500,
    rent_due_day: 1,
    late_fee_amount: 100,
    late_fee_days: 5,
    status: 'active',
    document_url: 'https://example.com/lease-303.pdf'
  },
  {
    id: '00000000-0000-0000-0000-000000000304',
    unit_id: '00000000-0000-0000-0000-000000000205',
    tenant_id: '00000000-0000-0000-0000-000000000006',
    start_date: '2023-04-15',
    end_date: '2024-04-15',
    rent_amount: 2200,
    security_deposit: 2200,
    rent_due_day: 1,
    late_fee_amount: 90,
    late_fee_days: 5,
    status: 'active',
    document_url: 'https://example.com/lease-304.pdf'
  },
  {
    id: '00000000-0000-0000-0000-000000000305',
    unit_id: '00000000-0000-0000-0000-000000000206',
    tenant_id: '00000000-0000-0000-0000-000000000007',
    start_date: '2023-05-01',
    end_date: '2024-05-01',
    rent_amount: 3000,
    security_deposit: 3000,
    rent_due_day: 1,
    late_fee_amount: 120,
    late_fee_days: 5,
    status: 'active',
    document_url: 'https://example.com/lease-305.pdf'
  }
];

// Sample payments data
export const SAMPLE_PAYMENTS = [
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

// Sample maintenance requests data
export const SAMPLE_MAINTENANCE_REQUESTS = [
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

// Sample notifications data
export const SAMPLE_NOTIFICATIONS = [
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
export const SAMPLE_MONTHLY_REVENUE = [
  { month: 'Mar 2023', amount: 5000 },
  { month: 'Apr 2023', amount: 5500 },
  { month: 'May 2023', amount: 5500 },
  { month: 'Jun 2023', amount: 5500 },
  { month: 'Jul 2023', amount: 5500 },
  { month: 'Aug 2023', amount: 5550 }
];

// Helper function to check if we should use sample data
export const shouldUseSampleData = (): boolean => {
  return import.meta.env.DEV && 
    (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);
};

// Helper function to initialize sample data for a user
export const initializeSampleUser = () => {
  if (shouldUseSampleData()) {
    return SAMPLE_LANDLORD_USER;
  }
  return null;
};
