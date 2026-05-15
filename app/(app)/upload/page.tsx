import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import VideoUploadForm from '@/app/components/VideoUploadForm';
import { uploadGuidelinesData } from '@/data/uploadGuidelinesData';


const VideoUploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-reelspro-black/90 via-reelspro-blue/40 to-reelspro-black/90 pt-20 px-4">
      <div className="w-full max-w-7xl mx-auto">

        <div className="relative mb-12 overflow-hidden">

          <div className="neo-blur rounded-xl p-8 md:p-12 relative z-10 ">
            <h1 className="section-title text-4xl md:text-5xl font-bold mb-3">Create & Upload</h1>
            <p className="text-gray-300 max-w-2xl">
              Share your creativity with the world. Upload videos and reach viewers across the globe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-8">
          {uploadGuidelinesData.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Icon className={item.title === "Size Limits" ? "text-reelspro-blue" : "text-green-400"} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload Form Card */}
        <Card className="neo-blur  overflow-hidden  bg-transparent">
          <CardContent className="p-8">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 rounded-full bg-reelspro-blue/20 flex items-center justify-center mr-4">
                <Upload className="text-reelspro-blue h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Upload Video</h2>
                <p className="text-gray-400">Fill out the details below to publish your video</p>
              </div>
            </div>
            <VideoUploadForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoUploadPage;