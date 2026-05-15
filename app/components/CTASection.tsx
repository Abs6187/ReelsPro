import Link from 'next/link'
import React from 'react'

const CTASection = () => {
  return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-reelspro-black/10 via-reelspro-black to-reelspro-black/10 opacity-100"></div>
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Share Your Vision?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join ReelsPro today and start creating videos that captivate your audience.
              No credit card required to get started.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/register" 
                className="hero-button"
              >
                Get Started For Free
              </Link>
              <Link 
                href="#pricing" 
                className="px-8 py-4 rounded-full border border-white/30 hover:border-white/60 transition-colors"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-8 text-gray-400 text-sm">
              Already a member? <Link href="/login" className="text-reelspro-blue hover:underline">Log in here</Link>
            </p>
          </div>
        </div>
      </section>
  )
}

export default CTASection
