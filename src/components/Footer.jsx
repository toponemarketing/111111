import React, { useState } from 'react'
import { Mail, Phone, MapPin, Heart } from 'lucide-react'

const Footer = () => {
  const [logoError, setLogoError] = useState(false)

  return (
    <footer className="bg-gray-900 text-white">
      <div className="section-padding">
        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                {!logoError ? (
                  <img 
                    src="https://global-files-nginx.builderall.com/76b44d28-a620-4e75-bf81-c0f7cb857979/a292a2755ab2cc8baa0b641ea87ce7d2a7984441d8bb18d697b8a4379a7153d9.png"
                    alt="Boundless with Kim Logo"
                    className="h-10 w-auto brightness-0 invert"
                    onError={() => setLogoError(true)}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="h-8 w-8 text-primary-400" />
                    <span className="text-2xl font-bold">
                      Boundless <span className="text-primary-400">with Kim</span>
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                A safe, judgment-free space for healing and transformation. Where your journey from brokenness to boundless begins.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:support@boundlesswithkim.com" className="hover:text-primary-400">
                    support@boundlesswithkim.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>Online sessions available nationwide</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#services" className="hover:text-primary-400">Life Coaching</a></li>
                <li><a href="#services" className="hover:text-primary-400">Online Therapy</a></li>
                <li><a href="#services" className="hover:text-primary-400">Recovery Support</a></li>
                <li><a href="#contact" className="hover:text-primary-400">Free Consultation</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#about" className="hover:text-primary-400">About Kim</a></li>
                <li><a href="#testimonials" className="hover:text-primary-400">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-primary-400">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Boundless with Kim. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-primary-400">Privacy Policy</a>
                <a href="#" className="hover:text-primary-400">Terms of Service</a>
                <a href="#" className="hover:text-primary-400">Disclaimer</a>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Licensed Social Worker | Trauma-Informed Care | Hope • Healing • Transformation
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
