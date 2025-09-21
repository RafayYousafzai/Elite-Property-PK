"use client";
import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PropertyImage {
  src: string;
}

interface ImageGalleryProps {
  images: PropertyImage[];
  maxVisible?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  maxVisible = 4,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxSlides = images.map((image) => ({
    src: image.src,
  }));

  const renderImageGrid = () => {
    return (
      <div className="grid grid-cols-12 mt-8 gap-8 h-96 lg:h-[540px]">
        {/* Main large image */}
        <div className="lg:col-span-8 col-span-12 row-span-2 h-full">
          {images[0] && (
            <div
              className="relative cursor-pointer h-full"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={images[0].src}
                alt="Main Property Image"
                width={400}
                height={500}
                className="rounded-2xl w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          )}
        </div>

        {/* Second image - desktop only */}
        <div className="lg:col-span-4 lg:block hidden">
          {images[1] && (
            <div
              className="relative cursor-pointer h-64 lg:h-80"
              onClick={() => openLightbox(1)}
            >
              <Image
                src={images[1].src}
                alt="Property Image 2"
                width={400}
                height={500}
                className="rounded-2xl w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          )}
        </div>

        {/* Third image */}
        <div className="lg:col-span-2 col-span-6">
          {images[2] && (
            <div
              className="relative cursor-pointer h-32 lg:h-48"
              onClick={() => openLightbox(2)}
            >
              <Image
                src={images[2].src}
                alt="Property Image 3"
                width={400}
                height={500}
                className="rounded-2xl w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          )}
        </div>

        {/* Fourth image with overlay for remaining count */}
        <div className="lg:col-span-2 col-span-6">
          {images[3] && (
            <div
              className="relative cursor-pointer group h-32 lg:h-48"
              onClick={() => openLightbox(3)}
            >
              <Image
                src={images[3].src}
                alt="Property Image 4"
                width={400}
                height={500}
                className="rounded-2xl w-full h-full object-cover"
                unoptimized={true}
              />
              {images.length > maxVisible && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center group-hover:bg-black/70 transition-colors duration-300">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">
                      +{images.length - maxVisible}
                    </div>
                    <div className="text-sm">View All Photos</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderImageGrid()}

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

export default ImageGallery;
