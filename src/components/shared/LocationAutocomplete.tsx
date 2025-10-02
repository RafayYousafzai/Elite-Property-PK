"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import { Input, Spinner } from "@heroui/react";

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
  className = "h-full",
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
    <div className="relative w-full ">
      <Input
        label="Location"
        size="lg"
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        isRequired={required}
        endContent={!isLoaded && <Spinner size="sm" color="primary" />}
      />
    </div>
  );
}

// Extend the Window interface to include Google Maps
declare global {
  interface Window {
    google: any;
  }
}
