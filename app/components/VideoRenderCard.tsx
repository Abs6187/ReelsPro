import React from 'react'
import {
    Card,
    CardContent,
  } from "@/components/ui/card"
import { IVideo } from '@/models/Video'
import { IKVideo } from "imagekitio-next";
  

const VideoRenderCard = ({video} : {video : IVideo}) => {

  return (
        <Card >
        <CardContent>
        <div  className="rounded-xl overflow-hidden relative mx-auto h-full w-full"
            style={{ aspectRatio: "9/16" }}>
        <IKVideo
            path={video.videoUrl}
            transformation={[{ height: "1920", width: "1080" }]}
            controls={video.controls}
            className='w-full h-full object-cover'
        />
        </div>
        <div>
        <h2 className='text-xl text-white capitalize'>{video.title}</h2>
        <p className='text-sm text-gray-200 text-muted-foreground'>{video.description}</p>
        </div>
        </CardContent>
        </Card>

  )
}

export default VideoRenderCard


