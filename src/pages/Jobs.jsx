import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { useJobs, useCustomers } from '../hooks/useSupabase'
import JobModal from '../components/modals/JobModal'

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  const { jobs, loading, fetchJobs, createJob, updateJob, deleteJob } = useJobs()
  const { customers, fetchCustomers } = useCustomers()

  useEffect(() => {
    fetchJobs()
    fetchCustomers()
  }, [])

  const handleNewJob = () => {
    setSelectedJob(null)
    setIsModalOpen(true)
  }

  const handleEditJob = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleDeleteJob = async (job) => {
    if (confirm(`Delete job ${job.job_number}?`)) {
      try {
        await deleteJob(job.id)
        alert('Job deleted successfully!')
      } catch (error) {
        console.error('Error deleting job:', error)
        alert('Error deleting job. Please try again.')
      }
    }
  }

  const handleSaveJob = async (jobData) => {
    try {
      if (selectedJob) {
        await updateJob(selectedJob.id, jobData)
        alert('Job updated successfully!')
      } else {
        await createJob(jobData)
        alert('Job created successfully!')
      }
    } catch (error) {
      console.error('Error saving job:', error)
      throw error
    }
  }

  const handleStatusChange = async (job, newStatus) => {
    try {
      console.log('Updating job status:', { jobId: job.id, oldStatus: job.status, newStatus })
      await updateJob(job.id, { status: newStatus })
      alert(`Job ${job.job_number} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating job status:', error)
      alert('Error updating job status. Please try again.')
    }
  }

  const handleViewJob = (job) => {
    alert(`Viewing job ${job.job_number} - ${job.service}`)
  }

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
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200'
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

  const getStatusActions = (job) => {
    const actions = []
    
    switch (job.status) {
      case 'Scheduled':
        actions.push({ label: 'Start Job', status: 'In Progress', color: 'bg-blue-600 hover:bg-blue-700' })
        actions.push({ label: 'Cancel', status: 'Cancelled', color: 'bg-red-600 hover:bg-red-700' })
        break
      case 'In Progress':
        actions.push({ label: 'Complete', status: 'Completed', color: 'bg-green-600 hover:bg-green-700' })
        actions.push({ label: 'Cancel', status: 'Cancelled', color: 'bg-red-600 hover:bg-red-700' })
        break
      case 'Approved':
        actions.push({ label: 'Complete', status: 'Completed', color: 'bg-green-600 hover:bg-green-700' })
        actions.push({ label: 'Start Job', status: 'In Progress', color: 'bg-blue-600 hover:bg-blue-700' })
        break
      case 'Quote Sent':
        actions.push({ label: 'Approve', status: 'Approved', color: 'bg-green-600 hover:bg-green-700' })
        actions.push({ label: 'Schedule', status: 'Scheduled', color: 'bg-blue-600 hover:bg-blue-700' })
        break
      default:
        break
    }
    
    return actions
  }

  const filteredJobs = jobs.filter(job => {
    const customerName = job.customer?.name || ''
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.job_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading jobs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage and track all your service jobs</p>
        </div>
        <button 
          onClick={handleNewJob}
          className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
        >
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
              <option value="Approved">Approved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{job.job_number}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                      {job.priority} Priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.customer?.name || 'No customer'}</p>
                      <p className="text-sm text-gray-500">{job.service}</p>
                      <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {job.scheduled_date && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-2 h-4 w-4" />
                          {job.scheduled_date} {job.scheduled_time && `at ${job.scheduled_time}`}
                        </div>
                      )}
                      {job.address && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          {job.address}
                        </div>
                      )}
                      {job.amount && (
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <DollarSign className="mr-2 h-4 w-4" />
                          ${parseFloat(job.amount).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Action buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getStatusActions(job).map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleStatusChange(job, action.status)}
                        className={`${action.color} text-white px-3 py-1 rounded text-xs flex items-center transition-colors`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {/* Regular Action buttons */}
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleViewJob(job)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditJob(job)}
                      className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs flex items-center transition-colors"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </button>
                  </div>
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
            <button 
              onClick={handleNewJob}
              className="btn-primary hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </button>
          </div>
        </div>
      )}

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        job={selectedJob}
        customers={customers}
      />
    </div>
  )
}

export default Jobs
