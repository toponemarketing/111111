import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  User,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { useCustomers } from '../hooks/useSupabase'
import CustomerModal from '../components/modals/CustomerModal'

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const { customers, loading, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomers()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleNewCustomer = () => {
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDeleteCustomer = async (customer) => {
    if (confirm(`Delete customer ${customer.name}?`)) {
      try {
        await deleteCustomer(customer.id)
        alert('Customer deleted successfully!')
      } catch (error) {
        alert('Error deleting customer. Please try again.')
      }
    }
  }

  const handleSaveCustomer = async (customerData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, customerData)
        alert('Customer updated successfully!')
      } else {
        await createCustomer(customerData)
        alert('Customer created successfully!')
      }
    } catch (error) {
      throw error
    }
  }

  const handleContactCustomer = (type, customer) => {
    if (type === 'email' && customer.email) {
      window.open(`mailto:${customer.email}`)
    } else if (type === 'call' && customer.phone) {
      window.open(`tel:${customer.phone}`)
    } else {
      alert(`No ${type} information available for ${customer.name}`)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <button 
          onClick={handleNewCustomer}
          className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </button>
      </div>

      {/* Search and Filters */}
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
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'VIP' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : customer.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {customer.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  <button 
                    onClick={() => handleContactCustomer('email', customer)}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {customer.email}
                  </button>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  <button 
                    onClick={() => handleContactCustomer('call', customer)}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {customer.phone}
                  </button>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {customer.address}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Jobs</p>
                  <p className="font-medium text-gray-900">{customer.total_jobs || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Spent</p>
                  <p className="font-medium text-gray-900">${parseFloat(customer.total_spent || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => alert(`Viewing customer ${customer.name}`)}
                className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
              >
                <Eye className="mr-1 h-3 w-3" />
                View
              </button>
              <button
                onClick={() => handleEditCustomer(customer)}
                className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs flex items-center transition-colors"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by adding your first customer'
            }
          </p>
          <div className="mt-6">
            <button 
              onClick={handleNewCustomer}
              className="btn-primary hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </button>
          </div>
        </div>
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />
    </div>
  )
}

export default Customers
