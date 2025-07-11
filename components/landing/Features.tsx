import { 
  DollarSign, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Smartphone,
  CreditCard,
  Link as LinkIcon
} from 'lucide-react'

const features = [
  {
    icon: DollarSign,
    title: 'Real Cash Rewards',
    description: 'Pay customers actual money, not credits or discounts. Direct bank transfers via Stripe Connect.',
  },
  {
    icon: Users,
    title: 'Automatic Tracking',
    description: 'Seamlessly track referrals from signup to job completion through Jobber integration.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Monitor referral performance, conversion rates, and ROI with detailed dashboards.',
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Automated payouts within 24 hours of job completion and payment verification.',
  },
  {
    icon: Shield,
    title: 'Fraud Protection',
    description: 'Built-in safeguards to prevent abuse and ensure legitimate referrals only.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Optimized for mobile sharing and tracking. Easy-to-use referral links and QR codes.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Commission',
    description: 'Set custom commission rates and minimum job values. Full control over your program.',
  },
  {
    icon: LinkIcon,
    title: 'Easy Sharing',
    description: 'Unique referral links, QR codes, and social sharing tools for maximum reach.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Successful Referrals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform handles every aspect of your referral program, 
            from tracking to payouts, so you can focus on growing your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
