import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, XCircle, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'

interface Quote {
  id: string
  service_description: string
  amount: number
  scheduled_date: string | null
  status: string
  created_at: string
  clients: {
    name: string
    email: string
    phone: string | null
    address: string | null
  }
}

export default function ShareQuote() {
  const { token } = useParams<{ token: string }>()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responding, setResponding] = useState(false)

  useEffect(() => {
    if (token) {
      loadQuote(token)
    }
  }, [token])

  const loadQuote = async (publicToken: string) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          service_description,
          amount,
          scheduled_date,
          status,
          created_at,
          clients!inner (
            name,
            email,
            phone,
            address
          )
        `)
        .eq('public_token', publicToken)
        .single()

      if (error) {
        console.error('Error loading quote:', error)
        setError('Quote not found or link has expired')
        return
      }

      // Transform the data to match our interface
      const transformedQuote: Quote = {
        ...data,
        clients: Array.isArray(data.clients) ? data.clients[0] : data.clients
      }

      setQuote(transformedQuote)
    } catch (error) {
      console.error('Error loading quote:', error)
      setError('Failed to load quote')
    } finally {
      setLoading(false)
    }
  }

  const respondToQuote = async (response: 'approved' | 'declined') => {
    if (!quote) return

    setResponding(true)
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: response })
        .eq('id', quote.id)

      if (error) {
        console.error('Error updating quote:', error)
        return
      }

      setQuote({ ...quote, status: response })
    } catch (error) {
      console.error('Error responding to quote:', error)
    } finally {
      setResponding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h1>
          <p className="text-gray-600">{error || 'This quote link may have expired or been removed.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">Service Quote</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {quote.status === 'approved' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Quote Approved</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Thank you for approving this quote. We'll be in touch soon to schedule the work.
            </p>
          </div>
        )}

        {quote.status === 'declined' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">Quote Declined</p>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Thank you for your response. Please feel free to contact us if you have any questions.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Service Quote</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Service Description</p>
                  <p className="font-medium text-gray-900">{quote.service_description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(quote.amount)}</p>
                  </div>
                  {quote.scheduled_date && (
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Date</p>
                      <p className="font-medium text-gray-900">{formatDate(quote.scheduled_date)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Client Name</p>
                  <p className="font-medium">{quote.clients.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{quote.clients.email}</p>
                </div>
                {quote.clients.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{quote.clients.phone}</p>
                  </div>
                )}
                {quote.clients.address && (
                  <div>
                    <p className="text-sm text-gray-600">Service Address</p>
                    <p className="font-medium">{quote.clients.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Actions */}
          <div className="space-y-6">
            {quote.status === 'pending' && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Response</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Please review the quote details and let us know if you'd like to proceed with this service.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => respondToQuote('approved')}
                    disabled={responding}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    {responding ? 'Processing...' : 'Approve Quote'}
                  </button>
                  <button
                    onClick={() => respondToQuote('declined')}
                    disabled={responding}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="h-5 w-5" />
                    {responding ? 'Processing...' : 'Decline Quote'}
                  </button>
                </div>
              </div>
            )}

            {/* Quote Information */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Quote Date</p>
                  <p className="font-medium">{formatDate(quote.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                    quote.status === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
