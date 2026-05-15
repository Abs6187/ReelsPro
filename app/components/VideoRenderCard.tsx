import React, { useState } from 'react'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { IVideo } from '@/models/Video'
import { IKVideo } from "imagekitio-next";
import { Badge, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Music2,
  Gamepad2,
  Clapperboard,
  BookOpen,
  Video,
  Eye,
  EyeOff
} from 'lucide-react'

const getCategoryStyle = (category: string) => {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return {
        icon: <Clapperboard className="w-4 h-4" />,
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
      };
    case 'gaming':
      return {
        icon: <Gamepad2 className="w-4 h-4" />,
        bg: 'bg-purple-100',
        text: 'text-purple-800',
      };
    case 'music':
      return {
        icon: <Music2 className="w-4 h-4" />,
        bg: 'bg-pink-100',
        text: 'text-pink-800',
      };
    case 'vlogs':
      return {
        icon: <Video className="w-4 h-4" />,
        bg: 'bg-green-100',
        text: 'text-green-800',
      };
    case 'education':
      return {
        icon: <BookOpen className="w-4 h-4" />,
        bg: 'bg-blue-100',
        text: 'text-blue-800',
      };
    default:
      return {
        icon: null,
        bg: 'bg-gray-100',
        text: 'text-gray-800',
      };
  }
};

const VideoRenderCard = ({ video }: { video: IVideo }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBlurred, setShowBlurred] = useState(!!video.moderation?.blurredUrl);

  return (
    <Card className='neo-blur overflow-hidden bg-transparent'>
      <CardContent className="p-0">
        <div
          className="relative mx-auto w-full rounded-xl overflow-hidden border border-white/20"
          style={{ aspectRatio: "9/16" }}
        >

     
          <IKVideo
            path={showBlurred && video.moderation?.blurredUrl ? video.moderation.blurredUrl : video.videoUrl}
            transformation={[{ height: "1920", width: "1080" }]}
            controls={video.controls}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {video.moderation?.blurredUrl && (
            <button
              onClick={() => setShowBlurred(!showBlurred)}
              className="absolute top-16 right-4 z-20 bg-black/60 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
              title={showBlurred ? "Show Original" : "Show Blurred"}
            >
              {showBlurred ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {video.category && (
            <div
              className={`absolute top-4 left-4 z-10 px-2 py-1 text-sm rounded flex items-center gap-1 ${getCategoryStyle(video.category).bg} ${getCategoryStyle(video.category).text}`}
            >
              {getCategoryStyle(video.category).icon}
              {video.category.toUpperCase()}
            </div>
          )}
          {video.moderation?.status && (
            <Badge className={`absolute top-4 right-4 z-10 text-white capitalize ${
              video.moderation.status === 'approved' ? 'bg-green-500/80' :
              video.moderation.status === 'flagged' ? 'bg-yellow-500/80' :
              video.moderation.status === 'rejected' ? 'bg-red-500/80' : 'bg-gray-500/80'
            }`}>
              {video.moderation.status === 'flagged' ? 'Flagged' : video.moderation.status}
            </Badge>
          )}

          {!isPlaying && (
            <div className="absolute bottom-20 left-0 right-0">
              <div className=" px-4 py-3 transition-all duration-300">
   
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-white font-semibold capitalize line-clamp-2">
                    {video.title}
                  </h2>
                  <button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                    {isDrawerOpen ? (
                      <ChevronDown className="text-white" />
                    ) : (
                      <ChevronUp className="text-white" />
                    )}
                  </button>
                </div>


                {isDrawerOpen && (
                  <div className="mt-2 space-y-2  transition-all">
                    <p className="text-sm text-white">{video.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {video.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded bg-reelspro-blue/50 text-white capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoRenderCard;
