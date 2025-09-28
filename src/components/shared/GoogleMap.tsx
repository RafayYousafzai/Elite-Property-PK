"use client";

interface GoogleMapProps {
  address: string;
  className?: string;
  width?: string;
  height?: string;
}

export default function GoogleMap({
  address,
  className = "",
  width = "100%",
  height = "400",
}: GoogleMapProps) {
  // Encode the address for URL
  const encodedAddress = encodeURIComponent(address);

  // Generate Google Maps embed URL with the property address
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}&zoom=15&maptype=roadmap`;

  // Fallback iframe if no API key is provided
  const fallbackSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  const src = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    ? mapSrc
    : fallbackSrc;

  return (
    <div className={className}>
      <iframe
        src={src}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-2xl w-full"
        title={`Map showing location of ${address}`}
      />
    </div>
  );
}
