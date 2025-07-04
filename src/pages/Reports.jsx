import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

const Reports = () => {
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('overview')

  // Sample data for charts and reports
  const revenueData = [
    { month: 'Jan', revenue: 4500, jobs: 15 },
    { month: 'Feb', revenue: 5200, jobs: 18 },
    { month: 'Mar', revenue: 4800, jobs: 16 },
    { month: 'Apr', revenue: 6100, jobs: 22 },
    { month: 'May', revenue: 5800, jobs: 20 },
    { month: 'Jun', revenue: 6500, jobs: 24 },
  ]

  const topServices = [
    { service: 'Plumbing Repair', jobs: 45, revenue: 6750 },
    { service: 'HVAC Maintenance', jobs: 32, revenue: 8960 },
    { service: 'Electrical Work', jobs: 28, revenue: 8400 },
    { service: 'Carpet Cleaning', jobs: 24, revenue: 4320 },
    { service: 'Landscaping', jobs: 18, revenue: 8100 },
  ]

  const customerStats = [
    { type: 'New Customers', count: 23, change: '+15%' },
    { type: 'Repeat Customers', count: 67, change: '+8%' },
    { type: 'Customer Retention', count: '85%', change: '+3%' },
    { type: 'Avg. Customer Value', count: '$1,250', change: '+12%' },
  ]

  const jobStats = [
    { status: 'Completed', count: 89, percentage: 65 },
    { status: 'In Progress', count: 23, percentage: 17 },
    { status: 'Scheduled', count: 18, percentage: 13 },
    { status: 'Cancelled', count: 7, percentage: 5 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your business performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="input-field"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn-secondary flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45,231</p>
              <p className="text-sm text-success-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Jobs Completed</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-success-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Users className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Customers</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-success-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Job Value</p>
              <p className="text-2xl font-bold text-gray-900">$508</p>
              <p className="text-sm text-success-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-primary-500 rounded-t-sm"
                  style={{ height: `${(data.revenue / 7000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Status Distribution</h3>
          <div className="space-y-4">
            {jobStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    stat.status === 'Completed' ? 'bg-success-500' :
                    stat.status === 'In Progress' ? 'bg-warning-500' :
                    stat.status === 'Scheduled' ? 'bg-primary-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{stat.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.status === 'Completed' ? 'bg-success-500' :
                        stat.status === 'In Progress' ? 'bg-warning-500' :
                        stat.status === 'Scheduled' ? 'bg-primary-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services</h3>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.service}</p>
                  <p className="text-xs text-gray-500">{service.jobs} jobs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${service.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">${Math.round(service.revenue / service.jobs)} avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Statistics</h3>
          <div className="space-y-4">
            {customerStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{stat.type}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{stat.count}</span>
                  <span className="text-xs text-success-600">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Job #JOB-001 completed for John Smith - $150</span>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New customer Sarah Johnson added</span>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Quote #QUO-003 sent to Mike Wilson</span>
            <span className="text-xs text-gray-400">6 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Invoice #INV-002 paid by ABC Corporation - $1,200</span>
            <span className="text-xs text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
