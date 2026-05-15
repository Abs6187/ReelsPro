"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Upload, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { IVideo } from "@/models/Video";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [moderationResult, setModerationResult] = useState<IVideo | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: "",
      tags: [],

    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    setUploadStatus("success");
    console.log("Upload success:", response);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setUploadStatus("uploading");
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      console.error("Video URL is required");
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.createVideo(data);
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setValue("category", "");
      setValue("tags", []);
      setUploadProgress(0);
      setUploadStatus("idle");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setModerationResult(result as any);
    } catch (error) {
      console.error("Error creating video:", error);
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (moderationResult) {
    const status = moderationResult.moderation?.status || "pending";
    return (
      <Card className="border border-white/20 bg-black/40">
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          {status === "approved" ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : status === "flagged" ? (
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          ) : status === "rejected" ? (
            <AlertTriangle className="h-16 w-16 text-red-500" />
          ) : (
            <CheckCircle2 className="h-16 w-16 text-blue-500" />
          )}
          <h2 className="text-2xl font-bold text-white">Video Published!</h2>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 w-full max-w-sm mt-4">
            <p className="text-gray-300 text-sm mb-2">Moderation Status:</p>
            <p className={`text-lg font-semibold capitalize ${
              status === "approved" ? "text-green-400" :
              status === "flagged" ? "text-yellow-400" :
              status === "rejected" ? "text-red-400" : "text-white"
            }`}>
              {status === "flagged" ? "Flagged for Review" : status}
            </p>
            {moderationResult.moderation?.blurredUrl && (
              <p className="text-sm text-blue-400 mt-2">Explicit content was blurred automatically.</p>
            )}
          </div>
          <Button 
            className="mt-6 bg-reelspro-blue hover:bg-reelspro-blue/90 text-white" 
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white mt-2"
            onClick={() => setModerationResult(null)}
          >
            Upload Another Video
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white mb-2 block">Title</Label>
            <Input
              id="title"
              className="bg-black/60 border-white/10 focus:border-reelspro-blue text-white"
              placeholder="Enter your video title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white mb-2 block">Description</Label>
            <Textarea
              id="description"
              className="w-full rounded-md bg-black/60 border-white/10 focus:border-reelspro-blue text-white p-3 min-h-32"
              placeholder="Describe your video"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-white mb-2 block">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full bg-black/60 border-white/10 text-white p-3 rounded-md focus:border-reelspro-blue">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 text-white">
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="vlogs">Vlogs</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="tags" className="text-white mb-2 block">Tags</Label>
              <Input
                id="tags"
                className="bg-black/60 border-white/10 focus:border-reelspro-blue text-white"
                placeholder="Separate with commas"
                {...register("tags")}
              />
            </div>
          </div>
        </div>

        {/* File Upload UI */}
        <div>
          <Label className="text-white mb-2 block">Upload Video</Label>
          <Card className="border border-dashed border-white/20 bg-black/30 hover:bg-black/40 transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-64">
              {uploadStatus === "idle" && (
                <>
                  <Upload className="h-10 w-10 text-reelspro-blue animate-pulse mb-4" />
                  <FileUpload
                    fileType="video"
                    onSuccess={handleUploadSuccess}
                    onProgress={handleUploadProgress}
                    ref={fileInputRef}
                  />
                  <p className="text-gray-500 text-xs mt-4">Supported: MP4, WebM, MOV</p>
                </>
              )}

              {uploadStatus === "uploading" && (
                <>
                  <Loader2 className="h-10 w-10 text-reelspro-blue animate-spin mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">Uploading video...</h3>
                  <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-gradient-to-r from-reelspro-blue to-reelspro-purple h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{uploadProgress}% complete</p>
                </>
              )}

              {uploadStatus === "success" && (
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Complete!</h3>
                  <p className="text-gray-400">Your video is ready to publish.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Button type="submit" className="bg-reelspro-blue text-white w-[180px]">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing Video...
            </>
          ) : (
            "Publish Video"
          )}
        </Button>
      </div>
    </form>
  );
}
