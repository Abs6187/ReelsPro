'use client'

import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import Link from 'next/link';
import VideoBackground from './VideoBackground';
import VideoModal from './VideoModal';
import HeroVideoCarousel from './HeroVideoCarousel';
import { featuredVideos } from '@/data/featuredVideoData';




const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);

useEffect(() => {
  setIsVisible(true);

  const element = statsRef.current;  
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startCountAnimation();
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  if (element) {
    observer.observe(element);
  }

  return () => {
    if (element) {
      observer.disconnect();
    }
  };
}, []);

  const startCountAnimation = () => {
    const counters = document.querySelectorAll('.count-up');

    counters.forEach((counter) => {
      const target = +(counter.getAttribute('data-target') || '0');
      let count = 0;
      const increment = target / 50;

      const updateCount = () => {
        if (count < target) {
          count += increment;
          counter.textContent = Math.ceil(count).toLocaleString();
          setTimeout(updateCount, 30);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCount();
    });
  };

  const openVideoModal = (videoUrl : string) => {
    setModalVideoUrl(videoUrl);
  };

  const closeVideoModal = () => {
    setModalVideoUrl(null);
  };


  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <VideoBackground
        videoUrl="https://videos.pexels.com/video-files/19303815/19303815-hd_1920_1080_30fps.mp4"
        overlayClassName="bg-gradient-to-b from-reelspro-black via-black/60 to-black"
        poster='https://images.pexels.com/photos/19303815/pexels-photo-19303815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      />

      <div className="container mx-auto px-4 pt-10 z-10 py-20">
        <div className="grid md:grid-cols-2 gap-24 sm:gap-12 items-center">
          <div>
            <div className="mb-6 inline-block">
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full pl-2 pr-4 py-1">
                <span className="bg-reelspro-blue text-white text-xs font-bold rounded-full px-3 py-1 mr-2">NEW</span>
                <span className="text-sm text-white">Introducing 4K UHD video support</span>
              </div>
            </div>

            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <span className="gradient-text">Create & Share </span>
              <span className="block mt-2">Videos That Inspire</span>
            </h1>

            <p
              className={`text-xl text-gray-300 mb-8 max-w-lg transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Join millions of content creators who use ReelsPro to upload, enhance,
              and share stunning videos that capture the world&apos;s attention.
            </p>

            <div
              className={`flex flex-wrap gap-4 transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Link href="/register" className="hero-button flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/demo"
                className="flex items-center px-8 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                <Play className="mr-2 h-5 w-5 text-reelspro-blue" />
                Watch Demo
              </Link>
            </div>

            <div
              ref={statsRef}
              className={`mt-12 grid grid-cols-3 gap-4 max-w-md transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-reelspro-blue mb-1 count-up" data-target="10">0</div>
                <div className="text-sm text-gray-400">Million Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-reelspro-purple mb-1 count-up" data-target="500">0</div>
                <div className="text-sm text-gray-400">K Daily Views</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-reelspro-cyan mb-1">4.9</span>
                  <Star className="h-5 w-5 text-yellow-400 ml-1 mb-1" fill="#FBBF24" />
                </div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
            </div>
          </div>

 
          <div
            className={`relative transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >

            <div className="relative w-full h-[400px] flex items-center justify-center">
              <HeroVideoCarousel videoThumbnails={featuredVideos} openVideoModal={openVideoModal} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>

      {modalVideoUrl && (
        <VideoModal videoUrl={modalVideoUrl} onClose={closeVideoModal} />
      )}
    </section>
  );
};

export default HeroSection;