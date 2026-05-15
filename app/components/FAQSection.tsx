import React from 'react'
import AnimatedFAQ from './AnimatedFAQ'

const FAQSection = () => {
  return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Get answers to common questions about ReelsPro
            </p>
          </div>

          <AnimatedFAQ />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 transform -translate-y-1/2 -left-40 w-80 h-80 bg-reelspro-purple opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 transform -translate-y-1/2 -right-40 w-80 h-80 bg-reelspro-blue opacity-10 rounded-full blur-3xl"></div>
      </section>
  )
}

export default FAQSection
