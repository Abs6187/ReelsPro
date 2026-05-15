import React from 'react';
import { Check, LucideIcon } from 'lucide-react';
import Link from 'next/link';


interface PricingCardProps {
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: LucideIcon;
  gradient: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  billing,
  description,
  features,
  cta,
  popular = false,
  icon: Icon,
  gradient
}) => {
  return (
    <div className={`relative flex flex-col h-full ${popular ? 'transform md:scale-105 z-10' : ''}`}>
      {popular && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <span className="bg-reelspro-purple text-white text-sm font-bold py-1 px-4 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      
      <div className={`h-full rounded-xl overflow-hidden bg-black border ${popular ? 'border-reelspro-blue' : 'border-gray-800'} hover:border-reelspro-blue transition-all duration-300  hover:shadow-reelspro-blue flex flex-col 
        ${popular ? 'shadow-reelspro-blue shadow-2xl' : 'shadow-reelspro-purple'}`}>
        <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">{name}</h3>
            <div className="bg-white/20 rounded-full p-2">
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-end mb-2">
            <span className="text-4xl font-bold">${price}</span>
            <span className="ml-2 text-white/80">{billing}</span>
          </div>
          <p className="text-sm text-white/80">{description}</p>
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <ul className="space-y-3 mb-6 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="mr-2 mt-1 text-reelspro-blue">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link 
            href={popular ? "/register" : 
                price === 0 ? "/register" : "#contact"
            }
            className={`w-full py-3 rounded-lg text-center font-medium transition-all duration-300 ${
              popular 
                ? 'bg-gradient-to-r from-reelspro-blue to-reelspro-purple text-white hover:shadow-lg hover:shadow-reelspro-blue/30' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;