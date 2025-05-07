"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";


interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for file input
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    console.log(response);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    console.log(data);
    if (!data.videoUrl) {
      console.error("Video URL is required");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);


      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      router.push("/dashboard");

      // Clear file input using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input value
      }
    } catch (error) {
      console.error("Error creating video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
      <div className="form-control">
        <label className="label text-white">Title</label>
        <input
          type="text"
          className={`input input-bordered border-4 bg-black text-white ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1">{errors.title.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label text-white">Description</label>
        <textarea
          className={`textarea textarea-bordered border-4 bg-black text-white h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">{errors.description.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label text-white">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
          ref={fileInputRef} // Pass ref to FileUpload component
        />
        {uploadProgress > 0 && (
          <div>
            <div
              className="bg-white mt-4 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="text-white">{uploadProgress}%</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mx-auto">
        <button type="submit" className="btn bg-blue-700 w-[140px] text-white">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing Video...
            </>
          ) : (
            "Publish Video"
          )}
        </button>
      </div>
    </form>
  );
}

