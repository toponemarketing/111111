import React, { useState } from 'react'
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
  User
} from 'lucide-react'

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment)

const Calendar = () => {
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Kitchen Sink Repair',
      start: new Date(2024, 0, 15, 9, 0), // January 15, 2024, 9:00 AM
      end: new Date(2024, 0, 15, 11, 0),   // January 15, 2024, 11:00 AM
      customer: 'John Smith',
      address: '123 Main St',
      phone: '(555) 123-4567',
      status: 'confirmed',
      type: 'job'
    },
    {
      id: 2,
      title: 'HVAC Installation',
      start: new Date(2024, 0, 15, 14, 0), // January 15, 2024, 2:00 PM
      end: new Date(2024, 0, 15, 17, 0),   // January 15, 2024, 5:00 PM
      customer: 'Sarah Johnson',
      address: '456 Oak Ave',
      phone: '(555) 234-5678',
      status: 'confirmed',
      type: 'job'
    },
    {
      id: 3,
      title: 'Electrical Inspection',
      start: new Date(2024, 0, 16, 10, 30), // January 16, 2024, 10:30 AM
      end: new Date(2024, 0, 16, 12, 0),    // January 16, 2024, 12:00 PM
      customer: 'Mike Wilson',
      address: '789 Pine St',
      phone: '(555) 345-6789',
      status: 'pending',
      type: 'job'
    },
    {
      id: 4,
      title: 'Carpet Cleaning Quote',
      start: new Date(2024, 0, 17, 13, 0), // January 17, 2024, 1:00 PM
      end: new Date(2024, 0, 17, 14, 0),   // January 17, 2024, 2:00 PM
      customer: 'Emily Davis',
      address: '321 Elm St',
      phone: '(555) 456-7890',
      status: 'confirmed',
      type: 'quote'
    },
    {
      id: 5,
      title: 'Garden Maintenance',
      start: new Date(2024, 0, 18, 8, 0),  // January 18, 2024, 8:00 AM
      end: new Date(2024, 0, 18, 12, 0),   // January 18, 2024, 12:00 PM
      customer: 'Robert Brown',
      address: '654 Maple Dr',
      phone: '(555) 567-8901',
      status: 'confirmed',
      type: 'job'
    }
  ]

  // Custom event style getter
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6' // Default blue
    
    if (event.type === 'quote') {
      backgroundColor = '#8b5cf6' // Purple for quotes
    } else if (event.status === 'pending') {
      backgroundColor = '#f59e0b' // Orange for pending
    } else if (event.status === 'confirmed') {
      backgroundColor = '#10b981' // Green for confirmed
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

  // Custom event component
  const EventComponent = ({ event }) => (
    <div className="text-xs">
      <div className="font-medium truncate">{event.title}</div>
      <div className="truncate">{event.customer}</div>
    </div>
  )

  const handleNavigate = (newDate) => {
    setDate(newDate)
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  // Get today's appointments
  const todayEvents = events.filter(event => 
    moment(event.start).isSame(moment(), 'day')
  ).sort((a, b) => a.start - b.start)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Schedule and manage your appointments</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {moment(date).format('MMMM YYYY')}
                </h2>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleNavigate(moment(date).subtract(1, view).toDate())}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleNavigate(new Date())}
                    className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleNavigate(moment(date).add(1, view).toDate())}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewChange('month')}
                  className={`px-3 py-1 text-sm rounded ${
                    view === 'month' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => handleViewChange('week')}
                  className={`px-3 py-1 text-sm rounded ${
                    view === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => handleViewChange('day')}
                  className={`px-3 py-1 text-sm rounded ${
                    view === 'day' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>
            
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
                eventPropGetter={eventStyleGetter}
                components={{
                  event: EventComponent
                }}
                toolbar={false}
                popup
              />
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Today's Schedule
              </h3>
            </div>
            <div className="p-4">
              {todayEvents.length > 0 ? (
                <div className="space-y-4">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-primary-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="mr-1 h-3 w-3" />
                              {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <User className="mr-1 h-3 w-3" />
                              {event.customer}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="mr-1 h-3 w-3" />
                              {event.address}
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed' 
                            ? 'bg-success-100 text-success-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No appointments today</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Legend</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Confirmed Jobs</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Pending Jobs</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Quotes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
