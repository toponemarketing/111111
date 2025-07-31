import React from 'react'
import { Calendar } from 'lucide-react'

const BookingWidget = ({ className = "" }) => {
  const handleBookingClick = () => {
    // Open booking page in new tab
    window.open('https://boundless.clientsecure.me', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={className}>
      <div className="text-center">
        <button
          onClick={handleBookingClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Calendar className="h-5 w-5" />
          Request Appointment
        </button>
      </div>
    </div>
  )
}

export default BookingWidget
