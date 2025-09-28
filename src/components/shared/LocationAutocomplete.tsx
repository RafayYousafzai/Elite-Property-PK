"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Enter location",
  className = "",
  required = false,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places"],
        });

        await loader.load();
        setIsLoaded(true);

        if (inputRef.current && window.google) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["geocode", "establishment"],
              componentRestrictions: { country: ["pk", "us", "ae"] }, // Adjust countries as needed
            }
          );

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
              onChange(place.formatted_address);
            }
          });
        }
      } catch (error) {
        console.error("Error loading Google Places:", error);
        setIsLoaded(true); // Still show the input even if API fails
      }
    };

    initializeAutocomplete();
  }, [onChange]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        required={required}
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

// Extend the Window interface to include Google Maps
declare global {
  interface Window {
    google: any;
  }
}
