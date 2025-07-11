import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Turn Your Customers Into Your Sales Team?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of service businesses already using ReferralPay to grow through 
            word-of-mouth marketing. Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/signup" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="#contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-colors duration-200">
              Schedule Demo
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-1 text-primary-100">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="ml-2">Trusted by 500+ businesses</span>
          </div>
        </div>
      </div>
    </section>
  )
}
