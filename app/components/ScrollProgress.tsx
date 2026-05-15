'use client'

import React, { useState, useEffect } from 'react';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = Math.round((scrollTop / scrollHeight) * 100);
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', updateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/50">
        <div 
          className="h-full bg-gradient-to-r from-reelspro-blue via-reelspro-purple to-reelspro-pink"
          style={{ width: `${scrollProgress}%`, transition: 'width 0.2s ease-out' }}
        ></div>
      </div>
      
      <div 
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative h-12 w-12 bg-black/80 backdrop-blur-md rounded-full  shadow-lg hover:border-reelspro-blue/50 cursor-pointer transition-all duration-300"
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-7 w-7 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
          </div>
          
          <svg className="absolute -top-1 -right-1 -left-1 -bottom-1" width="60" height="60">
            <circle 
              cx="30" 
              cy="30" 
              r="28" 
              stroke="url(#progress-gradient)" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray={`${scrollProgress * 1.76} 1000`}
              transform="rotate(-90, 30, 30)"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CC9F0" />
                <stop offset="50%" stopColor="#7209B7" />
                <stop offset="100%" stopColor="#F72585" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
};

export default ScrollProgress;
