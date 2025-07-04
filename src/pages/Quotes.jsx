import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  FileText,
  Send,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react'

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const quotes = [
    {
      id: 1,
      quoteNumber: 'QUO-001',
      customer: 'Emily Davis',
      service: 'Carpet Cleaning',
      issueDate: '2024-01-10',
      expiryDate: '2024-02-10',
      amount: '$180.00',
      status: 'Sent',
      description: 'Deep carpet cleaning for living room and bedrooms',
      validUntil: '2024-02-10',
    },
    {
      id: 2,
      quoteNumber: 'QUO-002',
      customer: 'David Miller',
      service: 'Kitchen Renovation',
      issueDate: '2024-01-12',
      expiryDate: '2024-02-12',
      amount: '$2,500.00',
      status: 'Accepted',
      description: 'Complete kitchen renovation including cabinets and countertops',
      validUntil: '2024-02-12',
    },
    {
      id: 3,
      quoteNumber: 'QUO-003',
      customer: 'Lisa Anderson',
      service: 'Bathroom Remodel',
      issueDate: '2024-01-08',
      expiryDate: '2024-02-08',
      amount: '$1,800.00',
      status: 'Expired',
      description: 'Master bathroom remodel with new fixtures',
      validUntil: '2024-02-08',
    },
    {
      id: 4,
      quoteNumber: 'QUO-004',
      customer: 'Tech Solutions Inc',
      service: 'Office Cleaning',
      issueDate: '2024-01-14',
      expiryDate: '2024-02-14',
      amount: '$450.00',
      status: 'Draft',
      description: 'Monthly office cleaning service contract',
      validUntil: '2024-02-14',
    },
    {
      id: 5,
      quoteNumber: 'QUO-005',
      customer: 'Jennifer White',
      service: 'Landscaping',
      issueDate: '2024-01-11',
      expiryDate: '2024-02-11',
      amount: '$750.00',
      status: 'Declined',
      description: 'Front yard landscaping and garden design',
      validUntil: '2024-02-11',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'Sent':
        return 'bg-primary-50 text-primary-700 border-primary-200'
      case 'Declined':
        return 'bg-error-50 text-error-700 border-error-200'
      case 'Expired':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'Draft':
        return 'bg-warning-50 text-warning-700 border-warning-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalAmount = quotes.reduce((sum, quote) => sum + parseFloat(quote.amount.replace('$', '').replace(',', '')), 0)
  const acceptedAmount = quotes.filter(q => q.status === 'Accepted').reduce((sum, quote) => sum + parseFloat(quote.amount.replace('$', '').replace(',', '')), 0)
  const pendingAmount = quotes.filter(q => q.status === 'Sent').reduce((sum, quote) => sum + parseFloat(quote.amount.replace('$', '').replace(',', '')), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">Create and manage your service quotes</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </button>
      </div>

      {/* Quote Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">${acceptedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-warning-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotes, customers, or services..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
              <option value="Expired">Expired</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredQuotes.length} Quotes
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{quote.quoteNumber}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{quote.customer}</p>
                      <p className="text-sm text-gray-500">{quote.service}</p>
                      <p className="text-sm text-gray-500 mt-1">{quote.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        Issued: {quote.issueDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        Expires: {quote.expiryDate}
                      </div>
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <DollarSign className="mr-1 h-5 w-5" />
                        {quote.amount}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full" title="View">
                    <Eye className="h-4 w-4 text-gray-400" />
                  </button>
                  {quote.status === 'Draft' && (
                    <button className="p-2 hover:bg-gray-100 rounded-full" title="Send">
                      <Send className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                  {quote.status === 'Sent' && (
                    <>
                      <button className="p-2 hover:bg-gray-100 rounded-full text-success-600" title="Accept">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full text-error-600" title="Decline">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first quote'
            }
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              New Quote
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quotes
