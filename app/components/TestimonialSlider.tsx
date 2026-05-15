'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/testimonialsData';
import Image from 'next/image';

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
        />
      ));
  };

  return (
    <div 
      className="relative overflow-hidden py-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-0 left-0 w-96 h-80 bg-reelspro-blue opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bpttom-0 right-0 w-96 h-80 bg-reelspro-purple opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-6 relative">
        
        <div 
          ref={testimonialContainerRef}
          className="overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="min-w-full p-4"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-reelspro-blue to-reelspro-purple rounded-full blur-md opacity-70"></div>
                      <Image
                        width={80}
                        height={80} 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-20 h-20 rounded-full border-4 border-white/20 object-cover relative z-10"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-lg md:text-xl italic mb-4 text-gray-200">&quot;{testimonial.content}&quot;</p>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-reelspro-blue">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full  transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full  transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'w-6 bg-reelspro-blue' : 'bg-white/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;