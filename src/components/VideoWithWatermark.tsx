"use client";

import React, { useRef, useEffect, useState } from "react";

interface VideoWithWatermarkProps {
  videoUrl: string;
  watermarkText?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const VideoWithWatermark: React.FC<VideoWithWatermarkProps> = ({
  videoUrl,
  watermarkText = "reelzila",
  onContextMenu,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video
    const handleVideoLoaded = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      setIsDrawing(true);
    };

    video.addEventListener("loadedmetadata", handleVideoLoaded);

    // Animation loop to draw watermark
    let animationId: number;

    const drawWatermark = () => {
      if (!isDrawing || !video.paused) {
        // Draw the current video frame
        ctx.drawImage(video, 0, 0);

        // Draw watermark
        const fontSize = Math.min(canvas.width, canvas.height) / 8;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = "rgba(212, 255, 79, 0.25)"; // Semi-transparent reelzila color
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw text with shadow for better visibility
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(
          watermarkText,
          canvas.width / 2,
          canvas.height / 2
        );

        // Reset shadow
        ctx.shadowColor = "transparent";
      }

      animationId = requestAnimationFrame(drawWatermark);
    };

    const handlePlay = () => {
      setIsDrawing(true);
      drawWatermark();
    };

    const handlePause = () => {
      setIsDrawing(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleVideoLoaded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      cancelAnimationFrame(animationId);
    };
  }, [watermarkText]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-lg overflow-hidden"
      onContextMenu={onContextMenu}
    >
      {/* Hidden video element for source */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
      />

      {/* Canvas for watermarked display */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Prevent right-click */}
      <div
        className="absolute inset-0 pointer-events-auto"
        onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragStart={e => {
          e.preventDefault();
          return false;
        }}
      />
    </div>
  );
};
