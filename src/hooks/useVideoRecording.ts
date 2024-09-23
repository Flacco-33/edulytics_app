import { useState, useRef, useEffect, useCallback } from "react";
import { useMediaPermissions } from "@/hooks/useMediaPermissions ";
import WebCam from "react-webcam";

export const useVideoRecording = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const webcamRef = useRef<WebCam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturing, setCapturing] = useState(false);
  const videoMediaRecorder = useRef<MediaRecorder | null>(null);
  const [recorderChunks, setRecorderChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }, []);

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecorderChunks((prevChunks) => [...prevChunks, event.data]);
    }
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    
    setRecorderChunks([]);
    if (webcamRef.current?.stream) {
      setCapturing(true);
      videoMediaRecorder.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      videoMediaRecorder.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      videoMediaRecorder.current.start();
    }
  }, [handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    videoMediaRecorder.current?.stop();
    setCapturing(false);
  }, []);

  const handleDeleteVideo = useCallback(() => {
    setRecorderChunks([]);
    setVideoUrl(null);
  }, []);

  return {
    capturing,
    webcamRef,
    recorderChunks,
    videoUrl,
    facingMode,
    setVideoUrl,
    toggleFacingMode,
    handleStartCaptureClick,
    handleStopCaptureClick,
    handleDeleteVideo,
  };
};
