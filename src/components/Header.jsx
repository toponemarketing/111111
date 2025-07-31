import React, { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About Kim', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container-max">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {!logoError ? (
              <img 
                src="https://global-files-nginx.builderall.com/76b44d28-a620-4e75-bf81-c0f7cb857979/a292a2755ab2cc8baa0b641ea87ce7d2a7984441d8bb18d697b8a4379a7153d9.png"
                alt="Boundless with Kim Logo"
                className="h-12 w-auto"
                onError={() => setLogoError(true)}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900">
                  Boundless <span className="text-primary-600">with Kim</span>
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            <a href="#contact" className="btn-primary">
              Book Session
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                className="block px-3 py-2 text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Session
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
