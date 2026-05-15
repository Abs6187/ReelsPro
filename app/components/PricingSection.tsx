import { pricingPlans } from '@/data/pricingData'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import PricingCard from './PricingCard'

const PricingSection = () => {
  return (
    <section className="py-20 relative" id='pricing'>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal">
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">
              Select the perfect plan for your video creation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className="reveal"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 reveal" style={{ transitionDelay: '600ms' }}>
            <p className="text-gray-400 mb-6">All plans include 14-day free trial. No credit card required.</p>
            <Link href="/pricing" className="text-reelspro-blue hover:underline flex items-center justify-center">
              Compare all features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-reelspro-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-reelspro-blue/20 rounded-full blur-3xl"></div>
      </section>
  )
}

export default PricingSection