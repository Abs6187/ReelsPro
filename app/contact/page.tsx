import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-blue-700">Get in Touch</h2>
              <p className="text-gray-300 mb-6">
                Have questions or need assistance? We're here to help! 
                Reach out to us using any of the following methods.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-blue-700" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-300">support@reelspro.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-blue-700" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-blue-700" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-300">
                    123 Creator Street<br />
                    Digital City, DC 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 
