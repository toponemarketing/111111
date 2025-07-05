import React, { useState, useEffect } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2
} from 'lucide-react'
import { useAppointments, useCustomers } from '../hooks/useSupabase'
import AppointmentModal from '../components/modals/AppointmentModal'

const localizer = momentLocalizer(moment)

const Calendar = () => {
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const { appointments, loading, fetchAppointments, createAppointment, updateAppointment, deleteAppointment } = useAppointments()
  const { customers, fetchCustomers } = useCustomers()

  useEffect(() => {
    fetchAppointments()
    fetchCustomers()
  }, [])

  // Convert appointments to calendar events
  const events = appointments.map(appointment => ({
    id: appointment.id,
    title: appointment.title,
    start: new Date(appointment.start_time),
    end: new Date(appointment.end_time),
    resource: {
      ...appointment,
      customer: appointment.customer
    }
  }))

  const handleNewAppointment = () => {
    setSelectedAppointment(null)
    setIsModalOpen(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment.resource)
    setIsModalOpen(true)
  }

  const handleDeleteAppointment = async (appointment) => {
    if (confirm(`Delete appointment: ${appointment.title}?`)) {
      try {
        await deleteAppointment(appointment.resource.id)
        alert('Appointment deleted successfully!')
      } catch (error) {
        alert('Error deleting appointment. Please try again.')
      }
    }
  }

  const handleSaveAppointment = async (appointmentData) => {
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, appointmentData)
        alert('Appointment updated successfully!')
      } else {
        await createAppointment(appointmentData)
        alert('Appointment created successfully!')
      }
    } catch (error) {
      throw error
    }
  }

  const handleNavigate = (newDate) => {
    setDate(newDate)
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  const handleSelectEvent = (event) => {
    handleEditAppointment(event)
  }

  const handleSelectSlot = (slotInfo) => {
    if (confirm(`Create appointment for ${moment(slotInfo.start).format('MMMM Do YYYY, h:mm a')}?`)) {
      setSelectedAppointment({
        start_time: slotInfo.start.toISOString(),
        end_time: slotInfo.end.toISOString()
      })
      setIsModalOpen(true)
    }
  }

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'
    
    if (event.resource?.status === 'confirmed') {
      backgroundColor = '#10b981'
    } else if (event.resource?.status === 'pending') {
      backgroundColor = '#f59e0b'
    } else if (event.resource?.status === 'cancelled') {
      backgroundColor = '#ef4444'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const CustomEvent = ({ event }) => (
    <div className="p-1">
      <div className="font-medium text-xs">{event.resource.service}</div>
      <div className="text-xs opacity-90">{event.resource.customer?.name}</div>
    </div>
  )

  const todaysAppointments = appointments.filter(appointment => 
    moment(appointment.start_time).isSame(moment(), 'day')
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading calendar...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage your appointments and schedule</p>
        </div>
        <button 
          onClick={handleNewAppointment}
          className="btn-primary flex items-center hover:bg-primary-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleNavigate(moment(date).subtract(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate())}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
              {moment(date).format(view === 'month' ? 'MMMM YYYY' : view === 'week' ? 'MMMM YYYY' : 'MMMM Do, YYYY')}
            </h2>
            <button 
              onClick={() => handleNavigate(moment(date).add(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate())}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => handleNavigate(new Date())}
              className="btn-secondary hover:bg-gray-100 transition-colors"
            >
              Today
            </button>
            <div className="flex border border-gray-300 rounded-md">
              {['month', 'week', 'day'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => handleViewChange(viewType)}
                  className={`px-3 py-1 text-sm font-medium capitalize transition-colors ${
                    view === viewType
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${viewType === 'month' ? 'rounded-l' : viewType === 'day' ? 'rounded-r' : ''}`}
                >
                  {viewType}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div style={{ height: '600px' }}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent
            }}
            step={30}
            showMultiDayTimes
            toolbar={false}
          />
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {todaysAppointments.map((appointment) => (
            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {moment(appointment.start_time).format('h:mm A')} - {moment(appointment.end_time).format('h:mm A')}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="mr-2 h-4 w-4" />
                      {appointment.customer?.name || 'No customer'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {appointment.service}
                    </div>
                    {appointment.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        {appointment.address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAppointment({ resource: appointment })}
                    className="btn-secondary text-xs flex items-center hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment({ resource: appointment, title: appointment.title })}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs flex items-center transition-colors"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {todaysAppointments.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>No appointments scheduled for today</p>
            <button 
              onClick={handleNewAppointment}
              className="mt-2 btn-primary hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </button>
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        appointment={selectedAppointment}
        customers={customers}
      />
    </div>
  )
}

export default Calendar
