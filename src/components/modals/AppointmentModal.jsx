import React, { useState, useEffect } from 'react'
import { X, Calendar, User, MapPin, Clock, FileText } from 'lucide-react'

const AppointmentModal = ({ isOpen, onClose, onSave, appointment = null, customers = [] }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    service: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    address: '',
    status: 'confirmed'
  })

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time)
      const endDate = new Date(appointment.end_time)
      
      setFormData({
        customer_id: appointment.customer_id || '',
        title: appointment.title || '',
        service: appointment.service || '',
        start_date: startDate.toISOString().split('T')[0],
        start_time: startDate.toTimeString().slice(0, 5),
        end_date: endDate.toISOString().split('T')[0],
        end_time: endDate.toTimeString().slice(0, 5),
        address: appointment.address || '',
        status: appointment.status || 'confirmed'
      })
    } else {
      // Set default to next hour
      const now = new Date()
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      
      setFormData({
        customer_id: '',
        title: '',
        service: '',
        start_date: nextHour.toISOString().split('T')[0],
        start_time: nextHour.toTimeString().slice(0, 5),
        end_date: twoHoursLater.toISOString().split('T')[0],
        end_time: twoHoursLater.toTimeString().slice(0, 5),
        address: '',
        status: 'confirmed'
      })
    }
  }, [appointment])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Combine date and time for start and end
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)
      
      const appointmentData = {
        customer_id: formData.customer_id,
        title: formData.title,
        service: formData.service,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        address: formData.address,
        status: formData.status
      }
      
      await onSave(appointmentData)
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
      alert('Error saving appointment. Please try again.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {appointment ? 'Edit Appointment' : 'Create New Appointment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Customer
              </label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Appointment title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Plumbing Repair"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                End Time
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="Appointment location"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {appointment ? 'Update Appointment' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppointmentModal
