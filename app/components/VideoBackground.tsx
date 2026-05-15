'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  overlayClassName?: string;
  poster?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoUrl,
  overlayClassName = 'bg-black/30',
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener('canplaythrough', handleCanPlay);

    video.play().catch((err) => {
      console.warn('Autoplay failed:', err);
    });

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
      <div className={`absolute inset-0 z-10 ${overlayClassName}`} />

      <video
        ref={videoRef}
        className={`w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;
