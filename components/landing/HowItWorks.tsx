import { ArrowRight, UserPlus, Briefcase, DollarSign } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Customer Gets Referral Link',
    description: 'Each customer receives a unique referral link or QR code to share with friends and family.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Briefcase,
    title: 'Referred Client Books Job',
    description: 'New customers book and complete jobs through your Jobber system using the referral link.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: DollarSign,
    title: 'Automatic Cash Reward',
    description: 'Once the job is completed and paid, the referrer automatically receives their cash reward.',
    color: 'bg-purple-100 text-purple-600',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How ReferralPay Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, automated, and effective. Set up your referral program in minutes 
            and start rewarding customers for bringing you new business.
          </p>
        </div>

        <div className="relative">
          {/* Desktop flow */}
          <div className="hidden lg:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center text-center max-w-xs">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color} mb-4`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-8 w-8 text-gray-400 mx-8" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile flow */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.color} flex-shrink-0`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to boost your referrals?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of service businesses already using ReferralPay to grow through word-of-mouth marketing.
            </p>
            <button className="btn-primary">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
