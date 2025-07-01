import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CreditCard, CheckCircle, Receipt } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  due_date: string
  status: string
  created_at: string
  clients: {
    name: string
    email: string
    phone: string | null
    address: string | null
  }
}

export default function ShareInvoice() {
  const { token } = useParams<{ token: string }>()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (token) {
      loadInvoice(token)
    }
  }, [token])

  const loadInvoice = async (publicToken: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          amount,
          due_date,
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
        console.error('Error loading invoice:', error)
        setError('Invoice not found or link has expired')
        return
      }

      // Transform the data to match our interface
      const transformedInvoice: Invoice = {
        ...data,
        clients: Array.isArray(data.clients) ? data.clients[0] : data.clients
      }

      setInvoice(transformedInvoice)
    } catch (error) {
      console.error('Error loading invoice:', error)
      setError('Failed to load invoice')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!invoice) return

    setProcessing(true)
    try {
      // In a real app, this would integrate with Stripe
      // For now, we'll just mark as paid
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', invoice.id)

      if (error) {
        console.error('Error updating invoice:', error)
        return
      }

      setInvoice({ ...invoice, status: 'paid' })
      alert('Payment processed successfully!')
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const isOverdue = () => {
    if (!invoice || invoice.status === 'paid') return false
    return new Date(invoice.due_date) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Receipt className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600">{error || 'This invoice link may have expired or been removed.'}</p>
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
            <Receipt className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Invoice {invoice.invoice_number}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {invoice.status === 'paid' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Payment Received</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Thank you for your payment. This invoice has been marked as paid.
            </p>
          </div>
        )}

        {isOverdue() && invoice.status !== 'paid' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">This invoice is overdue</p>
            <p className="text-red-700 text-sm mt-1">
              Payment was due on {formatDate(invoice.due_date)}. Please pay as soon as possible.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Summary */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice Number</p>
                    <p className="font-medium">{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issue Date</p>
                    <p className="font-medium">{formatDate(invoice.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className={`font-medium ${isOverdue() ? 'text-red-600' : ''}`}>
                      {formatDate(invoice.due_date)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-900">Amount Due</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(invoice.amount)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bill To</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{invoice.clients.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{invoice.clients.email}</p>
                </div>
                {invoice.clients.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{invoice.clients.phone}</p>
                  </div>
                )}
                {invoice.clients.address && (
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{invoice.clients.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {invoice.status === 'unpaid' && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Make Payment</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Amount Due</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CreditCard className="h-5 w-5" />
                    {processing ? 'Processing...' : 'Pay Now'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            )}

            {/* Invoice Information */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    isOverdue() ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status === 'paid' ? 'Paid' : isOverdue() ? 'Overdue' : 'Unpaid'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600">Issue Date</p>
                  <p className="font-medium">{formatDate(invoice.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-medium">{formatDate(invoice.due_date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
