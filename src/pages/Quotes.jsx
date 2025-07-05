import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Send,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useQuotes, useCustomers, useJobs } from '../hooks/useSupabase'
import QuoteModal from '../components/modals/QuoteModal'

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)

  const { quotes, loading, fetchQuotes, createQuote, updateQuote, deleteQuote } = useQuotes()
  const { customers, fetchCustomers } = useCustomers()
  const { createJob } = useJobs()

  useEffect(() => {
    fetchQuotes()
    fetchCustomers()
  }, [])

  const handleNewQuote = () => {
    setSelectedQuote(null)
    setIsModalOpen(true)
  }

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote)
    setIsModalOpen(true)
  }

  const handleDeleteQuote = async (quote) => {
    if (confirm(`Delete quote ${quote.quote_number}?`)) {
      try {
        await deleteQuote(quote.id)
        alert('Quote deleted successfully!')
      } catch (error) {
        alert('Error deleting quote. Please try again.')
      }
    }
  }

  const handleSaveQuote = async (quoteData) => {
    try {
      if (selectedQuote) {
        await updateQuote(selectedQuote.id, quoteData)
        alert('Quote updated successfully!')
      } else {
        await createQuote(quoteData)
        alert('Quote created successfully!')
      }
    } catch (error) {
      throw error
    }
  }

  const handleConvertToJob = async (quote) => {
    if (confirm(`Convert quote ${quote.quote_number} to a job?`)) {
      try {
        // Create job from quote data
        const jobData = {
          customer_id: quote.customer_id,
          service: quote.service,
          description: quote.description,
          amount: quote.amount,
          status: 'Scheduled',
          priority: 'Medium',
          address: quote.customer?.address || '',
          scheduled_date: new Date().toISOString().split('T')[0] // Today's date as default
        }

        await createJob(jobData)
        
        // Update quote status to indicate it was converted
        await updateQuote(quote.id, { status: 'Accepted' })
        
        alert(`Quote ${quote.quote_number} successfully converted to job!`)
      } catch (error) {
        console.error('Error converting quote to job:', error)
        alert('Error converting quote to job. Please try again.')
      }
    }
  }

  const handleQuoteAction = async (action, quote) => {
    switch (action) {
      case 'view':
        alert(`Viewing quote ${quote.quote_number}`)
        break
      case 'send':
        try {
          await updateQuote(quote.id, { status: 'Pending' })
          alert(`Quote ${quote.quote_number} sent to ${quote.customer?.name}`)
        } catch (error) {
          alert('Error sending quote. Please try again.')
        }
        break
      case 'convert':
        await handleConvertToJob(quote)
        break
      case 'duplicate':
        try {
          const duplicateData = {
            customer_id: quote.customer_id,
            service: quote.service,
            description: quote.description,
            amount: quote.amount,
            status: 'Draft',
            valid_until: quote.valid_until
          }
          await createQuote(duplicateData)
          alert(`Quote ${quote.quote_number} duplicated successfully!`)
        } catch (error) {
          alert('Error duplicating quote. Please try again.')
        }
        break
      default:
        alert(`Action: ${action} for ${quote.quote_number}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'Pending':
        return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'Rejected':
        return 'bg-error-50 text-error-700 border-error-200'
      case 'Draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const customerName = quote.customer?.name || ''
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading quotes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">Create and manage your service quotes</p>
        </div>
        <button 
          onClick={handleNewQuote}
          className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Quote
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
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
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
            <div key={quote.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{quote.quote_number}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <User className="mr-2 h-4 w-4" />
                        {quote.customer?.name || 'No customer'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FileText className="mr-2 h-4 w-4" />
                        {quote.service}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{quote.description}</p>
                      <div className="flex items-center text-sm text-gray-900 font-medium mt-2">
                        <DollarSign className="mr-2 h-4 w-4" />
                        ${parseFloat(quote.amount).toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        Created: {new Date(quote.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        Valid until: {quote.valid_until}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleQuoteAction('view', quote)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditQuote(quote)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </button>
                    {quote.status !== 'Accepted' && quote.status !== 'Rejected' && (
                      <button
                        onClick={() => handleQuoteAction('send', quote)}
                        className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                      >
                        <Send className="mr-1 h-3 w-3" />
                        Send
                      </button>
                    )}
                    {(quote.status === 'Accepted' || quote.status === 'Pending') && (
                      <button
                        onClick={() => handleQuoteAction('convert', quote)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded text-xs flex items-center transition-colors"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Convert to Job
                      </button>
                    )}
                    <button
                      onClick={() => handleQuoteAction('duplicate', quote)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDeleteQuote(quote)}
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

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first quote'
            }
          </p>
          <div className="mt-6">
            <button 
              onClick={handleNewQuote}
              className="btn-primary hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Quote
            </button>
          </div>
        </div>
      )}

      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuote}
        quote={selectedQuote}
        customers={customers}
      />
    </div>
  )
}

export default Quotes
