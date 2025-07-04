import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  FileText,
  Download,
  Send,
  Eye,
  DollarSign,
  Calendar
} from 'lucide-react'

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-001',
      customer: 'John Smith',
      jobNumber: 'JOB-001',
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      amount: '$150.00',
      status: 'Paid',
      paidDate: '2024-01-20',
      description: 'Kitchen sink leak repair',
    },
    {
      id: 2,
      invoiceNumber: 'INV-002',
      customer: 'Sarah Johnson',
      jobNumber: 'JOB-002',
      issueDate: '2024-01-14',
      dueDate: '2024-02-13',
      amount: '$280.00',
      status: 'Sent',
      paidDate: null,
      description: 'Annual HVAC system maintenance',
    },
    {
      id: 3,
      invoiceNumber: 'INV-003',
      customer: 'ABC Corporation',
      jobNumber: 'JOB-006',
      issueDate: '2024-01-12',
      dueDate: '2024-02-11',
      amount: '$1,200.00',
      status: 'Overdue',
      paidDate: null,
      description: 'Office electrical system upgrade',
    },
    {
      id: 4,
      invoiceNumber: 'INV-004',
      customer: 'Mike Wilson',
      jobNumber: 'JOB-003',
      issueDate: '2024-01-16',
      dueDate: '2024-02-15',
      amount: '$320.00',
      status: 'Draft',
      paidDate: null,
      description: 'Install new electrical outlets',
    },
    {
      id: 5,
      invoiceNumber: 'INV-005',
      customer: 'Green Valley Apartments',
      jobNumber: 'JOB-007',
      issueDate: '2024-01-13',
      dueDate: '2024-02-12',
      amount: '$850.00',
      status: 'Paid',
      paidDate: '2024-01-18',
      description: 'Plumbing maintenance - multiple units',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'Sent':
        return 'bg-primary-50 text-primary-700 border-primary-200'
      case 'Overdue':
        return 'bg-error-50 text-error-700 border-error-200'
      case 'Draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '').replace(',', '')), 0)
  const paidAmount = invoices.filter(inv => inv.status === 'Paid').reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '').replace(',', '')), 0)
  const outstandingAmount = totalAmount - paidAmount

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your billing and payments</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-success-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-gray-900">${paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-warning-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">${outstandingAmount.toLocaleString()}</p>
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
                placeholder="Search invoices, customers, or job numbers..."
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
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredInvoices.length} Invoices
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{invoice.invoiceNumber}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.customer}</p>
                      <p className="text-sm text-gray-500">Job: {invoice.jobNumber}</p>
                      <p className="text-sm text-gray-500 mt-1">{invoice.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        Issued: {invoice.issueDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        Due: {invoice.dueDate}
                      </div>
                      {invoice.paidDate && (
                        <div className="flex items-center text-sm text-success-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          Paid: {invoice.paidDate}
                        </div>
                      )}
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <DollarSign className="mr-1 h-5 w-5" />
                        {invoice.amount}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full" title="View">
                    <Eye className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full" title="Download">
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                  {invoice.status !== 'Paid' && (
                    <button className="p-2 hover:bg-gray-100 rounded-full" title="Send">
                      <Send className="h-4 w-4 text-gray-400" />
                    </button>
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

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first invoice'
            }
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoices
