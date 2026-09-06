"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getImageUrl, getThumbnailUrl } from "@/lib/utils";

// Dynamically import heavy 3D viewer and LightboxModal to eliminate 1.5MB and CSS from main thread
const PhotoSphereViewer = dynamic(() => import("./PhotoSphereViewer"), {
  ssr: false,
});
const LightboxModal = dynamic(() => import("./LightboxModal"), {
  ssr: false,
});

interface PropertyImage {
  src?: string;
  url?: string;
  path?: string;
}

interface ImageCarouselProps {
  images: (string | PropertyImage)[];
  photoSphere?: string | null;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  photoSphere,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getImageSrc = (image: string | PropertyImage) => getImageUrl(image);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (lightboxOpen) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setLightboxIndex(currentIndex);
        setLightboxOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, lightboxOpen, images.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxSlides = images.map((image) => ({
    src: getImageSrc(image),
  }));

  if (!images || images.length === 0) {
    return (
      <div>
        {photoSphere ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-8 col-span-12">
              <div className="w-full h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Icon
                    icon="ph:image"
                    width={48}
                    height={48}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    No images available
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12">
              <div className="relative">
                {photoSphere && (
                  <PhotoSphereViewer
                    src="https://eqwshdwdmvfqbeuqknkn.supabase.co/storage/v1/object/public/property-images/properties/42vrk13aqma-1759564251566.jpg"
                    height="460px"
                    className="shadow-lg"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="ph:image"
                width={48}
                height={48}
                className="text-gray-400 mx-auto mb-2"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No images available
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Display only first 3 thumbnails to ensure high performance
  const visibleThumbnails = images.slice(0, 3);
  const remainingCount = images.length - 3;

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {/* Main Image Carousel */}
        <div
          className={`${
            photoSphere ? "lg:col-span-8" : "col-span-12"
          } col-span-12`}
        >
          <div className="relative group">
            {/* Main Image */}
            <div
              className="relative h-60 md:h-80 lg:h-[500px] cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => openLightbox(currentIndex)}
            >
              <Image
                src={getImageSrc(images[currentIndex])}
                alt={`Property Image ${currentIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                quality={75}
                className="object-cover"
              />

              {/* Fullscreen Icon */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon
                  icon="ph:arrows-out"
                  width={20}
                  height={20}
                  className="text-white"
                />
              </div>

              {/* View All Images Button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(currentIndex);
                  }}
                  className="absolute bottom-4 left-4 bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center gap-2 transition-all duration-200"
                >
                  <Icon icon="ph:images" width={16} height={16} />
                  View All ({images.length})
                </button>
              )}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Icon icon="ph:chevron-left" width={20} height={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Icon icon="ph:chevron-right" width={20} height={20} />
                </button>
              </>
            )}
          </div>

          {/* Limited 3-Thumbnail Navigation Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {visibleThumbnails.map((image, index) => {
                const isLastVisibleWithRemaining = index === 2 && remainingCount > 0;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isLastVisibleWithRemaining) {
                        openLightbox(2);
                      } else {
                        setCurrentIndex(index);
                      }
                    }}
                    className={`relative overflow-hidden rounded-xl w-24 h-20 transition-all duration-200 shrink-0 ${
                      index === currentIndex && !isLastVisibleWithRemaining
                        ? "ring-2 ring-primary"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={getThumbnailUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="96px"
                      quality={60}
                      className="object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getImageUrl(image);
                      }}
                    />
                    {isLastVisibleWithRemaining && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-1 rounded-xl hover:bg-black/70 transition-colors">
                        <span className="text-xs font-bold">+{remainingCount} More</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 360° Photo Sphere Viewer - Right Side */}
        {photoSphere && (
          <div className="lg:col-span-4 col-span-12">
            <div className="relative">
              <PhotoSphereViewer
                src={photoSphere}
                height="500px"
                className="shadow-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <LightboxModal
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
        />
      )}
    </>
  );
};

export default ImageCarousel;
