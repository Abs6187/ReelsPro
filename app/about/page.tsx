import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About ReelsPro</h1>
        
        <div className="space-y-6">
          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Story</h2>
            <p className="text-gray-300">
              ReelsPro was founded with a vision to create a platform where creators can freely express themselves through video content. 
              We believe in the power of visual storytelling and its ability to connect people across the globe.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Mission</h2>
            <p className="text-gray-300">
              Our mission is to provide a seamless, user-friendly platform for video content creators to share their stories, 
              connect with their audience, and grow their creative presence online.
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">What Sets Us Apart</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>High-quality video hosting</li>
              <li>Advanced content management tools</li>
              <li>Engaged community of creators</li>
              <li>Robust privacy controls</li>
              <li>24/7 customer support</li>
            </ul>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-300">We constantly strive to improve and innovate our platform.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-300">We foster a supportive and engaging community of creators.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-300">We maintain high standards in content and user experience.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Security</h3>
                <p className="text-gray-300">We prioritize the privacy and security of our users.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 