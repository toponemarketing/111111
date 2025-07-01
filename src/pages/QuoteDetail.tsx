import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, DollarSign, Edit, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Quote {
  id: string
  client_name: string
  client_email: string
  client_phone?: string
  client_address?: string
  service_description: string
  amount: number
  due_date?: string
  notes?: string
  status: 'pending' | 'approved' | 'declined'
  created_at: string
}

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)

  useEffect(() => {
    if (id) {
      loadQuote()
    }
  }, [id])

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setQuote(data)
    } catch (error) {
      console.error('Error loading quote:', error)
      navigate('/quotes')
    } finally {
      setLoading(false)
    }
  }

  const convertToInvoice = async () => {
    if (!quote) return
    
    setConverting(true)
    try {
      console.log('Converting quote to invoice:', quote)
      
      const invoiceData = {
        client_name: quote.client_name,
        client_email: quote.client_email,
        client_phone: quote.client_phone,
        client_address: quote.client_address,
        service_description: quote.service_description,
        amount: quote.amount,
        due_date: quote.due_date,
        notes: quote.notes,
        status: 'pending',
        quote_id: quote.id
      }

      console.log('Creating invoice with data:', invoiceData)

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Invoice created successfully:', data)

      // Update quote status to approved
      await supabase
        .from('quotes')
        .update({ status: 'approved' })
        .eq('id', quote.id)

      navigate(`/invoices/${data.id}`)
    } catch (error: any) {
      console.error('Error converting to invoice:', error)
      alert(`Failed to convert to invoice: ${error.message || 'Unknown error'}`)
    } finally {
      setConverting(false)
    }
  }

  const deleteQuote = async () => {
    if (!quote || !confirm('Are you sure you want to delete this quote?')) return

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quote.id)

      if (error) throw error
      navigate('/quotes')
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Failed to delete quote')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Quote not found</h3>
        <p className="mt-1 text-sm text-gray-500">The quote you're looking for doesn't exist.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/quotes')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote #{quote.id.slice(0, 8)}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(quote.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Quote Details */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quote Details</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Client Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Name:</span>
                {quote.client_name}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {quote.client_email}
              </div>
              {quote.client_phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {quote.client_phone}
                </div>
              )}
              {quote.client_address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {quote.client_address}
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Service Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                  {quote.service_description}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-medium mr-2">Amount:</span>
                  ${quote.amount.toLocaleString()}
                </div>
                {quote.due_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Due Date:</span>
                    {new Date(quote.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              {quote.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {quote.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={convertToInvoice}
          disabled={converting || quote.status === 'declined'}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <FileText className="mr-2 h-4 w-4" />
          {converting ? 'Converting...' : 'Convert to Invoice'}
        </button>
        <button
          onClick={() => navigate(`/quotes/${quote.id}/edit`)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Quote
        </button>
        <button
          onClick={deleteQuote}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  )
}
