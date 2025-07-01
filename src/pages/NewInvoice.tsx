import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatCurrency, generatePublicToken } from '../lib/utils'

interface InvoiceForm {
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientAddress?: string
  serviceDescription: string
  amount: number
  dueDate: string
}

interface QuoteData {
  service_description: string
  amount: number
  clients: {
    name: string
    email: string
    phone: string | null
    address: string | null
  }
}

export default function NewInvoice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const quoteId = searchParams.get('quoteId')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceForm>()

  const watchAmount = watch('amount')

  useEffect(() => {
    if (quoteId) {
      loadQuoteData(quoteId)
    }
  }, [quoteId])

  const loadQuoteData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          service_description,
          amount,
          clients!inner (
            name,
            email,
            phone,
            address
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading quote:', error)
        return
      }

      // Transform the data to match our interface
      const quoteData: QuoteData = {
        ...data,
        clients: Array.isArray(data.clients) ? data.clients[0] : data.clients
      }

      setValue('clientName', quoteData.clients.name)
      setValue('clientEmail', quoteData.clients.email)
      setValue('clientPhone', quoteData.clients.phone || '')
      setValue('clientAddress', quoteData.clients.address || '')
      setValue('serviceDescription', quoteData.service_description)
      setValue('amount', Number(quoteData.amount))
      
      // Set due date to 30 days from now
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 30)
      setValue('dueDate', dueDate.toISOString().split('T')[0])
    } catch (error) {
      console.error('Error loading quote data:', error)
    }
  }

  const generateInvoiceNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}${day}-${random}`
  }

  const onSubmit = async (data: InvoiceForm) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Create or find client
      let clientId: string
      
      const { data: existingClient, error: clientFetchError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.clientEmail)
        .single()

      if (clientFetchError && clientFetchError.code !== 'PGRST116') {
        throw new Error('Failed to check existing client')
      }

      if (existingClient) {
        clientId = existingClient.id
        
        // Update client info
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            name: data.clientName,
            phone: data.clientPhone || null,
            address: data.clientAddress || null,
          })
          .eq('id', clientId)

        if (updateError) {
          throw new Error('Failed to update client information')
        }
      } else {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            name: data.clientName,
            email: data.clientEmail,
            phone: data.clientPhone || null,
            address: data.clientAddress || null,
          })
          .select('id')
          .single()

        if (createError) {
          throw new Error('Failed to create client')
        }
        
        if (!newClient) {
          throw new Error('No client data returned')
        }
        
        clientId = newClient.id
      }

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          quote_id: quoteId || null,
          client_id: clientId,
          invoice_number: generateInvoiceNumber(),
          amount: data.amount,
          due_date: data.dueDate,
          status: 'unpaid',
          public_token: generatePublicToken(),
        })
        .select('id')
        .single()

      if (invoiceError) {
        throw new Error('Failed to create invoice')
      }

      if (!invoice) {
        throw new Error('No invoice data returned')
      }

      navigate(`/invoices/${invoice.id}`)
    } catch (error: any) {
      console.error('Error in invoice creation:', error)
      setError(error.message || 'Failed to create invoice. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">New Invoice</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Client Information */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  className="input"
                  {...register('clientName', { required: 'Client name is required' })}
                />
                {errors.clientName && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientName.message}</p>
                )}
              </div>
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  className="input"
                  {...register('clientEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.clientEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.clientEmail.message}</p>
                )}
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  {...register('clientPhone')}
                />
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  className="input"
                  {...register('clientAddress')}
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Service Description *</label>
                <textarea
                  rows={4}
                  className="input resize-none"
                  placeholder="Describe the service provided..."
                  {...register('serviceDescription', { required: 'Service description is required' })}
                />
                {errors.serviceDescription && (
                  <p className="text-red-600 text-sm mt-1">{errors.serviceDescription.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input pl-8"
                      {...register('amount', { 
                        required: 'Amount is required',
                        min: { value: 0.01, message: 'Amount must be greater than 0' }
                      })}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Due Date *</label>
                  <input
                    type="date"
                    className="input"
                    {...register('dueDate', { required: 'Due date is required' })}
                  />
                  {errors.dueDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {watchAmount > 0 && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Invoice Preview</h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(watchAmount)}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                This invoice will be sent to the client for payment
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
            <Link
              to="/"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
