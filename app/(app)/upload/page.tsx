"use client";

import { SectionHeading } from "@/app/components/SectionHeading";
import VideoUploadForm from "@/app/components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 ">
      <div className="mt-0">

        <SectionHeading heading="Upload Video"  />
      </div>
        <VideoUploadForm />
    </div>
  );
}