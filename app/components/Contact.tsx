import React, { useState } from 'react';
import { Mail, Phone, MapPin, Users,  Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';


const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden" id='contact'>
      <div className="relative">        
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Contact Hero Section */}
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-reelspro-blue to-reelspro-purple bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="reveal" style={{ transitionDelay: '100ms' }}>
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex justify-center items-center bg-reelspro-blue/20 rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6 text-reelspro-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                      <p className="text-gray-300">support@reelspro.com</p>
                      <p className="text-gray-300">business@reelspro.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex justify-center items-center bg-reelspro-blue/20 rounded-full p-3 mr-4">
                      <Phone className="h-6 w-6 text-reelspro-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                      <p className="text-gray-300">Mon-Fri: 9AM - 5PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex justify-center items-center bg-reelspro-blue/20 rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6 text-reelspro-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Location</h3>
                      <p className="text-gray-300">123 Video Lane</p>
                      <p className="text-gray-300">Tech City, CA 90210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex justify-center items-center bg-reelspro-blue/20 rounded-full p-3 mr-4">
                      <Users className="h-6 w-6 text-reelspro-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Social Media</h3>
                      <div className="flex space-x-4 mt-2">
                        {['x', 'facebook', 'instagram', 'youtube'].map((social, index) => (
                          <a 
                            key={index} 
                            href={`https://${social}.com/reelspro`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-300"
                          >
                            <Image
                              width={24}
                              height={24}
                              src={`https://simpleicons.org/icons/${social}.svg`} 
                              alt={social} 
                              className="h-5 w-5 invert" 
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 gradient-text">FAQs</h2>
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold mb-1">How quickly will I receive a response?</h3>
                    <p className="text-gray-300">We typically respond to all inquiries within 24-48 business hours.</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold mb-1">What kind of support do you offer?</h3>
                    <p className="text-gray-300">We provide technical support, account assistance, and help with content guidelines or copyright questions.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Can I visit your office?</h3>
                    <p className="text-gray-300">We welcome visitors by appointment only. Please contact us to schedule a visit.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="reveal" style={{ transitionDelay: '300ms' }}>
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-reelspro-blue/50 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-reelspro-blue/50 focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-reelspro-blue/50 focus:border-transparent transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-reelspro-blue/50 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-reelspro-purple to-reelspro-blue py-3 rounded-md text-white font-semibold flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(76,201,240,0.6)] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26430.393553120906!2d-118.43209236271336!3d34.09771467415808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc35fbd217ef%3A0xcf1ef9352700d95c!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1652813333246!5m2!1sen!2sus" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ReelsPro Office Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;