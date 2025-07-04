import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react'

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const jobs = [
    {
      id: 1,
      jobNumber: 'JOB-001',
      customer: 'John Smith',
      service: 'Plumbing Repair',
      status: 'In Progress',
      priority: 'High',
      scheduledDate: '2024-01-15',
      scheduledTime: '9:00 AM',
      address: '123 Main St, Anytown',
      amount: '$150.00',
      description: 'Kitchen sink leak repair',
    },
    {
      id: 2,
      jobNumber: 'JOB-002',
      customer: 'Sarah Johnson',
      service: 'HVAC Maintenance',
      status: 'Completed',
      priority: 'Medium',
      scheduledDate: '2024-01-14',
      scheduledTime: '2:00 PM',
      address: '456 Oak Ave, Anytown',
      amount: '$280.00',
      description: 'Annual HVAC system maintenance',
    },
    {
      id: 3,
      jobNumber: 'JOB-003',
      customer: 'Mike Wilson',
      service: 'Electrical Work',
      status: 'Scheduled',
      priority: 'Low',
      scheduledDate: '2024-01-16',
      scheduledTime: '10:30 AM',
      address: '789 Pine St, Anytown',
      amount: '$320.00',
      description: 'Install new electrical outlets',
    },
    {
      id: 4,
      jobNumber: 'JOB-004',
      customer: 'Emily Davis',
      service: 'Carpet Cleaning',
      status: 'Quote Sent',
      priority: 'Medium',
      scheduledDate: '2024-01-17',
      scheduledTime: '1:00 PM',
      address: '321 Elm St, Anytown',
      amount: '$180.00',
      description: 'Deep carpet cleaning for living room',
    },
    {
      id: 5,
      jobNumber: 'JOB-005',
      customer: 'Robert Brown',
      service: 'Landscaping',
      status: 'In Progress',
      priority: 'High',
      scheduledDate: '2024-01-15',
      scheduledTime: '8:00 AM',
      address: '654 Maple Dr, Anytown',
      amount: '$450.00',
      description: 'Garden redesign and maintenance',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'In Progress':
        return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'Scheduled':
        return 'bg-primary-50 text-primary-700 border-primary-200'
      case 'Quote Sent':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-error-50 text-error-700'
      case 'Medium':
        return 'bg-warning-50 text-warning-700'
      case 'Low':
        return 'bg-success-50 text-success-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage and track all your service jobs</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, customers, or services..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Quote Sent">Quote Sent</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {filteredJobs.length} Jobs
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredJobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{job.jobNumber}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                      {job.priority} Priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.customer}</p>
                      <p className="text-sm text-gray-500">{job.service}</p>
                      <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        {job.scheduledDate} at {job.scheduledTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        {job.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-900 font-medium">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {job.amount}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first job'
            }
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Jobs
