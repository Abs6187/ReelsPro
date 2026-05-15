import { ArrowRight, Film, Share2, Upload } from 'lucide-react';
import React from 'react'

const HowItWorks = () => {
  return (
      <section className="py-20 bg-gradient-to-b from-black via-reelspro-black/20 to-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three simple steps to start sharing your amazing videos with the world
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Upload,
                title: "Upload Your Video",
                description: "Upload your content in just a few clicks. Support for all major formats up to 4K resolution."
              },
              {
                icon: Film,
                title: "Enhance & Edit",
                description: "Apply professional filters, trim clips, add music, and customize your video to perfection."
              },
              {
                icon: Share2,
                title: "Share & Grow",
                description: "Publish to your audience and leverage our algorithm to reach new viewers."
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex-1 reveal" style={{ transitionDelay: `${index * 200}ms` }}>
                  <div className="relative mb-6 mx-auto w-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-reelspro-blue to-reelspro-purple rounded-full blur-xl opacity-70"></div>
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-black rounded-full border border-reelspro-blue/30">
                      <Icon className="w-8 h-8 text-reelspro-blue" />
                    </div>
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-full hidden md:block">
                      {index < 2 && (
                        <div className="flex items-center w-12 md:w-24">
                          <div className="h-0.5 w-full bg-gradient-to-r from-reelspro-blue to-transparent"></div>
                          <ArrowRight className="w-4 h-4 text-reelspro-blue ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold mb-3">{step.title}</div>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
      </section>
  )
}

export default HowItWorks
