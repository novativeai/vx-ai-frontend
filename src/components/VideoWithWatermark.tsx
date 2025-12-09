"use client";

import React from "react";

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
  return (
    <div
      className="relative w-full bg-black rounded-lg overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
    >
      {/* Video Player - natural aspect ratio */}
      <video
        src={videoUrl}
        className="w-full h-auto"
        autoPlay
        loop
        muted
        playsInline
        controls
        controlsList="nodownload"
      />

      {/* Watermark Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[#D4FF4F]/25 font-bold tracking-wider"
          style={{
            fontSize: "clamp(24px, 8vw, 64px)",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          {watermarkText}
        </span>
      </div>

      {/* Prevent drag/download overlay (allows video controls through) */}
      <div
        className="absolute inset-0 pointer-events-none"
        onDragStart={(e) => {
          e.preventDefault();
          return false;
        }}
      />
    </div>
  );
};
