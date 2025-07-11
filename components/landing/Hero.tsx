import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, DollarSign, Users, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4 mr-2" />
                Powered by Jobber Integration
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Reward Customers with 
                <span className="text-primary-600"> Real Cash</span> for Referrals
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Turn your satisfied customers into your best sales team. ReferralPay integrates with Jobber to automatically reward customers with cash when their referrals complete and pay for jobs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup" className="btn-primary inline-flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#how-it-works" className="btn-secondary inline-flex items-center justify-center">
                See How It Works
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">5%</div>
                <div className="text-sm text-gray-600">Average Commission</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">3x</div>
                <div className="text-sm text-gray-600">More Referrals</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-600">Payout Time</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="Happy customer receiving cash reward"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-success-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
