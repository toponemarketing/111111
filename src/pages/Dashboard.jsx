import React from 'react'
import { 
  DollarSign, 
  Users, 
  Briefcase, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
    },
    {
      name: 'Active Jobs',
      value: '23',
      change: '+3',
      changeType: 'increase',
      icon: Briefcase,
    },
    {
      name: 'Total Customers',
      value: '156',
      change: '+8',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'This Week',
      value: '12',
      change: '-2',
      changeType: 'decrease',
      icon: Calendar,
    },
  ]

  const recentJobs = [
    {
      id: 1,
      customer: 'John Smith',
      service: 'Plumbing Repair',
      status: 'In Progress',
      amount: '$150',
      date: '2024-01-15',
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      service: 'HVAC Maintenance',
      status: 'Completed',
      amount: '$280',
      date: '2024-01-14',
    },
    {
      id: 3,
      customer: 'Mike Wilson',
      service: 'Electrical Work',
      status: 'Scheduled',
      amount: '$320',
      date: '2024-01-16',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success-50 text-success-700'
      case 'In Progress':
        return 'bg-warning-50 text-warning-700'
      case 'Scheduled':
        return 'bg-primary-50 text-primary-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'increase' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {item.changeType === 'increase' ? (
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                        ) : (
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4 transform rotate-180" />
                        )}
                        <span className="ml-1">{item.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{job.customer}</p>
                    <p className="text-sm text-gray-500">{job.service}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{job.amount}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{job.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
              <Briefcase className="mr-2 h-4 w-4" />
              Create New Job
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Users className="mr-2 h-4 w-4" />
              Add Customer
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">9:00 AM - Kitchen Sink Repair</p>
                <p className="text-sm text-gray-500">John Smith • 123 Main St</p>
              </div>
              <CheckCircle className="h-5 w-5 text-success-500" />
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">2:00 PM - HVAC Installation</p>
                <p className="text-sm text-gray-500">Sarah Johnson • 456 Oak Ave</p>
              </div>
              <AlertCircle className="h-5 w-5 text-warning-500" />
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">4:30 PM - Electrical Inspection</p>
                <p className="text-sm text-gray-500">Mike Wilson • 789 Pine St</p>
              </div>
              <div className="h-5 w-5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
