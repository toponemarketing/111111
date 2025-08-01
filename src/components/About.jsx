import React, { useState } from 'react'
import { Heart, Award, Users, Phone } from 'lucide-react'
import BookingWidget from './BookingWidget'

const About = () => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              {!imageError ? (
                <img 
                  src="https://global-files-nginx.builderall.com/76b44d28-a620-4e75-bf81-c0f7cb857979/33c12f98605ff23a0e925ad6607db10fd3027319c0e95651ab5bdfe761dee040.png"
                  alt="Kim - Licensed Social Worker and Life Coach"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />
              ) : (
                // Fallback design when image fails to load
                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-lavender-200 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center">
                      <Heart className="h-16 w-16 text-primary-600" />
                    </div>
                    <div className="text-gray-700">
                      <h3 className="text-2xl font-bold">Kim</h3>
                      <p className="text-primary-600 font-medium">Licensed Social Worker & Life Coach</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Overlay with credentials */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white space-y-2">
                  <h3 className="text-2xl font-bold">Kim</h3>
                  <p className="text-primary-300 font-medium">Licensed Social Worker & Life Coach</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span>Master's Degree in Social Work</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating credential badge - top right only */}
            <div className="absolute -top-4 -right-4 bg-primary-600 text-white rounded-2xl p-4 shadow-lg">
              <div className="text-center">
                <Heart className="h-6 w-6 mx-auto mb-1" />
                <p className="text-xs font-medium">Lived</p>
                <p className="text-xs">Experience</p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Meet Kim – From Brokenness to{' '}
                <span className="text-primary-600">Boundless</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Hi, I'm Kim. I know what it feels like to be stuck, to feel unseen, and to wonder if change is even possible. I've lived through addiction, trauma, and homelessness — and by the grace of God, I found my way through. I didn't just survive. I turned my pain into purpose.
              </p>
              
              <p>
                Today, I hold a Master's Degree in Social Work and use both my lived experience and clinical training to walk alongside people who feel like they've run out of options. I created Boundless with Kim to be the kind of support I wish I had — honest, compassionate, and rooted in hope.
              </p>
              
              <div className="bg-primary-50 rounded-2xl p-6 border-l-4 border-primary-600">
                <p className="text-xl font-medium text-primary-800">
                  You are not alone. Healing is possible. And together, we can get there.
                </p>
              </div>
            </div>

            {/* Credentials List */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Credentials & Expertise</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Master's Degree in Social Work</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Licensed Clinical Social Worker</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Trauma-Informed Care Specialist</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Addiction Recovery Expert</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <BookingWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
