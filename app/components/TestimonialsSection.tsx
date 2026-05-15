import React from 'react'
import TestimonialSlider from './TestimonialSlider'

const TestimonialsSection = () => {
  return (
<section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title pb-4">What Creators Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied content creators already using ReelsPro
            </p>
          </div>

          <TestimonialSlider />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-reelspro-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-reelspro-purple opacity-5 rounded-full blur-3xl"></div>
      </section>
  )
}

export default TestimonialsSection
