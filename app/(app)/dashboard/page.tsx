"use client"
import { SectionHeading } from '@/app/components/SectionHeading';
import VideoRenderCard from '@/app/components/VideoRenderCard';
import { apiClient } from '@/lib/api-client';
import { IVideo } from '@/models/Video';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'

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
    <div className='max-w-7xl mx-auto pt-20 px-4 '>
      <div className='flex flex-col gap-4 items-center justify-center'>
      <SectionHeading heading="All Videos" />
      <p className='text-white text-2xl hidden max-w-2xl md:block'>Discover new content, explore diverse genres, and enjoy a community-driven platform for sharing and viewing videos.</p>
      </div>
      {
        loading ? (
          <div className='mt-12'>
            <BarLoader width={"100%"} color="#36d7b7" />

          </div>
        ) : (
            <>
              {
                videos.length === 0 ?(
                  <div className='flex flex-col gap-4 items-center mt-12 justify-center'>
                    <p className='text-white text-3xl'>No videos found</p>
                  </div>
                  
                ) :(
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 gap-4'>
                    {videos.map((video) => (
                        <VideoRenderCard video={video} key={video._id?.toString()} />
                    ))}
                  </div>
                )
              }
            </>
        )
      }
    </div>
  )
}

export default DashboardPage
