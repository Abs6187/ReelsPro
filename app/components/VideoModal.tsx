'use client';

import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
        <video src={videoUrl} controls autoPlay className="w-full h-full object-contain"></video>
        <button onClick={onClose} className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 p-2 rounded-full">
          <X className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoModal;
