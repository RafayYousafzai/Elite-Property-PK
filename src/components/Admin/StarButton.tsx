"use client";

import { useState } from "react";
import { updatePropertyFeaturedStatus } from "@/lib/supabase/properties";

interface StarButtonProps {
  propertyId: string;
  isFeatured: boolean;
  onStatusChange?: (isFeatured: boolean) => void;
}

export default function StarButton({
  propertyId,
  isFeatured,
  onStatusChange,
}: StarButtonProps) {
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(isFeatured);

  const toggleFeatured = async () => {
    setLoading(true);
    try {
      const success = await updatePropertyFeaturedStatus(propertyId, !featured);
      if (success) {
        setFeatured(!featured);
        onStatusChange?.(!featured);
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFeatured}
      disabled={loading}
      className={`text-xl transition-colors duration-200 ${
        loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
      } ${featured ? "text-yellow-500" : "text-gray-300"}`}
      title={featured ? "Remove from featured" : "Mark as featured"}
    >
      {loading ? "..." : featured ? "⭐" : "☆"}
    </button>
  );
}
