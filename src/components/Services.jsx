import React from 'react'
import { Brain, Target, Heart, Users, Mail } from 'lucide-react'
import BookingWidget from './BookingWidget'

const Services = () => {
  const services = [
    {
      icon: Target,
      title: 'Life Coaching',
      description: 'For those who feel stuck, overwhelmed, or unsure of their next step. Kim helps you set goals, rebuild confidence, and walk into your purpose.',
      features: ['Goal Setting & Achievement', 'Confidence Building', 'Purpose Discovery', 'Life Transitions']
    },
    {
      icon: Brain,
      title: 'Online Therapy & Counseling',
      description: 'Confidential support for those navigating trauma, depression, anxiety, or major life transitions. Clinical care with a personal touch.',
      features: ['Trauma Therapy', 'Depression & Anxiety', 'PTSD Support', 'Individual Counseling']
    },
    {
      icon: Heart,
      title: 'Recovery Support & Addiction Coaching',
      description: 'Whether you\'re early in recovery or years into the journey, Kim offers ongoing support from someone who\'s walked the road herself.',
      features: ['Addiction Recovery', 'Relapse Prevention', 'Ongoing Support', 'Family Counseling']
    }
  ]

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Therapy. Coaching. Recovery Support.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You deserve healing — mind, body, and soul.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4">
                    <BookingWidget />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Options */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Additional Options</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary-600" />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Group Sessions</h4>
                  <p className="text-gray-600">Coming soon - Community healing circles</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Heart className="h-8 w-8 text-primary-600" />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Sliding Scale Rates</h4>
                  <p className="text-gray-600">Financial assistance available</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <BookingWidget />
              <a href="#contact" className="btn-secondary">
                <Mail className="h-4 w-4" />
                Contact for Custom Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
