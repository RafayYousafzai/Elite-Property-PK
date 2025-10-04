"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PhotoSphereViewer from "./PhotoSphereViewer";

interface PropertyImage {
  src: string;
}

interface ImageCarouselProps {
  images: PropertyImage[];
  photoSphere?: string | null;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  photoSphere,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (lightboxOpen) return; // Don't interfere with lightbox navigation

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
    src: image,
  }));

  if (!images || images.length === 0) {
    return (
      <div className="mt-8">
        {photoSphere ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Empty space for consistency */}
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
            {/* 360° Viewer */}
            <div className="lg:col-span-4 col-span-12">
              <div className="relative">
                {/* <h3 className="text-lg font-medium text-dark dark:text-white mb-4 flex items-center gap-2">
                  <Icon
                    icon="ph:globe"
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                  360° Virtual Tour
                </h3> */}
                {photoSphere && (
                  <PhotoSphereViewer
                    src={[
                      "https://eqwshdwdmvfqbeuqknkn.supabase.co/storage/v1/object/public/property-images/properties/42vrk13aqma-1759564251566.jpg",
                    ]}
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

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-8">
        {/* Main Image Carousel - Left Side */}
        <div
          className={`${
            photoSphere ? "lg:col-span-8" : "col-span-12"
          } col-span-12`}
        >
          <div className="relative group">
            {/* Main Image */}
            <div
              className="relative h-96 lg:h-[500px] cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => openLightbox(currentIndex)}
            >
              <Image
                src={images[currentIndex]}
                alt={`Property Image ${currentIndex + 1}`}
                width={800}
                height={500}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                unoptimized={true}
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
                  onClick={() => openLightbox(currentIndex)}
                  className="absolute bottom-4 left-4 bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                >
                  <Icon icon="ph:images" width={16} height={16} />
                  View All ({images.length})
                </button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <Icon icon="ph:chevron-left" width={20} height={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <Icon icon="ph:chevron-right" width={20} height={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="relative mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 relative overflow-hidden rounded-lg transition-all duration-300 ${
                      index === currentIndex
                        ? "ring-2 ring-primary scale-105"
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={60}
                      className="w-20 h-16 object-cover"
                      unoptimized={true}
                    />
                  </button>
                ))}
              </div>

              {/* Scroll indicators */}
              {images.length > 6 && (
                <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-gradient-to-l from-white dark:from-gray-900 to-transparent w-8 h-full pointer-events-none" />
              )}
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
            {/* <h3 className="text-lg font-medium text-dark dark:text-white mb-4 flex items-center gap-2">
              <Icon
                icon="ph:globe"
                width={20}
                height={20}
                className="text-primary"
              />
              360° Virtual Tour
            </h3> */}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
};

export default ImageCarousel;
