import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'

const Reports = () => {
  const [dateRange, setDateRange] = useState('last-30-days')
  const [reportType, setReportType] = useState('overview')

  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Jobs Completed',
      value: '127',
      change: '+8.2%',
      changeType: 'positive',
      icon: Briefcase,
    },
    {
      name: 'New Customers',
      value: '23',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Average Job Value',
      value: '$356',
      change: '+4.1%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ]

  const topServices = [
    { name: 'Plumbing Repair', revenue: '$12,450', jobs: 45, percentage: 28 },
    { name: 'HVAC Maintenance', revenue: '$9,800', jobs: 32, percentage: 22 },
    { name: 'Electrical Work', revenue: '$8,200', jobs: 28, percentage: 18 },
    { name: 'Landscaping', revenue: '$7,100', jobs: 24, percentage: 16 },
    { name: 'Carpet Cleaning', revenue: '$4,900', jobs: 18, percentage: 11 },
  ]

  const monthlyData = [
    { month: 'Jan', revenue: 4200, jobs: 15 },
    { month: 'Feb', revenue: 3800, jobs: 12 },
    { month: 'Mar', revenue: 5100, jobs: 18 },
    { month: 'Apr', revenue: 4600, jobs: 16 },
    { month: 'May', revenue: 5800, jobs: 21 },
    { month: 'Jun', revenue: 6200, jobs: 23 },
  ]

  // Button handlers
  const handleExportReport = () => {
    alert('📊 Exporting report...')
    console.log('Export report clicked')
  }

  const handleRefreshData = () => {
    alert('🔄 Refreshing data...')
    console.log('Refresh data clicked')
  }

  const handleGenerateReport = () => {
    alert(`📈 Generating ${reportType} report for ${dateRange}...`)
    console.log('Generate report:', { reportType, dateRange })
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    console.log('Date range changed:', range)
  }

  const handleReportTypeChange = (type) => {
    setReportType(type)
    console.log('Report type changed:', type)
  }

  const handleViewDetails = (service) => {
    alert(`📋 Viewing details for ${service.name}`)
    console.log('View service details:', service)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefreshData}
            className="btn-secondary flex items-center hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <button 
            onClick={handleExportReport}
            className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              className="input-field"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="last-year">Last year</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
            >
              <option value="overview">Business Overview</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="customers">Customer Report</option>
              <option value="services">Service Performance</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleGenerateReport}
              className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
            <button 
              onClick={() => handleViewDetails({ name: 'Monthly Revenue' })}
              className="text-primary-600 hover:text-primary-700 text-sm transition-colors"
            >
              View Details
            </button>
          </div>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 w-8">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(data.revenue / 6200) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">${data.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{data.jobs} jobs</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Services</h3>
            <button 
              onClick={() => handleViewDetails({ name: 'Top Services' })}
              className="text-primary-600 hover:text-primary-700 text-sm transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm text-gray-500">{service.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{service.revenue}</span>
                    <span>{service.jobs} jobs</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewDetails(service)}
                  className="ml-3 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Report Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleGenerateReport('customer-summary')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all"
          >
            <Users className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Customer Summary</span>
          </button>
          <button 
            onClick={() => handleGenerateReport('job-performance')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all"
          >
            <Briefcase className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Job Performance</span>
          </button>
          <button 
            onClick={() => handleGenerateReport('financial-summary')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all"
          >
            <DollarSign className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Financial Summary</span>
          </button>
          <button 
            onClick={() => handleGenerateReport('trend-analysis')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all"
          >
            <TrendingUp className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Trend Analysis</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reports
