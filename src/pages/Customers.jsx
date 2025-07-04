import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  User,
  Building
} from 'lucide-react'

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [customerType, setCustomerType] = useState('all')

  const customers = [
    {
      id: 1,
      name: 'John Smith',
      type: 'Residential',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      totalJobs: 5,
      totalSpent: '$1,250.00',
      lastJobDate: '2024-01-15',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      type: 'Residential',
      email: 'sarah.johnson@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Anytown, ST 12345',
      totalJobs: 3,
      totalSpent: '$890.00',
      lastJobDate: '2024-01-14',
      status: 'Active',
    },
    {
      id: 3,
      name: 'ABC Corporation',
      type: 'Commercial',
      email: 'contact@abccorp.com',
      phone: '(555) 345-6789',
      address: '789 Business Blvd, Anytown, ST 12345',
      totalJobs: 12,
      totalSpent: '$5,600.00',
      lastJobDate: '2024-01-16',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Mike Wilson',
      type: 'Residential',
      email: 'mike.wilson@email.com',
      phone: '(555) 456-7890',
      address: '321 Pine St, Anytown, ST 12345',
      totalJobs: 2,
      totalSpent: '$420.00',
      lastJobDate: '2024-01-10',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Green Valley Apartments',
      type: 'Commercial',
      email: 'manager@greenvalley.com',
      phone: '(555) 567-8901',
      address: '654 Valley Rd, Anytown, ST 12345',
      totalJobs: 8,
      totalSpent: '$3,200.00',
      lastJobDate: '2024-01-12',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Emily Davis',
      type: 'Residential',
      email: 'emily.davis@email.com',
      phone: '(555) 678-9012',
      address: '987 Elm St, Anytown, ST 12345',
      totalJobs: 1,
      totalSpent: '$180.00',
      lastJobDate: '2023-12-20',
      status: 'Inactive',
    },
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesType = customerType === 'all' || customer.type === customerType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'Inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="input-field"
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-warning-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Residential</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.type === 'Residential').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Commercial</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.type === 'Commercial').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredCustomers.length} Customers
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{customer.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                      {customer.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-2 h-4 w-4" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        {customer.address}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Total Jobs:</span>
                        <span className="ml-2 text-gray-500">{customer.totalJobs}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Total Spent:</span>
                        <span className="ml-2 text-gray-500">{customer.totalSpent}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Last Job:</span>
                        <span className="ml-2 text-gray-500">{customer.lastJobDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || customerType !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first customer'
            }
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
