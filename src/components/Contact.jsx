import React from 'react'
import { Mail, Phone, Calendar, MapPin, Clock } from 'lucide-react'
import BookingWidget from './BookingWidget'
import ContactWidget from './ContactWidget'

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Let's Connect
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're ready to begin your healing journey or just have a few questions, I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href="mailto:support@boundlesswithkim.com" className="text-primary-600 hover:text-primary-700">
                      support@boundlesswithkim.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Online Booking</p>
                    <p className="text-gray-600">Schedule directly through our system</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600">Within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Services</p>
                    <p className="text-gray-600">Online sessions available nationwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-primary-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
              <p className="mb-6 opacity-90">
                Take the first step toward healing and transformation today.
              </p>
              <div className="space-y-3">
                <BookingWidget />
              </div>
            </div>
          </div>

          {/* Contact Form Widget */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
            
            <div className="text-center space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Use our secure contact form to reach out with any questions or to get started with your healing journey. All information is confidential and secure.
              </p>
              
              <ContactWidget />
              
              <p className="text-sm text-gray-600">
                Your information is confidential and secure. Kim will respond within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
