import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useSupabase = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, supabase }
}

// Jobs operations
export const useJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          customer:customers(name, email, phone)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const createJob = async (jobData) => {
    try {
      const { data: jobNumber } = await supabase.rpc('generate_job_number')
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          job_number: jobNumber,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single()

      if (error) throw error
      await fetchJobs()
      return data
    } catch (error) {
      console.error('Error creating job:', error)
      throw error
    }
  }

  const updateJob = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchJobs()
      return data
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    }
  }

  const deleteJob = async (id) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  }

  return { jobs, loading, fetchJobs, createJob, updateJob, deleteJob }
}

// Customers operations
export const useCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (customerData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customerData,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single()

      if (error) throw error
      await fetchCustomers()
      return data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  const updateCustomer = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchCustomers()
      return data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  }

  const deleteCustomer = async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  }

  return { customers, loading, fetchCustomers, createCustomer, updateCustomer, deleteCustomer }
}

// Quotes operations
export const useQuotes = () => {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          customer:customers(name, email, phone)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const createQuote = async (quoteData) => {
    try {
      const { data: quoteNumber } = await supabase.rpc('generate_quote_number')
      
      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          ...quoteData,
          quote_number: quoteNumber,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single()

      if (error) throw error
      await fetchQuotes()
      return data
    } catch (error) {
      console.error('Error creating quote:', error)
      throw error
    }
  }

  const updateQuote = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchQuotes()
      return data
    } catch (error) {
      console.error('Error updating quote:', error)
      throw error
    }
  }

  const deleteQuote = async (id) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchQuotes()
    } catch (error) {
      console.error('Error deleting quote:', error)
      throw error
    }
  }

  return { quotes, loading, fetchQuotes, createQuote, updateQuote, deleteQuote }
}

// Invoices operations
export const useInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(name, email, phone)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = async (invoiceData) => {
    try {
      const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number')
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          ...invoiceData,
          invoice_number: invoiceNumber,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single()

      if (error) throw error
      await fetchInvoices()
      return data
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  }

  const updateInvoice = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchInvoices()
      return data
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  const deleteInvoice = async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchInvoices()
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  return { invoices, loading, fetchInvoices, createInvoice, updateInvoice, deleteInvoice }
}

// Appointments operations
export const useAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customer:customers(name, email, phone)
        `)
        .order('start_time', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAppointment = async (appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single()

      if (error) throw error
      await fetchAppointments()
      return data
    } catch (error) {
      console.error('Error creating appointment:', error)
      throw error
    }
  }

  const updateAppointment = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchAppointments()
      return data
    } catch (error) {
      console.error('Error updating appointment:', error)
      throw error
    }
  }

  const deleteAppointment = async (id) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchAppointments()
    } catch (error) {
      console.error('Error deleting appointment:', error)
      throw error
    }
  }

  return { appointments, loading, fetchAppointments, createAppointment, updateAppointment, deleteAppointment }
}
