"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CallbackPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already dismissed or completed the callback request
    const isDismissed = sessionStorage.getItem("elite_callback_popup_dismissed");
    if (isDismissed) return;

    // Show popup after 5 seconds delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("elite_callback_popup_dismissed", "true");
    setIsOpen(false);
  };

  const handleRedirect = () => {
    sessionStorage.setItem("elite_callback_popup_dismissed", "true");
    setIsOpen(false);
    router.push("/request-callback");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Clickable Backdrop to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Premium Centered Card with Background Image & Sharp Corners */}
      <div 
        className="relative w-full max-w-lg min-h-[400px] border border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden rounded-none bg-cover bg-center animate-in zoom-in-95 duration-350"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000')`
        }}
      >
        {/* Dark Overlay Tint for High-Contrast Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 z-10" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 text-white/70 hover:text-white p-1.5 border border-white/20 hover:border-white/50 rounded-none bg-black/40 transition duration-150"
          aria-label="Close popup"
        >
          <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Card Content Wrapper */}
        <div className="relative z-20 flex-1 flex flex-col justify-between p-8 sm:p-10 text-white">
          
          {/* Header text */}
          <div className="space-y-3 mt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#f97316]">
              Elite Property Exchange
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white uppercase">
              Consult With Our <br />Executive Partners
            </h2>
            <div className="w-12 h-1 bg-[#f97316]" />
          </div>

          {/* Description & Action buttons stacked closely */}
          <div className="space-y-6 mt-6">
            <p className="text-sm text-zinc-300 font-medium leading-relaxed max-w-md">
              Looking to buy, sell, or invest in DHA Islamabad? Request a callback today and our expert consultants will connect with you shortly.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleRedirect}
                className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs uppercase tracking-widest rounded-none shadow-md transition duration-200"
              >
                Request Call Back
              </button>
              
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white font-bold text-xs uppercase tracking-widest rounded-none border border-white/15 transition duration-150"
              >
                No Thanks, Just Browsing
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
