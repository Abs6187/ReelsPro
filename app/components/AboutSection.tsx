import React from 'react';
import { ArrowRight,  Play } from 'lucide-react';
import VideoBackground from './VideoBackground';
import Link from 'next/link';
import Image from 'next/image';
import { teamData } from '@/data/teamData';


const About = () => {
  return (
    <div className="bg-black text-white min-h-screen overflow-hidden" id='about'>
      <div className="relative">
        <VideoBackground 
          videoUrl="https://videos.pexels.com/video-files/857136/857136-hd_1280_720_24fps.mp4"
          overlayClassName="bg-gradient-to-b from-reelspro-black/40 via-black/50 to-reelspro-black/50"
          poster='/hero-poster.jpg'
        />
        
        <div className="container mx-auto px-4 py-20 relative z-30">
          {/* About Hero Section */}
          <div className="text-center mb-16 reveal">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
                <Play className="h-8 w-8 text-reelspro-blue" fill="#4CC9F0" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-reelspro-blue to-reelspro-purple bg-clip-text text-transparent">
              About ReelsPro
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Creating the future of video sharing and community engagement
            </p>
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 reveal">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Founded in 2023, ReelsPro began with a simple mission: to create a platform where creators could share high-quality video content and build meaningful connections with their audience.
              </p>
              <p className="text-gray-300 mb-4">
                What started as a small project has grown into a thriving community of filmmakers, content creators, and video enthusiasts from around the world. Our platform now hosts thousands of videos across countless genres and topics.
              </p>
              <p className="text-gray-300">
                We believe in the power of visual storytelling to educate, entertain, and inspire. Every feature we build is designed to empower creators and enhance the viewing experience.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-5 -left-5 w-64 h-64 bg-reelspro-purple opacity-20 rounded-full blur-3xl"></div>
              <div className="aspect-video rounded-xl overflow-hidden relative border border-white/10">
                <Image
                  width={500}
                  height={500}
                  src="https://images.pexels.com/photos/1654691/pexels-photo-1654691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="ReelsPro team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 reveal">
            <div className="order-2 md:order-1 relative">
              <div className="absolute -bottom-5 -right-5 w-64 h-64 bg-reelspro-blue opacity-20 rounded-full blur-3xl"></div>
              <div className="aspect-video rounded-xl overflow-hidden relative border border-white/10">
                <Image
                  width={500}
                  height={500}
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h2>
              <p className="text-gray-300 mb-4">
                At ReelsPro, our mission is to democratize video sharing and empower creators of all backgrounds to share their stories with the world.
              </p>
              <p className="text-gray-300 mb-4">
                We&apos;re committed to providing a platform that values quality content, fosters authentic community engagement, and respects both creators and viewers.
              </p>
              <p className="text-gray-300">
                Our goal is to build the most intuitive, powerful, and creator-friendly video platform on the web, one that puts your work and your audience first.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-24 reveal">
            <h2 className="text-3xl font-bold mb-10 text-center gradient-text">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamData.map((member, index) => (
                <div key={index} className="bg-transparent backdrop-blur-sm rounded-xl p-6  group">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-reelspro-blue to-reelspro-purple rounded-full blur-md opacity-70 group-hover:opacity-100 scale-110 transition-all duration-300"></div>
                      <Image
                        width={500}
                        height={500}
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full border-2 border-white/20 object-cover relative z-10"
                        unoptimized
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-reelspro-blue text-sm mb-3">{member.role}</p>
                    <p className="text-gray-400 text-center">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center reveal">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Join Our Community</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Ready to be part of the ReelsPro story? Create an account today and start sharing your videos with our growing community.
            </p>
            <Link 
              href="/register" 
              className="hero-button inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;