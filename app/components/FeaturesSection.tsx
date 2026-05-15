
import React, { useEffect } from 'react';
import { features } from '@/data/features';
import Image from 'next/image';

const FeaturesSection = () => {
  useEffect(() => {

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.bento-item');
    revealElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      revealElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="py-20 relative" id='features'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-reelspro-blue to-reelspro-purple bg-clip-text text-transparent">Powerful Features</h2>
          <p className="text-xl text-gray-300">
            Everything you need to create, share, and grow with your videos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {

            let colSpan = "col-span-1";
            let rowSpan = "row-span-1";
            
            if (feature.size === "large") {
              colSpan = "col-span-1 md:col-span-2";
              rowSpan = "row-span-2";
            } else if (feature.size === "medium") {
              colSpan = "col-span-1 md:col-span-1";
              rowSpan = "row-span-1 md:row-span-2";
            }

            return (
              <div 
                key={feature.id}
                className={`bento-item ${colSpan} ${rowSpan} rounded-xl overflow-hidden reveal transition-transform duration-500 ease-in-out hover:scale-[1.02] hover:shadow-xl shadow-lg`}
                style={{ transitionDelay: `${parseInt(feature.delay)}ms` }}
              >
                <div className="relative h-full group cursor-pointer">

                  <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-b ${feature.backgroundColor} opacity-80`}></div>
                    <Image
                      width={500}
                      height={500} 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>


                  <div className="relative z-10 p-6 h-full flex flex-col">

                    <div className="mb-4">
                      <span className="bg-reelspro-blue/20 backdrop-blur-sm text-reelspro-blue text-xs font-bold rounded-full px-3 py-1">
                        {feature.highlight}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-reelspro-blue to-reelspro-purple rounded-full blur-lg opacity-70 group-hover:opacity-100 animate-pulse"></div>
                        <div className="relative bg-black/70 backdrop-blur-sm rounded-full p-4 border border-reelspro-blue/30">
                          <feature.icon className="h-6 w-6 text-reelspro-blue" />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    

                    {feature.size !== "small" && <div className="flex-grow"></div>}
                    

                    <div className="mt-4 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <svg className="w-6 h-6 text-reelspro-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-1/4 left-0 w-64 h-64 bg-reelspro-blue opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-reelspro-purple opacity-10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default FeaturesSection;