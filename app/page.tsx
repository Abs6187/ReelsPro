'use client'

import React, { useEffect } from 'react';
import NavBar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import HeroSection from './components/HeroSection';
import PricingSection from './components/PricingSection';
import Contact from './components/Contact';
import About from './components/AboutSection';
import HowItWorks from './components/HowItWorks';
import TestimonialsSection from './components/TestimonialsSection';
import StatsSection from './components/StatsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import FeaturesSection from './components/FeaturesSection';




const Index = () => {
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

    const revealElements = document.querySelectorAll('.reveal');
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
    <div className="bg-black text-white min-h-screen overflow-hidden">
      <ScrollProgress />
      <NavBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
        <HowItWorks />

      {/* About Section */}
      <About />
      
      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* FAQ Section */}
      <FAQSection />


      {/* CTA Section */}
      <CTASection />


      {/*Contact Section */}
      <Contact />
              
    </div>
  );
};

export default Index;