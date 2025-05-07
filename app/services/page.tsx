import React from 'react';
import { Upload, Shield, Users, BarChart, Video, Zap } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: <Upload className="w-12 h-12 text-blue-700" />,
      title: "Video Hosting",
      description: "High-quality video hosting with unlimited storage and fast delivery worldwide."
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-700" />,
      title: "Content Protection",
      description: "Advanced security features to protect your content and intellectual property."
    },
    {
      icon: <Users className="w-12 h-12 text-blue-700" />,
      title: "Community Features",
      description: "Build and engage with your audience through comments, likes, and shares."
    },
    {
      icon: <BarChart className="w-12 h-12 text-blue-700" />,
      title: "Analytics",
      description: "Detailed insights and analytics to track your content's performance."
    },
    {
      icon: <Video className="w-12 h-12 text-blue-700" />,
      title: "Content Management",
      description: "Easy-to-use tools for organizing and managing your video content."
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-700" />,
      title: "Fast Processing",
      description: "Quick video processing and optimization for all devices."
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
        
        <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          ReelsPro offers a comprehensive suite of video hosting and management services 
          designed to help creators succeed in their digital journey.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors duration-300">
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-900 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose ReelsPro?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">For Content Creators</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Professional video hosting</li>
                <li>Advanced analytics and insights</li>
                <li>Customizable video players</li>
                <li>Monetization options</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">For Businesses</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Enterprise-grade security</li>
                <li>Team collaboration tools</li>
                <li>API access</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 
