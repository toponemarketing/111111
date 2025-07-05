import React, { useState, useEffect } from 'react'
import { 
  Calendar, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react'
import { useJobs, useCustomers, useQuotes, useInvoices } from '../hooks/useSupabase'

const Dashboard = () => {
  const { jobs, fetchJobs } = useJobs()
  const { customers, fetchCustomers } = useCustomers()
  const { quotes, fetchQuotes } = useQuotes()
  const { invoices, fetchInvoices } = useInvoices()

  useEffect(() => {
    fetchJobs()
    fetchCustomers()
    fetchQuotes()
    fetchInvoices()
  }, [])

  // Calculate metrics from real data
  const totalJobs = jobs.length
  const totalCustomers = customers.length
  const totalQuotes = quotes.length
  const totalInvoices = invoices.length

  const completedJobs = jobs.filter(job => job.status === 'Completed').length
  const pendingJobs = jobs.filter(job => job.status === 'Scheduled' || job.status === 'In Progress').length
  
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount || 0), 0)

  const pendingQuotes = quotes.filter(quote => quote.status === 'Pending').length
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'Overdue').length

  const recentJobs = jobs.slice(0, 5)
  const recentCustomers = customers.slice(0, 5)

  const stats = [
    {
      name: 'Total Jobs',
      value: totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Active Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Pending Quotes',
      value: pendingQuotes,
      icon: FileText,
      color: 'bg-orange-500',
      change: '-3%',
      changeType: 'negative'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary flex items-center justify-center hover:bg-primary-700 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </button>
          <button className="btn-secondary flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
          <button className="btn-secondary flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Create Quote
          </button>
          <button className="btn-secondary flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.length > 0 ? recentJobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.job_number}</p>
                    <p className="text-sm text-gray-500">{job.customer?.name || 'No customer'}</p>
                    <p className="text-sm text-gray-500">{job.service}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : job.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                    {job.amount && (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        ${parseFloat(job.amount).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No jobs yet</p>
                <button className="mt-2 btn-primary">Create your first job</button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentCustomers.length > 0 ? recentCustomers.map((customer) => (
              <div key={customer.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'VIP' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : customer.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {customer.total_jobs || 0} jobs
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No customers yet</p>
                <button className="mt-2 btn-primary">Add your first customer</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(overdueInvoices > 0 || pendingQuotes > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            {overdueInvoices > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {overdueInvoices} overdue invoice{overdueInvoices > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-600">Follow up on payment collection</p>
                </div>
              </div>
            )}
            {pendingQuotes > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {pendingQuotes} pending quote{pendingQuotes > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-yellow-600">Waiting for customer response</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
