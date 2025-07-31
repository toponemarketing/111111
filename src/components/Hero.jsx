import React from 'react'
import { ArrowRight, User, Heart } from 'lucide-react'
import BookingWidget from './BookingWidget'

const Hero = () => {
  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-primary-50 via-lavender-50 to-warm-50">
      <div className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Where Healing Begins and{' '}
                  <span className="text-primary-600">Limitations End</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Real help. Real healing. Real hope. Welcome to Boundless with Kim — a place where transformation isn't just possible — it's already begun.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Boundless with Kim is more than a service — it's a mission. Founded by Kim, a licensed social worker and life coach who overcame addiction, trauma, and life on the streets, this is a safe, judgment-free space for individuals seeking breakthrough. Whether you're battling addiction, anxiety, trauma, or cycles that seem unbreakable, Kim is here to walk with you toward freedom — because she's been there too.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <BookingWidget className="flex-1" />
                <a href="#about" className="btn-secondary text-lg">
                  <User className="h-5 w-5" />
                  Learn More About Kim
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-200 to-lavender-200 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center">
                    <Heart className="h-16 w-16 text-primary-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    "Healing is possible. And together, we can get there."
                  </p>
                  <p className="text-primary-600 font-semibold">- Kim</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-warm-400 rounded-full p-4 shadow-lg">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-lavender-400 rounded-full p-6 shadow-lg">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
