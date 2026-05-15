import React from 'react'

const StatsSection = () => {
  return (
     <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
            {[
              { number: "10M+", label: "Users" },
              { number: "500K+", label: "Daily Views" },
              { number: "200TB", label: "Videos Hosted" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-2">
                  <div className="absolute inset-0 scale-75 bg-gradient-to-r from-reelspro-blue/20 to-reelspro-purple/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative text-4xl md:text-5xl font-bold gradient-text">{stat.number}</div>
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Animated stripes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                top: `${20 * (i + 1)}%`,
                opacity: 0.5,
                animation: `moveLeftToRight ${8 + i * 2}s linear infinite`,
              }}
            ></div>
          ))}
        </div>
      </section>
  )
}

export default StatsSection
