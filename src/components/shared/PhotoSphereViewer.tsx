"use client";
import React, { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";

interface PhotoSphereViewerProps {
  src: string;
  width?: string;
  height?: string;
  className?: string;
}

const PhotoSphereViewer: React.FC<PhotoSphereViewerProps> = ({
  src,
  width = "100%",
  height = "400px",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing viewer
    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    // Create new viewer
    viewerRef.current = new Viewer({
      container: containerRef.current,
      panorama: src,
      navbar: ["autorotate", "zoom", "move", "fullscreen"],
      loadingImg: "/images/360.jpg",
      touchmoveTwoFingers: true,
      mousewheelCtrlKey: true,
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={`rounded-2xl overflow-hidden ${className}`}
    />
  );
};

export default PhotoSphereViewer;
