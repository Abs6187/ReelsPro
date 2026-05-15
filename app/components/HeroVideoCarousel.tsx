import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export interface VideoThumbnail {
  thumbnail: string;
  profilePic: string;
  creator: string;
  followers: string;
  videoUrl: string;
}

export interface HeroVideoCarouselProps {
  videoThumbnails: VideoThumbnail[];
  openVideoModal: (videoUrl: string) => void;
}

const HeroVideoCarousel = ({ videoThumbnails, openVideoModal }: HeroVideoCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredIndex !== null) return; 

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % videoThumbnails.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hoveredIndex, videoThumbnails.length]);

  const getTransformStyle = (index: number) => {
    const position = (index - activeIndex + videoThumbnails.length) % videoThumbnails.length;

    const positions = [
      { translate: '-120px', rotate: '-20deg', scale: 0.8, z: 1 },
      { translate: '-60px', rotate: '-10deg', scale: 0.9, z: 2 },
      { translate: '0px', rotate: '0deg', scale: 1.05, z: 5 },
      { translate: '60px', rotate: '10deg', scale: 0.9, z: 2 },
      { translate: '120px', rotate: '20deg', scale: 0.8, z: 1 },
    ];

    const { translate, rotate, scale, z } = positions[position];

    return {
      transform: `translateX(${translate}) rotate(${rotate}) scale(${scale})`,
      zIndex: hoveredIndex === index ? 10 : z,
    };
  };

  return (
    <div className="relative w-[300px] h-[500px] mx-auto">
      {videoThumbnails.map((video, index) => {
        const style = getTransformStyle(index);

        return (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden border-4 border-white/10 transition-transform duration-500 ease-in-out group cursor-pointer`}
            style={{
                ...style,
                boxShadow: hoveredIndex === index
                  ? '0 15px 35px rgba(72, 201, 248, 0.8), 0 10px 30px rgba(72, 255, 241, 0.6), 0 10px 20px rgba(114, 9, 183, 0.4)'  // Blue dominant shadow on hover
                  : '0 4px 12px rgba(72, 201, 248, 0.5), 0 6px 14px rgba(72, 255, 241, 0.4), 0 8px 20px rgba(114, 9, 183, 0.3), 0 6px 16px rgba(100, 255, 218, 0.2)'  // Blue dominant shadow for non-hovered state
              }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => openVideoModal(video.videoUrl)}
          >
            <Image height={500} width={300} src={video.thumbnail} alt={video.creator} className="w-full h-full object-cover"  />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center">
              <Image height={40} width={40} src={video.profilePic} alt={video.creator} className="w-10 h-10 rounded-full border-2 border-white" unoptimized />
              <div className="ml-2">
                <p className="text-white font-medium">{video.creator}</p>
                <p className="text-xs text-gray-300">{video.followers}</p>
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-blue-600/80 rounded-full p-2 backdrop-blur hover:scale-110 transition">
              <Play className="h-5 w-5 text-white" fill="white" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroVideoCarousel;
