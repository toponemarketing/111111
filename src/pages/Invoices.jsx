import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react'
import { useInvoices, useCustomers } from '../hooks/useSupabase'
import InvoiceModal from '../components/modals/InvoiceModal'

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const { invoices, loading, fetchInvoices, createInvoice, updateInvoice, deleteInvoice } = useInvoices()
  const { customers, fetchCustomers } = useCustomers()

  useEffect(() => {
    fetchInvoices()
    fetchCustomers()
  }, [])

  const handleNewInvoice = () => {
    setSelectedInvoice(null)
    setIsModalOpen(true)
  }

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleDeleteInvoice = async (invoice) => {
    if (confirm(`Delete invoice ${invoice.invoice_number}?`)) {
      try {
        await deleteInvoice(invoice.id)
        alert('Invoice deleted successfully!')
      } catch (error) {
        alert('Error deleting invoice. Please try again.')
      }
    }
  }

  const handleSaveInvoice = async (invoiceData) => {
    try {
      if (selectedInvoice) {
        await updateInvoice(selectedInvoice.id, invoiceData)
        alert('Invoice updated successfully!')
      } else {
        await createInvoice(invoiceData)
        alert('Invoice created successfully!')
      }
    } catch (error) {
      throw error
    }
  }

  const handleInvoiceAction = async (action, invoice) => {
    switch (action) {
      case 'view':
        alert(`Viewing invoice ${invoice.invoice_number}`)
        break
      case 'download':
        alert(`Downloading invoice ${invoice.invoice_number}`)
        break
      case 'send':
        try {
          await updateInvoice(invoice.id, { status: 'Pending' })
          alert(`Invoice ${invoice.invoice_number} sent to ${invoice.customer?.name}`)
        } catch (error) {
          alert('Error sending invoice. Please try again.')
        }
        break
      case 'mark-paid':
        try {
          await updateInvoice(invoice.id, { status: 'Paid' })
          alert(`Invoice ${invoice.invoice_number} marked as paid`)
        } catch (error) {
          alert('Error updating invoice status. Please try again.')
        }
        break
      default:
        alert(`Action: ${action} for ${invoice.invoice_number}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'Pending':
        return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'Overdue':
        return 'bg-error-50 text-error-700 border-error-200'
      case 'Draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const customerName = invoice.customer?.name || ''
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading invoices...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices and payments</p>
        </div>
        <button 
          onClick={handleNewInvoice}
          className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
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
                placeholder="Search invoices, customers, or services..."
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
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
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
            <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{invoice.invoice_number}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <User className="mr-2 h-4 w-4" />
                        {invoice.customer?.name || 'No customer'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FileText className="mr-2 h-4 w-4" />
                        {invoice.service}
                      </div>
                      <div className="flex items-center text-sm text-gray-900 font-medium">
                        <DollarSign className="mr-2 h-4 w-4" />
                        ${parseFloat(invoice.amount).toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        Issued: {invoice.issue_date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        Due: {invoice.due_date}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleInvoiceAction('view', invoice)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditInvoice(invoice)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleInvoiceAction('download', invoice)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </button>
                    {invoice.status !== 'Paid' && (
                      <button
                        onClick={() => handleInvoiceAction('send', invoice)}
                        className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                      >
                        <Send className="mr-1 h-3 w-3" />
                        Send
                      </button>
                    )}
                    {invoice.status === 'Pending' && (
                      <button
                        onClick={() => handleInvoiceAction('mark-paid', invoice)}
                        className="bg-success-600 hover:bg-success-700 text-white px-2 py-1 rounded text-xs flex items-center transition-colors"
                      >
                        <DollarSign className="mr-1 h-3 w-3" />
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteInvoice(invoice)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs flex items-center transition-colors"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </button>
                  </div>
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
            <button 
              onClick={handleNewInvoice}
              className="btn-primary hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </button>
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
        invoice={selectedInvoice}
        customers={customers}
      />
    </div>
  )
}

export default Invoices
