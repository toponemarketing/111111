import React from 'react'
import { BookOpen, Download, Video, Headphones } from 'lucide-react'

const Resources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: '5 Daily Practices for Mental Wellness',
      description: 'Simple, evidence-based strategies you can start today to improve your mental health.',
      type: 'Article',
      link: '#'
    },
    {
      icon: Download,
      title: 'Recovery Toolkit',
      description: 'A comprehensive guide with worksheets, affirmations, and coping strategies.',
      type: 'PDF Download',
      link: '#'
    },
    {
      icon: Video,
      title: 'Trauma-Informed Self-Care',
      description: 'Learn gentle self-care practices designed specifically for trauma survivors.',
      type: 'Video',
      link: '#'
    },
    {
      icon: Headphones,
      title: 'Guided Meditation for Anxiety',
      description: 'A 10-minute guided meditation to help calm anxiety and center yourself.',
      type: 'Audio',
      link: '#'
    }
  ]

  return (
    <section id="resources" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Free Resources for Your Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tools, tips, and guidance to support your healing process — available anytime you need them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon
            return (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{resource.title}</h3>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <a 
                      href={resource.link} 
                      className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
                    >
                      Access Resource
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-primary-600 to-lavender-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold">Stay Connected</h3>
            <p className="text-xl opacity-90">
              Get weekly tips, resources, and encouragement delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-sm opacity-75">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resources
