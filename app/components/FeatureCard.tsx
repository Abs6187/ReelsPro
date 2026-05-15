'use client'
import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  animation: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  delay 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`feature-card reveal`}
      style={{ transitionDelay: `${parseInt(delay) + 100}ms` }}
    >
      <div className="mb-6 relative">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-reelspro-blue to-reelspro-purple rounded-full blur-lg opacity-70 group-hover:opacity-100 animate-pulse-glow"></div>
            <div className="relative bg-black rounded-full p-4 border border-reelspro-blue/30">
              <Icon className="h-8 w-8 text-reelspro-blue" />
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-center mb-3">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  );
};

export default FeatureCard;
