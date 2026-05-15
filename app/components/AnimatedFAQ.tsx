'use client'
import React, { useEffect, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from '@/data/faqData';

const AnimatedFAQ = () => {
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      faqItems.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <div ref={faqRef} className="max-w-3xl mx-auto">
      <Accordion type="multiple" className="space-y-4">
        {faqData.map((faq, idx) => (
          <AccordionItem 
            key={idx} 
            value={`item-${idx}`}
            className="faq-item reveal glass-card overflow-hidden border-none"
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline group">
              <span className="group-hover:text-reelspro-blue transition-colors">
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-300">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AnimatedFAQ;