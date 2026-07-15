"use client"
import VideoRenderCard  from '@/app/components/VideoRenderCard';
import { apiClient } from '@/lib/api-client';
import { IVideo } from '@/models/Video';
import React, { useEffect, useState } from 'react'
import { Video, Upload, Loader, Film, } from "lucide-react";
import Link from 'next/link';
import ModerationFAB from '@/app/components/ModerationFAB';
const DashboardPage = () => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchVideos();
  }, []);
  return (
    <>
<div className="min-h-screen bg-gradient-to-br from-reelspro-black/90 via-reelspro-blue/40 to-reelspro-black/30 pt-20 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="relative mb-12 overflow-hidden">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-reelspro-blue/20 to-reelspro-purple/20 rounded-xl"></div> */}
          <div className="neo-blur rounded-xl p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h1 className="section-title text-4xl md:text-5xl font-bold mb-3">Video Library</h1>
                <p className="text-gray-300 max-w-2xl">
                  Discover new content, explore diverse genres, and enjoy a community-driven platform for sharing and viewing videos.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link href="/upload">
                  <button className="hero-button flex items-center gap-2">
                    <Upload size={18} />
                    <span>Upload Video</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 hidden md:grid">
          {[
            { title: "Total Videos", value: "0", icon: <Video className="text-reelspro-blue" /> },
            { title: "Total Views", value: "0", icon: <Play className="text-reelspro-purple" /> },
            { title: "Likes", value: "0", icon: <Heart className="text-reelspro-pink" /> },
            { title: "Uploads", value: "0", icon: <Upload className="text-reelspro-cyan" /> }
          ].map((stat, index) => (
            <Card key={index} className="border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden hover:bg-black/60 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Videos Section */}
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Film className="mr-2 text-reelspro-blue" size={24} />
            Recent Videos
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-pulse-glow">
                <Loader className="animate-spin h-12 w-12 text-reelspro-blue" />
              </div>
              <p className="text-gray-400 mt-4">Loading your videos...</p>
            </div>
          ) : (
            <>
              {videos.length === 0 ? (
                <div className="neo-blur rounded-xl p-12 text-center">
                  <div className="w-20 h-20 bg-reelspro-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="text-reelspro-blue h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 gradient-text">No videos found</h3>
                  <p className="text-gray-400 mb-6">You haven&apos;t uploaded any videos yet. Get started by uploading your first video.</p>
                  <Link href="/upload">
                    <button className="hero-button inline-flex items-center">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Your First Video
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoRenderCard video={video} key={video._id?.toString()} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    <ModerationFAB />
    </>
  )
}

export default DashboardPage
