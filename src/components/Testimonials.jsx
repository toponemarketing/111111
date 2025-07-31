import React from 'react'
import { Quote, Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Kim didn't just listen — she understood. Her honesty and strength gave me the courage to believe in myself again.",
      author: "J.R.",
      service: "Coaching Client",
      rating: 5
    },
    {
      quote: "Working with Kim helped me take back my life. I've never felt more supported or seen.",
      author: "D.S.",
      service: "Recovery Client",
      rating: 5
    },
    {
      quote: "Kim's lived experience combined with her professional training creates a unique healing environment. She truly gets it.",
      author: "M.L.",
      service: "Therapy Client",
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="section-padding bg-primary-50">
      <div className="container-max">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            What Others Are Saying
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from real people who found their path to healing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warm-500 fill-current" />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="h-8 w-8 text-primary-200 absolute -top-2 -left-2" />
                  <p className="text-lg text-gray-700 leading-relaxed pl-6">
                    {testimonial.quote}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-primary-600 text-sm">{testimonial.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6">
              Join the many who have found hope, healing, and transformation with Kim's support.
            </p>
            <a href="#contact" className="btn-primary">
              Begin Your Healing Journey
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
