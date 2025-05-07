import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importing social media icons

const Footer = () => {
  return (
    <footer className="bg-inherit text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div>
          <h1 className="text-3xl  font-semibold tracking-tight ">Reels
                        <span className='text-blue-700'>Pro</span>
                    </h1>
            <p className="text-gray-400 text-lg">
              Your go-to platform for top-tier video content and seamless sharing experience.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl font-semibold hover:text-blue-700">Quick Links</h3>
            <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
            <a href="/services" className="text-gray-400 hover:text-white">Services</a>
            <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl font-semibold hover:text-blue-700">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>© 2025 Reels<span className='text-blue-700'>Pro</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
