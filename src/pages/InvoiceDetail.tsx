import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send, CreditCard, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils'

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  due_date: string
  status: string
  public_token: string
  paid_at: string | null
  created_at: string
  clients: {
    name: string
    email: string
    phone: string | null
    address: string | null
  }
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadInvoice(id)
    }
  }, [id])

  const loadInvoice = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          amount,
          due_date,
          status,
          public_token,
          paid_at,
          created_at,
          clients!inner (
            name,
            email,
            phone,
            address
          )
        `)
        .eq('id', invoiceId)
        .single()

      if (error) {
        console.error('Error loading invoice:', error)
        setError('Invoice not found')
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

  const deleteInvoice = async () => {
    if (!invoice || !confirm('Are you sure you want to delete this invoice?')) return

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id)

      if (error) {
        console.error('Error deleting invoice:', error)
        return
      }

      navigate('/')
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const getShareUrl = () => {
    if (!invoice) return ''
    return `${window.location.origin}/share/invoice/${invoice.public_token}`
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      alert('Share URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
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
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <Link to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Invoice {invoice.invoice_number}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
              {isOverdue() && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
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

            {/* Invoice Summary */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h2>
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
                    <p className="text-lg font-medium text-gray-900">Total Amount</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(invoice.amount)}</p>
                  </div>
                </div>
                {invoice.paid_at && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">Paid on {formatDate(invoice.paid_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Payment Actions */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={copyShareUrl}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Copy Payment Link
                </button>
                
                {invoice.status === 'unpaid' && (
                  <Link
                    to={getShareUrl()}
                    target="_blank"
                    className="w-full btn-outline flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    View Payment Page
                  </Link>
                )}

                <button
                  onClick={deleteInvoice}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Invoice
                </button>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium">{formatDate(invoice.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600">Payment URL</p>
                  <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">
                    {getShareUrl()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
