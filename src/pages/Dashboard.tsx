import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  Receipt, 
  Users, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Stats {
  totalQuotes: number
  totalInvoices: number
  totalClients: number
  totalRevenue: number
  pendingQuotes: number
  paidInvoices: number
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalQuotes: 0,
    totalInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
    paidInvoices: 0
  })

  useEffect(() => {
    // Load stats from localStorage or API
    const loadStats = () => {
      const quotes = JSON.parse(localStorage.getItem('quotes') || '[]')
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]')
      const clients = JSON.parse(localStorage.getItem('clients') || '[]')

      const totalRevenue = invoices
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + inv.amount, 0)

      const pendingQuotes = quotes.filter((q: any) => q.status === 'pending').length
      const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length

      setStats({
        totalQuotes: quotes.length,
        totalInvoices: invoices.length,
        totalClients: clients.length,
        totalRevenue,
        pendingQuotes,
        paidInvoices
      })
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Total Quotes',
      value: stats.totalQuotes,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/quotes'
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      icon: Receipt,
      color: 'bg-green-500',
      href: '/invoices'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-purple-500',
      href: '/clients'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      href: '/invoices'
    }
  ]

  const quickActions = [
    {
      title: 'Create Quote',
      description: 'Generate a new quote for a client',
      icon: FileText,
      href: '/quotes/new',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Create Invoice',
      description: 'Create a new invoice',
      icon: Receipt,
      href: '/invoices/new',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Add Client',
      description: 'Add a new client to your database',
      icon: Users,
      href: '/clients',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/quotes/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Quote
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              to={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`${action.color} text-white p-4 rounded-lg transition-colors`}
              >
                <div className="flex items-center mb-2">
                  <Icon size={20} className="mr-2" />
                  <h3 className="font-medium">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Quotes</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {stats.pendingQuotes}
            </span>
          </div>
          <div className="space-y-3">
            {stats.pendingQuotes > 0 ? (
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2 text-yellow-500" />
                {stats.pendingQuotes} quotes awaiting client response
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle size={16} className="mr-2 text-green-500" />
                No pending quotes
              </div>
            )}
            <Link
              to="/quotes"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all quotes →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue This Month</h2>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle size={16} className="mr-2 text-green-500" />
              {stats.paidInvoices} invoices paid
            </div>
            <Link
              to="/invoices"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all invoices →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
